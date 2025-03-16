
// Utilities for handling transformation results

// Create a result container
function createResultContainer() {
  const resultContainer = document.createElement('div');
  resultContainer.className = 'text-magic-wand-result';
  resultContainer.style.display = 'none';
  return resultContainer;
}

// Create back button
function createBackButton(resultContainer, buttonsContainer) {
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
    const popup = document.getElementById('text-magic-wand-popup');
    if (popup) {
      popup.style.height = 'auto';
    }
  });
  
  return backButton;
}

// Format the transformation result based on action type
function formatResult(action, result, resultContainer) {
  resultContainer.innerHTML = '';
  
  if (action.toLowerCase() === 'meaning') {
    // Split meaning result into parts
    const parts = result.text.split('\n');
    parts.forEach(part => {
      const p = document.createElement('p');
      p.textContent = part;
      resultContainer.appendChild(p);
    });
  } else if (action.toLowerCase() === 'pronounce') {
    // For pronunciation, add play button
    const playButton = document.createElement('button');
    playButton.className = 'text-magic-wand-play-button';
    playButton.innerHTML = '🔊';
    playButton.title = 'Play pronunciation';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = result.text;
    
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
    resultContainer.textContent = result.text;
  }
  
  return resultContainer;
}

// Create action buttons (Copy and Replace)
function createActionButtons(resultText, resultContainer) {
  // Add a copy button
  const copyButton = document.createElement('button');
  copyButton.className = 'text-magic-wand-copy-button';
  copyButton.textContent = 'Copy';
  copyButton.addEventListener('click', function() {
    // Copy result to clipboard
    navigator.clipboard.writeText(resultText).then(function() {
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
      range.insertNode(document.createTextNode(resultText));
      document.getElementById('text-magic-wand-popup')?.remove();
    }
  });
  resultContainer.appendChild(replaceButton);
  
  return resultContainer;
}

// Adjust popup height if needed
function adjustPopupHeight(resultContainer) {
  if (resultContainer.offsetHeight > 200) {
    resultContainer.style.maxHeight = '200px';
    resultContainer.style.overflowY = 'auto';
  }
}

export { 
  createResultContainer, 
  createBackButton, 
  formatResult, 
  createActionButtons, 
  adjustPopupHeight 
};
