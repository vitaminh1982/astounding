import React, { useState } from 'react';
import { Client } from '../../../../types/client';
import { Plus, X } from 'lucide-react';

interface SegmentationProps {
  client: Client;
  onChange: () => void;
}

export default function Segmentation({ client, onChange }: SegmentationProps) {
  const [segment, setSegment] = useState(client.segment);
  const [engagementScore, setEngagementScore] = useState(client.engagementScore);
  const [tags, setTags] = useState(client.tags);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
    onChange();
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
    onChange();
  };

  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSegment(e.target.value as Client['segment']);
    onChange();
  };

  const handleEngagementScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEngagementScore(parseInt(e.target.value));
    onChange();
  };

  return (
    <div className="space-y-4 sm:space-y-2 md:space-y-4">
      <h3 className="font-semibold text-lg sm:text-sm md:text-lg">Customer segment</h3>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Engagement level</label>
          <select
            value={segment}
            onChange={handleSegmentChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300"
          >
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Occasionnel">Occasionnal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Engagement score</label>
          <div className="mt-1 p-2 flex items-center gap-2">
            <input
              type="range"
              value={engagementScore}
              onChange={handleEngagementScoreChange}
              min="0"
              max="100"
              className="flex-1"
            />
            <span className="w-12 text-center">{engagementScore}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-indigo-900">
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
          <div className="inline-flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nouveau tag"
              className="px-3 py-1 rounded-md border-gray-300 text-sm"
            />
            <button
              onClick={addTag}
              className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
