// Collection of sample paragraphs by difficulty
import { generateChallenge } from "@/services/mistralAIService";

// Define the ChallengeType to ensure consistency across the application
export type ChallengeType = "beginner" | "intermediate" | "advanced" | "expert" | "code" | "custom";

const paragraphs = {
  beginner: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once, making it a perfect typing exercise for beginners.",
    "Simple words help new typists learn where keys are located. Practice makes perfect when learning to type quickly and accurately.",
    "I am learning how to type faster. My fingers are getting used to the keyboard. Soon I will type without looking down."
  ],
  intermediate: [
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many programming languages, such as Python, Java, C++, and JavaScript.",
    "The internet is a global network of billions of computers and other electronic devices. With the internet, it's possible to access almost any information, communicate with anyone else in the world, and do much more.",
    "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction."
  ],
  advanced: [
    "The human brain contains approximately 86 billion neurons, can process vast amounts of information simultaneously, and consumes merely 20 watts of power—equivalent to a dim light bulb! Scientists continue to marvel at its complexity.",
    "The economy's precipitous decline necessitated unprecedented intervention from central banking authorities; consequently, quantitative easing policies were implemented despite significant controversy among macroeconomists.",
    "Quantum mechanics describes nature at the smallest scales of energy levels of atoms and subatomic particles. It has bizarre consequences such as wave-particle duality, quantum tunneling, and Heisenberg's uncertainty principle."
  ],
  code: [
    "function calculateFactorial(n) {\n  if (n <= 1) return 1;\n  return n * calculateFactorial(n - 1);\n}\n\n// Calculate 5! (5 factorial)\nconst result = calculateFactorial(5);\nconsole.log(result); // 120",
    "const fetchData = async (url) => {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error('Network error');\n    return await response.json();\n  } catch (error) {\n    console.error('Fetch error:', error);\n    return null;\n  }\n};",
    "class BinarySearchTree {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n\n  insert(value) {\n    if (value <= this.value) {\n      if (!this.left) this.left = new BinarySearchTree(value);\n      else this.left.insert(value);\n    } else {\n      if (!this.right) this.right = new BinarySearchTree(value);\n      else this.right.insert(value);\n    }\n  }\n}"
  ],
  quotes: [
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "In the end, it's not the years in your life that count. It's the life in your years. - Abraham Lincoln",
    "Life is what happens when you're busy making other plans. - John Lennon"
  ],
  poetry: [
    "Two roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference. - Robert Frost",
    "Hope is the thing with feathers\nThat perches in the soul,\nAnd sings the tune without the words,\nAnd never stops at all. - Emily Dickinson",
    "Do not go gentle into that good night,\nOld age should burn and rave at close of day;\nRage, rage against the dying of the light. - Dylan Thomas"
  ]
};

// Additional challenge types available through Mistral AI
export const challengeTypes: ChallengeType[] = ["beginner", "intermediate", "advanced", "expert", "code", "custom"];

// Custom text storage - use getter to ensure we're always reading the latest value
const getCustomTexts = (): string[] => {
  const savedTexts = localStorage.getItem('typingCustomTexts');
  return savedTexts ? JSON.parse(savedTexts) : [];
};

// Save custom texts to localStorage
const saveCustomTexts = (texts: string[]): void => {
  localStorage.setItem('typingCustomTexts', JSON.stringify(texts));
};

// Function to add custom text
export const addCustomText = (text: string): void => {
  if (text && text.length > 0) {
    const texts = getCustomTexts();
    texts.push(text);
    saveCustomTexts(texts);
  }
};

// Function to clear custom texts
export const clearCustomTexts = (): void => {
  saveCustomTexts([]);
};

// Function to get a random paragraph based on difficulty
export const getRandomParagraph = async (
  difficulty: ChallengeType = "intermediate", 
  useCustom: boolean = false,
  useMistralAI: boolean = false
): Promise<string> => {
  // If using custom texts and there are custom texts available
  if (useCustom) {
    const customTexts = getCustomTexts();
    if (customTexts.length > 0) {
      // Always return the most recently added text for more predictable behavior
      return customTexts[customTexts.length - 1];
    }
  }
  
  // Use Mistral AI API if enabled
  if (useMistralAI) {
    try {
      return await generateChallenge(difficulty);
    } catch (error) {
      console.error("Failed to generate text from Mistral AI, falling back to predefined text:", error);
      // If Mistral AI fails, fall back to predefined texts
    }
  }
  
  // Otherwise use the selected difficulty from predefined paragraphs
  if (difficulty in paragraphs) {
    const difficultyParagraphs = paragraphs[difficulty as keyof typeof paragraphs] || paragraphs.intermediate;
    const randomIndex = Math.floor(Math.random() * difficultyParagraphs.length);
    return difficultyParagraphs[randomIndex];
  }
  
  // Add code snippets to the difficulty levels
  if (difficulty === "code") {
    const codeSamples = [
      `function calculateFactorial(n) {
        if (n === 0 || n === 1) {
          return 1;
        }
        return n * calculateFactorial(n - 1);
      }

      // Calculate factorial of 5
      const result = calculateFactorial(5);
      console.log(result); // 120`,

      `class User {
        constructor(name, email) {
          this.name = name;
          this.email = email;
          this.lastActive = new Date();
        }
        
        updateActivity() {
          this.lastActive = new Date();
          return this.lastActive;
        }
        
        getInfo() {
          return {
            name: this.name,
            email: this.email,
            lastActive: this.lastActive
          };
        }
      }`,

      `import React, { useState, useEffect } from 'react';

      function DataFetcher({ endpoint }) {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
          const fetchData = async () => {
            try {
              setLoading(true);
              const response = await fetch(endpoint);
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const result = await response.json();
              setData(result);
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          };

          fetchData();
        }, [endpoint]);

        return { data, loading, error };
      }`,

      `def merge_sort(arr):
        if len(arr) <= 1:
            return arr
            
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        return merge(left, right)

      def merge(left, right):
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
                
        result.extend(left[i:])
        result.extend(right[j:])
        return result`
    ];
    const randomIndex = Math.floor(Math.random() * codeSamples.length);
    return codeSamples[randomIndex];
  }
  
  // If the requested challenge type isn't in predefined paragraphs, use intermediate as fallback
  return paragraphs.intermediate[Math.floor(Math.random() * paragraphs.intermediate.length)];
};

// Function to calculate words per minute with improved accuracy
export const calculateWPM = (
  typedCharacters: number,
  correctCharacters: number,
  timeInSeconds: number
): number => {
  // Safety check - avoid division by zero
  if (timeInSeconds <= 0) return 0;
  if (typedCharacters <= 0) return 0;
  
  // Standard word length is 5 characters
  const standardWordLength = 5;
  const minutes = timeInSeconds / 60;
  
  // WPM calculation based on correct characters only
  // This is more accurate than counting total characters
  const words = correctCharacters / standardWordLength;
  
  // Ensure value is rounded to 1 decimal place for more precision
  return Math.round(words / minutes * 10) / 10;
};

// Function to calculate characters per minute with improved accuracy
export const calculateCPM = (
  typedCharacters: number,
  timeInSeconds: number
): number => {
  // Safety check - avoid division by zero
  if (timeInSeconds <= 0) return 0;
  if (typedCharacters <= 0) return 0;
  
  const minutes = timeInSeconds / 60;
  
  // Round to 1 decimal place for more precision
  return Math.round(typedCharacters / minutes * 10) / 10;
};

// Function to calculate accuracy with improved precision
export const calculateAccuracy = (
  totalCharacters: number,
  correctCharacters: number
): number => {
  // Safety check - avoid division by zero
  if (totalCharacters <= 0) return 0;
  
  // Ensure correctCharacters doesn't exceed totalCharacters
  const validCorrectChars = Math.min(correctCharacters, totalCharacters);
  
  // Calculate accuracy with 1 decimal place for precision
  return Math.round((validCorrectChars / totalCharacters) * 1000) / 10;
};

// Generate a list of available categories
export const getTextCategories = () => {
  return Object.keys(paragraphs);
};

// Get difficulty-based text sets
export const getTextsByDifficulty = (difficulty: string) => {
  if (difficulty in paragraphs) {
    return paragraphs[difficulty as keyof typeof paragraphs];
  }
  return paragraphs.intermediate;
};
