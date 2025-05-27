// src/components/integrations/AddToolModal.tsx
import React, { useState } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import IntegrationSearchBar from './IntegrationSearchBar';
import IntegrationFilters from './IntegrationFilters';
import IntegrationCard, { IntegrationType } from './IntegrationCard';

type AddToolModalProps = {
  isOpen: boolean;
  onClose: () => void;
  availableIntegrations: IntegrationType[];
  onOpenIntegrationModal: (integration: IntegrationType) => void;
};

function AddToolModal({
  isOpen,
  onClose,
  availableIntegrations,
  onOpenIntegrationModal,
}: AddToolModalProps) {
  const { t } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  if (!isOpen) {
    return null;
  }

  // Filter available tools based on search and category
  const filteredIntegrations = availableIntegrations.filter(integration => 
    (categoryFilter === 'all' || integration.category === categoryFilter) &&
    (integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     integration.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('integrations.availableTools')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('integrations.availableToolsDescription')}
              </p>
            </div>
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-6 space-y-4">
              <IntegrationSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <IntegrationFilters
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter="disconnected"
                setStatusFilter={() => {}}
                hideStatusFilter={true}
              />
            </div>
            
            {filteredIntegrations.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onOpenModal={onOpenIntegrationModal}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('integrations.noToolsFound')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('integrations.noToolsFoundDescription')}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToolModal;
