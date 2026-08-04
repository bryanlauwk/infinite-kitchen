import { useCallback, useRef } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { useAgents } from '@/context/AgentContext';
import { useSound } from '@/context/SoundContext';
import { callCookingAgent, callAlchemyAgent, callJudgeAgent } from '@/lib/api';
import { ConversationMessage, Ingredient } from '@/lib/types';
import { generateReview } from '@/lib/reviewGenerator';
import { toast } from 'sonner';

const MAX_ITERATIONS = 20; // Safety limit
const MAX_NO_ACTION_ITERATIONS = 3; // Auto-complete after this many empty responses
const MAX_REPEAT_ACTIONS = 3; // Force progression after this many identical actions

// Track actions to detect loops
interface ActionRecord {
  action: string;
  ingredients: string[];
}

// Retry helper with exponential backoff + jitter (handles transient 5xx/503 from the backend)
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 4,
  baseDelay: number = 800
): Promise<T> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      // Rate limits are deliberate, not transient — retrying only burns the cap.
      if (error instanceof Error && error.name === 'RateLimitError') throw error;
      if (i === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 300;
      console.warn(`Retry ${i + 1}/${maxRetries} after ${Math.round(delay)}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}


export function useCookingLoop() {
  const {
    inventory,
    orders,
    cookingState,
    startOrder,
    setCookingActive,
    addToInventory,
    addTimelineEvent,
    updateOrderStatus,
    setJudgeResult,
    setOrderReview,
    markOrderImprovable,
    addConversationMessage,
    clearConversation,
    setActiveIngredients,
    setActiveTechnique,
    clearActiveItems,
  } = useKitchen();
  
  const { setAgentStatus, setAgentThinking } = useAgents();
  const { 
    startAmbience, 
    stopAmbience, 
    playActionSound,
    playStartSound, 
    playServeSound, 
    playSuccessSound, 
    playErrorSound 
  } = useSound();
  const abortRef = useRef(false);

  const runCookingLoop = useCallback(async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    // Reset state
    abortRef.current = false;
    clearConversation();
    startOrder(orderId);
    setCookingActive(true);

    // Initial conversation setup
    const conversationHistory: ConversationMessage[] = [];
    let currentInventory = [...inventory];
    let iterations = 0;
    let noActionCount = 0;
    let repeatActionCount = 0;
    const actionHistory: ActionRecord[] = [];
    let servedDishName = '';

    try {
      // Start kitchen ambience and play start sound
      await Promise.all([startAmbience(), playStartSound()]);
      
      // Main cooking loop
      while (!abortRef.current && iterations < MAX_ITERATIONS) {
        iterations++;

        // 1. Call Cooking Agent with retry
        setAgentStatus('chef', 'thinking');
        setAgentThinking('chef', `Planning next step for ${order.dishName}...`);

        addTimelineEvent({
          type: 'thinking',
          agent: 'chef',
          content: iterations === 1 
            ? `Starting order: ${order.dishName}. Let me plan the cooking steps...`
            : 'Considering the next step...',
        });

        const cookingResponse = await callWithRetry(() => 
          callCookingAgent(currentInventory, order, conversationHistory)
        );

        // Add thinking to timeline
        if (cookingResponse.thinking) {
          addTimelineEvent({
            type: 'thinking',
            agent: 'chef',
            content: cookingResponse.thinking,
          });
        }

        // Check if no function call
        if (!cookingResponse.functionCall) {
          noActionCount++;
          console.warn(`No function call from cooking agent (${noActionCount}/${MAX_NO_ACTION_ITERATIONS})`);
          
          // Still record the thinking in history
          addConversationMessage({
            role: 'assistant',
            content: cookingResponse.thinking || '',
          });
          conversationHistory.push({
            role: 'assistant',
            content: cookingResponse.thinking || '',
          });
          
          // Auto-complete if stuck
          if (noActionCount >= MAX_NO_ACTION_ITERATIONS) {
            console.log('Auto-completing due to no function calls');
            const generatedIngredients = currentInventory.filter(i => i.isGenerated);
            if (generatedIngredients.length > 0) {
              servedDishName = generatedIngredients[generatedIngredients.length - 1].name;
            } else {
              servedDishName = order.dishName;
            }
            
            addTimelineEvent({
              type: 'serve',
              agent: 'chef',
              content: `Auto-serving: ${servedDishName}`,
            });
            
            await playServeSound();
            updateOrderStatus(orderId, 'served', servedDishName);
            break;
          }
          
          continue;
        }

        // Reset no-action counter on successful call
        noActionCount = 0;

        const { name: actionName, ingredients: ingredientIds } = cookingResponse.functionCall;

        // Loop detection: check if this action was already performed
        const currentAction: ActionRecord = {
          action: actionName,
          ingredients: [...ingredientIds].sort(),
        };
        
        const isRepeat = actionHistory.some(prev =>
          prev.action === currentAction.action &&
          JSON.stringify(prev.ingredients) === JSON.stringify(currentAction.ingredients)
        );
        
        if (isRepeat) {
          repeatActionCount++;
          console.warn(`Repeat action detected (${repeatActionCount}/${MAX_REPEAT_ACTIONS}): ${actionName}(${ingredientIds.join(', ')})`);
          
          if (repeatActionCount >= MAX_REPEAT_ACTIONS) {
            // Force-serve the last generated ingredient
            console.log('Max repeat actions reached, force-serving');
            const generatedIngredients = currentInventory.filter(i => i.isGenerated);
            if (generatedIngredients.length > 0) {
              servedDishName = generatedIngredients[generatedIngredients.length - 1].name;
            } else {
              servedDishName = order.dishName;
            }
            
            addTimelineEvent({
              type: 'serve',
              agent: 'chef',
              content: `⚠️ Loop detected - Auto-serving: ${servedDishName}`,
            });
            
            await playServeSound();
            updateOrderStatus(orderId, 'served', servedDishName);
            break;
          }
          
          // Add anti-repeat instruction to conversation
          const warningMessage = `WARNING: You already performed ${actionName} with these ingredients. Do NOT repeat this action. Try a DIFFERENT technique or combine with other ingredients. Progress to the next step.`;
          conversationHistory.push({
            role: 'user',
            content: warningMessage,
          });
        } else {
          repeatActionCount = 0;
        }
        
        // Track this action
        actionHistory.push(currentAction);
        if (actionHistory.length > 5) actionHistory.shift();

        // Record assistant's thinking + action in history
        const assistantContent = `${cookingResponse.thinking || ''}\n\nAction taken: ${actionName}(${ingredientIds.join(', ')})`;
        addConversationMessage({
          role: 'assistant',
          content: assistantContent,
        });
        conversationHistory.push({
          role: 'assistant',
          content: assistantContent,
        });

        // Add action to timeline
        addTimelineEvent({
          type: 'action',
          agent: 'chef',
          content: `Executing ${actionName}`,
          functionCall: {
            name: actionName,
            ingredients: ingredientIds,
          },
        });

        setAgentStatus('chef', 'acting');
        setAgentThinking('chef', `${actionName}(${ingredientIds.join(', ')})`);
        
        // Set active technique and ingredients for UI feedback
        setActiveTechnique(actionName);
        setActiveIngredients(ingredientIds);
        
        // Play sound for this cooking action with ingredient context
        playActionSound(actionName, ingredientIds);

        // Check if this is the serve action
        if (cookingResponse.isComplete || actionName === 'serve') {
          // Get the served dish name from the last created ingredient
          const servedIngredient = currentInventory.find(
            i => i.id === ingredientIds[0]
          );
          servedDishName = servedIngredient?.name || ingredientIds[0];
          
          addTimelineEvent({
            type: 'serve',
            agent: 'chef',
            content: `Serving: ${servedDishName}`,
          });

          // Play serve sound
          await playServeSound();

          updateOrderStatus(orderId, 'served', servedDishName);
          break;
        }

        // 2. Call Alchemy Agent to transform ingredients
        setAgentStatus('sous', 'thinking');
        setAgentThinking('sous', `Determining result of ${actionName}...`);

        // Get the actual ingredient objects
        const usedIngredients = ingredientIds
          .map(id => currentInventory.find(i => i.id === id))
          .filter((i): i is Ingredient => i !== undefined);

        if (usedIngredients.length === 0) {
          // Try to find by name if ID didn't match
          const byName = ingredientIds
            .map(id => currentInventory.find(i => 
              i.name.toLowerCase() === id.toLowerCase() ||
              i.id === id.toLowerCase().replace(/\s+/g, '_')
            ))
            .filter((i): i is Ingredient => i !== undefined);
          
          if (byName.length > 0) {
            usedIngredients.push(...byName);
          } else {
            console.warn('Could not find ingredients:', ingredientIds);
            // Create placeholder ingredients
            ingredientIds.forEach(id => {
              usedIngredients.push({
                id,
                name: id.replace(/_/g, ' '),
                emoji: '🥘',
                category: 'generated',
                isGenerated: true,
              });
            });
          }
        }

        const alchemyResult = await callWithRetry(() => 
          callAlchemyAgent(actionName, usedIngredients)
        );

        setAgentStatus('sous', 'acting');
        setAgentThinking('sous', alchemyResult.description);

        // Create new ingredient from alchemy result
        const newIngredient: Ingredient = {
          id: alchemyResult.resultId,
          name: alchemyResult.resultName,
          emoji: alchemyResult.emoji,
          category: 'generated',
          isGenerated: true,
        };

        // Always add to LOCAL cooking inventory (for this session only)
        currentInventory = [...currentInventory, newIngredient];

        // Only add to PERSISTENT inventory if it's a discovery (new base ingredient)
        if (alchemyResult.isDiscovery) {
          // Check if already exists before adding (addToInventory handles this, but let's be explicit)
          const existsInInventory = inventory.some(i => i.id === newIngredient.id);
          if (!existsInInventory) {
            addToInventory(newIngredient);
            
            // Show discovery toast
            toast.success(`New ingredient discovered: ${alchemyResult.emoji} ${alchemyResult.resultName}`, {
              duration: 4000,
            });
          }
          
          addTimelineEvent({
            type: 'result',
            agent: 'sous',
            content: `✨ NEW DISCOVERY: ${alchemyResult.emoji} ${alchemyResult.resultName} - ${alchemyResult.description}`,
            result: {
              resultName: alchemyResult.resultName,
              resultId: alchemyResult.resultId,
              emoji: alchemyResult.emoji,
              description: alchemyResult.description,
              isDiscovery: true,
            },
          });
        } else {
          addTimelineEvent({
            type: 'result',
            agent: 'sous',
            content: alchemyResult.description,
            result: {
              resultName: alchemyResult.resultName,
              resultId: alchemyResult.resultId,
              emoji: alchemyResult.emoji,
              description: alchemyResult.description,
              isDiscovery: false,
            },
          });
        }

        // Update conversation with function result - both React state and local array
        addConversationMessage({
          role: 'function',
          name: actionName,
          content: `Result: ${alchemyResult.emoji} ${alchemyResult.resultName} - ${alchemyResult.description}. New ingredient ID: ${alchemyResult.resultId}`,
        });
        conversationHistory.push({
          role: 'function',
          name: actionName,
          content: `Result: ${alchemyResult.emoji} ${alchemyResult.resultName} - ${alchemyResult.description}. New ingredient ID: ${alchemyResult.resultId}`,
        });

        // Reset agent states for next iteration
        setAgentStatus('chef', 'idle');
        setAgentStatus('sous', 'idle');
        setAgentThinking('chef', undefined);
        setAgentThinking('sous', undefined);
        
        // Clear active items briefly before next action
        clearActiveItems();

        // Small delay for UI updates
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 3. Call Judge Agent
      if (servedDishName) {
        setAgentStatus('expeditor', 'thinking');
        setAgentThinking('expeditor', 'Evaluating the dish...');

        addTimelineEvent({
          type: 'thinking',
          agent: 'expeditor',
          content: `Comparing "${servedDishName}" to order "${order.dishName}"...`,
        });

        const judgeResult = await callWithRetry(() => 
          callJudgeAgent(servedDishName, order.dishName)
        );

        setAgentStatus('expeditor', 'acting');

        // Check if it's a low-confidence match (< 95%)
        const isLowConfidenceMatch = judgeResult.match && judgeResult.confidence < 95;
        
        addTimelineEvent({
          type: 'judge',
          agent: 'expeditor',
          content: judgeResult.match 
            ? isLowConfidenceMatch
              ? `⚠️ ACCEPTED (${judgeResult.confidence}%): ${judgeResult.reasoning} - Could be improved.`
              : `✅ MATCH (${judgeResult.confidence}%): ${judgeResult.reasoning}`
            : `❌ REJECTED (${judgeResult.confidence}%): ${judgeResult.reasoning}`,
        });

        // Set judge result with improvable flag for low-confidence matches
        setJudgeResult(orderId, judgeResult);
        
        // Update order status - mark as improvable if low confidence match
        if (isLowConfidenceMatch) {
          // Set both status and improvable flag
          updateOrderStatus(orderId, 'verified', servedDishName);
          markOrderImprovable(orderId);
        } else {
          updateOrderStatus(orderId, judgeResult.match ? 'verified' : 'rejected', servedDishName);
        }

        // Play success or error sound based on judge result
        if (judgeResult.match) {
          await playSuccessSound();
          
          // Generate customer review after a delay (for successful dishes only)
          setTimeout(() => {
            const review = generateReview();
            setOrderReview(orderId, review);
          }, 2000 + Math.random() * 3000); // 2-5 second delay
        } else {
          await playErrorSound();
        }

        // Calm, observational feedback (no "success/failure" language)
        toast(
          judgeResult.match 
            ? isLowConfidenceMatch
              ? 'The kitchen approves, but it could be better.'
              : 'The kitchen approves.'
            : 'Something feels off.'
        );
      }

    } catch (error) {
      console.error('Cooking loop error:', error);
      
      addTimelineEvent({
        type: 'error',
        agent: 'chef',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      toast.error(error instanceof Error ? error.message : 'Cooking failed');
      updateOrderStatus(orderId, 'rejected');
    } finally {
      // Stop kitchen ambience
      stopAmbience();
      
      // Clear active items
      clearActiveItems();
      
      // Reset all states
      setCookingActive(false);
      setAgentStatus('chef', 'idle');
      setAgentStatus('sous', 'idle');
      setAgentStatus('expeditor', 'idle');
      setAgentThinking('chef', undefined);
      setAgentThinking('sous', undefined);
      setAgentThinking('expeditor', undefined);
    }
  }, [
    orders,
    inventory,
    startOrder,
    setCookingActive,
    addToInventory,
    addTimelineEvent,
    updateOrderStatus,
    setJudgeResult,
    setOrderReview,
    markOrderImprovable,
    addConversationMessage,
    clearConversation,
    setAgentStatus,
    setAgentThinking,
    startAmbience,
    stopAmbience,
    playActionSound,
    playStartSound,
    playServeSound,
    playSuccessSound,
    playErrorSound,
    setActiveIngredients,
    setActiveTechnique,
    clearActiveItems,
  ]);

  const abortCooking = useCallback(() => {
    abortRef.current = true;
    setCookingActive(false);
    toast.info('Cooking aborted');
  }, [setCookingActive]);

  return {
    runCookingLoop,
    abortCooking,
    isCooking: cookingState.isActive,
  };
}
