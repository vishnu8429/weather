import { useEffect, RefObject } from "react";

interface UseClickOutsideOptions {
  ref: RefObject<HTMLElement | null>;
  enabled?: boolean;
  handler: () => void;
}

/**
 * Custom hook to detect clicks outside of a referenced element
 * @param ref - React ref to the element to detect clicks outside of
 * @param enabled - Whether the click outside detection is enabled (default: true)
 * @param handler - Callback function to execute when click outside is detected
 */
export function useClickOutside({
  ref,
  enabled = true,
  handler,
}: UseClickOutsideOptions): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, enabled, handler]);
}
