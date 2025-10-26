import React, { useState, useContext } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import ConversationsHeader from '../components/conversations/ConversationsHeader';
import ConversationsFilters from '../components/conversations/ConversationsFilters';
import ConversationsList from '../components/conversations/ConversationsList';
import ConversationDetails from '../components/conversations/ConversationDetails';
import NewMessageModal from '../components/conversations/config/NewMessageModal';

export default function ConversationsPage() {
  const { t } = useContext(LanguageContext);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobileViewingDetails, setIsMobileViewingDetails] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  const handleSelectConversation = (conversation) => {
    console.log("Selected conversation:", conversation); // Debug log
    setSelectedConversation(conversation);
    setIsMobileViewingDetails(true);
  };

  const handleBackToList = () => {
    setIsMobileViewingDetails(false);
  };

  const handleCreateConversation = (newConversationData) => {
    // Here you would typically call an API to create the conversation
    // Then add it to your conversations list
    console.log('Creating new conversation:', newConversationData);

    // For demonstration purposes, let's create a mock conversation object
    const newConversation = {
      id: `new-${Date.now()}`,
      client: {
        name: newConversationData.name,
        email: newConversationData.email || 'user@example.com',
        initials: newConversationData.name.substring(0, 2).toUpperCase()
      },
      lastMessage: 'How can I help you today?',
      priority: 'medium',
      needsAttention: false,
      status: 'active',
      agent: 'AI Assistant',
      lastActivity: 'Just now',
      initiatedByAI: false,
      isAIConversation: false,
      messages: [
        {
          id: 1,
          content: 'How can I help you today?',
          sender: 'agent',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      ]
    };

    // You would add this to your conversations list in your state management system
    // Then automatically select it
    setSelectedConversation(newConversation);
    setIsMobileViewingDetails(true);
    setIsNewMessageModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {t('conversations.title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t('conversations.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsNewMessageModalOpen(true)}
                          className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
                <Plus className="w-4 h-4" />
                {t('conversations.newMessage')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-4rem)] relative">
          <AnimatePresence>
            <motion.div
              className={`
                ${isMobileViewingDetails ? 'hidden md:block' : 'w-full'}
                md:w-1/2
                border-r border-gray-200
                overflow-y-auto
                bg-white
              `}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 sm:p-6">
                <ConversationsFilters />
                <ConversationsList
                  onSelect={handleSelectConversation}
                  selectedId={selectedConversation?.id}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            <motion.div
              className={`
                ${!isMobileViewingDetails ? 'hidden md:block' : 'w-full absolute md:relative top-0 left-0 h-full'}
                md:w-1/2
                bg-gray-50
              `}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedConversation ? (
                <>
                  <div className="md:hidden p-4 bg-white border-b border-gray-200">
                    <button
                      onClick={handleBackToList}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      {t('conversations.backToDiscussions')}
                    </button>
                  </div>

                  <ConversationDetails
                    key={selectedConversation.id} // Add a key to ensure re-render on conversation change
                    conversation={{...selectedConversation}} // Pass a copy to avoid mutation issues
                    onClose={handleBackToList}
                  />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('conversations.noDiscussionSelected')}
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    {t('conversations.selectDiscussionPrompt')}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* New Message Modal */}
      <AnimatePresence>
        {isNewMessageModalOpen && (
          <NewMessageModal
            isOpen={isNewMessageModalOpen}
            onClose={() => setIsNewMessageModalOpen(false)}
            onCreateConversation={handleCreateConversation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
