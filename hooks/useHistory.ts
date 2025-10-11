import { useState, useEffect, useCallback } from 'react';

const HISTORY_STORAGE_KEY = 'concept-three-whys-history';

export const useHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
  }, []);

  const addHistoryItem = useCallback((concept: string) => {
    setHistory(prevHistory => {
      // Normalize to prevent case-sensitive duplicates
      const lowerCaseConcept = concept.toLowerCase();
      // Remove any previous entries for the same concept
      const filteredHistory = prevHistory.filter(item => item.toLowerCase() !== lowerCaseConcept);
      // Add the new one to the top.
      const newHistory = [concept, ...filteredHistory];
      // Limit to maximum 5 items
      const limitedHistory = newHistory.slice(0, 5);

      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return limitedHistory;
    });
  }, []);

  return { history, addHistoryItem };
};