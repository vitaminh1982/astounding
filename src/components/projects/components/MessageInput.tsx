/**
 * Message input component with attachments and controls
 */
import React from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Agent, Attachment } from '../types';

interface MessageInputProps {
  selectedAgents: string[];
  agents: Agent[];
  visibility: 'project' | 'team' | 'private';
  setVisibility: (visibility: 'project' | 'team' | 'private') => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  attachments: Attachment[];
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  formatFileSize: (bytes: number) => string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileButtonClick: () => void;
}

/**
 * MessageInput handles user input, attachments, and message sending
 */
const MessageInput: React.FC<MessageInputProps> = ({
  selectedAgents,
  agents,
  visibility,
  setVisibility,
  newMessage,
  setNewMessage,
  attachments,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  formatFileSize,
  fileInputRef,
  onFileButtonClick
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t border-border dark:border-border">
      {/* Chat controls */}
      <div className="p-4 border-b border-border dark:border-border bg-surface-container-low dark:bg-surface-container-highest/50 transition-colors">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-on-surface dark:text-muted-foreground">Selected Agents:</span>
            {selectedAgents.length === 0 ? (
              <span className="text-sm text-muted-foreground dark:text-muted-foreground">All agents (collaborative mode)</span>
            ) : (
              <div className="flex gap-2">
                {selectedAgents.map((agentId) => {
                  const agent = agents.find((a) => a.id === agentId);
                  return agent ? (
                    <span key={agentId} className="flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-teal-900/30 text-indigo-800 dark:text-teal-300 rounded-full text-xs transition-colors">
                      <span>{agent.avatar}</span>
                      <span>{agent.name}</span>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-on-surface dark:text-muted-foreground">Visibility:</span>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="text-sm border border-border dark:border-border rounded-md px-2 py-1 bg-white dark:bg-surface-container-highest text-foreground dark:text-foreground transition-colors focus:ring-2 focus:ring-ring dark:focus:ring-ring focus:border-primary-green dark:focus:border-teal-500"
              aria-label="Message visibility"
            >
              <option value="project">Project</option>
              <option value="team">Team</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat input */}
      <div className="bg-white dark:bg-surface-container-high rounded-lg border border-border dark:border-border m-4 transition-colors">
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
            onClick={onFileButtonClick}
            className="p-2 text-muted-foreground dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-container-highest flex-shrink-0 transition-colors"
            title="Attach files"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI agents anything... Use @Seiya, @Shiryu, @Hyôga, @Shun, or @Ikki to mention specific agents"
              className="w-full px-4 py-2 border-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-foreground dark:text-foreground"
              aria-label="Message input"
            />
            
            {/* Attachment preview */}
            {attachments.length > 0 && (
              <div className="mt-2 flex gap-2 items-center">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 bg-surface-container-low dark:bg-surface-container-highest px-3 py-1 rounded-md text-xs border border-border dark:border-border transition-colors"
                  >
                    <span className="text-on-surface dark:text-muted-foreground">{att.name}</span>
                    <button
                      onClick={() => onRemoveAttachment(att.id)}
                      className="text-outline dark:text-muted-foreground hover:text-on-surface dark:hover:text-muted-foreground ml-2 transition-colors"
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
            className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary dark:bg-teal-600 text-white hover:bg-indigo-700 dark:hover:bg-teal-700 flex-shrink-0 transition-colors shadow-sm dark:shadow-gray-900"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
