
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TextSelectionPopup from "./TextSelectionPopup";
import { useToast } from "@/components/ui/use-toast";
import { 
  transformTone, 
  checkGrammar, 
  translateText, 
  getPronunciation, 
  getMeaning,
  playPronunciation
} from "@/utils/textTransformations";
import { useSettings } from "@/contexts/SettingsContext";

const ChromeExtensionSimulator: React.FC = () => {
  const [selectedText, setSelectedText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [result, setResult] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
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

  const handleAction = async (action: string) => {
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
          description: settings.grammarAutoDetect ? 
            "Grammar and spelling checked successfully." :
            "Grammar checking is disabled in settings."
        });
        break;
      case "translate":
        actionResult = translateText(selectedText);
        toast({
          title: "Text translated",
          description: `Translated to ${settings.primaryLanguage}.`
        });
        break;
      case "pronounce":
        const pronunciation = getPronunciation(selectedText);
        actionResult = settings.showPhonetic ? 
          `${selectedText} ${pronunciation.phonetic}` : 
          `${selectedText} [Phonetic spelling disabled in settings]`;
        
        // Auto-play pronunciation if setting is enabled
        if (settings.autoPlayPronunciation) {
          setIsPlaying(true);
          await playPronunciation(selectedText);
          setIsPlaying(false);
          toast({
            title: "Pronunciation played",
            description: "Audio pronunciation played automatically."
          });
        } else {
          toast({
            title: "Pronunciation ready",
            description: "Click the speaker icon to hear pronunciation."
          });
        }
        break;
      case "meaning":
        const meaning = getMeaning(selectedText);
        actionResult = `Definition: ${meaning.definition}`;
        if (meaning.partOfSpeech && settings.showPartOfSpeech) {
          actionResult += `\nPart of speech: ${meaning.partOfSpeech}`;
        }
        if (meaning.examples && settings.includeExamples) {
          actionResult += `\nExamples: ${meaning.examples.join(', ')}`;
        }
        toast({
          title: "Meaning provided",
          description: "Definition and usage examples retrieved based on your settings."
        });
        break;
      default:
        actionResult = selectedText;
    }
    
    setResult(actionResult);
    setShowPopup(false);
  };

  const handlePlayPronunciation = async () => {
    if (selectedText && !isPlaying) {
      setIsPlaying(true);
      toast({
        title: "Playing pronunciation",
        description: "Audio pronunciation is playing..."
      });
      
      try {
        await playPronunciation(selectedText);
        toast({
          title: "Pronunciation complete",
          description: "Audio pronunciation finished playing."
        });
      } catch (error) {
        toast({
          title: "Pronunciation error",
          description: "There was an error playing the audio.",
          variant: "destructive"
        });
      } finally {
        setIsPlaying(false);
      }
    }
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
        Select text below to see the extension popup in action. Changes in Settings will affect the transformations.
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
            <p>
              Common words for testing: hello, goodbye, book, computer, program. Try selecting these for 
              pronunciation and meaning features.
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
              {result.includes("Phonetic") && (
                <button 
                  className="ml-2 p-1 bg-primary text-primary-foreground rounded-full"
                  onClick={handlePlayPronunciation}
                  disabled={isPlaying}
                >
                  {isPlaying ? "▶️..." : "▶️"}
                </button>
              )}
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
