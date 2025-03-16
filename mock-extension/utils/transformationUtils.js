
// Utilities for text transformations

// Create a buttons container for transformation actions
function createButtonsContainer() {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'text-magic-wand-buttons';
  return buttonsContainer;
}

// Get transformation actions
function getTransformationActions() {
  return [
    { name: 'Tone', icon: '✨', tooltip: 'Rewrite Tone' },
    { name: 'Grammar', icon: '✓', tooltip: 'Check Grammar' },
    { name: 'Translate', icon: '🌐', tooltip: 'Translate' },
    { name: 'Pronounce', icon: '🔊', tooltip: 'Pronounce' },
    { name: 'Meaning', icon: '📚', tooltip: 'Get Meaning' }
  ];
}

// Create transformation buttons
function createTransformationButtons(
  buttonsContainer, 
  resultContainer, 
  backButton, 
  text
) {
  const actions = getTransformationActions();
  
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
          handleTransformationResult(action.name, response, resultContainer);
        } else {
          resultContainer.textContent = 'Error: Could not transform text.';
        }
      });
    });
    
    buttonsContainer.appendChild(button);
  });
  
  return buttonsContainer;
}

// Handle transformation result
function handleTransformationResult(actionName, response, resultContainer) {
  const formattedContainer = formatResult(actionName, response, resultContainer);
  const containerWithButtons = createActionButtons(response.text, formattedContainer);
  adjustPopupHeight(containerWithButtons);
  
  return containerWithButtons;
}

// Import needed functions from resultUtils
import { 
  formatResult, 
  createActionButtons, 
  adjustPopupHeight 
} from './resultUtils.js';

export { 
  createButtonsContainer, 
  getTransformationActions, 
  createTransformationButtons 
};
