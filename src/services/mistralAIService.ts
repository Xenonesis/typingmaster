
// Mistral AI API integration for generating typing challenges
// Use environment variable for API key
import { ChallengeType } from "@/utils/textGenerator";

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "ZlpFhuLy30eBxpucPJM9h3hq8ygcIAb2";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Generate a typing challenge text using Mistral AI
 * @param type The type of challenge to generate
 * @returns Promise with the generated text
 */
export const generateChallenge = async (type: ChallengeType): Promise<string> => {
  // Map challenge types to appropriate prompts
  const prompts: Record<ChallengeType, string> = {
    beginner: "Generate a simple, easy-to-type paragraph (40-60 words) for beginner typists using basic vocabulary and short sentences. Make it interesting but easy.",
    intermediate: "Generate a medium difficulty typing paragraph (60-80 words) with common punctuation and moderate vocabulary that would make a good typing exercise for intermediate typists.",
    advanced: "Generate a challenging paragraph (80-120 words) with complex vocabulary, special characters, and varied punctuation for advanced typists.",
    code: "Generate a short snippet of well-formatted, realistic code (JavaScript, Python, or TypeScript) that would make a good typing exercise for programmers. Include comments and proper indentation.",
    quotes: "Generate an inspiring or thought-provoking quote (30-50 words) from a famous person that would make a good typing exercise.",
    poetry: "Generate a short poem (40-80 words) with interesting rhythm that would make a good typing exercise."
  };

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates high-quality typing exercises based on the user's request."
          },
          {
            role: "user",
            content: prompts[type]
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text from the response
    const generatedText = data.choices[0]?.message?.content?.trim();
    
    if (!generatedText) {
      throw new Error("No text was generated");
    }
    
    return generatedText;
  } catch (error) {
    console.error("Failed to generate text from Mistral AI:", error);
    // Return a default text instead of throwing error to improve user experience
    return getDefaultText(type);
  }
}; 

/**
 * Provides fallback text when API call fails
 */
const getDefaultText = (type: ChallengeType): string => {
  const fallbackTexts: Record<ChallengeType, string> = {
    beginner: "The quick brown fox jumps over the lazy dog. This simple sentence contains every letter of the alphabet and is perfect for beginners to practice typing.",
    intermediate: "Learning to type efficiently is an essential skill in today's digital world. With practice and dedication, anyone can improve their typing speed and accuracy.",
    advanced: "The complexity of human cognition—our ability to process, analyze, and synthesize diverse information—distinguishes us from other species. This remarkable capacity enables us to solve intricate problems, create art, and develop technology.",
    code: `function calculateWordCount(text) {
  // Remove extra whitespace and split by spaces
  const words = text.trim().split(/\\s+/);
  return words.length;
  // Return the number of words in the text
}`,
    quotes: "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    poetry: "The road not taken, beckons me still,\nWith paths diverged in yellow wood.\nLong I stood, contemplating which to fill,\nKnowing not where either would."
  };
  
  return fallbackTexts[type];
} 
