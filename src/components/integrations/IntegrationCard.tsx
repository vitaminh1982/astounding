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
    <div className="bg-white dark:bg-surface-container-high overflow-hidden shadow dark:shadow-gray-900 rounded-lg border border-border dark:border-border hover:shadow-md dark:hover:shadow-gray-800 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-surface-container-low dark:bg-surface-container-highest rounded-lg flex items-center justify-center transition-colors">
              <div className="h-8 w-8 text-on-surface dark:text-muted-foreground transition-colors">
                {IconComponent}
              </div>
            </div>
            <h3 className="ml-3 text-lg font-medium text-foreground dark:text-foreground transition-colors">{integration.name}</h3>
          </div>
          
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors
            ${integration.isConnected 
              ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' 
              : 'bg-surface-container-low dark:bg-surface-container-highest border-border dark:border-border text-on-surface dark:text-muted-foreground'}`}
          >
            {integration.isConnected 
              ? t('integrations.connected') 
              : t('integrations.disconnected')}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2 h-10 transition-colors">{integration.description}</p>
        
        {integration.isConnected && integration.connectedSince && (
          <p className="mt-2 text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
            {t('integrations.connectedSince')}: {integration.connectedSince}
          </p>
        )}
      </div>
      
      <div className="bg-surface-container-low dark:bg-surface-container-highest/50 px-5 py-3 transition-colors">
        <button
          onClick={() => onOpenModal(integration)}
          className={`w-full inline-flex justify-center items-center px-4 py-2 border rounded-md 
                    shadow-sm dark:shadow-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors
                    ${integration.isConnected
                      ? 'border-border dark:border-border bg-white dark:bg-surface-container-highest text-on-surface dark:text-muted-foreground hover:bg-surface-container-low dark:hover:bg-surface-container-highest focus:ring-ring dark:focus:ring-ring'
                      : 'border-transparent bg-primary dark:bg-teal-600 text-white hover:bg-indigo-700 dark:hover:bg-teal-700 focus:ring-ring dark:focus:ring-ring'}`}
        >
          {integration.isConnected
            ? t('integrations.configure')
            : t('integrations.connect')}
        </button>
      </div>
    </div>
  );
}
