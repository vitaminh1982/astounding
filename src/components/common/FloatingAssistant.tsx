// src/components/common/FloatingAssistant.tsx
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className="text-gray-600">How can I help you today?</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
