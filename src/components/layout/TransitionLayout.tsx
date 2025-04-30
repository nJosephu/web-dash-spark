
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface TransitionLayoutProps {
  children: ReactNode;
}

const TransitionLayout = ({ children }: TransitionLayoutProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300); // This should match the duration of the CSS transition
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === "fadeIn" 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
};

export default TransitionLayout;
