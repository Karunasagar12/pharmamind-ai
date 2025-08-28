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

interface DashboardMetrics {
  title: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage()
  const [metrics, setMetrics] = useState<DashboardMetrics[]>([])
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

  // Fetch metrics for selected production line (real-time)
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const response = await pharmaApi.getProductionLineMetrics(selectedLine)
        setMetrics(response.metrics)
        setError(null)
      } catch (err) {
        setError('Failed to load production line metrics')
        console.error('Production line metrics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    
    // Refresh data every 10 seconds for real-time simulation
    const interval = setInterval(fetchMetrics, 10000)
    return () => clearInterval(interval)
  }, [selectedLine])

  const handleLineChange = (lineId: number) => {
    setSelectedLine(lineId)
  }

  const translateMetricTitle = (title: string) => {
    const titleMap: { [key: string]: string } = {
      'Tablet Production Rate': t('dashboard.production.rate'),
      'Quality Score': t('dashboard.quality.score'),
      'Temperature': t('dashboard.temperature'),
      'Pressure': t('dashboard.pressure'),
      'Humidity': t('dashboard.humidity'),
      'Vibration': t('dashboard.vibration'),
      'pH Level': t('dashboard.ph'),
      'Dissolution Rate': t('dashboard.dissolution'),
      'Hardness': t('dashboard.hardness'),
      'Friability': t('dashboard.friability'),
      'Content Uniformity': t('dashboard.content.uniformity'),
      'API Content': t('dashboard.api.content'),
      'Drug Release Rate': t('dashboard.drug.release')
    }
    return titleMap[title] || title
  }

  const translateProductionLineName = (name: string) => {
    const nameMap: { [key: string]: string } = {
      'Production Line A': t('production.line.a'),
      'Production Line B': t('production.line.b'),
      'Production Line C': t('production.line.c'),
      'Production Line D': t('production.line.d')
    }
    return nameMap[name] || name
  }

  const translateProductName = (product: string) => {
    const productMap: { [key: string]: string } = {
      'Cholesterol Drug A': t('product.cholesterol.a'),
      'Cholesterol Drug B': t('product.cholesterol.b'),
      'Cholesterol Drug C': t('product.cholesterol.c'),
      'Cholesterol Drug D': t('product.cholesterol.d')
    }
    return productMap[product] || product
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="status-indicator status-success">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {t('dashboard.realtime.active')}
          </div>
          <div className="text-sm text-gray-500">
            {t('dashboard.last.updated')}: {new Date().toLocaleTimeString()}
          </div>
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {t('dashboard.refresh.10s')}
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

      {/* Production Line Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
                         <h2 className="text-xl font-semibold text-gray-900">
               {productionLines.find(line => line.id === selectedLine) ? translateProductionLineName(productionLines.find(line => line.id === selectedLine)!.name) : t('dashboard.production.line')}
             </h2>
             <p className="text-gray-600 mt-1">
               {productionLines.find(line => line.id === selectedLine) ? translateProductName(productionLines.find(line => line.id === selectedLine)!.product) : t('loading')}
             </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">{t('dashboard.total.batches')}</p>
              <p className="text-lg font-semibold text-gray-900">
                {productionLines.find(line => line.id === selectedLine)?.total_batches || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{t('dashboard.status')}</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900">{t('dashboard.running')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading state
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-4 card bg-red-50 border-red-200">
            <div className="text-red-600">
              <h3 className="font-semibold">{t('dashboard.error.loading.data')}</h3>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2">{t('dashboard.error.api.running')}</p>
            </div>
          </div>
        ) : (
          // Data loaded - Production line metrics display
          metrics.map((metric, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{translateMetricTitle(metric.title)}</h3>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500 mb-1">{metric.unit}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Real-time Status Overview */}
      <div className="card">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
           {t('dashboard.realtime.status.overview')} - {productionLines.find(line => line.id === selectedLine) ? translateProductionLineName(productionLines.find(line => line.id === selectedLine)!.name) : t('dashboard.production.line')}
         </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-green-800">{t('dashboard.system.status')}</p>
                <p className="text-lg font-bold text-green-900">{t('dashboard.operational')}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-blue-800">{t('dashboard.data.quality')}</p>
                <p className="text-lg font-bold text-blue-900">{t('dashboard.excellent')}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-purple-800">{t('dashboard.connection')}</p>
                <p className="text-lg font-bold text-purple-900">{t('dashboard.stable')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
