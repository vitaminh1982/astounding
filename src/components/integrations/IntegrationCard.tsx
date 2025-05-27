import React from 'react';
import { useContext } from 'react';
import { Link } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
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
  AsanaIcon
} from './icons';

export interface IntegrationType {
  id: string;
  name: string;
  description: string;
  iconType: string;
  category: string;
  isConnected: boolean;
  connectedSince?: string;
}

interface IntegrationCardProps {
  integration: IntegrationType;
  onOpenModal: (integration: IntegrationType) => void;
}

export default function IntegrationCard({ integration, onOpenModal }: IntegrationCardProps) {
  const { t } = useContext(LanguageContext);

  // Map for integration icons
  const iconMapping: Record<string, React.ReactNode> = {
    'slack': <SlackIcon />,
    'google-calendar': <GoogleCalendarIcon />,
    'zapier': <ZapierIcon />,
    'shopify': <ShopifyIcon />,
    'stripe': <StripeIcon />,
    'hubspot': <HubspotIcon />,
    'zendesk': <ZendeskIcon />,
    'outlook': <OutlookIcon />,
    'mailchimp': <MailchimpIcon />,
    'asana': <AsanaIcon />,
    'default': <Link className="h-6 w-6" />
  };

  const IconComponent = iconMapping[integration.iconType] || iconMapping['default'];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="h-8 w-8 text-gray-700">
                {IconComponent}
              </div>
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">{integration.name}</h3>
          </div>
          
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${integration.isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'}`}
          >
            {integration.isConnected 
              ? t('integrations.connected') 
              : t('integrations.disconnected')}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 h-10">{integration.description}</p>
        
        {integration.isConnected && integration.connectedSince && (
          <p className="mt-2 text-xs text-gray-500">
            {t('integrations.connectedSince')}: {integration.connectedSince}
          </p>
        )}
      </div>
      
      <div className="bg-gray-50 px-5 py-3">
        <button
          onClick={() => onOpenModal(integration)}
          className={`w-full inline-flex justify-center items-center px-4 py-2 border rounded-md 
                    shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
                    ${integration.isConnected
                      ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
                      : 'border-transparent bg-indigo-700 text-white hover:bg-indigo-600 focus:ring-blue-500'}`}
        >
          {integration.isConnected
            ? t('integrations.configure')
            : t('integrations.connect')}
        </button>
      </div>
    </div>
  );
}
