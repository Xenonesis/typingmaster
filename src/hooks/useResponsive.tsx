
import { useState, useEffect } from 'react';

interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
}

/**
 * Custom hook to handle responsive breakpoints across the application
 * @returns Object containing boolean flags for different screen sizes
 */
export function useResponsive(): ResponsiveBreakpoints {
  const [breakpoints, setBreakpoints] = useState<ResponsiveBreakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isSmallScreen: false,
    isLargeScreen: false
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const updateBreakpoints = () => {
      const width = window.innerWidth;
      
      setBreakpoints({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        isSmallScreen: width < 1024,
        isLargeScreen: width >= 1280
      });
    };

    // Initial check
    updateBreakpoints();

    // Add event listener
    window.addEventListener('resize', updateBreakpoints);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateBreakpoints);
    };
  }, []);

  return breakpoints;
}

export default useResponsive;
