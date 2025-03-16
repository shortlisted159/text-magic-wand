
import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsState {
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
  
  useEffect(() => {
    // On component mount, load settings from storage
    const loadSettings = async () => {
      try {
        // In a real extension, this would use chrome.storage.sync.get
        const savedSettings = localStorage.getItem("textMagicWandSettings");
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    
    loadSettings();
  }, []);
  
  const updateSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
    // In a real extension, this would use chrome.storage.sync.set
    localStorage.setItem("textMagicWandSettings", JSON.stringify(newSettings));
  };
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
