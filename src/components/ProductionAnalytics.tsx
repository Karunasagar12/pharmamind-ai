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

interface AnalyticsData {
  productionTrend: {
    labels: string[];
    data: number[];
  };
  qualityTrend: {
    labels: string[];
    data: number[];
  };
  efficiencyMetrics: {
    uptime: number;
    throughput: number;
    yield: number;
    cycleTime: number;
  };
  kpis: {
    name: string;
    value: number;
    target: number;
    unit: string;
    status: 'on-target' | 'above-target' | 'below-target';
  }[];
}

const ProductionAnalytics: React.FC = () => {
  const { t } = useLanguage()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([])
  const [selectedLine, setSelectedLine] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')

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

  // Generate analytics data
  useEffect(() => {
    const generateAnalytics = async () => {
      try {
        setLoading(true)
        const response = await pharmaApi.getRealtimeProductionLineMetrics(selectedLine)
        const metrics = response.metrics
        
        // Generate time series data based on selected time range
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720
        const labels = []
        const productionData = []
        const qualityData = []
        
        for (let i = 0; i < hours; i++) {
          if (timeRange === '24h') {
            labels.push(`${i}:00`)
          } else if (timeRange === '7d') {
            const day = Math.floor(i / 24) + 1
            const hour = i % 24
            labels.push(`Day ${day} ${hour}:00`)
          } else {
            const day = Math.floor(i / 24) + 1
            labels.push(`Day ${day}`)
          }
          
          // Generate production line-specific data based on real-time metrics
          const productionRate = parseFloat(metrics.find(m => m.title === 'Tablet Production Rate')?.value || '200')
          const qualityScore = parseFloat(metrics.find(m => m.title === 'Quality Score')?.value || '95')
        
          // Generate realistic production data with trends based on actual production rate
          const baseProduction = productionRate + Math.sin(i * 0.1) * (productionRate * 0.2) + Math.random() * (productionRate * 0.1)
          productionData.push(Math.round(baseProduction))
          
          // Generate quality data with some variation based on actual quality score
          const baseQuality = qualityScore + Math.sin(i * 0.05) * 2 + Math.random() * 1
          qualityData.push(Math.round(baseQuality * 10) / 10)
        }
        
        // Calculate efficiency metrics
        const avgProduction = productionData.reduce((a, b) => a + b, 0) / productionData.length
        const avgQuality = qualityData.reduce((a, b) => a + b, 0) / qualityData.length
        
        const efficiencyMetrics = {
          uptime: 85 + Math.random() * 10,
          throughput: avgProduction,
          yield: avgQuality,
          cycleTime: 60 / avgProduction
        }
        
        // Generate KPIs
        const kpis = [
          {
            name: 'Production Rate',
            value: avgProduction,
            target: 250,
            unit: 'tablets/min',
            status: avgProduction >= 250 ? 'above-target' : avgProduction >= 200 ? 'on-target' : 'below-target'
          },
          {
            name: 'Quality Score',
            value: avgQuality,
            target: 95,
            unit: '%',
            status: avgQuality >= 95 ? 'above-target' : avgQuality >= 90 ? 'on-target' : 'below-target'
          },
          {
            name: 'Uptime',
            value: efficiencyMetrics.uptime,
            target: 90,
            unit: '%',
            status: efficiencyMetrics.uptime >= 90 ? 'above-target' : efficiencyMetrics.uptime >= 85 ? 'on-target' : 'below-target'
          },
          {
            name: 'Cycle Time',
            value: efficiencyMetrics.cycleTime,
            target: 0.24,
            unit: 'sec/tablet',
            status: efficiencyMetrics.cycleTime <= 0.24 ? 'above-target' : efficiencyMetrics.cycleTime <= 0.3 ? 'on-target' : 'below-target'
          }
        ]
        
        setAnalyticsData({
          productionTrend: { labels, data: productionData },
          qualityTrend: { labels, data: qualityData },
          efficiencyMetrics,
          kpis
        })
        
        setError(null)
      } catch (err) {
        setError('Failed to load analytics data')
        console.error('Analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    generateAnalytics()
  }, [selectedLine, timeRange])

  const handleLineChange = (lineId: number) => {
    setSelectedLine(lineId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above-target': return 'text-green-600 bg-green-50 border-green-200'
      case 'on-target': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'below-target': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'above-target': return '✅'
      case 'on-target': return '🎯'
      case 'below-target': return '⚠️'
      default: return '❓'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
                 <div>
           <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>
           <p className="text-gray-600 mt-1">{t('analytics.subtitle')}</p>
         </div>
        <div className="flex items-center space-x-3">
                     <div className="status-indicator status-success">
             <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
             {t('analytics.status.active')}
           </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
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

      {/* Time Range Selector */}
             <div className="flex items-center space-x-4">
         <span className="text-sm font-medium text-gray-700">{t('analytics.time.range')}:</span>
        <div className="flex space-x-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-pharma-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-4 card bg-red-50 border-red-200">
            <div className="text-red-600">
              <h3 className="font-semibold">{t('analytics.error.loading')}</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : analyticsData ? (
          analyticsData.kpis.map((kpi, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">{kpi.name}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(kpi.status)}`}>
                  <span className="mr-1">{getStatusIcon(kpi.status)}</span>
                  {kpi.status === 'above-target' ? t('analytics.status.above.target') :
                   kpi.status === 'on-target' ? t('analytics.status.on.target') :
                   t('analytics.status.below.target')}
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-gray-900">{kpi.value.toFixed(1)}</span>
                <span className="text-sm text-gray-500 mb-1">{kpi.unit}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{t('analytics.target')}: {kpi.target}</span>
                  <span>{((kpi.value / kpi.target) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      kpi.status === 'above-target' ? 'bg-green-500' :
                      kpi.status === 'on-target' ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>

      

      {/* Efficiency Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.efficiency.title')}</h3>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : analyticsData ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.efficiencyMetrics.uptime.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Uptime</div>
              <div className="text-xs text-gray-500 mt-1">Equipment availability</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analyticsData.efficiencyMetrics.throughput.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Throughput</div>
              <div className="text-xs text-gray-500 mt-1">Tablets per minute</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analyticsData.efficiencyMetrics.yield.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Yield</div>
              <div className="text-xs text-gray-500 mt-1">First-pass yield</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analyticsData.efficiencyMetrics.cycleTime.toFixed(2)}s</div>
              <div className="text-sm text-gray-600">Cycle Time</div>
              <div className="text-xs text-gray-500 mt-1">Seconds per tablet</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.insights.title')}</h3>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('analytics.production.trend')}:</strong> {analyticsData.efficiencyMetrics.throughput > 220 ? 
                    t('analytics.production.above.target') : 
                    t('analytics.production.needs.improvement')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('analytics.quality.performance')}:</strong> {analyticsData.efficiencyMetrics.yield > 95 ? 
                    t('analytics.quality.excellent') : 
                    t('analytics.quality.needs.attention')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('analytics.efficiency.analysis')}:</strong> {analyticsData.efficiencyMetrics.uptime > 90 ? 
                    t('analytics.uptime.high') : 
                    t('analytics.uptime.below.target')}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-pharma-50 rounded-lg border border-pharma-200">
              <p className="text-sm text-pharma-800">
                <strong>{t('analytics.recommendation')}:</strong> {analyticsData.efficiencyMetrics.throughput > 220 && analyticsData.efficiencyMetrics.yield > 95 ? 
                  t('analytics.excellent.performance') :
                  t('analytics.improvement.strategies')
                }
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductionAnalytics
