import { useState, useCallback } from "react";

interface UseKeyboardNavigationOptions<T> {
  items: T[];
  isOpen: boolean;
  activeIndex?: number;
  setActiveIndex?: (index: number | ((prev: number) => number)) => void;
  onSelect: (item: T) => void;
  onClose?: () => void;
}

interface UseKeyboardNavigationReturn {
  activeIndex: number;
  setActiveIndex: (index: number | ((prev: number) => number)) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Custom hook to handle keyboard navigation for dropdown/autocomplete components
 * Supports ArrowUp, ArrowDown, Enter, and Escape keys
 * If activeIndex and setActiveIndex are provided, uses them; otherwise manages state internally
 */
export function useKeyboardNavigation<T>({
  items,
  isOpen,
  activeIndex: externalActiveIndex,
  setActiveIndex: externalSetActiveIndex,
  onSelect,
  onClose,
}: UseKeyboardNavigationOptions<T>): UseKeyboardNavigationReturn {
  const [internalActiveIndex, setInternalActiveIndex] = useState(-1);

  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const setActiveIndex = externalSetActiveIndex || setInternalActiveIndex;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || items.length === 0) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < items.length) {
            onSelect(items[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose?.();
          break;
      }
    },
    [isOpen, items, activeIndex, setActiveIndex, onSelect, onClose]
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
}
