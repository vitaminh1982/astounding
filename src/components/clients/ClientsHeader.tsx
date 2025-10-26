import React, { useContext } from 'react';
import { UserPlus, Download, Upload } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

export default function ClientsHeader() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div className="w-full lg:w-1/2 xl:w-1/3 mb-4 lg:mb-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t('clients.page.header.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('clients.page.header.subtitle')}
        </p>
      </div>
      <div className="w-full lg:w-1/2 xl:w-2/3 flex justify-end gap-3">
        <div className="lg:hidden flex flex-col gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{t('clients.page.header.export')}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <Upload className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{t('clients.page.header.import')}</span>
          </button>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-teal-700 transition-colors shadow-sm dark:shadow-gray-900"
        >
          <UserPlus className="w-4 h-4" />
          {t('clients.page.header.addCustomer')}
        </button>
        <div className="hidden lg:flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{t('clients.page.header.export')}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <Upload className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{t('clients.page.header.import')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
