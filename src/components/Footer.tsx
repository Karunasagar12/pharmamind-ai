import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const Footer: React.FC = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{t('footer.copyright')}</span>
          <span className="text-gray-400">|</span>
          <span className="font-medium text-pharma-600">{t('footer.pharmamind.version')}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{t('footer.manuwatch.version')}</span>
          <span>•</span>
          <span>{t('footer.platform')}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
