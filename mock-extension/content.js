
// This would be the content script for the actual Chrome extension
// It would inject the text selection popup into web pages

// Listen for text selection
document.addEventListener('mouseup', function(event) {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    // Get selected text
    const selectedText = selection.toString().trim();
    
    // Get position for popup
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Send message to background script with selected text and position
    chrome.runtime.sendMessage({
      action: 'showPopup',
      text: selectedText,
      position: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
      }
    });
  }
});

// Listen for messages from background script or popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'replaceText') {
    // Replace the selected text with transformed text
    document.execCommand('insertText', false, message.text);
    sendResponse({ success: true });
  }
});

// Create and inject popup when requested
function createPopup(position, text) {
  // Remove any existing popup
  const existingPopup = document.getElementById('text-magic-wand-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'text-magic-wand-popup';
  popup.className = 'text-magic-wand-popup';
  popup.style.position = 'absolute';
  popup.style.left = `${position.x}px`;
  popup.style.top = `${position.y + 20}px`;
  popup.style.zIndex = '9999';
  
  // Add buttons for each transformation
  const actions = [
    { name: 'Tone', icon: '✨' },
    { name: 'Grammar', icon: '✓' },
    { name: 'Translate', icon: '🌐' },
    { name: 'Pronounce', icon: '🔊' },
    { name: 'Meaning', icon: '📚' }
  ];
  
  actions.forEach(action => {
    const button = document.createElement('button');
    button.className = 'text-magic-wand-button';
    button.innerHTML = `<span>${action.icon}</span>`;
    button.title = action.name;
    
    button.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: 'transformText',
        type: action.name.toLowerCase(),
        text: text
      });
    });
    
    popup.appendChild(button);
  });
  
  // Add popup to document
  document.body.appendChild(popup);
  
  // Close popup when clicking outside
  document.addEventListener('mousedown', function closePopup(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('mousedown', closePopup);
    }
  });
}

// Listen for popup creation request from background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'createPopup') {
    createPopup(message.position, message.text);
    sendResponse({ success: true });
  }
});
