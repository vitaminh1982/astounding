import React, { useState } from 'react';
import { Server, Terminal, Globe, Key, FileText } from 'lucide-react';
import { MCPProtocol, AuthMethod, MCPServerFormData } from '../../../types/integration';

interface MCPServerFormProps {
  onSubmit: (data: MCPServerFormData) => void;
  onCancel: () => void;
  initialData?: Partial<MCPServerFormData>;
}

export default function MCPServerForm({
  onSubmit,
  onCancel,
  initialData,
}: MCPServerFormProps) {
  const [formData, setFormData] = useState<MCPServerFormData>({
    name: initialData?.name || '',
    auth_method: initialData?.auth_method || 'none',
    protocol: initialData?.protocol || 'stdio',
    command: initialData?.command || '',
    args: initialData?.args || [],
    url: initialData?.url || '',
    env: initialData?.env || {},
    connection_config: initialData?.connection_config || {},
  });

  const [argsInput, setArgsInput] = useState(formData.args?.join(' ') || '');
  const [envInput, setEnvInput] = useState(
    Object.entries(formData.env || {})
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const args = argsInput
      .split(' ')
      .filter((arg) => arg.trim())
      .map((arg) => arg.trim());

    const env: Record<string, string> = {};
    envInput
      .split('\n')
      .filter((line) => line.trim())
      .forEach((line) => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      });

    onSubmit({
      ...formData,
      args,
      env,
      connection_config: {
        protocol: formData.protocol,
        command: formData.command,
        args,
        url: formData.url,
        env,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Connection Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                   focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                   focus:ring-blue-500 dark:focus:ring-teal-500"
          placeholder="My MCP Server"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Protocol Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['stdio', 'http', 'sse'] as MCPProtocol[]).map((protocol) => (
            <button
              key={protocol}
              type="button"
              onClick={() => setFormData({ ...formData, protocol })}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2
                       transition-all ${
                         formData.protocol === protocol
                           ? 'border-blue-500 dark:border-teal-500 bg-blue-50 dark:bg-teal-900/20'
                           : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                       }`}
            >
              {protocol === 'stdio' && <Terminal className="h-5 w-5" />}
              {protocol === 'http' && <Globe className="h-5 w-5" />}
              {protocol === 'sse' && <Server className="h-5 w-5" />}
              <span className="text-sm font-medium">{protocol.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {formData.protocol === 'stdio' && (
        <>
          <div>
            <label
              htmlFor="command"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Command
            </label>
            <input
              type="text"
              id="command"
              required
              value={formData.command}
              onChange={(e) =>
                setFormData({ ...formData, command: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                       focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500 dark:focus:ring-teal-500"
              placeholder="npx"
            />
          </div>

          <div>
            <label
              htmlFor="args"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Arguments (space-separated)
            </label>
            <input
              type="text"
              id="args"
              value={argsInput}
              onChange={(e) => setArgsInput(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                       focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500 dark:focus:ring-teal-500"
              placeholder="-y @modelcontextprotocol/server-memory"
            />
          </div>
        </>
      )}

      {(formData.protocol === 'http' || formData.protocol === 'sse') && (
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Server URL
          </label>
          <input
            type="url"
            id="url"
            required
            value={formData.url}
            onChange={(e) =>
              setFormData({ ...formData, url: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                     focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                     focus:ring-blue-500 dark:focus:ring-teal-500"
            placeholder="http://localhost:3000"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Authentication Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['none', 'api_key', 'jwt', 'basic'] as AuthMethod[]).map(
            (method) => (
              <button
                key={method}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, auth_method: method })
                }
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2
                         transition-all ${
                           formData.auth_method === method
                             ? 'border-blue-500 dark:border-teal-500 bg-blue-50 dark:bg-teal-900/20'
                             : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                         }`}
              >
                <Key className="h-4 w-4" />
                <span className="text-sm font-medium capitalize">
                  {method.replace('_', ' ')}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="env"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Environment Variables (one per line: KEY=value)
        </label>
        <textarea
          id="env"
          value={envInput}
          onChange={(e) => setEnvInput(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100
                   focus:border-blue-500 dark:focus:border-teal-500 focus:outline-none focus:ring-2
                   focus:ring-blue-500 dark:focus:ring-teal-500 font-mono text-sm"
          placeholder="API_KEY=your_key_here&#10;DEBUG=true"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                   bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                   rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-teal-600
                   rounded-md hover:bg-blue-700 dark:hover:bg-teal-700 transition-colors"
        >
          Connect Server
        </button>
      </div>
    </form>
  );
}
