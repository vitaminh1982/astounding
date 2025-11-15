import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { Info, MessageSquare, Settings2 } from 'lucide-react';

interface MessageConfigProps {
  template: Template;
}

export default function MessageConfig({ template }: MessageConfigProps) {
  const [activeTab, setActiveTab] = useState('message');
  const [title, setTitle] = useState("Client Welcome");
  const [message, setMessage] = useState(`Hello {client.firstName},

Welcome to {company.name}! 🎉

We are thrilled to have you as one of our new clients. To celebrate your arrival, we are offering you an exclusive discount of {offer.discount}% on your first order!

To use it, simply apply the code:
【 WELCOME{client.id} 】
valid until {offer.expiry_date}.

Feel free to explore our full catalog on {company.website}
or reach out to us with any questions.

See you soon,
The {company.name} Team`);

  const [variables] = useState({
    client: ['firstName', 'id'],
    company: ['name', 'website'],
    offer: ['discount', 'expiry_date']
  });

  const [settings, setSettings] = useState({
    includeEmoji: true,
    htmlFormatting: true,
    textVersion: true,
    delay: 'immediate'
  });

  return (
    <div className="space-y-4">
      {/* Mobile tab navigation */}
      <div className="flex border-b">
        {[
          { id: 'message', label: 'Message', icon: MessageSquare },
          { id: 'variables', label: 'Variables', icon: Info },
          { id: 'settings', label: 'Settings', icon: Settings2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 text-sm font-medium flex flex-col items-center gap-1 ${
              activeTab === tab.id 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Message Section */}
      {activeTab === 'message' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 text-sm"
              placeholder="Ex: Welcome to our company!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                className="w-full p-3 rounded-lg border border-gray-300 text-sm font-mono"
                placeholder="Write your message..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {message.length} characters
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variables Section */}
      {activeTab === 'variables' && (
        <div className="space-y-4">
          {Object.entries(variables).map(([category, vars]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium capitalize mb-2">{category}</h4>
              <div className="space-y-2">
                {vars.map(v => (
                  <div
                    key={v}
                    className="p-2 bg-white rounded border border-gray-200 text-sm flex justify-between items-center"
                    onClick={() => {
                      // Logic to copy variable
                      navigator.clipboard.writeText(`{${category}.${v}}`);
                    }}
                  >
                    <span>{`{${category}.${v}}`}</span>
                    <button className="text-xs text-indigo-600 px-2 py-1 rounded-md bg-indigo-50">
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Section */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-3">General Options</h4>
            <div className="space-y-3">
              {[
                { key: 'includeEmoji', label: 'Include Emoji' },
                { key: 'htmlFormatting', label: 'HTML Formatting' },
                { key: 'textVersion', label: 'Text Version' }
              ].map(option => (
                <label key={option.key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings[option.key as keyof typeof settings]}
                    onChange={(e) => setSettings({
                      ...settings,
                      [option.key]: e.target.checked
                    })}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Send Delay</h4>
            <select
              value={settings.delay}
              onChange={(e) => setSettings({
                ...settings,
                delay: e.target.value
              })}
              className="w-full p-3 rounded-lg border border-gray-300 text-sm"
            >
              <option value="immediate">Immediate</option>
              <option value="1hour">After 1 hour</option>
              <option value="1day">After 1 day</option>
              <option value="custom">Custom</option>
            </select>
            
            {settings.delay === 'custom' && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Custom Delay (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm"
                  placeholder="24"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}