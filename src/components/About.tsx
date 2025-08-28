import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState('project')
  const { t } = useLanguage()

  const tabs: Tab[] = [
    {
      id: 'project',
      label: t('about.tabs.project'),
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('about.project.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('about.project.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('about.project.architecture.title')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900">ManuWatch:</span>
                    <span className="text-gray-700"> {t('about.project.architecture.manuwatch')}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900">VisionQC:</span>
                    <span className="text-gray-700"> {t('about.project.architecture.visionqc')}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('about.project.data.title')}
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• {t('about.project.data.batches')}</li>
                <li>• {t('about.project.data.simulation')}</li>
                <li>• {t('about.project.data.quality')}</li>
                <li>• {t('about.project.data.analytics')}</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('about.project.tech.title')}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Frontend</h4>
                <p className="text-sm text-blue-700">React.js, Next.js, Tailwind CSS, Recharts</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Backend</h4>
                <p className="text-sm text-green-700">FastAPI, WebSocket, PostgreSQL, Redis</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">AI/ML</h4>
                <p className="text-sm text-purple-700">TensorFlow.js, YOLOv8, scikit-learn</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Cloud</h4>
                <p className="text-sm text-orange-700">Firebase, Google Cloud, Docker, GitHub Actions</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('about.project.features.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-700">
                <li>• {t('about.project.features.monitoring')}</li>
                <li>• {t('about.project.features.analytics')}</li>
                <li>• {t('about.project.features.vision')}</li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li>• {t('about.project.features.bilingual')}</li>
                <li>• {t('about.project.features.scalable')}</li>
                <li>• {t('about.project.features.enterprise')}</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'me',
      label: t('about.tabs.me'),
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('about.me.name')}
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  {t('about.me.title')}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.me.description')}
                </p>
              </div>
                             <div className="flex-shrink-0">
                 <div className="w-48 h-48 md:w-52 md:h-52 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                   <img
                     src="/profile-image.jpg"
                     alt={t('about.me.name')}
                     className="w-full h-full object-cover rounded-full"
                     onError={(e) => {
                       // Fallback to placeholder if image fails to load
                       const target = e.target as HTMLImageElement;
                       target.style.display = 'none';
                       target.nextElementSibling?.classList.remove('hidden');
                     }}
                   />
                   <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center hidden">
                     <div className="text-center text-blue-600">
                       <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                       </svg>
                       <p className="text-sm font-medium">Karunasagar</p>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">
               {t('about.me.experience.title')}
             </h3>
             <div className="space-y-4">
               <div className="flex items-start">
                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                 <div>
                   <p className="text-gray-700 font-medium">{t('about.me.experience.zelis')}</p>
                 </div>
               </div>
               <div className="flex items-start">
                 <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                 <div>
                   <p className="text-gray-700 font-medium">{t('about.me.experience.exl')}</p>
                 </div>
               </div>
               <div className="flex items-start">
                 <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                 <div>
                   <p className="text-gray-700 font-medium">{t('about.me.experience.miicare')}</p>
                 </div>
               </div>
               <div className="flex items-start">
                 <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                 <div>
                   <p className="text-gray-700 font-medium">{t('about.me.experience.jpmorgan')}</p>
                 </div>
               </div>
             </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">
                 {t('about.me.expertise.title')}
               </h3>
               <div className="space-y-4">
                 <div>
                   <h4 className="font-medium text-gray-900 mb-2">{t('about.me.expertise.ml')}</h4>
                   <p className="text-sm text-gray-700">{t('about.me.expertise.mlDesc')}</p>
                 </div>
                 <div>
                   <h4 className="font-medium text-gray-900 mb-2">{t('about.me.expertise.healthcare')}</h4>
                   <p className="text-sm text-gray-700">{t('about.me.expertise.healthcareDesc')}</p>
                 </div>
                 <div>
                   <h4 className="font-medium text-gray-900 mb-2">{t('about.me.expertise.bigdata')}</h4>
                   <p className="text-sm text-gray-700">{t('about.me.expertise.bigdataDesc')}</p>
                 </div>
                 <div>
                   <h4 className="font-medium text-gray-900 mb-2">{t('about.me.expertise.emerging')}</h4>
                   <p className="text-sm text-gray-700">{t('about.me.expertise.emergingDesc')}</p>
                 </div>
               </div>
             </div>

             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">
                 {t('about.me.global.title')}
               </h3>
               <p className="text-gray-700 leading-relaxed">
                 {t('about.me.global.description')}
               </p>
             </div>
           </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('about.me.achievements.title')}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
                <p className="text-sm text-blue-700">{t('about.me.achievements.automation')}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">30%</div>
                <p className="text-sm text-green-700">{t('about.me.achievements.accuracy')}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">10M+</div>
                <p className="text-sm text-purple-700">{t('about.me.achievements.claims')}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('about.me.recognition.title')}
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {t('about.me.recognition.teamz')}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {t('about.me.recognition.ambassador')}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {t('about.me.recognition.chairperson')}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'lilly',
      label: t('about.tabs.lilly'),
             content: (
         <div className="space-y-6">
           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-4">
               {t('about.lilly.title')}
             </h2>
             <p className="text-gray-700 leading-relaxed">
               {t('about.lilly.motivation.description')}
             </p>
           </div>

           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">
               {t('about.lilly.matters.title')}
             </h3>
             <p className="text-gray-700 leading-relaxed">
               {t('about.lilly.matters.description')}
             </p>
           </div>

           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">
               {t('about.lilly.bring.title')}
             </h3>
             <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-4">
                 <div className="bg-blue-50 p-4 rounded-lg">
                   <h4 className="font-medium text-blue-900 mb-2">{t('about.lilly.bring.learning')}</h4>
                   <p className="text-sm text-blue-700">{t('about.lilly.bring.learningDesc')}</p>
                 </div>
                 <div className="bg-green-50 p-4 rounded-lg">
                   <h4 className="font-medium text-green-900 mb-2">{t('about.lilly.bring.ai')}</h4>
                   <p className="text-sm text-green-700">{t('about.lilly.bring.aiDesc')}</p>
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="bg-purple-50 p-4 rounded-lg">
                   <h4 className="font-medium text-purple-900 mb-2">{t('about.lilly.bring.global')}</h4>
                   <p className="text-sm text-purple-700">{t('about.lilly.bring.globalDesc')}</p>
                 </div>
                 <div className="bg-orange-50 p-4 rounded-lg">
                   <h4 className="font-medium text-orange-900 mb-2">{t('about.lilly.bring.leadership')}</h4>
                   <p className="text-sm text-orange-700">{t('about.lilly.bring.leadershipDesc')}</p>
                 </div>
               </div>
             </div>
           </div>

           <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">
               {t('about.lilly.now.title')}
             </h3>
             <p className="text-gray-700 leading-relaxed">
               {t('about.lilly.now.description')}
             </p>
           </div>

           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">
               {t('about.lilly.vision.title')}
             </h3>
             <p className="text-gray-700 leading-relaxed mb-4">
               {t('about.lilly.vision.description')}
             </p>
             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
               <p className="text-blue-800 font-medium">
                 {t('about.lilly.vision.legacy')}
               </p>
             </div>
           </div>
         </div>
       )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
