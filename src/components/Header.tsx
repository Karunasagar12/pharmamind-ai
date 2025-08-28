import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

const Header: React.FC = () => {
  const { t } = useLanguage()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pharma-500 to-pharma-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('pharmamind.title')}</h1>
            <p className="text-sm text-gray-500">{t('pharmamind.subtitle')}</p>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
          <div className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200">
            <span className="font-medium text-amber-800">{t('developed.by')} </span>
            <span className="font-bold text-amber-900">Karunasagar Mohansundar</span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            🔔
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            📊
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ⚙️
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            👤
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
