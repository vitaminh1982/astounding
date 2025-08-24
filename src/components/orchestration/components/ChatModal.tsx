import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './ChatInterface';
import { ChatInterfaceProps } from '../types';

interface ChatModalProps extends ChatInterfaceProps {
  isChatMaximized: boolean;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isChatMaximized,
  setIsChatMaximized,
  ...chatProps
}) => {
  return (
    <AnimatePresence>
      {isChatMaximized && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsChatMaximized(false);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatInterface 
              {...chatProps}
              isModal={true}
              setIsChatMaximized={setIsChatMaximized}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ChatModal);