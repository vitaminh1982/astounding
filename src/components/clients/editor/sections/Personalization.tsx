import React, { useState } from 'react';
import { Client } from '../../../../types/client';

interface PersonalizationProps {
  client: Client;
}

export default function Personalization({ client }: PersonalizationProps) {
  const [customFields, setCustomFields] = useState<Record<string, string>>({
    birthday: '1990-01-01',
    company: 'Acme Inc',
    jobTitle: 'Manager'
  });

  const handleFieldChange = (field: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFieldRemove = (field: string) => {
    setCustomFields(prev => {
      const newCustomFields = { ...prev };
      delete newCustomFields[field];
      return newCustomFields;
    });
  };

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleAddField = () => {
    if (newFieldName && newFieldValue) {
      setCustomFields(prev => ({
        ...prev,
        [newFieldName]: newFieldValue
      }));
      setNewFieldName('');
      setNewFieldValue('');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-2 md:space-y-4">
      <h3 className="font-semibold text-lg sm:text-sm md:text-lg">Customization</h3>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {Object.entries(customFields).map(([field, value]) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300"
            />
            <button
              className="text-sm text-red-600 hover:text-red-700 mt-2"
              onClick={() => handleFieldRemove(field)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Field name</label>
        <input
          type="text"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border-gray-300"
        />
        <label className="block text-sm font-medium text-gray-700 mt-2">Field value</label>
        <input
          type="text"
          value={newFieldValue}
          onChange={(e) => setNewFieldValue(e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border-gray-300"
        />
        <button
          className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
          onClick={handleAddField}
        >
          Add
        </button>
      </div>
    </div>
  );
}
