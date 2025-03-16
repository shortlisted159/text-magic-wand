
// Text transformation utility functions

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
  // In a real extension, this would use a grammar checking API
  let corrected = text;
  
  // Simple example corrections
  corrected = corrected.replace(/\bi\b/g, "I");
  corrected = corrected.replace(/\s+/g, " ");
  corrected = corrected.replace(/\bi'm\b/g, "I'm");
  corrected = corrected.replace(/\bthier\b/g, "their");
  corrected = corrected.replace(/\byour welcome\b/g, "you're welcome");
  
  return corrected.trim();
};

/**
 * Translate text to different languages
 */
export const translateText = (text: string, targetLanguage: string): string => {
  // In a real extension, this would use a translation API
  // Mock implementation
  return `[Translated to ${targetLanguage}] ${text}`;
};

/**
 * Get pronunciation guide
 */
export const getPronunciation = (word: string): { phonetic: string, audioUrl: string } => {
  // In a real extension, this would use a pronunciation API
  return {
    phonetic: `/ˈsæmpəl/`, // Example phonetic spelling
    audioUrl: "https://example.com/audio/sample.mp3" // Example audio URL
  };
};

/**
 * Get word or phrase meaning
 */
export const getMeaning = (
  text: string, 
  includeExamples: boolean = true, 
  includePartOfSpeech: boolean = true
): {
  definition: string,
  partOfSpeech?: string,
  examples?: string[]
} => {
  // In a real extension, this would use a dictionary API
  
  // Mock implementation
  const result: {
    definition: string,
    partOfSpeech?: string,
    examples?: string[]
  } = {
    definition: `Definition of "${text}" would appear here.`
  };
  
  if (includePartOfSpeech) {
    result.partOfSpeech = "noun";
  }
  
  if (includeExamples) {
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
