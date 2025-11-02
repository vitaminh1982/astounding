import React, { useState, useEffect, useRef } from 'react';
import { Client } from '../../../../types/client';
import { Plus, X, Tag, Target, Users, Zap, Hash, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SegmentationProps {
  client: Client;
  onChange: (updates: Partial<Client>) => void;
}

const SEGMENT_CONFIG = {
  Premium: {
    color: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
    icon: '👑',
    description: 'High-value clients with premium engagement'
  },
  Standard: {
    color: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    icon: '⭐',
    description: 'Regular clients with standard engagement'
  },
  Occasionnel: {
    color: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
    icon: '💼',
    description: 'Occasional clients with basic interaction'
  }
};

const TAG_COLORS = [
  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
];

export default function Segmentation({ client, onChange }: SegmentationProps) {
  const [segment, setSegment] = useState<Client['segment']>(client.segment);
  const [engagementScore, setEngagementScore] = useState(client.engagementScore);
  const [tags, setTags] = useState<string[]>(client.tags || []);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track changes
  useEffect(() => {
    const hasChanged = 
      segment !== client.segment ||
      engagementScore !== client.engagementScore ||
      JSON.stringify(tags) !== JSON.stringify(client.tags || []);
    
    setHasChanges(hasChanged);
  }, [segment, engagementScore, tags, client]);

  const validateTag = (tag: string): string | null => {
    const trimmedTag = tag.trim();
    
    if (!trimmedTag) return 'Tag cannot be empty';
    if (trimmedTag.length < 2) return 'Tag must be at least 2 characters';
    if (trimmedTag.length > 20) return 'Tag must be less than 20 characters';
    if (tags.includes(trimmedTag)) return 'Tag already exists';
    if (tags.length >= 10) return 'Maximum 10 tags allowed';
    
    return null;
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    const validationError = validateTag(trimmedTag);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const updatedTags = [...tags, trimmedTag];
    setTags(updatedTags);
    setNewTag('');
    setError('');
    
    onChange({
      tags: updatedTags
    });
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    
    onChange({
      tags: updatedTags
    });
  };

  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSegment = e.target.value as Client['segment'];
    setSegment(newSegment);
    
    onChange({
      segment: newSegment
    });
  };

  const handleEngagementScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value);
    setEngagementScore(newScore);
    
    onChange({
      engagementScore: newScore
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 40) return { label: 'Average', color: 'text-amber-600 dark:text-amber-400' };
    return { label: 'Low', color: 'text-red-600 dark:text-red-400' };
  };

  const getTagColor = (index: number) => {
    return TAG_COLORS[index % TAG_COLORS.length];
  };

  const engagementLevel = getEngagementLevel(engagementScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-teal-900/30 border border-indigo-200 dark:border-teal-800 rounded-lg transition-colors">
            <Users className="w-5 h-5 text-indigo-600 dark:text-teal-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">
              Client Segmentation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Categorize and tag clients for better organization
            </p>
          </div>
        </div>
        
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full border border-amber-200 dark:border-amber-800 transition-colors"
          >
            Unsaved changes
          </motion.div>
        )}
      </div>
      
      {/* Segment and Engagement Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Segment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Client Segment
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Target className="w-4 h-4" />
            </div>
            <select
              value={segment}
              onChange={handleSegmentChange}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-gray-900 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 appearance-none"
            >
              {Object.entries(SEGMENT_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {key}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Segment Info */}
          <div className={`mt-3 p-3 rounded-lg border transition-colors ${SEGMENT_CONFIG[segment].color}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{SEGMENT_CONFIG[segment].icon}</span>
              <span className="font-medium">{segment} Segment</span>
            </div>
            <p className="text-sm opacity-90">
              {SEGMENT_CONFIG[segment].description}
            </p>
          </div>
        </div>
        
        {/* Engagement Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Engagement Score
          </label>
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                  Current Score
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold transition-colors ${engagementLevel.color}`}>
                  {engagementScore}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                  engagementScore >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                  engagementScore >= 60 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                  engagementScore >= 40 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}>
                  {engagementLevel.label}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                value={engagementScore}
                onChange={handleEngagementScoreChange}
                min="0"
                max="100"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb transition-colors"
                style={{
                  background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${engagementScore}%, rgb(229 231 235) ${engagementScore}%, rgb(229 231 235) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400 transition-colors" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Client Tags ({tags.length}/10)
            </label>
          </div>
          
          {tags.length > 0 && (
            <button
              onClick={() => {
                setTags([]);
                onChange({ tags: [] });
              }}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
        
        {/* Existing Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 hover:shadow-sm ${getTagColor(index)}`}
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Add New Tag */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter a new tag (e.g., VIP, Marketing, Support)"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm dark:shadow-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  error
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                    : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-teal-500 focus:ring-indigo-500 dark:focus:ring-teal-500'
                }`}
                maxLength={20}
                disabled={tags.length >= 10}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors">
                  {error}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                {newTag.length}/20 characters • Press Enter to add
              </p>
            </div>
            
            <button
              onClick={addTag}
              disabled={!newTag.trim() || tags.length >= 10}
              className="px-4 py-2 bg-indigo-600 dark:bg-teal-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm dark:shadow-gray-900 hover:shadow-md dark:hover:shadow-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
              aria-label="Add new tag"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {segment}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Client Segment
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-blue-100 dark:bg-teal-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Zap className="w-4 h-4 text-blue-600 dark:text-teal-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {engagementScore}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Engagement Score
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center shadow-sm dark:shadow-gray-900 transition-colors">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg inline-flex mb-2 transition-colors">
            <Tag className="w-4 h-4 text-green-600 dark:text-green-400 transition-colors" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
            {tags.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
            Active Tags
          </p>
        </div>
      </div>
    </div>
  );
}

// Add to your CSS for custom range slider styling
const styles = `
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-thumb::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

@media (prefers-color-scheme: dark) {
  .slider-thumb::-webkit-slider-thumb {
    background: #14B8A6;
  }
  
  .slider-thumb::-moz-range-thumb {
    background: #14B8A6;
  }
}
`;
