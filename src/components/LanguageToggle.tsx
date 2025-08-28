import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (newLanguage: 'EN' | 'FR') => {
    setLanguage(newLanguage)
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('EN')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          language === 'EN'
            ? 'bg-pharma-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => handleLanguageChange('FR')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          language === 'FR'
            ? 'bg-pharma-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        FR
      </button>
    </div>
  )
}

export default LanguageToggle
