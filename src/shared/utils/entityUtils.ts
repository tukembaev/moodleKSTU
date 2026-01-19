/**
 * Generate a temporary ID for new items
 * This helps identify new items before they are saved to the server
 */
export const generateTempId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if an ID is a temporary ID (generated locally)
 */
export const isTempId = (id: string): boolean => {
  return id.startsWith('temp-');
};

/**
 * Prepare data for API submission
 * - Remove ID from new items (let server generate it)
 * - Keep ID for existing items
 */
export const prepareDataForApi = <T extends { id: string }>(items: T[]): Omit<T, 'id'>[] => {
  return items.map(item => {
    if (isTempId(item.id)) {
      // New item - remove ID so server generates it
      const { id, ...itemWithoutId } = item;
      return itemWithoutId;
    }
    // Existing item - keep ID
    return item;
  });
};
