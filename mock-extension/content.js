
// Content script for the Text Magic Wand Chrome extension
// This script handles text selection and popup creation

// Track if the popup is already shown
let popupShown = false;

// Listen for text selection
document.addEventListener('mouseup', function(event) {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    // Get selected text
    const selectedText = selection.toString().trim();
    
    // Get position for popup
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Show the popup at the selection
    showPopup({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    }, selectedText);
  } else if (popupShown) {
    // Check if click is outside the popup to close it
    const popup = document.getElementById('text-magic-wand-popup');
    if (popup && !popup.contains(event.target)) {
      removePopup();
    }
  }
});

// Listen for messages from background script or popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'replaceText') {
    // Replace the selected text with transformed text
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(message.text));
      removePopup();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No text selected' });
    }
  }
});

// Create popup function
function showPopup(position, text) {
  // Remove any existing popup
  removePopup();
  
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
    { name: 'Tone', icon: '✨', tooltip: 'Rewrite Tone' },
    { name: 'Grammar', icon: '✓', tooltip: 'Check Grammar' },
    { name: 'Translate', icon: '🌐', tooltip: 'Translate' },
    { name: 'Pronounce', icon: '🔊', tooltip: 'Pronounce' },
    { name: 'Meaning', icon: '📚', tooltip: 'Get Meaning' }
  ];
  
  actions.forEach(action => {
    const button = document.createElement('button');
    button.className = 'text-magic-wand-button';
    button.innerHTML = `<span>${action.icon}</span>`;
    button.title = action.tooltip;
    
    button.addEventListener('click', function() {
      chrome.runtime.sendMessage({
        action: 'transformText',
        type: action.name.toLowerCase(),
        text: text
      }, function(response) {
        if (response && response.text) {
          chrome.runtime.sendMessage({
            action: 'replaceText',
            text: response.text
          });
        }
      });
    });
    
    popup.appendChild(button);
  });
  
  // Add popup to document
  document.body.appendChild(popup);
  popupShown = true;
  
  // Add event listener to close popup when clicking outside
  document.addEventListener('mousedown', handleOutsideClick);
}

// Handle clicks outside the popup
function handleOutsideClick(e) {
  const popup = document.getElementById('text-magic-wand-popup');
  if (popup && !popup.contains(e.target)) {
    removePopup();
  }
}

// Remove popup function
function removePopup() {
  const popup = document.getElementById('text-magic-wand-popup');
  if (popup) {
    popup.remove();
    popupShown = false;
    document.removeEventListener('mousedown', handleOutsideClick);
  }
}
