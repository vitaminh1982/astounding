import React from 'react';
import { Play, RotateCcw, Power } from 'lucide-react';

interface ActionButtonsProps {
  onSave: () => void;
}

export default function ActionButtons({ onSave }: ActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        <Play className="w-4 h-4" />
        Save
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
        <Power className="w-4 h-4" />
        Deactivate
      </button>
    </div>
  );
}
