
// Utility functions for handling popups in the Text Magic Wand extension

// Create popup function
function createPopup(position, text) {
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'text-magic-wand-popup';
  popup.className = 'text-magic-wand-popup';
  popup.style.position = 'absolute';
  popup.style.left = `${position.x}px`;
  popup.style.top = `${position.y - 40}px`; // Position above the text
  popup.style.zIndex = '2147483647'; // Maximum z-index
  
  return popup;
}

// Remove popup function
function removePopup() {
  const popup = document.getElementById('text-magic-wand-popup');
  if (popup) {
    popup.remove();
    return true;
  }
  return false;
}

// Handle clicks outside the popup
function handleOutsideClick(e) {
  const popup = document.getElementById('text-magic-wand-popup');
  if (popup && !popup.contains(e.target)) {
    removePopup();
  }
}

// Add styles for the popup dynamically
function addStyles() {
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
}

export { createPopup, removePopup, handleOutsideClick, addStyles };
