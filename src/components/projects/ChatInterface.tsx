import React, { useRef, useEffect } from 'react';
import { MessageSquare, FileText, Paperclip, Send } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'thinking' | 'offline';
  avatar: string;
  description: string;
  capabilities: string[];
  lastActivity: string;
  responseTime: string;
  successRate: number;
  isConfigurable: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentId?: string;
  timestamp: Date;
  mentions?: string[];
  attachments?: Attachment[];
  visibility: 'project' | 'team' | 'private';
  canConvertToTask?: boolean;
  canConvertToDocument?: boolean;
}

interface ChatInterfaceProps {
  activeTab: 'chat' | 'documents';
  setActiveTab: (tab: 'chat' | 'documents') => void;
  selectedAgents: string[];
  agents: Agent[];
  visibility: 'project' | 'team' | 'private';
  setVisibility: (visibility: 'project' | 'team' | 'private') => void;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  attachments: Attachment[];
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onConvertMessage: (messageId: string, type: 'task' | 'document') => void;
  formatFileSize: (bytes: number) => string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  activeTab,
  setActiveTab,
  selectedAgents,
  agents,
  visibility,
  setVisibility,
  messages,
  newMessage,
  setNewMessage,
  attachments,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  onConvertMessage,
  formatFileSize
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow border h-[calc(100vh-14rem)] flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'chat' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'documents' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documents
          </button>
        </nav>
      </div>

      {activeTab === 'chat' && (
        <>
          {/* Chat controls */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Selected Agents:</span>
                {selectedAgents.length === 0 ? (
                  <span className="text-sm text-gray-500">All agents (collaborative mode)</span>
                ) : (
                  <div className="flex gap-2">
                    {selectedAgents.map((agentId) => {
                      const agent = agents.find((a) => a.id === agentId);
                      return agent ? (
                        <span key={agentId} className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                          <span>{agent.avatar}</span>
                          <span>{agent.name}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Visibility:</span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="text-sm border rounded-md px-2 py-1"
                  aria-label="Message visibility"
                >
                  <option value="project">Project</option>
                  <option value="team">Team</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="max-w-3xl">
                  <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
                    {message.sender === 'agent' && (
                      <div className="text-xs text-gray-500 mb-2">{/* Agent badge if needed */}</div>
                    )}
                    <div className="whitespace-pre-wrap text-gray-800">{message.content}</div>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {message.attachments.map((att) => (
                          <div key={att.id} className="flex items-center gap-2 text-xs opacity-85">
                            <Paperclip className="w-3 h-3" />
                            <span>{att.name}</span>
                            <span className="ml-2 text-gray-400">({formatFileSize(att.size)})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>{message.timestamp.toLocaleTimeString()}</span>

                      {message.sender === 'agent' && (message.canConvertToTask || message.canConvertToDocument) && (
                        <div className="flex gap-2">
                          {message.canConvertToTask && (
                            <button
                              onClick={() => onConvertMessage(message.id, 'task')}
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              Convert to task
                            </button>
                          )}
                          {message.canConvertToDocument && (
                            <button
                              onClick={() => onConvertMessage(message.id, 'document')}
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              Convert to document
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat input */}
          <div className="border-t">
            <div className="bg-white rounded-lg border m-4">
              <div className="flex items-center gap-3 p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={onFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.png,.jpg"
                  aria-hidden
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 flex-shrink-0"
                  title="Attach files"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage();
                      }
                    }}
                    placeholder="Ask your AI agents anything... Use @Alex, @Sarah, @Marcus, @Diana, or @Robert to mention specific agents"
                    className="w-full px-4 py-2 border-0 focus:outline-none placeholder-gray-500"
                    aria-label="Message input"
                  />
                  
                  {/* Attachment preview */}
                  {attachments.length > 0 && (
                    <div className="mt-2 flex gap-2 items-center">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md text-xs border"
                        >
                          <span>{att.name}</span>
                          <button
                            onClick={() => onRemoveAttachment(att.id)}
                            className="text-gray-400 hover:text-gray-700 ml-2"
                            aria-label={`Remove ${att.name}`}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={onSendMessage}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'documents' && (
        <div className="p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
            <p className="text-gray-500 mb-4">AI-generated documents and project artifacts will appear here.</p>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Generate Document</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Upload Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;