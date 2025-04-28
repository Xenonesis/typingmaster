import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if window matches a media query
 * 
 * @param query The media query to match against
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false to prevent SSR/hydration issues
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener for changes
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener for changes
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Cleanup function to remove event listener
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [query]); // Re-run effect if query changes

  return matches;
} 