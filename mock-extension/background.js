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
  // Import and use the actual transformation functions
  switch (type) {
    case 'tone':
      const tone = params.tone || 'formal';
      if (tone === 'casual') {
        return `Hey there! ${text} Ya know what I mean?`;
      } else if (tone === 'formal') {
        return `I would like to inform you that ${text}. Thank you for your attention.`;
      } else if (tone === 'friendly') {
        return `Hi friend! ${text} Hope that helps!`;
      } else if (tone === 'funny') {
        return `Well, well, well... ${text} *dramatically drops mic*`;
      } else {
        return text;
      }
      
    case 'grammar':
      // Basic grammar check implementation
      return text
        .replace(/\bi\b/g, "I")
        .replace(/\bthier\b/g, "their")
        .replace(/\byour welcome\b/g, "you're welcome")
        .replace(/\bi'm\b/g, "I'm")
        .replace(/\s+/g, " ").trim();
      
    case 'translate':
      const language = params.language || 'English';
      // Mock translation that would be replaced with actual API in production
      return `[Translated to ${language}] ${text}`;
      
    case 'pronounce':
      // Mock pronunciation data
      const phonetic = `/prəˌnʌnsɪˈeɪʃən/`;
      return `${text} [pronunciation: ${phonetic}]`;
      
    case 'meaning':
      // Mock dictionary lookup
      const definition = `Definition of "${text}": A sample definition would appear here.`;
      const partOfSpeech = "noun";
      const examples = [
        `Example: Here's how to use "${text}" in a sentence.`,
        `Another example with "${text}" would look like this.`
      ];
      
      return `${definition}\nPart of Speech: ${partOfSpeech}\n${examples.join('\n')}`;
      
    default:
      return text;
  }
}
