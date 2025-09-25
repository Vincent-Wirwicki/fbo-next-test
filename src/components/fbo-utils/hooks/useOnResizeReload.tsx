import { useEffect } from "react";

export function useWindowResizeReload(delay = 50) {
  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      // Clear the existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout
      timeoutId = setTimeout(() => {
        window.location.reload();
      }, delay);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [delay]); // Re-run effect if delay changes
}
