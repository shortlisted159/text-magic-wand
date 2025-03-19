
// Text transformation utility functions
import { SettingsState } from '@/contexts/SettingsContext';

// Settings utility function to get current settings
const getSettings = (): SettingsState => {
  // Try to get settings from localStorage
  try {
    const savedSettings = localStorage.getItem("textMagicWandSettings");
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
  
  // Return default settings if none found
  return {
    darkMode: false,
    grammarAutoDetect: true,
    grammarHighlight: true,
    primaryLanguage: "english",
    autoDetectLanguage: true,
    showPhonetic: true,
    autoPlayPronunciation: false,
    includeExamples: true,
    showPartOfSpeech: true
  };
};

/**
 * Transform text to different tones
 */
export const transformTone = (text: string, tone: string): string => {
  // In a real extension, this would use a language model API
  switch (tone) {
    case "casual":
      return `Hey there! ${text} Ya know what I mean?`;
    case "formal":
      return `I would like to inform you that ${text}. Thank you for your attention.`;
    case "friendly":
      return `Hi friend! ${text} Hope that helps!`;
    case "funny":
      return `Well, well, well... ${text} *dramatically drops mic*`;
    default:
      return text;
  }
};

/**
 * Check grammar and spelling
 */
export const checkGrammar = (text: string): string => {
  const settings = getSettings();
  
  // Don't perform correction if setting is disabled
  if (!settings.grammarAutoDetect) {
    return text;
  }
  
  // In a real extension, this would use a grammar checking API
  let corrected = text;
  
  // Simple example corrections
  corrected = corrected.replace(/\bi\b/g, "I");
  corrected = corrected.replace(/\s+/g, " ");
  corrected = corrected.replace(/\bi'm\b/g, "I'm");
  corrected = corrected.replace(/\bthier\b/g, "their");
  corrected = corrected.replace(/\byour welcome\b/g, "you're welcome");
  
  // Apply highlighting if setting is enabled
  if (settings.grammarHighlight) {
    // In a real implementation, this would highlight the corrections
    // For our mock version, we'll add a marker
    corrected = `${corrected} [Grammar checked ✓]`;
  }
  
  return corrected.trim();
};

// Define some mock translations for simulation
const mockTranslations: Record<string, Record<string, string>> = {
  spanish: {
    "hello": "hola",
    "goodbye": "adiós",
    "thank you": "gracias",
    "please": "por favor",
    "yes": "sí",
    "no": "no",
    "good": "bueno",
    "bad": "malo",
    "food": "comida",
    "water": "agua",
    "friends": "amigos",
    "book": "libro"
  },
  french: {
    "hello": "bonjour",
    "goodbye": "au revoir",
    "thank you": "merci",
    "please": "s'il vous plaît",
    "yes": "oui",
    "no": "non",
    "good": "bon",
    "bad": "mauvais",
    "food": "nourriture",
    "water": "eau"
  },
  german: {
    "hello": "hallo",
    "goodbye": "auf wiedersehen",
    "thank you": "danke",
    "please": "bitte",
    "yes": "ja",
    "no": "nein"
  },
  hindi: {
    "hello": "नमस्ते (namaste)",
    "goodbye": "अलविदा (alvida)",
    "thank you": "धन्यवाद (dhanyavaad)",
    "please": "कृपया (kripya)"
  }
};

/**
 * Translate text to different languages
 */
export const translateText = (text: string, targetLanguage?: string): string => {
  const settings = getSettings();
  
  // Use settings.primaryLanguage if targetLanguage not provided
  const language = (targetLanguage || settings.primaryLanguage).toLowerCase();
  
  // Add auto-detection note if that setting is enabled
  const detectionNote = settings.autoDetectLanguage ? 
    " (Auto-detected source language)" : "";
    
  // Simple word-by-word translation for demo purposes
  if (mockTranslations[language]) {
    let translated = text;
    const words = text.toLowerCase().split(/\b/);
    
    words.forEach(word => {
      if (mockTranslations[language][word.trim()]) {
        const regex = new RegExp(`\\b${word.trim()}\\b`, 'gi');
        translated = translated.replace(regex, mockTranslations[language][word.trim()]);
      }
    });
    
    if (translated !== text) {
      return `${translated}${detectionNote}`;
    }
  }
  
  // If we don't have translations or nothing matched,
  // return a simulation message
  return `[Translated to ${language}${detectionNote}] ${text}`;
};

// Mock phonetic pronunciations
const mockPhonetics: Record<string, string> = {
  "hello": "/həˈloʊ/",
  "goodbye": "/ˌɡʊdˈbaɪ/",
  "thank": "/θæŋk/",
  "you": "/juː/",
  "please": "/pliːz/",
  "yes": "/jɛs/",
  "no": "/noʊ/",
  "good": "/ɡʊd/",
  "bad": "/bæd/",
  "book": "/bʊk/",
  "computer": "/kəmˈpjuːtər/",
  "program": "/ˈproʊɡræm/",
  "language": "/ˈlæŋɡwɪdʒ/",
  "extension": "/ɪkˈstɛnʃən/",
  "technology": "/tɛkˈnɑːlədʒi/"
};

/**
 * Get pronunciation guide
 */
export const getPronunciation = (word: string): { phonetic: string, audioUrl: string } => {
  const settings = getSettings();
  
  // For single words, try to find in our phonetics dictionary
  const singleWord = word.trim().toLowerCase();
  let phonetic = "";
  
  if (mockPhonetics[singleWord] && settings.showPhonetic) {
    phonetic = mockPhonetics[singleWord];
  } else if (settings.showPhonetic) {
    // For demonstration, create a simple phonetic representation
    phonetic = `/ˈsɪmjʊleɪtɪd/`;
  }
  
  // Generate a fake audio URL that we can use for playback simulation
  const timestamp = new Date().getTime();
  const audioUrl = `https://api.pronunciation-simulator.example/${encodeURIComponent(word)}?t=${timestamp}`;
  
  return {
    phonetic,
    audioUrl
  };
};

// Mock dictionary entries
const mockDictionary: Record<string, {
  definition: string,
  partOfSpeech: string,
  examples: string[]
}> = {
  "hello": {
    definition: "Used as a greeting or to begin a conversation.",
    partOfSpeech: "exclamation",
    examples: [
      "Hello there, how are you?",
      "She said hello to the guests as they arrived."
    ]
  },
  "goodbye": {
    definition: "Used when parting from someone.",
    partOfSpeech: "exclamation",
    examples: [
      "They said their goodbyes before leaving.",
      "She waved goodbye as the train departed."
    ]
  },
  "book": {
    definition: "A written or printed work consisting of pages glued or sewn together along one side and bound in covers.",
    partOfSpeech: "noun",
    examples: [
      "I'm reading a good book at the moment.",
      "The library has over a million books."
    ]
  },
  "program": {
    definition: "A series of coded software instructions to control the operation of a computer or other machine.",
    partOfSpeech: "noun",
    examples: [
      "She wrote a program to analyze the data.",
      "The program crashed and I lost my work."
    ]
  },
  "computer": {
    definition: "An electronic device for storing and processing data, typically in binary form.",
    partOfSpeech: "noun",
    examples: [
      "She bought a new computer for her office.",
      "The computer processes millions of calculations per second."
    ]
  }
};

/**
 * Get word or phrase meaning
 */
export const getMeaning = (
  text: string, 
  includeExamples?: boolean, 
  includePartOfSpeech?: boolean
): {
  definition: string,
  partOfSpeech?: string,
  examples?: string[]
} => {
  const settings = getSettings();
  
  // Use settings if params not provided
  const showExamples = includeExamples !== undefined ? 
    includeExamples : settings.includeExamples;
  
  const showPartOfSpeech = includePartOfSpeech !== undefined ? 
    includePartOfSpeech : settings.showPartOfSpeech;
  
  // Try to find the word in our mock dictionary
  const lowercaseText = text.toLowerCase().trim();
  
  if (mockDictionary[lowercaseText]) {
    const entry = mockDictionary[lowercaseText];
    const result: {
      definition: string,
      partOfSpeech?: string,
      examples?: string[]
    } = {
      definition: entry.definition
    };
    
    if (showPartOfSpeech) {
      result.partOfSpeech = entry.partOfSpeech;
    }
    
    if (showExamples) {
      result.examples = entry.examples;
    }
    
    return result;
  }
  
  // For words not in our dictionary
  const result: {
    definition: string,
    partOfSpeech?: string,
    examples?: string[]
  } = {
    definition: `Definition for "${text}" would appear here from a dictionary API.`
  };
  
  if (showPartOfSpeech) {
    result.partOfSpeech = "unknown";
  }
  
  if (showExamples) {
    result.examples = [
      `This is an example sentence using "${text}".`,
      `Another example with "${text}" would appear here.`
    ];
  }
  
  return result;
};

/**
 * Summarize text
 */
export const summarizeText = (text: string): string => {
  // In a real extension, this would use a summarization API
  
  // Mock implementation: truncate and add ellipsis
  if (text.length > 100) {
    return text.slice(0, 100) + "...";
  }
  return text;
};

// Function to play pronunciation audio
export const playPronunciation = (word: string): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`Playing pronunciation for: ${word}`);
    
    // In a real extension, this would play an audio file
    // For our simulation, we'll just resolve after a delay
    setTimeout(() => {
      console.log(`Finished playing pronunciation for: ${word}`);
      resolve();
    }, 2000);
  });
};
