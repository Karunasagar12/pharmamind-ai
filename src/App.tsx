import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Dashboard from './components/Dashboard'
import OEETracking from './components/OEETracking'
import ProductionAnalytics from './components/ProductionAnalytics'
import PredictiveMaintenance from './components/PredictiveMaintenance'
import QualityControl from './components/QualityControl'
import VisionQC from './components/VisionQC'
import About from './components/About'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Router>
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/oee" element={<OEETracking />} />
                <Route path="/analytics" element={<ProductionAnalytics />} />
                <Route path="/maintenance" element={<PredictiveMaintenance />} />
                <Route path="/quality" element={<QualityControl />} />
                <Route path="/visionqc" element={<VisionQC />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </Router>
      </div>
    </LanguageProvider>
  )
}

export default App
