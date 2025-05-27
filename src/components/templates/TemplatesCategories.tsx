import React, { useContext } from 'react';
import { Mail, MessageSquare, Bell, Tag, Users, User, MessageCircleIcon } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

const categories = [
  { icon: Mail, label: 'templates.categories.email', count: 12 },
  { icon: MessageCircleIcon, label: 'templates.categories.whatsapp', count: 4 },
  { icon: MessageSquare, label: 'templates.categories.chat', count: 8 },
  { icon: Bell, label: 'templates.categories.notification', count: 5 },
  { icon: User, label: 'templates.categories.employee', count: 16 },  
  { icon: Users, label: 'templates.categories.customer', count: 67 },
  { icon: Tag, label: 'templates.categories.custom', count: 3 }
];

export default function TemplatesCategories() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">{t('templates.categories.title')}</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.label}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <category.icon className="w-5 h-5 text-gray-600" />
              <span>{t(category.label)}</span>
            </div>
            <span className="text-sm text-gray-500">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
