import { useState, useCallback } from 'react';
import axios from 'axios';
import { Message, AgentConfig, Tool } from '../types';

export const useChatLogic = (agentConfig: AgentConfig, tools: Tool[]) => {
  const [sessionId] = useState('dbf369d7-94ce-4f6a-96ca-b9ec1505c17e');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      content: agentConfig.greeting || "Hello, I'm Lucia. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const simulateTyping = useCallback(async (text: string) => {
    setIsTyping(true);
    let currentText = '';
    
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentText += (i === 0 ? '' : ' ') + word;
      setDisplayText(currentText);
      
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    }
    
    setIsTyping(false);
    return text;
  }, []);

  const sendMessage = useCallback(async (messageContent: string, isAgentActive: boolean) => {
    if (!messageContent.trim() || isLoading || !isAgentActive) return;

    try {
      setIsLoading(true);
      
      const userMessage: Message = {
        sender: 'user',
        content: messageContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setDisplayText('');
      setIsThinking(true);
      
      if (isAgentActive) {
        const payload = {
          chatInput: messageContent,
          sessionId: sessionId,
          conversation_history: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          agentConfig: {
            ...agentConfig,
            tools: tools.filter(tool => tool.isActive)
          }
        };

        const response = await axios.post(
          'https://miranki.app.n8n.cloud/webhook/invoke_agent',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        setIsThinking(false);

        if (response.data) {
          let agentResponse = '';
          
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

          await simulateTyping(agentResponse);

          const agentMessage: Message = {
            sender: 'agent',
            content: agentResponse,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, agentMessage]);
        }
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      setIsThinking(false);
      
      const errorMessage: Message = {
        sender: 'agent',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setIsThinking(false);
    }
  }, [agentConfig, tools, messages, sessionId, simulateTyping, isLoading]);

  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: Message = {
      sender: 'agent',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  return {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isTyping,
    isThinking,
    displayText,
    sendMessage,
    addSystemMessage
  };
};