import React from 'react';
import {
  Link,
  Server,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { IntegrationTypeData, UserIntegration } from '../../types/integration';
import {
  SlackIcon,
  GoogleCalendarIcon,
  ZapierIcon,
  ShopifyIcon,
  StripeIcon,
  HubspotIcon,
  ZendeskIcon,
  OutlookIcon,
  MailchimpIcon,
  AsanaIcon,
} from './icons';

interface EnhancedIntegrationCardProps {
  integrationType: IntegrationTypeData;
  userIntegration?: UserIntegration;
  onConnect: () => void;
  onConfigure?: () => void;
}

export default function EnhancedIntegrationCard({
  integrationType,
  userIntegration,
  onConnect,
  onConfigure,
}: EnhancedIntegrationCardProps) {
  const iconMapping: Record<string, React.ReactNode> = {
    slack: <SlackIcon />,
    'google-calendar': <GoogleCalendarIcon />,
    zapier: <ZapierIcon />,
    shopify: <ShopifyIcon />,
    stripe: <StripeIcon />,
    hubspot: <HubspotIcon />,
    zendesk: <ZendeskIcon />,
    outlook: <OutlookIcon />,
    mailchimp: <MailchimpIcon />,
    asana: <AsanaIcon />,
    default: <Link className="h-6 w-6" />,
  };

  const IconComponent =
    iconMapping[integrationType.icon_type] || iconMapping['default'];

  const getStatusIcon = () => {
    if (!userIntegration) return null;

    switch (userIntegration.status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'configuring':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    if (!userIntegration) {
      return 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300';
    }

    switch (userIntegration.status) {
      case 'connected':
        return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      case 'testing':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
      case 'configuring':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow dark:shadow-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
              <div className="h-8 w-8 text-gray-700 dark:text-gray-300 transition-colors">
                {IconComponent}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors truncate">
                  {userIntegration?.name || integrationType.name}
                </h3>
                {integrationType.type === 'mcp' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300">
                    <Server className="h-3 w-3" />
                    MCP
                  </span>
                )}
                {integrationType.type === 'vendor' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                    <Globe className="h-3 w-3" />
                    API
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                {integrationType.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${getStatusColor()}`}
            >
              {userIntegration
                ? userIntegration.status.replace('_', ' ')
                : 'Not Connected'}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10 transition-colors">
          {integrationType.description}
        </p>

        {userIntegration?.connected_at && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Connected: {new Date(userIntegration.connected_at).toLocaleDateString()}
          </p>
        )}

        {userIntegration?.last_error && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
            {userIntegration.last_error}
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 transition-colors">
        <button
          onClick={userIntegration ? onConfigure : onConnect}
          className={`w-full inline-flex justify-center items-center px-4 py-2 border rounded-md
                    shadow-sm dark:shadow-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors
                    ${
                      userIntegration
                        ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-blue-500 dark:focus:ring-teal-500'
                        : 'border-transparent bg-blue-600 dark:bg-teal-600 text-white hover:bg-blue-700 dark:hover:bg-teal-700 focus:ring-blue-500 dark:focus:ring-teal-500'
                    }`}
        >
          {userIntegration ? 'Configure' : 'Connect'}
        </button>
      </div>
    </div>
  );
}
