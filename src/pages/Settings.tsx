
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { MoonIcon, SunIcon } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Extension Settings</h1>
        <p className="text-muted-foreground">Customize your Text Magic Wand experience</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the extension looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme Mode</Label>
              <div className="flex items-center space-x-2">
                <SunIcon className="h-4 w-4" />
                <Switch 
                  id="theme"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSettings({ ...settings, darkMode: checked })}
                />
                <MoonIcon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Grammar & Spelling</CardTitle>
            <CardDescription>Configure grammar and spelling check options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-detect">Auto-detect errors</Label>
              <Switch 
                id="auto-detect"
                checked={settings.grammarAutoDetect}
                onCheckedChange={(checked) => updateSettings({ ...settings, grammarAutoDetect: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="highlight">Highlight errors</Label>
              <Switch 
                id="highlight"
                checked={settings.grammarHighlight}
                onCheckedChange={(checked) => updateSettings({ ...settings, grammarHighlight: checked })}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Translation</CardTitle>
            <CardDescription>Set your preferred languages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Language</Label>
              <Select 
                value={settings.primaryLanguage} 
                onValueChange={(value) => updateSettings({ ...settings, primaryLanguage: value })}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-translate">Auto-detect language</Label>
              <Switch 
                id="auto-translate"
                checked={settings.autoDetectLanguage}
                onCheckedChange={(checked) => updateSettings({ ...settings, autoDetectLanguage: checked })}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pronunciation</CardTitle>
            <CardDescription>Configure pronunciation options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="phonetic">Show phonetic spelling</Label>
              <Switch 
                id="phonetic"
                checked={settings.showPhonetic}
                onCheckedChange={(checked) => updateSettings({ ...settings, showPhonetic: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoplay">Auto-play pronunciation</Label>
              <Switch 
                id="autoplay"
                checked={settings.autoPlayPronunciation}
                onCheckedChange={(checked) => updateSettings({ ...settings, autoPlayPronunciation: checked })}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meaning Assistant</CardTitle>
            <CardDescription>Set meaning lookup preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="examples">Include usage examples</Label>
              <Switch 
                id="examples"
                checked={settings.includeExamples}
                onCheckedChange={(checked) => updateSettings({ ...settings, includeExamples: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="part-of-speech">Show part of speech</Label>
              <Switch 
                id="part-of-speech"
                checked={settings.showPartOfSpeech}
                onCheckedChange={(checked) => updateSettings({ ...settings, showPartOfSpeech: checked })}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            // Reset to defaults
            updateSettings({
              darkMode: false,
              grammarAutoDetect: true,
              grammarHighlight: true,
              primaryLanguage: "english",
              autoDetectLanguage: true,
              showPhonetic: true,
              autoPlayPronunciation: false,
              includeExamples: true,
              showPartOfSpeech: true
            });
            toast({
              title: "Settings reset",
              description: "Your settings have been reset to default values."
            });
          }}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
