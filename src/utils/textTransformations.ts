
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

/**
 * Translate text to different languages
 */
export const translateText = (text: string, targetLanguage?: string): string => {
  const settings = getSettings();
  
  // Use settings.primaryLanguage if targetLanguage not provided
  const language = targetLanguage || settings.primaryLanguage;
  
  // Add auto-detection note if that setting is enabled
  const detectionNote = settings.autoDetectLanguage ? 
    " (Auto-detected source language)" : "";
  
  // In a real extension, this would use a translation API
  return `[Translated to ${language}${detectionNote}] ${text}`;
};

/**
 * Get pronunciation guide
 */
export const getPronunciation = (word: string): { phonetic: string, audioUrl: string } => {
  const settings = getSettings();
  
  // Return phonetic spelling based on settings
  const phonetic = settings.showPhonetic ? `/ˈsæmpəl/` : "";
  
  return {
    phonetic: phonetic,
    audioUrl: "https://example.com/audio/sample.mp3" // Example audio URL
  };
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
  
  // In a real extension, this would use a dictionary API
  const result: {
    definition: string,
    partOfSpeech?: string,
    examples?: string[]
  } = {
    definition: `Definition of "${text}" would appear here.`
  };
  
  if (showPartOfSpeech) {
    result.partOfSpeech = "noun";
  }
  
  if (showExamples) {
    result.examples = [
      `Here's an example of how to use "${text}" in a sentence.`,
      `Another example of "${text}" usage would appear here.`
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
