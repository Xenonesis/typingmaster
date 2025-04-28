
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Only execute this code in the browser
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      
      // Use addEventListener for better browser compatibility
      mql.addEventListener("change", onChange)
      
      // Set initial value
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      // Clean up
      return () => mql.removeEventListener("change", onChange)
    }
    
    // Default to false for server-side rendering
    return setIsMobile(false)
  }, [])

  // Return false when undefined to avoid rendering issues
  return isMobile === undefined ? false : isMobile
}
