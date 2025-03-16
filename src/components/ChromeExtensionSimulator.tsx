
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TextSelectionPopup from "./TextSelectionPopup";
import { useToast } from "@/components/ui/use-toast";
import { transformTone, checkGrammar, translateText, getPronunciation, getMeaning } from "@/utils/textTransformations";
import { useSettings } from "@/contexts/SettingsContext";

const ChromeExtensionSimulator: React.FC = () => {
  const [selectedText, setSelectedText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState("");
  const { toast } = useToast();
  const { settings } = useSettings();

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString());
      
      // Get position of selected text
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setPopupPosition({
        x: rect.left,
        y: rect.top
      });
      
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleAction = (action: string) => {
    if (!selectedText) return;
    
    let actionResult = "";
    
    switch (action) {
      case "tone":
        actionResult = transformTone(selectedText, "formal");
        toast({
          title: "Tone transformed",
          description: "Text rewritten in formal tone."
        });
        break;
      case "grammar":
        actionResult = checkGrammar(selectedText);
        toast({
          title: "Grammar checked",
          description: "Grammar and spelling checked successfully."
        });
        break;
      case "translate":
        actionResult = translateText(selectedText, settings.primaryLanguage);
        toast({
          title: "Text translated",
          description: `Translated to ${settings.primaryLanguage}.`
        });
        break;
      case "pronounce":
        const pronunciation = getPronunciation(selectedText);
        actionResult = `${selectedText} ${pronunciation.phonetic}`;
        toast({
          title: "Pronunciation ready",
          description: "Click the speaker icon to hear pronunciation."
        });
        break;
      case "meaning":
        const meaning = getMeaning(selectedText, settings.includeExamples, settings.showPartOfSpeech);
        actionResult = `Definition: ${meaning.definition}`;
        if (meaning.partOfSpeech) {
          actionResult += `\nPart of speech: ${meaning.partOfSpeech}`;
        }
        if (meaning.examples && meaning.examples.length > 0) {
          actionResult += `\nExamples: ${meaning.examples.join(', ')}`;
        }
        toast({
          title: "Meaning provided",
          description: "Definition and usage examples retrieved."
        });
        break;
      default:
        actionResult = selectedText;
    }
    
    setResult(actionResult);
    setShowPopup(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-2">Chrome Extension Simulator</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Select text below to see the extension popup in action
      </p>
      
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="prose max-w-none dark:prose-invert">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
              Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus 
              ut eleifend nibh porttitor. The quick brown fox jumps over the lazy dog. I love to read
              books and learn new things everyday.
            </p>
            <p>
              Sometimes i make grammar mistakes when i write quickly. Thier are many reasons for this,
              but your welcome to correct me. Technology is amazing when it helps us communicate better.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Transformation Result:</h3>
            <div className="p-3 bg-muted rounded-md whitespace-pre-line">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
      
      {showPopup && (
        <TextSelectionPopup
          selectedText={selectedText}
          position={popupPosition}
          onAction={handleAction}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ChromeExtensionSimulator;
