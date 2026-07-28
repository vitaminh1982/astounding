import React, { useState } from 'react';
import { Template } from '../../../../types/template';
import { Monitor, Smartphone, Send, Mail, Image, Eye, EyeOff, Code, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewSectionProps {
  template: Template;
}

type PreviewMode = 'desktop' | 'mobile';
type PreviewFormat = 'html' | 'text';

export default function PreviewSection({ template }: PreviewSectionProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [showDetails, setShowDetails] = useState(true);
  const [previewFormat, setPreviewFormat] = useState<PreviewFormat>('html');
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [testEmail, setTestEmail] = useState('preview@example.com');

  const handleSendTest = async () => {
    setIsLoading(true);
    setTestEmailSent(false);
    
    // Simulate sending test email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setTestEmailSent(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => setTestEmailSent(false), 3000);
  };

  const handleModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
  };

  const handleFormatChange = (format: PreviewFormat) => {
    setPreviewFormat(format);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors">
            <Eye className="w-5 h-5 text-tertiary dark:text-tertiary transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground dark:text-foreground transition-colors">
              Live Preview
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
              Preview your template in real-time
            </p>
          </div>
        </div>
        
        {/* Mobile Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="sm:hidden p-2 text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={showDetails ? "Hide preview controls" : "Show preview controls"}
        >
          {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {(showDetails || window.innerWidth >= 640) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-surface-container-high border border-border dark:border-border rounded-lg p-4 shadow-sm dark:shadow-gray-900 transition-colors">
              {/* Preview Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Device Mode Toggle */}
                <div className="flex rounded-lg border border-border dark:border-border overflow-hidden shadow-sm dark:shadow-gray-900 transition-colors">
                  <button
                    onClick={() => handleModeChange('desktop')}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      previewMode === 'desktop'
                        ? 'bg-primary dark:bg-teal-600 text-white'
                        : 'bg-white dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                    }`}
                    aria-label="Desktop preview mode"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => handleModeChange('mobile')}
                    className={`flex items-center px-4 py-2 text-sm font-medium border-l border-border dark:border-border transition-all duration-200 ${
                      previewMode === 'mobile'
                        ? 'bg-primary dark:bg-teal-600 text-white'
                        : 'bg-white dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                    }`}
                    aria-label="Mobile preview mode"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                {/* Format Toggle */}
                <div className="flex rounded-lg border border-border dark:border-border overflow-hidden shadow-sm dark:shadow-gray-900 transition-colors">
                  <button
                    onClick={() => handleFormatChange('html')}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      previewFormat === 'html'
                        ? 'bg-primary dark:bg-teal-600 text-white'
                        : 'bg-white dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                    }`}
                    aria-label="HTML preview format"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">HTML</span>
                  </button>
                  <button
                    onClick={() => handleFormatChange('text')}
                    className={`flex items-center px-4 py-2 text-sm font-medium border-l border-border dark:border-border transition-all duration-200 ${
                      previewFormat === 'text'
                        ? 'bg-primary dark:bg-teal-600 text-white'
                        : 'bg-white dark:bg-surface-container-highest text-muted-foreground dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest'
                    }`}
                    aria-label="Plain text preview format"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Text</span>
                  </button>
                </div>

                {/* Send Test Button */}
                <button
                  onClick={handleSendTest}
                  disabled={isLoading}
                  className="ml-auto flex items-center px-4 py-2 text-sm font-medium bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Sending...</span>
                    </>
                  ) : testEmailSent ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Send Test</span>
                    </>
                  )}
                </button>
              </div>

              {/* Test Email Info */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-tertiary dark:text-tertiary mt-0.5 flex-shrink-0 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1 transition-colors">
                      Test Email Address
                    </p>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-blue-900/30 text-foreground dark:text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:border-tertiary dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors focus:outline-none"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {testEmailSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 transition-colors">
                        Test email sent successfully to {testEmail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Frame */}
      <div className="relative">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`bg-white dark:bg-surface-container-high rounded-lg shadow-lg dark:shadow-gray-900 border-2 border-border dark:border-border transition-all duration-300 ${
            previewMode === 'mobile' 
              ? 'max-w-[375px] mx-auto' 
              : 'w-full'
          }`}
        >
          {/* Mobile Status Bar */}
          {previewMode === 'mobile' && (
            <div className="h-8 bg-background dark:bg-black rounded-t-lg flex items-center justify-center relative transition-colors">
              <div className="w-20 h-1.5 bg-surface-container-highest dark:bg-surface-container-highest rounded-full transition-colors" />
              <div className="absolute right-4 flex items-center gap-2 text-white text-xs">
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-2 bg-white rounded-full" />
                  <div className="w-1 h-3 bg-white rounded-full" />
                  <div className="w-1 h-4 bg-white rounded-full" />
                </div>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Email Header */}
          <div className="p-4 border-b border-border dark:border-border bg-surface-container-low dark:bg-surface-container-high/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-teal-900/30 flex items-center justify-center transition-colors">
                <span className="text-sm font-semibold text-primary-green dark:text-teal-400 transition-colors">
                  SP
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground dark:text-foreground truncate transition-colors">
                  Sendplex Team
                </p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate transition-colors">
                  noreply@sendplex.com
                </p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className={`p-6 ${previewFormat === 'text' ? 'font-mono text-sm' : ''}`}>
            {previewFormat === 'html' ? (
              <div className="space-y-4">
                {/* Logo */}
                <div className="flex items-center justify-center py-4">
                  <div className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-teal-600 dark:to-cyan-600 rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-white font-bold text-xl">Sendplex</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 text-on-surface dark:text-muted-foreground transition-colors">
                  <p className="text-lg font-semibold text-foreground dark:text-foreground transition-colors">
                    Hello Thomas,
                  </p>
                  <p>
                    Welcome to <strong className="text-primary-green dark:text-teal-400 transition-colors">Sendplex</strong>! 🎉
                  </p>
                  <p>
                    We are thrilled to have you as one of our new clients. To celebrate your arrival,
                    we are offering you an exclusive discount on your first order!
                  </p>
                  
                  {/* CTA Button */}
                  <div className="py-4">
                    <a
                      href="#"
                      className="inline-block px-6 py-3 bg-primary dark:bg-teal-600 text-white font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-md dark:shadow-gray-900"
                    >
                      Get Started
                    </a>
                  </div>

                  <p>
                    Feel free to explore our platform or reach out to us with any questions.
                  </p>
                  
                  <p>
                    See you soon,<br />
                    <strong>The Sendplex Team</strong>
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-border dark:border-border text-xs text-muted-foreground dark:text-muted-foreground text-center transition-colors">
                  <p>© 2025 Sendplex. All rights reserved.</p>
                  <p className="mt-1">
                    <a href="#" className="hover:text-primary-green dark:hover:text-teal-400 transition-colors">Unsubscribe</a>
                    {' • '}
                    <a href="#" className="hover:text-primary-green dark:hover:text-teal-400 transition-colors">Preferences</a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-on-surface dark:text-muted-foreground whitespace-pre-wrap transition-colors">
                {`Hello Thomas,

Welcome to Sendplex!

We are thrilled to have you as one of our new clients. To celebrate your arrival, we are offering you an exclusive discount on your first order!

Get Started: https://sendplex.com/welcome

Feel free to explore our platform or reach out to us with any questions.

See you soon,
The Sendplex Team

---
© 2025 Sendplex. All rights reserved.
Unsubscribe: https://sendplex.com/unsubscribe`}
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 dark:bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg transition-colors"
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary-green dark:text-teal-400 animate-spin transition-colors" />
                <p className="text-sm font-medium text-on-surface dark:text-muted-foreground transition-colors">
                  Sending test email...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preview Info */}
      <div className="p-4 bg-surface-container-low dark:bg-surface-container-high/50 border border-border dark:border-border rounded-lg transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded transition-colors">
            <Eye className="w-4 h-4 text-tertiary dark:text-tertiary transition-colors" />
          </div>
          <div className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors">
            <p className="font-medium text-foreground dark:text-foreground mb-1 transition-colors">
              Preview Notes
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>This is a live preview of your template</li>
              <li>Variable placeholders will be replaced with actual data when sent</li>
              <li>Test emails help verify formatting before deployment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Action Button */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-container-high border-t border-border dark:border-border shadow-lg dark:shadow-gray-900 transition-colors z-10">
        <button
          onClick={handleSendTest}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending Test...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Test Email
            </>
          )}
        </button>
      </div>
    </div>
  );
}
