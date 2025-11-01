import React, { useState } from 'react';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  IntegrationTypeData,
  UserIntegration,
  MCPServerFormData,
  VendorAPIFormData,
} from '../../types/integration';
import MCPServerForm from './forms/MCPServerForm';
import VendorAPIForm from './forms/VendorAPIForm';

interface ConnectionModalProps {
  integrationType: IntegrationTypeData | null;
  existingIntegration?: UserIntegration;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (data: MCPServerFormData | VendorAPIFormData) => Promise<void>;
  onTest?: (integration: UserIntegration) => Promise<void>;
  onDisconnect?: (integration: UserIntegration) => Promise<void>;
}

export default function ConnectionModal({
  integrationType,
  existingIntegration,
  isOpen,
  onClose,
  onConnect,
  onTest,
  onDisconnect,
}: ConnectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen || !integrationType) return null;

  const handleSubmit = async (data: MCPServerFormData | VendorAPIFormData) => {
    setIsSubmitting(true);
    setTestResult(null);

    try {
      await onConnect(data);
      onClose();
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTest = async () => {
    if (!existingIntegration || !onTest) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      await onTest(existingIntegration);
      setTestResult({
        success: true,
        message: 'Connection test successful!',
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!existingIntegration || !onDisconnect) return;

    if (
      !confirm(
        `Are you sure you want to disconnect ${existingIntegration.name}?`
      )
    ) {
      return;
    }

    try {
      await onDisconnect(existingIntegration);
      onClose();
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Disconnect failed',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-opacity-80 transition-opacity"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200 dark:border-gray-600">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-teal-500 transition-colors p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-teal-900/30">
                  <span className="text-2xl">
                    {integrationType.type === 'mcp' ? '🔌' : '🔗'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    {existingIntegration
                      ? `Configure ${integrationType.name}`
                      : `Connect ${integrationType.name}`}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {integrationType.type === 'mcp'
                      ? 'MCP Server Connection'
                      : 'Vendor API Integration'}
                  </p>
                </div>
              </div>
            </div>

            {testResult && (
              <div
                className={`mb-6 rounded-lg p-4 ${
                  testResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  )}
                  <p
                    className={`text-sm ${
                      testResult.success
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}
                  >
                    {testResult.message}
                  </p>
                </div>
              </div>
            )}

            {integrationType.type === 'mcp' ? (
              <MCPServerForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                initialData={
                  existingIntegration
                    ? {
                        name: existingIntegration.name,
                        auth_method: existingIntegration.auth_method,
                        protocol: (existingIntegration.connection_config as any)
                          ?.protocol,
                        command: (existingIntegration.connection_config as any)
                          ?.command,
                        args: (existingIntegration.connection_config as any)
                          ?.args,
                        url: (existingIntegration.connection_config as any)
                          ?.url,
                        env: (existingIntegration.connection_config as any)
                          ?.env,
                        connection_config: existingIntegration.connection_config,
                      }
                    : undefined
                }
              />
            ) : (
              <VendorAPIForm
                integrationType={integrationType}
                onSubmit={handleSubmit}
                onCancel={onClose}
                initialData={
                  existingIntegration
                    ? {
                        name: existingIntegration.name,
                        auth_method: existingIntegration.auth_method,
                        connection_config: existingIntegration.connection_config,
                      }
                    : undefined
                }
              />
            )}

            {existingIntegration && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 dark:text-teal-400 bg-blue-50 dark:bg-teal-900/20 border border-blue-200 dark:border-teal-800 rounded-md hover:bg-blue-100 dark:hover:bg-teal-900/30 transition-colors disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </button>

                {onDisconnect && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
