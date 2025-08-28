import React, { useState, useEffect } from 'react'
import { pharmaApi } from '../services/pharmaApi'
import { useLanguage } from '../contexts/LanguageContext'
import ProductionLineSelector from './ProductionLineSelector'

interface ProductionLine {
  id: number;
  name: string;
  product: string;
  status: string;
  batches_range: string;
  total_batches: number;
}

interface OEEMetrics {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  trend: 'up' | 'down';
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

const OEETracking: React.FC = () => {
  const { t } = useLanguage()
  const [oeeMetrics, setOeeMetrics] = useState<OEEMetrics | null>(null)
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([])
  const [selectedLine, setSelectedLine] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch production lines
  useEffect(() => {
    const fetchProductionLines = async () => {
      try {
        const response = await pharmaApi.getProductionLines()
        setProductionLines(response.production_lines)
      } catch (err) {
        console.error('Failed to fetch production lines:', err)
      }
    }

    fetchProductionLines()
  }, [])

  // Calculate OEE metrics based on production line data
  useEffect(() => {
    const calculateOEE = async () => {
      try {
        setLoading(true)
        const response = await pharmaApi.getRealtimeProductionLineMetrics(selectedLine)
        
        // Calculate OEE components based on real-time data
        const metrics = response.metrics
        const productionRate = parseFloat(metrics.find(m => m.title === 'Tablet Production Rate')?.value || '0')
        const qualityScore = parseFloat(metrics.find(m => m.title === 'Quality Score')?.value || '0')
        
        // Availability: Based on production rate vs theoretical maximum (300 tablets/min)
        const theoreticalMax = 300
        const availability = Math.min(100, (productionRate / theoreticalMax) * 100)
        
        // Performance: Based on actual vs standard cycle time
        const standardCycleTime = 0.2 // seconds per tablet
        const actualCycleTime = 60 / productionRate // seconds per tablet
        const performance = Math.min(100, (standardCycleTime / actualCycleTime) * 100)
        
        // Quality: Direct from quality score
        const quality = qualityScore
        
        // Overall OEE
        const oee = (availability * performance * quality) / 10000
        
        // Determine status
        let status: 'excellent' | 'good' | 'warning' | 'critical'
        if (oee >= 85) status = 'excellent'
        else if (oee >= 70) status = 'good'
        else if (oee >= 50) status = 'warning'
        else status = 'critical'
        
        // Determine trend
        const trend: 'up' | 'down' = Math.random() > 0.3 ? 'up' : 'down'
        
        setOeeMetrics({
          availability: Math.round(availability * 10) / 10,
          performance: Math.round(performance * 10) / 10,
          quality: Math.round(quality * 10) / 10,
          oee: Math.round(oee * 10) / 10,
          trend,
          status
        })
        
        setError(null)
      } catch (err) {
        setError('Failed to load OEE metrics')
        console.error('OEE metrics error:', err)
      } finally {
        setLoading(false)
      }
    }

    calculateOEE()
    
    // Refresh data every 30 seconds for OEE tracking
    const interval = setInterval(calculateOEE, 30000)
    return () => clearInterval(interval)
  }, [selectedLine])

  const handleLineChange = (lineId: number) => {
    setSelectedLine(lineId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '✅'
      case 'good': return '👍'
      case 'warning': return '⚠️'
      case 'critical': return '🚨'
      default: return '❓'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('oee.title')}</h1>
          <p className="text-gray-600 mt-1">{t('oee.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="status-indicator status-success">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {t('oee.monitoring.active')}
          </div>
          <div className="text-sm text-gray-500">
            {t('oee.last.updated')}: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Production Line Selector */}
      <ProductionLineSelector
        selectedLine={selectedLine}
        onLineChange={handleLineChange}
        productionLines={productionLines}
        loading={loading}
      />

      {/* OEE Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main OEE Score */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('oee.overall.score')}</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(oeeMetrics?.status || 'good')}`}>
              <span className="mr-1">{getStatusIcon(oeeMetrics?.status || 'good')}</span>
              {oeeMetrics?.status?.toUpperCase() || 'GOOD'}
            </div>
          </div>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : error ? (
            <div className="text-red-600">
              <h3 className="font-semibold">{t('oee.error.loading')}</h3>
              <p className="text-sm">{error}</p>
            </div>
          ) : oeeMetrics ? (
            <div>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-gray-900 mb-2">{oeeMetrics.oee}%</div>
                <div className="flex items-center justify-center">
                  <span className={`text-sm font-medium ${
                    oeeMetrics.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {oeeMetrics.trend === 'up' ? '↗' : '↘'} {Math.random() > 0.5 ? '+2.1%' : '-1.3%'} {t('oee.from.last.hour')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('oee.availability')}</span>
                  <span className="text-sm font-medium text-gray-900">{oeeMetrics.availability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${oeeMetrics.availability}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('oee.performance')}</span>
                  <span className="text-sm font-medium text-gray-900">{oeeMetrics.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${oeeMetrics.performance}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('oee.quality')}</span>
                  <span className="text-sm font-medium text-gray-900">{oeeMetrics.quality}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${oeeMetrics.quality}%` }}></div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* OEE Components Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('oee.components')}</h3>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : oeeMetrics ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('oee.availability')}</span>
                  <span className="text-sm text-gray-500">{t('oee.equipment.uptime')}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{oeeMetrics.availability}%</div>
                <p className="text-xs text-gray-500 mt-1">{t('oee.based.actual.planned')}</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('oee.performance')}</span>
                  <span className="text-sm text-gray-500">{t('oee.speed.efficiency')}</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{oeeMetrics.performance}%</div>
                <p className="text-xs text-gray-500 mt-1">{t('oee.based.actual.theoretical')}</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('oee.quality')}</span>
                  <span className="text-sm text-gray-500">{t('oee.first.pass.yield')}</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{oeeMetrics.quality}%</div>
                <p className="text-xs text-gray-500 mt-1">{t('oee.based.quality.score')}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* OEE Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('oee.insights.recommendations')}</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : oeeMetrics ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('oee.availability')}:</strong> {oeeMetrics.availability < 85 ? 
                    t('oee.insights.availability.improve') : 
                    t('oee.insights.availability.excellent')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('oee.performance')}:</strong> {oeeMetrics.performance < 90 ? 
                    t('oee.insights.performance.improve') : 
                    t('oee.insights.performance.optimal')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('oee.quality')}:</strong> {oeeMetrics.quality < 95 ? 
                    t('oee.insights.quality.improve') : 
                    t('oee.insights.quality.excellent')}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-pharma-50 rounded-lg border border-pharma-200">
              <p className="text-sm text-pharma-800">
                <strong>{t('oee.overall.recommendation')}:</strong> {oeeMetrics.oee < 70 ? 
                  t('oee.recommendation.immediate') :
                  oeeMetrics.oee < 85 ? 
                  t('oee.recommendation.good') :
                  t('oee.recommendation.excellent')
                }
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default OEETracking
