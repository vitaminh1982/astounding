import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useContext(LanguageContext)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLanguage}
        className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
        title={language === 'en' ? 'Switch to French' : 'Passer en Anglais'}
      >
        {language === 'fr' ? '🇫🇷' : '🇬🇧'}
      </button>
      <span className="text-sm text-muted-foreground">
        {language === 'fr' ? 'Français' : 'English'}
      </span>
    </div>
  )
}
