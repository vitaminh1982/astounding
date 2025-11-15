import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { Info } from 'lucide-react';

interface CustomizationOptionsProps {
  template: Template;
}

interface OptionConfig {
  key: string;
  label: string;
  description: string;
}

export default function CustomizationOptions({ template }: CustomizationOptionsProps) {
  const [options, setOptions] = useState({
    includeLogo: true,
    digitalSignature: false,
    clickableLinks: true
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const optionsConfig: OptionConfig[] = [
    {
      key: 'includeLogo',
      label: 'Include company logo',
      description: 'Automatically adds your logo in the message header'
    },
    {
      key: 'digitalSignature',
      label: 'Add digital signature',
      description: 'Includes a secure digital signature in the message'
    },
    {
      key: 'clickableLinks',
      label: 'Enable clickable links',
      description: 'Makes all the links in the message interactive'
    }
  ];

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-semibold text-base sm:text-lg">Customization</h3>
      
      <div className="border rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">
          Message options
        </h4>
        
        <div className="space-y-2 sm:space-y-3">
          {optionsConfig.map(({ key, label, description }) => (
            <div 
              key={key}
              className="group relative rounded-md hover:bg-gray-50 transition-colors"
            >
              <label className="flex items-start sm:items-center gap-2 p-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof typeof options]}
                  onChange={() => handleOptionChange(key as keyof typeof options)}
                  className="mt-0.5 sm:mt-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 sm:w-5 sm:h-5"
                />
                <div className="flex-1">
                  <span className="text-sm sm:text-base font-medium">
                    {label}
                  </span>
                  <p className="hidden sm:block text-xs text-gray-500 mt-0.5">
                    {description}
                  </p>
                </div>
                
                {/* Info icon for mobile tooltip */}
                <button
                  type="button"
                  className="sm:hidden p-1 text-gray-400 hover:text-gray-600"
                  onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                >
                  <Info className="w-4 h-4" />
                </button>
              </label>

              {/* Mobile tooltip */}
              {activeTooltip === key && (
                <div className="sm:hidden absolute z-10 left-0 right-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded-md">
                  {description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Advanced settings section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <details className="group">
            <summary className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
              Advanced settings
            </summary>
            <div className="mt-3 space-y-3 pl-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Signature format
                  </label>
                  <select className="w-full p-1.5 sm:p-2 text-sm border rounded-md">
                    <option>Simple</option>
                    <option>Detailed</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo position
                  </label>
                  <select className="w-full p-1.5 sm:p-2 text-sm border rounded-md">
                    <option>Header</option>
                    <option>Footer</option>
                  </select>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}