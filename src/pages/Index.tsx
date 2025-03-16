
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Mic, VolumeUp, Wand2, Check, Globe, Book, Settings as SettingsIcon } from "lucide-react";
import ChromeExtensionSimulator from "@/components/ChromeExtensionSimulator";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { 
  transformTone, 
  checkGrammar, 
  translateText, 
  getPronunciation, 
  getMeaning 
} from "@/utils/textTransformations";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedTone, setSelectedTone] = useState("casual");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const { toast } = useToast();
  const { settings } = useSettings();
  
  const handleTransformText = (type: string) => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to transform.",
        variant: "destructive"
      });
      return;
    }
    
    // Use our utility functions for transformations
    let result = "";
    
    switch (type) {
      case "tone":
        result = transformTone(inputText, selectedTone);
        toast({
          title: "Tone transformed",
          description: `Text rewritten in ${selectedTone} tone.`
        });
        break;
      case "grammar":
        result = checkGrammar(inputText);
        toast({
          title: "Grammar checked",
          description: "Grammar and spelling checked successfully."
        });
        break;
      case "translate":
        result = translateText(inputText, selectedLanguage);
        toast({
          title: "Text translated",
          description: `Translated to ${selectedLanguage}.`
        });
        break;
      case "pronounce":
        const pronunciation = getPronunciation(inputText);
        result = `${inputText} ${pronunciation.phonetic}`;
        toast({
          title: "Pronunciation ready",
          description: "Click the speaker icon to hear pronunciation."
        });
        break;
      case "meaning":
        const meaning = getMeaning(
          inputText, 
          settings.includeExamples, 
          settings.showPartOfSpeech
        );
        result = `Definition: ${meaning.definition}`;
        if (meaning.partOfSpeech) {
          result += `\nPart of speech: ${meaning.partOfSpeech}`;
        }
        if (meaning.examples && meaning.examples.length > 0) {
          result += `\nExamples: ${meaning.examples.join(', ')}`;
        }
        toast({
          title: "Meaning provided",
          description: "Definition and usage examples retrieved."
        });
        break;
      default:
        result = inputText;
    }
    
    setOutputText(result);
  };

  const playPronunciation = () => {
    toast({
      title: "Audio playback",
      description: "This would play audio pronunciation in a real extension."
    });
  };

  return (
    <div className={`container mx-auto py-6 max-w-4xl ${settings.darkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Text Magic Wand</h1>
          <p className="text-muted-foreground">Transform your text with powerful features</p>
        </div>
        <Link to="/settings">
          <Button variant="outline" size="icon">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
            <CardDescription>Enter or paste text you want to transform</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Type or paste your text here..." 
              className="min-h-[150px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="tone" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="tone"><Wand2 className="mr-2 h-4 w-4" /> Tone</TabsTrigger>
            <TabsTrigger value="grammar"><Check className="mr-2 h-4 w-4" /> Grammar</TabsTrigger>
            <TabsTrigger value="translate"><Globe className="mr-2 h-4 w-4" /> Translate</TabsTrigger>
            <TabsTrigger value="pronounce"><VolumeUp className="mr-2 h-4 w-4" /> Pronounce</TabsTrigger>
            <TabsTrigger value="meaning"><Book className="mr-2 h-4 w-4" /> Meaning</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="pt-6">
              <TabsContent value="tone" className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Tone</Label>
                  <Select 
                    value={selectedTone} 
                    onValueChange={setSelectedTone}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="funny">Funny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleTransformText("tone")}>Rewrite Text</Button>
              </TabsContent>
              
              <TabsContent value="grammar" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-correct" 
                      checked={settings.grammarAutoDetect}
                      onCheckedChange={(checked) => {
                        const newSettings = { ...settings, grammarAutoDetect: checked };
                        useSettings().updateSettings(newSettings);
                      }}
                    />
                    <Label htmlFor="auto-correct">Auto-correct as I type</Label>
                  </div>
                </div>
                <Button onClick={() => handleTransformText("grammar")}>Check Grammar & Spelling</Button>
              </TabsContent>
              
              <TabsContent value="translate" className="space-y-4">
                <div className="space-y-2">
                  <Label>Translate To</Label>
                  <Select 
                    value={selectedLanguage} 
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleTransformText("translate")}>Translate Text</Button>
              </TabsContent>
              
              <TabsContent value="pronounce" className="space-y-4">
                <div className="space-y-2">
                  <Label>Pronunciation Options</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="show-phonetic" 
                        checked={settings.showPhonetic}
                      />
                      <Label htmlFor="show-phonetic">Show phonetic spelling</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleTransformText("pronounce")}>Get Pronunciation</Button>
                  <Button variant="outline" size="icon" onClick={playPronunciation}>
                    <VolumeUp className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="meaning" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="include-examples" 
                      checked={settings.includeExamples}
                    />
                    <Label htmlFor="include-examples">Include usage examples</Label>
                  </div>
                </div>
                <Button onClick={() => handleTransformText("meaning")}>Get Meaning</Button>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Transformed Text</CardTitle>
            <CardDescription>Your processed text will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Results will appear here..." 
              className="min-h-[150px]"
              value={outputText}
              readOnly
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => {
            if (outputText) {
              navigator.clipboard.writeText(outputText);
              toast({
                title: "Copied to clipboard",
                description: "The transformed text has been copied to your clipboard."
              });
            } else {
              toast({
                title: "Nothing to copy",
                description: "Transform some text first before copying.",
                variant: "destructive"
              });
            }
          }}>
            Copy to Clipboard
          </Button>
        </div>
        
        <ChromeExtensionSimulator />
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Text Magic Wand Extension • Version 1.0</p>
        <p className="mt-1">This is a simulation of how the extension would work in Chrome.</p>
      </div>
    </div>
  );
};

export default Index;
