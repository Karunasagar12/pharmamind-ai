import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { ChevronDown, ChevronRight, Home, BarChart3, TrendingUp, PieChart, Wrench, CheckCircle, Camera, Info, Settings } from 'lucide-react'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { t } = useLanguage()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const isSectionExpanded = (section: string) => expandedSections.includes(section)

  const manuwatchNavigation = [
    { name: t('nav.realtime'), href: '/dashboard', icon: BarChart3, description: t('nav.realtime.desc') },
    { name: t('nav.oee'), href: '/oee', icon: TrendingUp, description: t('nav.oee.desc') },
    { name: t('nav.analytics'), href: '/analytics', icon: PieChart, description: t('nav.analytics.desc') },
    { name: t('nav.maintenance'), href: '/maintenance', icon: Wrench, description: t('nav.maintenance.desc') },
    { name: t('nav.quality'), href: '/quality', icon: CheckCircle, description: t('nav.quality.desc') },
  ]

  const visionqcNavigation = [
    { name: t('nav.visionqc'), href: '/visionqc', icon: Camera, description: t('nav.visionqc.desc') },
  ]

  const aboutNavigation = [
    { name: t('nav.about'), href: '/about', icon: Info, description: t('nav.about.desc') },
  ]

  const isActive = (href: string) => location.pathname === href
  const isInSection = (section: string) => {
    if (section === 'manuwatch') {
      return manuwatchNavigation.some(item => isActive(item.href))
    }
    if (section === 'visionqc') {
      return visionqcNavigation.some(item => isActive(item.href))
    }
    if (section === 'about') {
      return aboutNavigation.some(item => isActive(item.href))
    }
    return false
  }

  // Auto-expand sections based on current route
  React.useEffect(() => {
    const currentSection = isInSection('manuwatch') ? 'manuwatch' : 
                          isInSection('visionqc') ? 'visionqc' : null
    
    if (currentSection && !expandedSections.includes(currentSection)) {
      setExpandedSections(prev => [...prev, currentSection])
    }
  }, [location.pathname])

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 min-h-screen shadow-sm">
      {/* Header */}
      <div className="px-6 py-8 border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Built for demonstration purposes for Eli Lilly</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-2">
        {/* About Section - Always Visible */}
        <div className="space-y-1">
          {aboutNavigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className={`text-xs mt-0.5 ${
                    active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-6"></div>

        {/* ManuWatch Section */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('manuwatch')}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
              isInSection('manuwatch')
                ? 'bg-gradient-to-r from-slate-50 to-blue-50 text-slate-800 border border-slate-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                isInSection('manuwatch') ? 'bg-blue-500' : 'bg-slate-400'
              }`}></div>
              <span>ManuWatch</span>
            </div>
            {isSectionExpanded('manuwatch') ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
          
          {isSectionExpanded('manuwatch') && (
            <div className="ml-6 space-y-1 mt-2">
              {manuwatchNavigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      <div className={`text-xs mt-0.5 ${
                        active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* VisionQC Section */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('visionqc')}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
              isInSection('visionqc')
                ? 'bg-gradient-to-r from-slate-50 to-purple-50 text-slate-800 border border-slate-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                isInSection('visionqc') ? 'bg-purple-500' : 'bg-slate-400'
              }`}></div>
              <span>VisionQC</span>
            </div>
            {isSectionExpanded('visionqc') ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
          
          {isSectionExpanded('visionqc') && (
            <div className="ml-6 space-y-1 mt-2">
              {visionqcNavigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 ${active ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      <div className={`text-xs mt-0.5 ${
                        active ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-72 p-6 border-t border-slate-200 bg-white">
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-900 mb-1">PharmaMind AI v2.2.4</div>
          <div className="text-xs text-slate-500">© 2025 Karunasagar Mohansundar</div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
