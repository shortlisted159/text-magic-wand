
import React, { createContext, useContext, useState, useEffect } from "react";

export interface SettingsState {
  darkMode: boolean;
  grammarAutoDetect: boolean;
  grammarHighlight: boolean;
  primaryLanguage: string;
  autoDetectLanguage: boolean;
  showPhonetic: boolean;
  autoPlayPronunciation: boolean;
  includeExamples: boolean;
  showPartOfSpeech: boolean;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (newSettings: SettingsState) => void;
}

const defaultSettings: SettingsState = {
  darkMode: false,
  grammarAutoDetect: true,
  grammarHighlight: true,
  primaryLanguage: "english",
  autoDetectLanguage: true,
  showPhonetic: true,
  autoPlayPronunciation: false,
  includeExamples: true,
  showPartOfSpeech: true
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {}
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load settings from storage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("textMagicWandSettings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          
          // Apply dark mode if set
          if (parsedSettings.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading settings:", error);
        setIsInitialized(true);
      }
    };
    
    loadSettings();
  }, []);
  
  // Update settings and save to storage
  const updateSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
    
    // Apply dark mode changes immediately
    if (newSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem("textMagicWandSettings", JSON.stringify(newSettings));
  };
  
  if (!isInitialized) {
    // You could show a loading state here if needed
    return null;
  }
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
