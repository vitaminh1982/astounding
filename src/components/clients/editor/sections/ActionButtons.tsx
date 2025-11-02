import React from 'react';
import { Client } from '../../../../types/client';
import { Save, Archive, Trash2, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  client: Client;
  onSave: (client: Client) => void;
  onArchive?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onReset?: () => void;
  isSaving?: boolean;
  isArchiving?: boolean;
  isDeleting?: boolean;
}

export default function ActionButtons({ 
  client, 
  onSave, 
  onArchive,
  onDelete,
  onReset,
  isSaving = false,
  isArchiving = false,
  isDeleting = false
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 md:gap-3">
        {/* Save Button */}
        <button
          onClick={() => onSave(client)}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 sm:px-3 md:px-4 py-2.5 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
          aria-label={isSaving ? "Saving client information" : "Save client information"}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm sm:text-xs md:text-sm">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-colors" />
              <span className="text-sm sm:text-xs md:text-sm">Save</span>
            </>
          )}
        </button>

        {/* Reset Button (when enabled) */}
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 sm:px-3 md:px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
            aria-label="Reset form to original values"
          >
            <RefreshCw className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-colors" />
            <span className="text-sm sm:text-xs md:text-sm">Reset</span>
          </button>
        )}
        
        {/* Archive Button */}
        {onArchive && (
          <button
            onClick={() => onArchive(client)}
            disabled={isArchiving}
            className="flex items-center justify-center gap-2 px-4 sm:px-3 md:px-4 py-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
            aria-label={isArchiving ? "Archiving client" : "Archive client"}
          >
            {isArchiving ? (
              <>
                <div className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-amber-700 dark:border-amber-300 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm sm:text-xs md:text-sm">Archiving...</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-colors" />
                <span className="text-sm sm:text-xs md:text-sm">Archive</span>
              </>
            )}
          </button>
        )}
        
        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(client)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 sm:px-3 md:px-4 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
            aria-label={isDeleting ? "Deleting client" : "Delete client"}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4 border-2 border-red-700 dark:border-red-300 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm sm:text-xs md:text-sm">Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-colors" />
                <span className="text-sm sm:text-xs md:text-sm">Delete</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
