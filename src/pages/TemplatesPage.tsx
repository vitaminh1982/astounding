// Importation des composants et des hook nécessaires
import React, { useState, useContext } from 'react';
import TemplatesHeader from '../components/templates/TemplatesHeader';
import TemplatesSearch from '../components/templates/TemplatesSearch';
import TemplatesList from '../components/templates/TemplatesList';
import TemplatesCategories from '../components/templates/TemplatesCategories';
import { LanguageContext } from '../context/LanguageContext';

// Fonction principale du composant TemplatesPage
export default function TemplatesPage() {
  // État pour gérer l'ouverture du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useContext(LanguageContext);

  return (
    // Conteneur principal avec une hauteur minimale écran
    <div className="min-h-screen bg-gray-50">
      {/* Container principal avec padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* En-tête de la page */}
        <TemplatesHeader />

        {/* Bouton pour ouvrir/fermer le menu mobile */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-4 py-2 text-left bg-white rounded-lg border"
          >
            {t('templates.categories.title')} {isMobileMenuOpen ? '▼' : '▶'}
          </button>
        </div>

        {/* Conteneur principal avec une grille pour organiser les éléments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar avec les catégories, caché sur mobile sauf si le menu est ouvert */}
          <div className={`lg:col-span-3 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <TemplatesCategories />
          </div>

          {/* Contenu principal avec la barre de recherche et la liste de templates */}
          <div className="lg:col-span-9">
            <TemplatesSearch />
            <div className="mt-4">
              <TemplatesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
