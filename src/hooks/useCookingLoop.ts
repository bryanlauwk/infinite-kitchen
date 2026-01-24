import { useCallback, useRef } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { useAgents } from '@/context/AgentContext';
import { callCookingAgent, callAlchemyAgent, callJudgeAgent } from '@/lib/api';
import { ConversationMessage, Ingredient } from '@/lib/types';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

const MAX_ITERATIONS = 20; // Safety limit

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
    addConversationMessage,
    clearConversation,
  } = useKitchen();
  
  const { setAgentStatus, setAgentThinking } = useAgents();
  const { 
    startAmbience, 
    stopAmbience, 
    playActionSound, 
    playServeSound, 
    playSuccessSound, 
    playErrorSound 
  } = useSoundEffects();
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
    let servedDishName = '';

    try {
      // Start kitchen ambience
      await startAmbience();
      
      // Main cooking loop
      while (!abortRef.current && iterations < MAX_ITERATIONS) {
        iterations++;

        // 1. Call Cooking Agent
        setAgentStatus('chef', 'thinking');
        setAgentThinking('chef', `Planning next step for ${order.dishName}...`);

        addTimelineEvent({
          type: 'thinking',
          agent: 'chef',
          content: iterations === 1 
            ? `Starting order: ${order.dishName}. Let me plan the cooking steps...`
            : 'Considering the next step...',
        });

        const cookingResponse = await callCookingAgent(
          currentInventory,
          order,
          conversationHistory
        );

        // Add thinking to timeline
        if (cookingResponse.thinking) {
          addTimelineEvent({
            type: 'thinking',
            agent: 'chef',
            content: cookingResponse.thinking,
          });
        }

        // Check if no function call (unusual - might need to prompt again)
        if (!cookingResponse.functionCall) {
          console.warn('No function call from cooking agent');
          // Still record the thinking in history
          addConversationMessage({
            role: 'assistant',
            content: cookingResponse.thinking || '',
          });
          conversationHistory.push({
            role: 'assistant',
            content: cookingResponse.thinking || '',
          });
          continue;
        }

        const { name: actionName, ingredients: ingredientIds } = cookingResponse.functionCall;

        // Record assistant's thinking + action in history
        // We format it as "thinking\n\nAction: action_name(ingredients)" so the AI knows what it did
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
        
        // Play sound for this cooking action
        playActionSound(actionName);

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

        const alchemyResult = await callAlchemyAgent(actionName, usedIngredients);

        setAgentStatus('sous', 'acting');
        setAgentThinking('sous', alchemyResult.description);

        // Add result to timeline
        addTimelineEvent({
          type: 'result',
          agent: 'sous',
          content: alchemyResult.description,
          result: {
            resultName: alchemyResult.resultName,
            resultId: alchemyResult.resultId,
            emoji: alchemyResult.emoji,
            description: alchemyResult.description,
          },
        });

        // Create new ingredient from alchemy result
        const newIngredient: Ingredient = {
          id: alchemyResult.resultId,
          name: alchemyResult.resultName,
          emoji: alchemyResult.emoji,
          category: 'generated',
          isGenerated: true,
        };

        // Add to inventory
        addToInventory(newIngredient);
        currentInventory = [...currentInventory, newIngredient];

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

        const judgeResult = await callJudgeAgent(servedDishName, order.dishName);

        setAgentStatus('expeditor', 'acting');

        addTimelineEvent({
          type: 'judge',
          agent: 'expeditor',
          content: judgeResult.match 
            ? `✅ MATCH (${judgeResult.confidence}%): ${judgeResult.reasoning}`
            : `❌ REJECTED (${judgeResult.confidence}%): ${judgeResult.reasoning}`,
        });

        setJudgeResult(orderId, judgeResult);
        updateOrderStatus(orderId, judgeResult.match ? 'verified' : 'rejected', servedDishName);

        // Play success or error sound based on judge result
        if (judgeResult.match) {
          await playSuccessSound();
        } else {
          await playErrorSound();
        }

        toast[judgeResult.match ? 'success' : 'error'](
          judgeResult.match 
            ? `Order fulfilled! ${judgeResult.reasoning}`
            : `Order rejected: ${judgeResult.reasoning}`
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
    addConversationMessage,
    clearConversation,
    setAgentStatus,
    setAgentThinking,
    startAmbience,
    stopAmbience,
    playActionSound,
    playServeSound,
    playSuccessSound,
    playErrorSound,
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
