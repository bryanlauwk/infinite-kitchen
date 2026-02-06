// Ingredient ID normalization to handle AI hallucination issues
// Extracted from cooking-agent for maintainability

interface InventoryItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Normalizes an ingredient ID that may have been hallucinated by the AI
 * (e.g. "garlicAddress" → "garlic") by attempting progressively fuzzier matches.
 */
export function normalizeIngredientId(rawId: string, inventory: InventoryItem[]): string {
  // 1. Exact match
  if (inventory.some((i) => i.id === rawId)) {
    return rawId;
  }

  // 2. Clean garbage patterns (Address, numbers, special chars)
  const cleaned = rawId
    .replace(/Address|[0-9]+|[^a-zA-Z_\s]/gi, '')
    .toLowerCase()
    .trim();

  if (inventory.some((i) => i.id === cleaned)) {
    return cleaned;
  }

  // 3. Convert spaces to underscores
  const snakeCase = cleaned.replace(/\s+/g, '_');
  if (inventory.some((i) => i.id === snakeCase)) {
    return snakeCase;
  }

  // 4. Fuzzy match: find ingredient containing this word
  const fuzzyMatch = inventory.find(
    (i) =>
      i.id.includes(cleaned) ||
      i.name.toLowerCase().includes(cleaned) ||
      cleaned.includes(i.id),
  );
  if (fuzzyMatch) {
    return fuzzyMatch.id;
  }

  // 5. Name-based match
  const nameMatch = inventory.find(
    (i) =>
      i.name.toLowerCase() === rawId.toLowerCase() ||
      i.name.toLowerCase().replace(/\s+/g, '_') === rawId.toLowerCase(),
  );
  if (nameMatch) {
    return nameMatch.id;
  }

  // 6. Return original if no match found
  console.warn(`Could not normalize ingredient ID: "${rawId}"`);
  return rawId;
}
