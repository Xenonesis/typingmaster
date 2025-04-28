import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Create a context for animations
type AnimationsContextType = {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  toggleAnimations: () => void;
};

const AnimationsContext = createContext<AnimationsContextType | undefined>(undefined);

// Provider component
export const AnimationsProvider = ({ children }: { children: ReactNode }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('typingAnimationsEnabled');
    // Default to true if no preference is set
    return savedPreference !== null ? savedPreference === 'true' : true;
  });

  // Save animations preference to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('typingAnimationsEnabled', animationsEnabled.toString());
    } catch (error) {
      console.error("Failed to save animations preference to localStorage:", error);
    }
  }, [animationsEnabled]);

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
  };

  return (
    <AnimationsContext.Provider value={{ animationsEnabled, setAnimationsEnabled, toggleAnimations }}>
      {children}
    </AnimationsContext.Provider>
  );
};

// Custom hook to use the animations context
export const useAnimations = (): AnimationsContextType => {
  const context = useContext(AnimationsContext);
  if (context === undefined) {
    throw new Error("useAnimations must be used within an AnimationsProvider");
  }
  return context;
}; 