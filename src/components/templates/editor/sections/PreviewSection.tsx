import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { Monitor, Smartphone, Send, Mail, Image, Eye, EyeOff } from 'lucide-react';

interface PreviewSectionProps {
  template: Template;
}

export default function PreviewSection({ template }: PreviewSectionProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showDetails, setShowDetails] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<'html' | 'text'>('html');

  return (
    <div className="space-y-4">
      {/* En-tête mobile */}
      <div className="sm:hidden flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Preview</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 text-gray-500"
        >
          {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Contrôles */}
      <div className={`space-y-3 ${!showDetails && 'sm:block hidden'}`}>
        {/* Options de prévisualisation */}
        <div className="flex flex-wrap gap-2 p-2">
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center px-3 py-2 text-sm ${
                previewMode === 'desktop'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Monitor className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center px-3 py-2 text-sm border-l ${
                previewMode === 'mobile'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Smartphone className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setPreviewFormat('html')}
              className={`flex items-center px-3 py-2 text-sm ${
                previewFormat === 'html'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Image className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">HTML</span>
            </button>
            <button
              onClick={() => setPreviewFormat('text')}
              className={`flex items-center px-3 py-2 text-sm border-l ${
                previewFormat === 'text'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Mail className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Text</span>
            </button>
          </div>

          <button
            className="ml-auto flex items-center px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Send test</span>
          </button>
        </div>

        {/* Info de test */}
        <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>Test email : preview@example.com</p>
        </div>
      </div>

      {/* Zone de prévisualisation */}
      <div className="relative">
        {/* Frame de prévisualisation */}
        <div 
          className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ${
            previewMode === 'mobile' 
              ? 'max-w-[375px] mx-auto' 
              : 'w-full'
          }`}
        >
          {/* Barre d'état simulée pour mobile */}
          {previewMode === 'mobile' && (
            <div className="h-6 bg-gray-800 rounded-t-lg flex items-center justify-center">
              <div className="w-16 h-1.5 bg-gray-600 rounded-full" />
            </div>
          )}

          {/* Contenu du message */}
          <div className={`p-4 ${previewFormat === 'text' ? 'font-mono' : ''}`}>
            <div className="space-y-4">
              <img
                src="/path/to/logo.png"
                alt="Logo Entreprise"
                className="h-8"
              />
              <div className="space-y-2">
                <p>Hello Thomas,</p>
                <p>Welcome to Sendplex !</p>
                <p>
                  We are glad to welcoming you as a new client.
                </p>
                <p>
                  Regards,<br />
                  Sendplex Team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay de chargement */}
        {false && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Actions rapides mobiles */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg"
        >
          <Send className="w-5 h-5 mr-2" />
          Send a test
        </button>
      </div>
    </div>
  );
}
