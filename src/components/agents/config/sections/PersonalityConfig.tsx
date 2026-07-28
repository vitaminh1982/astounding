import React, { useState } from 'react';

interface PersonalityConfigProps {
  config: {
    style: string[];
    language: string[];
    customTone: string;
  };
}

export default function PersonalityConfig({ config }: PersonalityConfigProps) {
  const [personalityConfig, setPersonalityConfig] = useState(config);

  const handleStyleChange = (style: string) => {
    const newStyles = personalityConfig.style.includes(style)
      ? personalityConfig.style.filter(s => s !== style)
      : [...personalityConfig.style, style];
    setPersonalityConfig({ ...personalityConfig, style: newStyles });
  };

  const handleLanguageChange = (language: string) => {
    const newLanguages = personalityConfig.language.includes(language)
      ? personalityConfig.language.filter(l => l !== language)
      : [...personalityConfig.language, language];
    setPersonalityConfig({ ...personalityConfig, language: newLanguages });
  };

  const handleToneChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPersonalityConfig({ ...personalityConfig, customTone: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Personnality and tone</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
          <h4 className="font-medium text-foreground dark:text-foreground mb-3">Communication Style</h4>
          <div className="space-y-2">
            {['Professional', 'Empathetic', 'Solution-oriented'].map((style) => (
              <label key={style} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={personalityConfig.style.includes(style.toLowerCase())}
                  onChange={() => handleStyleChange(style.toLowerCase())}
                  className="rounded border-border dark:border-border bg-white dark:bg-surface-container-highest text-primary-green dark:text-primary-green focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
                />
                <span className="text-on-surface dark:text-on-surface-variant">{style}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="border border-border dark:border-border bg-white dark:bg-surface-container-highest rounded-lg p-4 transition-colors">
          <h4 className="font-medium text-foreground dark:text-foreground mb-3">Language level</h4>
          <div className="space-y-2">
            {['Formal', 'Courteous', 'Casual'].map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={personalityConfig.language.includes(level.toLowerCase())}
                  onChange={() => handleLanguageChange(level.toLowerCase())}
                  className="rounded border-border dark:border-border bg-white dark:bg-surface-container-highest text-primary-green dark:text-primary-green focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
                />
                <span className="text-on-surface dark:text-on-surface-variant">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-on-surface dark:text-on-surface-variant">
          AI Prompt
        </label>
        <textarea
          value={personalityConfig.customTone}
          onChange={handleToneChange}
          rows={5}
          className="mt-1 p-2 block w-full rounded-md border-border dark:border-border bg-surface-container dark:bg-surface-container-highest text-foreground dark:text-foreground font-mono shadow-sm focus:border-primary-green dark:focus:border-teal-500 focus:ring-ring dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        />
      </div>
    </div>
  );
}
