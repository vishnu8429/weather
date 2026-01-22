import { useRef, useEffect } from "react";
import { GeoCodingEntry } from "@/store/types/weather";

interface UseDebounceOptions {
  minLength?: number;
  delay?: number;
  isUserTyping: boolean;
  searchText: string;
  onSearch: (term: string) => Promise<GeoCodingEntry[]>;
  onResults: (results: GeoCodingEntry[]) => void;
  onError?: (error: unknown) => void;
}

/**
 * Custom hook to handle debounced search functionality
 * Manages debounce timing and ensures only the latest search results are used
 */
export function useDebounce({
  minLength = 2,
  delay = 300,
  isUserTyping,
  searchText,
  onSearch,
  onResults,
  onError,
}: UseDebounceOptions): {
  cancel: () => void;
} {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSearchTextRef = useRef<string>("");

  // Store callbacks in refs to avoid including them in dependency array
  // This prevents infinite loops when callbacks are recreated on each render
  const onSearchRef = useRef(onSearch);
  const onResultsRef = useRef(onResults);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onSearchRef.current = onSearch;
    onResultsRef.current = onResults;
    onErrorRef.current = onError;
  }, [onSearch, onResults, onError]);

  useEffect(() => {
    if (!isUserTyping) {
      return;
    }

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchText.trim().length < minLength) {
      onResultsRef.current([]);
      return;
    }

    const term = searchText.trim();
    latestSearchTextRef.current = term;

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await onSearchRef.current(term);

        // Only update if the search term hasn't changed
        if (term !== latestSearchTextRef.current) {
          return;
        }

        onResultsRef.current(result);
      } catch (error) {
        onErrorRef.current?.(error);
        onResultsRef.current([]);
      }
    }, delay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText, minLength, delay, isUserTyping]);

  const cancel = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  return { cancel };
}
