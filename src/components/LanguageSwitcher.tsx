import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useContext(LanguageContext)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLanguage}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title={language === 'en' ? 'Switch to French' : 'Passer en Anglais'}
      >
        {language === 'fr' ? '🇫🇷' : '🇬🇧'}
      </button>
      <span className="text-sm text-gray-600">
        {language === 'fr' ? 'Français' : 'English'}
      </span>
    </div>
  )
}
