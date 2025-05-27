import React, { useState } from 'react';
import { Client } from '../../../../types/client';

interface BasicInfoProps {
  client: Client;
  onChange: () => void;
}

export default function BasicInfo({ client, onChange }: BasicInfoProps) {
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone || '',
    status: client.status,
    notes: client.notes || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    onChange();
  };

  return (
    <div className="space-y-4 sm:space-y-2 md:space-y-4">
      <h3 className="font-semibold text-lg sm:text-sm md:text-lg">Basic Informations</h3>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 p-2 block w-full rounded-md border-gray-300"
          placeholder="Notes internes sur le client..."
        />
      </div>

      <div className="text-sm text-gray-500 sm:text-xs md:text-sm">
        Registration data: {client.registrationDate}
      </div>
    </div>
  );
}
