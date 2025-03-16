
// This would be the background script for the actual Chrome extension
// It would handle communication between the content script and popup

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
    // Send message to active tab to process the selected text
    chrome.tabs.sendMessage(tab.id, {
      action: 'transformText',
      type: action,
      text: info.selectionText,
      params: params
    });
  }
});

// Listen for popup requests from content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'showPopup') {
    // Forward message to the content script that sent it
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'createPopup',
      position: message.position,
      text: message.text
    });
  } else if (message.action === 'transformText') {
    // Load user settings from storage
    chrome.storage.sync.get(null, function(settings) {
      // Process transformation based on type
      // In a real extension, this might use external APIs
      processTransformation(message.type, message.text, settings)
        .then(function(result) {
          // Send transformed text back to content script
          chrome.tabs.sendMessage(sender.tab.id, {
            action: 'replaceText',
            text: result
          });
        });
    });
  }
});

// Function to process text transformations
async function processTransformation(type, text, settings) {
  // This would use APIs in a real extension
  // For now, we'll use simple mock transformations
  
  switch (type) {
    case 'tone':
      // Mock tone transformation
      return `[${settings.tone || 'formal'} tone] ${text}`;
      
    case 'grammar':
      // Mock grammar check
      return text
        .replace(/\bi\b/g, "I")
        .replace(/\bthier\b/g, "their")
        .replace(/\byour welcome\b/g, "you're welcome");
      
    case 'translate':
      // Mock translation
      return `[Translated to ${settings.primaryLanguage || 'English'}] ${text}`;
      
    case 'pronounce':
      // In a real extension, this would get pronunciation data
      // For now, just return the original text
      return text;
      
    case 'meaning':
      // Mock meaning lookup
      return `Definition of "${text}": A sample definition would appear here.`;
      
    default:
      return text;
  }
}
