import React from 'react';
import { Client } from '../../../../types/client';
import { Save, Archive, Trash2, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  client: Client;
  onSave: (client: Client) => void;
}

export default function ActionButtons({ client, onSave }: ActionButtonsProps) {
  return (
    <div className="flex justify-end gap-3 pt-6 sm:gap-2 md:gap-3 border-t">
      <button
        onClick={() => onSave(client)}
        className="flex items-center gap-2 px-4 sm:px-2 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <Save className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4" />
        <span className="text-sm sm:text-xs md:text-sm">Save</span>
      </button>

      {/*
      <button
        className="flex items-center gap-2 px-4 sm:px-2 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        <RefreshCw className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4" />
        <span className="text-sm sm:text-xs md:text-sm">Réinitialiser</span>
      </button>
      */}
      
      <button
        className="flex items-center gap-2 px-4 sm:px-2 md:px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
      >
        <Archive className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4" />
        <span className="text-sm sm:text-xs md:text-sm">Archive</span>
      </button>
      
      <button
        className="flex items-center gap-2 px-4 sm:px-2 md:px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
      >
        <Trash2 className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4" />
        <span className="text-sm sm:text-xs md:text-sm">Delete</span>
      </button>
    </div>
  );
}
