
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Additional hook to detect tablet screens (768px - 1023px)
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsTablet(width >= 768 && width < 1024)
    }
    
    window.addEventListener("resize", handleResize)
    handleResize() // Initial check
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return !!isTablet
}

// Combined hook to detect both mobile and tablet
export function useIsMobileOrTablet() {
  const [isSmallScreen, setIsSmallScreen] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }
    
    window.addEventListener("resize", handleResize)
    handleResize() // Initial check
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return !!isSmallScreen
}
