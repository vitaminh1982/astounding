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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4 border border-gray-200 dark:border-gray-600 transition-colors">
      <h2 className="font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors">{t('templates.categories.title')}</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.label}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <category.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-gray-100">{t(category.label)}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
