
// Background script for the Text Magic Wand Chrome extension
// Handles communication between content script and popup

// Initialize context menu items
chrome.runtime.onInstalled.addListener(function() {
  // Create context menu items for each transformation type
  const contextMenuItems = [
    { id: 'tone', title: 'Rewrite tone...' },
    { id: 'grammar', title: 'Check grammar' },
    { id: 'translate', title: 'Translate...' },
    { id: 'pronounce', title: 'Pronounce' },
    { id: 'meaning', title: 'Get meaning' }
  ];
  
  // Create parent menu item
  chrome.contextMenus.create({
    id: 'text-magic-wand',
    title: 'Text Magic Wand',
    contexts: ['selection']
  });
  
  // Create child menu items
  contextMenuItems.forEach(item => {
    chrome.contextMenus.create({
      id: item.id,
      parentId: 'text-magic-wand',
      title: item.title,
      contexts: ['selection']
    });
  });
  
  // Add tone sub-options
  const tones = ['Casual', 'Formal', 'Friendly', 'Funny'];
  tones.forEach(tone => {
    chrome.contextMenus.create({
      id: `tone-${tone.toLowerCase()}`,
      parentId: 'tone',
      title: tone,
      contexts: ['selection']
    });
  });
  
  // Add translation language options
  const languages = ['English', 'Hindi', 'Spanish', 'German', 'French'];
  languages.forEach(language => {
    chrome.contextMenus.create({
      id: `translate-${language.toLowerCase()}`,
      parentId: 'translate',
      title: language,
      contexts: ['selection']
    });
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (!info.selectionText) return;
  
  let action = '';
  let params = {};
  
  // Determine which action to take based on menu item clicked
  if (info.menuItemId === 'grammar') {
    action = 'grammar';
  } else if (info.menuItemId === 'pronounce') {
    action = 'pronounce';
  } else if (info.menuItemId === 'meaning') {
    action = 'meaning';
  } else if (info.menuItemId.startsWith('tone-')) {
    action = 'tone';
    params.tone = info.menuItemId.replace('tone-', '');
  } else if (info.menuItemId.startsWith('translate-')) {
    action = 'translate';
    params.language = info.menuItemId.replace('translate-', '');
  }
  
  if (action) {
    // Process the transformation and send back to content script
    processTransformation(action, info.selectionText, params)
      .then(function(result) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'replaceText',
          text: result
        });
      });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'transformText') {
    // Process transformation based on type
    processTransformation(message.type, message.text, message.params || {})
      .then(function(result) {
        // Send result back to sender
        sendResponse({ text: result });
      });
    // Keep the message channel open for the async response
    return true;
  } else if (message.action === 'replaceText' && sender.tab) {
    // Forward the replacement message to the content script
    chrome.tabs.sendMessage(sender.tab.id, message);
  }
});

// Function to process text transformations
async function processTransformation(type, text, params = {}) {
  // Enhanced transformation implementations that work better
  switch (type) {
    case 'tone':
      const tone = params.tone || 'formal';
      if (tone === 'casual') {
        return transformToCasual(text);
      } else if (tone === 'formal') {
        return transformToFormal(text);
      } else if (tone === 'friendly') {
        return transformToFriendly(text);
      } else if (tone === 'funny') {
        return transformToFunny(text);
      } else {
        return text;
      }
      
    case 'grammar':
      return checkGrammar(text);
      
    case 'translate':
      const language = params.language || 'spanish';
      return translateText(text, language);
      
    case 'pronounce':
      return getPronunciation(text);
      
    case 'meaning':
      return getMeaning(text);
      
    default:
      return text;
  }
}

// Enhanced tone transformation functions
function transformToCasual(text) {
  // Replace formal words with casual equivalents
  const casualText = text
    .replace(/\bUtilize\b/gi, "Use")
    .replace(/\bPurchase\b/gi, "Buy")
    .replace(/\bAssist\b/gi, "Help")
    .replace(/\bRequire\b/gi, "Need")
    .replace(/\bAdditional\b/gi, "More")
    .replace(/\bRequest\b/gi, "Ask")
    .replace(/\bObtain\b/gi, "Get")
    .replace(/\bCommunicate\b/gi, "Talk");
  
  // Add casual markers
  return `${casualText} 👍 Cool, right?`;
}

function transformToFormal(text) {
  // Replace casual words with formal equivalents
  const formalText = text
    .replace(/\bget\b/gi, "obtain")
    .replace(/\buse\b/gi, "utilize")
    .replace(/\bbuy\b/gi, "purchase")
    .replace(/\bhelp\b/gi, "assist")
    .replace(/\bneed\b/gi, "require")
    .replace(/\bmore\b/gi, "additional")
    .replace(/\bask\b/gi, "request")
    .replace(/\btalk\b/gi, "communicate");
  
  // Ensure proper capitalization and ending
  let result = formalText.charAt(0).toUpperCase() + formalText.slice(1);
  if (!result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) {
    result += '.';
  }
  
  return `I would like to inform you that ${result} Thank you for your attention.`;
}

function transformToFriendly(text) {
  return `Hey there! 😊 ${text} Hope that helps, friend!`;
}

function transformToFunny(text) {
  const funnyIntros = [
    "Get this... ",
    "OMG, listen up! ",
    "Hold onto your hat... ",
    "Breaking news! ",
    "You won't believe this but... "
  ];
  
  const funnyOutros = [
    " *mic drop*",
    " 😂 I can't even!",
    " Hilarious, right?",
    " That's what she said!",
    " Welcome to my TED talk.",
    " And that's the tea!"
  ];
  
  const randomIntro = funnyIntros[Math.floor(Math.random() * funnyIntros.length)];
  const randomOutro = funnyOutros[Math.floor(Math.random() * funnyOutros.length)];
  
  return `${randomIntro}${text}${randomOutro}`;
}

// Enhanced grammar checking function
function checkGrammar(text) {
  // More comprehensive grammar checks
  return text
    .replace(/\bi\b/g, "I")
    .replace(/\bim\b/gi, "I'm")
    .replace(/\bi'm\b/g, "I'm")
    .replace(/\bwont\b/gi, "won't")
    .replace(/\bdont\b/gi, "don't")
    .replace(/\bcant\b/gi, "can't")
    .replace(/\bthier\b/gi, "their")
    .replace(/\bthey're\b/gi, "they're")
    .replace(/\byour welcome\b/gi, "you're welcome")
    .replace(/\byour going\b/gi, "you're going")
    .replace(/\btheir going\b/gi, "they're going")
    .replace(/\bit's a\b/gi, "its a")
    .replace(/\bit's book\b/gi, "its book")
    .replace(/\btheres\b/gi, "there's")
    .replace(/\bwheres\b/gi, "where's")
    .replace(/(\.)(\w)/g, ". $2") // Add space after period
    .replace(/\s+/g, " ").trim();
}

// Enhanced translation function
function translateText(text, language) {
  // Mock translations for different languages
  const translations = {
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
      "friend": "amigo",
      "book": "libro",
      "car": "coche",
      "house": "casa",
      "work": "trabajo"
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
      "water": "eau",
      "friend": "ami",
      "book": "livre",
      "car": "voiture",
      "house": "maison",
      "work": "travail"
    },
    german: {
      "hello": "hallo",
      "goodbye": "auf wiedersehen",
      "thank you": "danke",
      "please": "bitte",
      "yes": "ja",
      "no": "nein",
      "good": "gut",
      "bad": "schlecht",
      "food": "essen",
      "water": "wasser",
      "friend": "freund",
      "book": "buch",
      "car": "auto",
      "house": "haus",
      "work": "arbeit"
    },
    hindi: {
      "hello": "नमस्ते (namaste)",
      "goodbye": "अलविदा (alvida)",
      "thank you": "धन्यवाद (dhanyavaad)",
      "please": "कृपया (kripya)",
      "yes": "हां (haan)",
      "no": "नहीं (nahin)",
      "good": "अच्छा (accha)",
      "bad": "बुरा (bura)",
      "food": "खाना (khaana)",
      "water": "पानी (paani)",
      "friend": "दोस्त (dost)",
      "book": "किताब (kitaab)",
      "car": "कार (kaar)",
      "house": "घर (ghar)",
      "work": "काम (kaam)"
    },
    english: {
      // For translating back to English
    }
  };
  
  language = language.toLowerCase();
  
  // If we don't have a dictionary for this language, return a placeholder
  if (!translations[language]) {
    return `[Translated to ${language}] ${text}`;
  }
  
  // Simple word-by-word translation
  let translatedText = text;
  Object.keys(translations[language]).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    translatedText = translatedText.replace(regex, translations[language][word]);
  });
  
  // If nothing was translated, return the original with a note
  if (translatedText === text) {
    return `[Translated to ${language}] ${text}`;
  }
  
  return translatedText;
}

// Enhanced pronunciation function
function getPronunciation(text) {
  // Mock phonetic pronunciations for common words
  const phonetics = {
    "hello": "/həˈloʊ/",
    "goodbye": "/ˌɡʊdˈbaɪ/",
    "thank": "/θæŋk/",
    "please": "/pliz/",
    "yes": "/jɛs/",
    "no": "/noʊ/",
    "good": "/ɡʊd/",
    "bad": "/bæd/",
    "food": "/fud/",
    "water": "/ˈwɔtər/",
    "friend": "/frɛnd/",
    "book": "/bʊk/",
    "car": "/kɑr/",
    "house": "/haʊs/",
    "work": "/wɜrk/",
    "computer": "/kəmˈpjutər/",
    "language": "/ˈlæŋɡwɪdʒ/",
    "dictionary": "/ˈdɪkʃəˌnɛri/",
    "pronunciation": "/prəˌnʌnsiˈeɪʃən/"
  };
  
  // Try to find the word in our phonetics dictionary
  const words = text.toLowerCase().split(/\s+/);
  if (words.length === 1 && phonetics[words[0]]) {
    return `${text} [pronunciation: ${phonetics[words[0]]}]`;
  }
  
  // For multiple words or unknown words, return a generic response
  return `${text} [Click the speaker icon to hear pronunciation]`;
}

// Enhanced meaning function
function getMeaning(text) {
  // Mock dictionary definitions for common words
  const definitions = {
    "hello": {
      definition: "Used as a greeting or to begin a phone conversation.",
      partOfSpeech: "exclamation",
      examples: ["Hello there, how are you?", "Hello, this is John speaking."]
    },
    "goodbye": {
      definition: "Used when parting or at the end of a conversation.",
      partOfSpeech: "exclamation",
      examples: ["Goodbye, see you tomorrow!", "She waved goodbye to her friends."]
    },
    "thank": {
      definition: "Express gratitude to (someone).",
      partOfSpeech: "verb",
      examples: ["I thanked him for his help.", "Thank you for your assistance."]
    },
    "please": {
      definition: "Used as a polite request or to add emphasis.",
      partOfSpeech: "adverb",
      examples: ["Could you please help me?", "Please, listen to what I'm saying."]
    },
    "good": {
      definition: "To be desired or approved of.",
      partOfSpeech: "adjective",
      examples: ["A good book", "The food was good."]
    }
  };
  
  // Clean up the text for lookup
  const lookupWord = text.toLowerCase().trim().replace(/[^\w\s]/g, '');
  
  // Check if we have this word in our dictionary
  if (definitions[lookupWord]) {
    const def = definitions[lookupWord];
    return `Definition of "${text}": ${def.definition}\nPart of Speech: ${def.partOfSpeech}\nExamples: ${def.examples.join(', ')}`;
  }
  
  // For words not in our dictionary
  return `Definition of "${text}": This word is not in our dictionary yet.\nTry searching for this word online for a complete definition.`;
}
