
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
      if (sendResponse) {
        sendResponse({ success: true });
      }
    } else if (sendResponse) {
      sendResponse({ success: false, error: 'No text selected' });
    }
  }
  return true;
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
  popup.style.top = `${position.y - 40}px`; // Position above the text
  popup.style.zIndex = '2147483647'; // Maximum z-index
  
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
      // Show loading state
      const loadingIndicator = document.createElement('div');
      loadingIndicator.textContent = 'Processing...';
      loadingIndicator.style.position = 'absolute';
      loadingIndicator.style.top = `${position.y + 30}px`;
      loadingIndicator.style.left = `${position.x}px`;
      loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      loadingIndicator.style.color = 'white';
      loadingIndicator.style.padding = '5px 10px';
      loadingIndicator.style.borderRadius = '3px';
      loadingIndicator.style.zIndex = '2147483647';
      document.body.appendChild(loadingIndicator);
      
      // Get transformation options based on button type
      let transformParams = {};
      if (action.name.toLowerCase() === 'tone') {
        transformParams = { tone: 'formal' }; // Default to formal tone
      } else if (action.name.toLowerCase() === 'translate') {
        transformParams = { language: 'Spanish' }; // Default to Spanish
      }
      
      // Send message to background script
      chrome.runtime.sendMessage({
        action: 'transformText',
        type: action.name.toLowerCase(),
        text: text,
        params: transformParams
      }, function(response) {
        // Remove loading indicator
        document.body.removeChild(loadingIndicator);
        
        if (response && response.text) {
          // Replace the text with the transformed version
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(response.text));
            removePopup();
          }
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

// Add styles for the popup dynamically
const addStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .text-magic-wand-popup {
      background-color: #ffffff;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      gap: 4px;
      padding: 6px;
      border: 1px solid #e5e5e5;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      animation: fadeIn 0.2s ease-in-out;
    }
    
    @media (prefers-color-scheme: dark) {
      .text-magic-wand-popup {
        background-color: #2d2d2d;
        border-color: #444444;
      }
      
      .text-magic-wand-button {
        color: #ffffff;
        background-color: #3d3d3d;
      }
      
      .text-magic-wand-button:hover {
        background-color: #525252;
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .text-magic-wand-button {
      background-color: #f5f5f5;
      border: none;
      border-radius: 4px;
      color: #333333;
      cursor: pointer;
      font-size: 14px;
      height: 32px;
      min-width: 32px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }
    
    .text-magic-wand-button:hover {
      background-color: #e9e9e9;
    }
    
    .text-magic-wand-button span {
      font-size: 16px;
    }
  `;
  document.head.appendChild(style);
};

// Initialize styles
addStyles();
