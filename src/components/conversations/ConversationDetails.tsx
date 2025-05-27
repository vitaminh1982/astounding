import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Bot, Send, Paperclip, MoreVertical, Image, Smile, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ConversationDetails({ conversation }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // Make a local copy of messages to avoid modifying the original conversation object
  const [localMessages, setLocalMessages] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Initialize local messages from conversation props
  useEffect(() => {
    if (conversation && Array.isArray(conversation.messages)) {
      setLocalMessages([...conversation.messages]);
    }
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isTyping]);

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a discussion to start
      </div>
    );
  }

  const simulateTyping = async (text) => {
    setIsTyping(true);
    let currentText = '';
    
    // Split the text into words
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentText += (i === 0 ? '' : ' ') + word;
      setDisplayText(currentText);
      
      // Random delay between words (50-150ms)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    }
    
    setIsTyping(false);
    return text;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const userMessageContent = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      // Create new user message
      const newUserMessage = {
        id: Date.now(),
        content: userMessageContent,
        sender: 'user',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };

      // Update local messages state
      setLocalMessages(prevMessages => [...prevMessages, newUserMessage]);

      // Display typing indicator
      setIsTyping(true);

      // For webhook-based conversations, send to the API
      if (typeof conversation.id === 'string' && conversation.id.startsWith('session-') && conversation.sessionId) {
        // Format conversation history for the API
        const conversationHistory = localMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
        
        // Add the new message to conversation history
        conversationHistory.push({
          role: 'user',
          content: userMessageContent
        });
        
        try {
          // Send POST request to webhook
          const response = await axios.post(
            'https://n8n-b2xt.onrender.com/webhook/scrape_lead',
            {
              chatInput: userMessageContent,
              sessionId: conversation.sessionId,
              conversation_history: conversationHistory
            },
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );

          // Process response
          let agentResponse = '';
          if (response.data) {
            if (response.data.output) {
              agentResponse = response.data.output;
            } else if (response.data.response) {
              agentResponse = response.data.response;
            } else if (response.data.message) {
              agentResponse = response.data.message;
            } else if (typeof response.data === 'string') {
              agentResponse = response.data;
            } else {
              agentResponse = "I received your message but couldn't process it properly.";
            }
          } else {
            agentResponse = "Thank you for your message. I'll get back to you shortly.";
          }
          
          // Create agent response message
          const newAgentMessage = {
            id: Date.now() + 1,
            content: agentResponse,
            sender: 'agent',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };
          
          // Update local messages
          setLocalMessages(prevMessages => [...prevMessages, newAgentMessage]);
          
        } catch (apiError) {
          console.error('API error:', apiError);
          
          // Add error message
          const errorMessage = {
            id: Date.now() + 1,
            content: "I'm sorry, but I encountered an error while processing your request. Please try again later.",
            sender: 'agent',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };
          
          setLocalMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      } else {
        // For static conversations, simulate a response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create mock response
        const newAgentMessage = {
          id: Date.now() + 1,
          content: `Thank you for your message. Our team will get back to you soon regarding: "${userMessageContent}"`,
          sender: 'agent',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        // Update local messages
        setLocalMessages(prevMessages => [...prevMessages, newAgentMessage]);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsTyping(false);
      setIsSending(false);
      scrollToBottom();
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    
    // If it's already a formatted time string, just return it
    if (typeof time === 'string' && time.includes(':')) {
      return time;
    }
    
    // Otherwise try to format it
    try {
      return new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (e) {
      return 'Just now';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                {conversation.client.avatar ? (
                  <img 
                    src={conversation.client.avatar} 
                    alt={conversation.client.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : conversation.client.initials}
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                ${conversation.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} 
              />
            </div>
            <div>
              <h2 className="font-medium">{conversation.client.name}</h2>
              <p className="text-sm text-gray-500">{conversation.client.email}</p>
              
              {/* Show webhook indicator for live conversations */}
              {typeof conversation.id === 'string' && conversation.id.startsWith('session-') && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  Live Conversation
                </span>
              )}
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {localMessages.map((msg, index) => (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${
                msg.sender === 'agent' ? 'justify-end' : ''
              }`}
            >
              {msg.sender !== 'agent' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'agent'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs mt-1 opacity-70">
                  {formatTime(msg.time)}
                </div>
              </div>
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-end"
            >
              <div className="max-w-[70%] p-3 rounded-lg bg-indigo-100">
                <div className="flex items-center">
                  <span className="text-indigo-600 text-sm mr-2">Typing</span>
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '400ms' }}></span>
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Image className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isSending || isTyping}
          />
          
          <motion.button
            whileHover={message.trim() && !isSending && !isTyping ? { scale: 1.05 } : {}}
            whileTap={message.trim() && !isSending && !isTyping ? { scale: 0.95 } : {}}
            type="submit"
            disabled={!message.trim() || isSending || isTyping}
            className={`p-2 rounded-full transition-colors
              ${message.trim() && !isSending && !isTyping
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isSending ? 
              <Loader className="w-5 h-5 animate-spin" /> : 
              <Send className="w-5 h-5" />
            }
          </motion.button>
        </form>
      </div>
    </div>
  );
}