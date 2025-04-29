import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for guest user
type GuestUser = {
  id: string;
  isGuest: boolean;
  createdAt: string;
  typingStats?: {
    wordsPerMinute: number[];
    accuracy: number[];
    dates: string[];
  };
  achievements?: string[];
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    soundEnabled?: boolean;
    animationsEnabled?: boolean;
  };
};

type GuestContextType = {
  guestUser: GuestUser | null;
  isGuest: boolean;
  createGuestUser: () => void;
  updateGuestStats: (wpm: number, accuracy: number) => void;
  updateGuestPreferences: (preferences: Partial<GuestUser['preferences']>) => void;
  addGuestAchievement: (achievementId: string) => void;
  clearGuestData: () => void;
};

const GuestContext = createContext<GuestContextType | undefined>(undefined);

const GUEST_USER_KEY = 'speedTypist.guestUser';

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Load guest user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem(GUEST_USER_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as GuestUser;
        setGuestUser(parsedUser);
        setIsGuest(true);
      } catch (error) {
        console.error('Failed to parse guest user data:', error);
        localStorage.removeItem(GUEST_USER_KEY);
      }
    }
  }, []);

  // Create a new guest user
  const createGuestUser = () => {
    const newUser: GuestUser = {
      id: uuidv4(),
      isGuest: true,
      createdAt: new Date().toISOString(),
      typingStats: {
        wordsPerMinute: [],
        accuracy: [],
        dates: []
      },
      achievements: [],
      preferences: {
        theme: 'system',
        soundEnabled: true,
        animationsEnabled: true
      }
    };

    setGuestUser(newUser);
    setIsGuest(true);
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(newUser));
  };

  // Update guest typing stats
  const updateGuestStats = (wpm: number, accuracy: number) => {
    if (!guestUser) return;

    const updatedUser = {
      ...guestUser,
      typingStats: {
        wordsPerMinute: [...(guestUser.typingStats?.wordsPerMinute || []), wpm],
        accuracy: [...(guestUser.typingStats?.accuracy || []), accuracy],
        dates: [...(guestUser.typingStats?.dates || []), new Date().toISOString()]
      }
    };

    setGuestUser(updatedUser);
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(updatedUser));
  };

  // Update guest preferences
  const updateGuestPreferences = (preferences: Partial<GuestUser['preferences']>) => {
    if (!guestUser) return;

    const updatedUser = {
      ...guestUser,
      preferences: {
        ...(guestUser.preferences || {}),
        ...preferences
      }
    };

    setGuestUser(updatedUser);
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(updatedUser));
  };

  // Add a new achievement for guest user
  const addGuestAchievement = (achievementId: string) => {
    if (!guestUser) return;
    
    // Don't add duplicate achievements
    if (guestUser.achievements?.includes(achievementId)) return;

    const updatedUser = {
      ...guestUser,
      achievements: [...(guestUser.achievements || []), achievementId]
    };

    setGuestUser(updatedUser);
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(updatedUser));
  };

  // Clear all guest data
  const clearGuestData = () => {
    setGuestUser(null);
    setIsGuest(false);
    localStorage.removeItem(GUEST_USER_KEY);
  };

  return (
    <GuestContext.Provider
      value={{
        guestUser,
        isGuest,
        createGuestUser,
        updateGuestStats,
        updateGuestPreferences,
        addGuestAchievement,
        clearGuestData
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
} 