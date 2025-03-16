
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

  // Create buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'text-magic-wand-buttons';
  popup.appendChild(buttonsContainer);
  
  // Create result container (initially hidden)
  const resultContainer = document.createElement('div');
  resultContainer.className = 'text-magic-wand-result';
  resultContainer.style.display = 'none';
  popup.appendChild(resultContainer);
  
  // Add back button (initially hidden)
  const backButton = document.createElement('button');
  backButton.className = 'text-magic-wand-back-button';
  backButton.innerHTML = '← Back';
  backButton.style.display = 'none';
  backButton.addEventListener('click', function() {
    // Hide result and back button, show buttons
    resultContainer.style.display = 'none';
    backButton.style.display = 'none';
    buttonsContainer.style.display = 'flex';
    
    // Reset popup height
    popup.style.height = 'auto';
  });
  popup.appendChild(backButton);
  
  actions.forEach(action => {
    const button = document.createElement('button');
    button.className = 'text-magic-wand-button';
    button.innerHTML = `<span>${action.icon}</span>`;
    button.title = action.tooltip;
    
    button.addEventListener('click', function() {
      // Show loading state in the result container
      resultContainer.textContent = 'Processing...';
      resultContainer.style.display = 'block';
      buttonsContainer.style.display = 'none';
      backButton.style.display = 'block';
      
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
        if (response && response.text) {
          // Show the result in the result container
          resultContainer.innerHTML = '';
          
          // Format the result based on action type
          if (action.name.toLowerCase() === 'meaning') {
            // Split meaning result into parts
            const parts = response.text.split('\n');
            parts.forEach(part => {
              const p = document.createElement('p');
              p.textContent = part;
              resultContainer.appendChild(p);
            });
          } else if (action.name.toLowerCase() === 'pronounce') {
            // For pronunciation, add play button
            const playButton = document.createElement('button');
            playButton.className = 'text-magic-wand-play-button';
            playButton.innerHTML = '🔊';
            playButton.title = 'Play pronunciation';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = response.text;
            
            resultContainer.appendChild(playButton);
            resultContainer.appendChild(textSpan);
            
            // Mock audio playback
            playButton.addEventListener('click', function() {
              playButton.innerHTML = '🔊 Playing...';
              setTimeout(() => {
                playButton.innerHTML = '🔊';
              }, 2000);
            });
          } else {
            // For other actions, just show the text
            resultContainer.textContent = response.text;
          }
          
          // Add a copy button
          const copyButton = document.createElement('button');
          copyButton.className = 'text-magic-wand-copy-button';
          copyButton.textContent = 'Copy';
          copyButton.addEventListener('click', function() {
            // Copy result to clipboard
            navigator.clipboard.writeText(response.text).then(function() {
              copyButton.textContent = 'Copied!';
              setTimeout(function() {
                copyButton.textContent = 'Copy';
              }, 2000);
            });
          });
          resultContainer.appendChild(copyButton);
          
          // Add a replace button
          const replaceButton = document.createElement('button');
          replaceButton.className = 'text-magic-wand-replace-button';
          replaceButton.textContent = 'Replace';
          replaceButton.addEventListener('click', function() {
            // Replace the text
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(response.text));
              removePopup();
            }
          });
          resultContainer.appendChild(replaceButton);
          
          // Adjust popup height if needed
          if (resultContainer.offsetHeight > 200) {
            resultContainer.style.maxHeight = '200px';
            resultContainer.style.overflowY = 'auto';
          }
        } else {
          resultContainer.textContent = 'Error: Could not transform text.';
        }
      });
    });
    
    buttonsContainer.appendChild(button);
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
      padding: 6px;
      border: 1px solid #e5e5e5;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      animation: fadeIn 0.2s ease-in-out;
      min-width: 240px;
      max-width: 320px;
    }
    
    .text-magic-wand-buttons {
      display: flex;
      gap: 4px;
    }
    
    .text-magic-wand-result {
      padding: 8px 4px;
      font-size: 14px;
      line-height: 1.5;
      color: #333333;
    }
    
    .text-magic-wand-back-button {
      background-color: transparent;
      border: none;
      color: #666666;
      cursor: pointer;
      font-size: 12px;
      padding: 4px 0;
      margin-bottom: 4px;
      text-align: left;
    }
    
    .text-magic-wand-copy-button,
    .text-magic-wand-replace-button {
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      color: #333333;
      cursor: pointer;
      font-size: 12px;
      margin-top: 8px;
      margin-right: 4px;
      padding: 4px 8px;
    }
    
    .text-magic-wand-play-button {
      background-color: transparent;
      border: none;
      color: #333333;
      cursor: pointer;
      font-size: 16px;
      margin-right: 4px;
      padding: 0;
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
      
      .text-magic-wand-result {
        color: #ffffff;
      }
      
      .text-magic-wand-back-button {
        color: #aaaaaa;
      }
      
      .text-magic-wand-copy-button,
      .text-magic-wand-replace-button {
        background-color: #3d3d3d;
        border-color: #555555;
        color: #ffffff;
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
