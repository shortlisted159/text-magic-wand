
// Event listeners for the popup

document.addEventListener('DOMContentLoaded', function() {
  // Get all feature buttons
  const featureButtons = document.querySelectorAll('.feature-button');
  
  // Add click listeners to each button
  featureButtons.forEach(function(button, index) {
    button.addEventListener('click', function() {
      const featureLabels = ['tone', 'grammar', 'translate', 'pronounce', 'meaning', 'settings'];
      const featureLabel = featureLabels[index];
      
      // Handle settings button differently
      if (featureLabel === 'settings') {
        // Open options page
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
        window.close();
        return;
      }
      
      // For other features, get the active tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Execute script to get selected text
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: getSelectedText
        }, function(results) {
          if (results && results[0] && results[0].result) {
            const selectedText = results[0].result;
            
            // Process the selected text based on the feature
            processFeature(featureLabel, selectedText, tabs[0].id);
          } else {
            // If no text is selected, show instructions
            chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              function: showInstructions,
              args: [featureLabel]
            });
          }
        });
      });
      
      // Close the popup
      window.close();
    });
  });
  
  // Open options page when link is clicked
  document.getElementById('open-options').addEventListener('click', function(e) {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
});

// Function to get selected text from the page
function getSelectedText() {
  return window.getSelection().toString().trim();
}

// Function to show instructions when no text is selected
function showInstructions(feature) {
  // Create a notification element
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = '#333333';
  notification.style.color = '#ffffff';
  notification.style.padding = '12px 16px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '10000';
  notification.style.fontSize = '14px';
  notification.innerText = `Please select text to use the ${feature} feature.`;
  
  // Add to page and remove after 3 seconds
  document.body.appendChild(notification);
  setTimeout(function() {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(function() {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Function to process the feature on selected text
function processFeature(feature, text, tabId) {
  // Send message to background script to handle the transformation
  chrome.runtime.sendMessage({
    action: 'transformText',
    type: feature,
    text: text
  }, function(response) {
    // Response handling would go here
  });
}
