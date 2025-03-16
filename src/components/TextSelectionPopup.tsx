
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Check, Globe, Volume, Book } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TextSelectionPopupProps {
  selectedText: string;
  position: { x: number; y: number };
  onAction: (action: string) => void;
  onClose: () => void;
}

const TextSelectionPopup: React.FC<TextSelectionPopupProps> = ({
  selectedText,
  position,
  onAction,
  onClose
}) => {
  const { settings } = useSettings();
  
  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${position.y + 20}px`,
    left: `${position.x}px`,
    zIndex: 9999,
  };
  
  return (
    <Card className={`p-2 shadow-lg ${settings.darkMode ? 'bg-slate-800' : 'bg-white'}`} style={popupStyle}>
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onAction("tone")}>
                <Wand2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rewrite Tone</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onAction("grammar")}>
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Check Grammar</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onAction("translate")}>
                <Globe className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Translate</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onAction("pronounce")}>
                <Volume className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pronounce</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onAction("meaning")}>
                <Book className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get Meaning</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default TextSelectionPopup;
