import React, { useState } from 'react';
import { MoreVertical, Star, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import ClientEditor from './editor/ClientEditor';
import { Client } from '../../types/client';

// Les styles CSS pour le scrollbar sont inclus ici pour une meilleure encapsulation
// Si vous préférez les avoir dans un fichier CSS global, retirez-les d'ici.
const scrollbarStyles = `
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
`;


export default function ClientsList() {
  const clients = useClients();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleSave = (updatedClient: Client) => {
    console.log('Client updated:', updatedClient);
    setSelectedClient(null);
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Customer</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Segment</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">LTV</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Satisfaction</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                    <th className="relative px-4 md:px-8 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-800">
                  {clients.map((client) => (
                    <TrClient 
                      key={client.id} 
                      client={client} 
                      onClick={() => setSelectedClient(client)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Gradient overlay for scroll overflow */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent" />
      </div>

      {selectedClient && (
        <ClientEditor
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

interface TrClientProps {
  client: Client;
  onClick: () => void;
}

function TrClient({ client, onClick }: TrClientProps) {
  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
      onClick={onClick}
    >
      <TdClient client={client} />
      <TdSegment client={client} />
      <TdLtv client={client} />
      <TdSatisfaction client={client} />
      <TdStatut client={client} />
      <TdActions client={client} onClick={onClick} />
    </tr>
  );
}

interface TdClientProps {
  client: Client;
}

function TdClient({ client }: TdClientProps) {
  return (
    <td className="px-4 md:px-8 py-6 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-700">
          {client.avatar || client.initials}
        </div>
        <div className="ml-5">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
              {client.name}
            </div>
            {client.vip && <Star className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{client.email}</div>
        </div>
      </div>
    </td>
  );
}

interface TdSegmentProps {
  client: Client;
}

function TdSegment({ client }: TdSegmentProps) {
  return (
    <td className="px-4 md:px-8 py-6 whitespace-nowrap">
      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                     bg-indigo-100 text-indigo-800 
                     dark:bg-teal-600 dark:text-teal-100">
        {client.segment}
      </span>
    </td>
  );
}

interface TdLtvProps {
  client: Client;
}

function TdLtv({ client }: TdLtvProps) {
  return (
    <td className="px-4 md:px-8 py-6 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900 dark:text-gray-200">{client.ltv}€</span>
        {client.ltvTrend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400" />
        )}
      </div>
    </td>
  );
}

interface TdSatisfactionProps {
  client: Client;
}

function TdSatisfaction({ client }: TdSatisfactionProps) {
  return (
    <td className="px-4 md:px-8 py-6 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
          <div 
            className="h-full bg-green-500 rounded-full dark:bg-green-400"
            style={{ width: `${client.satisfaction}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{client.satisfaction}%</span>
      </div>
    </td>
  );
}

interface TdStatutProps {
  client: Client;
}

function TdStatut({ client }: TdStatutProps) {
  return (
    <td className="px-4 md:px-8 py-6 whitespace-nowrap">
      <div className="flex items-center gap-2">
        {client.riskLevel === 'high' && (
          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
        )}
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          client.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {client.status}
        </span>
      </div>
    </td>
  );
}

interface TdActionsProps {
  client: Client;
  onClick: () => void;
}

function TdActions({ client, onClick }: TdActionsProps) {
  return (
    <td className="px-4 md:px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
      <button 
        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </td>
  );
}
