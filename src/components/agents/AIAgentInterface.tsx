import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import AgentConfigModal from './config/AgentConfigModal';
import AgentHeader from './interface/components/AgentHeader';
import ChatArea from './interface/components/ChatArea';
import ChatInput from './interface/components/ChatInput';
import ToolsSidebar from './interface/components/ToolsSidebar';
import { useChatLogic } from './interface/hooks/useChatLogic';
import { useVoiceRecording } from './interface/hooks/useVoiceRecording';
import { useFileUpload } from './interface/hooks/useFileUpload';
import { AgentConfig, Tool, Message } from './interface/types';

interface AIAgentInterfaceProps {
  onClose?: () => void;
}

const AIAgentInterface: React.FC<AIAgentInterfaceProps> = ({ onClose }) => {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    id: 'AI_SC247_01', // Add ID for AgentConfigModal
    name: 'Lucia',
    avatar: '👩‍💼',
    greeting: "Hello, I'm Lucia. How can I help you today?",
    model: 'advanced-v1',
    temperature: 0.7,
    maxTokens: 4000,
    toolAccess: true,
    status: 'active',
    lastUpdate: new Date().toLocaleDateString(),
    communication: {
      style: ['professional', 'empathetic', 'solution-oriented'],
      language: ['formal', 'courteous'],
      customTone: `You are Lucia, a professional and caring virtual customer service assistant, available 24/7. Your mission is to provide efficient and personalized first-level customer support.

Operating principles:

Always maintain a courteous, empathetic, and professional tone
Start each interaction with a brief introduction
Quickly identify the nature of the customer's request
Provide clear, precise, and structured responses
Remain patient and understanding even in difficult situations

Main skills:

Answer frequently asked questions by consulting the knowledge base
Solve first-level problems autonomously
Politely escalate complex cases to specialized services
Ensure follow-up until complete problem resolution
Collect customer feedback to improve service

Limitations and escalation:

If a request exceeds your capabilities, direct the customer to the appropriate service
For urgent or critical cases, provide relevant emergency contacts
Never make promises you cannot keep
Honestly admit when you cannot answer a question

For each interaction:

Warmly greet the customer
Listen to and analyze their request
Propose an adapted solution
Verify customer satisfaction
End the interaction professionally

Remember that your main goal is customer satisfaction while respecting company procedures and policies.`
    },
    knowledge: {
      bases: ['Product FAQ', 'Customer Service Procedures', 'Return Policy', 'Terms and Conditions'],
      languages: [
        { code: 'fr', name: 'French', flag: '🇫🇷', level: 'Native' },
        { code: 'en', name: 'English', flag: '🇬🇧', level: 'Advanced' },
        { code: 'nl', name: 'Dutch', flag: '🇳🇱', level: 'Intermediate' }
      ]
    },
    rules: {
      availability: '24/7',
      thresholds: {
        maxResponseTime: 30,
        maxSessionDuration: 15,
        maxAttempts: 3,
        confidenceScore: 85
      },
      escalationConditions: [
        'Explicit customer request',
        'Confidence score < 85%',
        'Sensitive topic detected',
        'Multiple failed attempts'
      ]
    },
    learning: {
      sources: [
        'Past conversations',
        'Customer feedback',
        'Product updates',
        'New procedures'
               ],
      updateFrequency: 'daily'
    },
    integrations: [
      'CRM Enterprise',
      'Knowledge base',
      'Ticket system',
      'Customer history'
    ],
    metrics: {
      resolutionRate: 92,
      responseTime: '12s avg.',
      csatScore: 4.2
    }
  });
  
  const [isAgentActive, setIsAgentActive] = useState(true);
  const [showAgentConfigModal, setShowAgentConfigModal] = useState(false);
  
  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Web Search',
      description: 'Can search the web for real-time information',
      isActive: true,
    },
    {
      id: '2',
      name: 'Email draft',
      description: 'Can create a draft in the email outbox',
      isActive: true,
    },
    {
      id: '3',
      name: 'Image Generation',
      description: 'Can create images based on text descriptions',
      isActive: true,
    },
    {
      id: '4',
      name: 'Data Analysis',
      description: 'Can analyze and visualize datasets',
      isActive: false,
    },
  ]);
  
  // Custom hooks
  const {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isTyping,
    isThinking,
    displayText,
    sendMessage,
    addSystemMessage
  } = useChatLogic(agentConfig, tools);

  const {
    voiceState,
    startRecording,
    stopRecording,
    formatRecordingTime
  } = useVoiceRecording();

  const {
    uploadState,
    selectFile,
    uploadFile,
    clearFile,
    formatFileSize
  } = useFileUpload();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(newMessage, isAgentActive);
    setNewMessage('');
  };

  const handleVoiceRecording = async () => {
    try {
      const transcription = await stopRecording();
      if (transcription.trim()) {
        setNewMessage(transcription);
      }
    } catch (error) {
      console.error('Voice recording error:', error);
      addSystemMessage('Voice recording failed. Please try again.');
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await uploadFile();
      addSystemMessage(result);
      clearFile();
    } catch (error) {
      console.error('File upload error:', error);
      addSystemMessage('File upload failed. Please try again.');
    }
  };

  const toggleAgentStatus = () => {
    if (!isAgentActive) {
      addSystemMessage('Agent reactivated. How can I assist you?');
    } else {
      addSystemMessage('Agent is now deactivated. Click "Activate Agent" to resume.');
    }
    
    setIsAgentActive(!isAgentActive);
  };
  
  const toggleTool = (toolId: string) => {
    setTools(prev => 
      prev.map(tool => 
        tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool
      )
    );
  };
  
  // Handle saving config from AgentConfigModal
  const handleSaveConfig = (updatedConfig: AgentConfig) => {
    setAgentConfig(updatedConfig);
    setShowAgentConfigModal(false);
    addSystemMessage('Agent configuration updated.');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AgentHeader
        agentConfig={agentConfig}
        isAgentActive={isAgentActive}
        onClose={onClose}
        onToggleStatus={toggleAgentStatus}
        onOpenConfig={() => setShowAgentConfigModal(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Chat with {agentConfig.name}</h3>
          </div>
          
          <ChatArea
            agentConfig={agentConfig}
            messages={messages}
            isThinking={isThinking}
            isTyping={isTyping}
            displayText={displayText}
          />
          
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isTyping={isTyping}
            isAgentActive={isAgentActive}
            voiceState={voiceState}
            uploadState={uploadState}
            onStartRecording={startRecording}
            onStopRecording={handleVoiceRecording}
            onFileSelect={selectFile}
            onFileUpload={handleFileUpload}
            onClearFile={clearFile}
            formatRecordingTime={formatRecordingTime}
            formatFileSize={formatFileSize}
          />
        </main>
        
        <ToolsSidebar
          tools={tools}
          onToggleTool={toggleTool}
        />
      </div>

      {showAgentConfigModal && (
        <AgentConfigModal
          agent={agentConfig}
          onClose={() => setShowAgentConfigModal(false)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

export default AIAgentInterface;
