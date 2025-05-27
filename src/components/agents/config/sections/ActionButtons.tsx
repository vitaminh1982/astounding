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
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <Play className="w-4 h-4" />
        Save
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
        <Power className="w-4 h-4" />
        Deactivate
      </button>
    </div>
  );
}