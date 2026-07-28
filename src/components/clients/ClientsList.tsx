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
            <div className="bg-white rounded-lg shadow dark:bg-surface-container-high dark:shadow-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-surface-container-low dark:bg-surface-container-highest">
                  <tr>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider dark:text-muted-foreground">Customer</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider dark:text-muted-foreground">Segment</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider dark:text-muted-foreground">LTV</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider dark:text-muted-foreground">Satisfaction</th>
                    <th className="px-4 md:px-8 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider dark:text-muted-foreground">Status</th>
                    <th className="relative px-4 md:px-8 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-surface-container-high">
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
      className="hover:bg-surface-container-low dark:hover:bg-surface-container-highest cursor-pointer"
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
        <div className="flex-shrink-0 h-12 w-12 bg-surface-container-low rounded-full flex items-center justify-center dark:bg-surface-container-highest">
          {client.avatar || client.initials}
        </div>
        <div className="ml-5">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-foreground dark:text-on-surface-variant">
              {client.name}
            </div>
            {client.vip && <Star className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">{client.email}</div>
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
        <span className="text-sm text-foreground dark:text-on-surface-variant">{client.ltv}€</span>
        {client.ltvTrend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-destructive dark:text-destructive" />
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
        <div className="w-24 h-3 bg-surface-container rounded-full overflow-hidden dark:bg-surface-container-highest">
          <div 
            className="h-full bg-green-500 rounded-full dark:bg-green-400"
            style={{ width: `${client.satisfaction}%` }}
          ></div>
        </div>
        <span className="text-sm text-muted-foreground dark:text-muted-foreground">{client.satisfaction}%</span>
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
          <AlertCircle className="w-4 h-4 text-destructive dark:text-destructive" />
        )}
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          client.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200'
            : 'bg-surface-container-low text-on-surface dark:bg-surface-container-highest dark:text-on-surface-variant'
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
        className="text-outline hover:text-muted-foreground dark:text-muted-foreground dark:hover:text-outline"
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
