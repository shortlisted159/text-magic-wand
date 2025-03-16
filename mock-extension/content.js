
// Content script for the Text Magic Wand Chrome extension
// This script handles text selection and popup creation

import { 
  createPopup, 
  removePopup, 
  handleOutsideClick, 
  addStyles 
} from './utils/popupUtils.js';

import { 
  createResultContainer, 
  createBackButton 
} from './utils/resultUtils.js';

import { 
  createButtonsContainer, 
  createTransformationButtons 
} from './utils/transformationUtils.js';

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
  const popup = createPopup(position, text);
  
  // Create buttons container
  const buttonsContainer = createButtonsContainer();
  popup.appendChild(buttonsContainer);
  
  // Create result container (initially hidden)
  const resultContainer = createResultContainer();
  popup.appendChild(resultContainer);
  
  // Add back button (initially hidden)
  const backButton = createBackButton(resultContainer, buttonsContainer);
  popup.appendChild(backButton);
  
  // Create transformation buttons
  createTransformationButtons(
    buttonsContainer, 
    resultContainer, 
    backButton, 
    text
  );
  
  // Add popup to document
  document.body.appendChild(popup);
  popupShown = true;
  
  // Add event listener to close popup when clicking outside
  document.addEventListener('mousedown', handleOutsideClick);
}

// Initialize styles
addStyles();
