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

interface QualityMetric {
  name: string;
  value: string;
  unit: string;
  status: 'pass' | 'warning' | 'fail';
  target: string;
  trend: 'up' | 'down' | 'stable';
}

interface QualityTest {
  id: string;
  name: string;
  result: string;
  status: 'pass' | 'warning' | 'fail';
  timestamp: string;
  operator: string;
}

const QualityControl: React.FC = () => {
  const { t } = useLanguage()
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([])
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([])
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

  // Generate quality metrics and tests for selected production line
  useEffect(() => {
    const generateQualityData = async () => {
      setLoading(true)
      
      try {
        // Generate production line-specific quality metrics
        const response = await pharmaApi.getRealtimeProductionLineMetrics(selectedLine)
        const metrics = response.metrics
        const qualityScore = parseFloat(metrics.find(m => m.title === 'Quality Score')?.value || '95')
        const drugReleaseRate = parseFloat(metrics.find(m => m.title === 'Drug Release Rate')?.value || '85')
        const apiContent = parseFloat(metrics.find(m => m.title === 'API Content')?.value || '98')
        
        // Base quality metrics on production line performance
        const baseMetrics: QualityMetric[] = [
          {
            name: 'Purity Level',
            value: (qualityScore + Math.random() * 2 - 1).toFixed(2),
            unit: '%',
            status: 'pass',
            target: '≥95%',
            trend: 'up'
          },
          {
            name: 'Dissolution Rate',
            value: (drugReleaseRate + Math.random() * 5 - 2.5).toFixed(1),
            unit: '%',
            status: 'pass',
            target: '≥80%',
            trend: 'stable'
          },
          {
            name: 'Content Uniformity',
            value: (apiContent + Math.random() * 1 - 0.5).toFixed(2),
            unit: '%',
            status: 'pass',
            target: '≥95%',
            trend: 'up'
          },
          {
            name: 'Disintegration Time',
            value: (2 + Math.random() * 3).toFixed(1),
            unit: 'min',
            status: 'pass',
            target: '≤5 min',
            trend: 'down'
          },
          {
            name: 'Friability',
            value: (0.1 + Math.random() * 0.3).toFixed(3),
            unit: '%',
            status: 'pass',
            target: '≤1%',
            trend: 'stable'
          },
          {
            name: 'Hardness',
            value: (8 + Math.random() * 4).toFixed(1),
            unit: 'N',
            status: 'pass',
            target: '≥6 N',
            trend: 'up'
          }
        ]

        // Generate production line-specific quality tests
        const testTypes = [
          'Visual Inspection',
          'Weight Variation',
          'Content Uniformity',
          'Dissolution Test',
          'Disintegration Test',
          'Friability Test',
          'Hardness Test',
          'Moisture Content',
          'pH Measurement',
          'Viscosity Test'
        ]

        const operators = ['Dr. Sarah Chen', 'Dr. Michael Rodriguez', 'Dr. Emily Johnson', 'Dr. David Kim']
        
                 // Generate statuses based on production line quality performance
         const basePassRate = qualityScore / 100
         const statuses: ('pass' | 'warning' | 'fail')[] = testTypes.map((_, index) => {
           const rand = Math.random()
           // Ensure pass rate is between 98-100% for all production lines
           if (rand < 0.98 + (Math.random() * 0.02)) return 'pass'
           else if (rand < 0.995) return 'warning'
           else return 'fail'
         })

        const tests: QualityTest[] = testTypes.map((test, index) => ({
          id: `QC-${selectedLine}-${index + 1}`,
          name: test,
          result: statuses[index] === 'pass' ? 'PASS' : statuses[index] === 'warning' ? 'MARGINAL' : 'FAIL',
          status: statuses[index],
          timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
          operator: operators[Math.floor(Math.random() * operators.length)]
        }))

        setQualityMetrics(baseMetrics)
        setQualityTests(tests)
        setError(null)
      } catch (err) {
        setError('Failed to generate quality data')
        console.error('Quality data error:', err)
      } finally {
        setLoading(false)
      }
    }

    generateQualityData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(generateQualityData, 30000)
    return () => clearInterval(interval)
  }, [selectedLine])

  const handleLineChange = (lineId: number) => {
    setSelectedLine(lineId)
  }

  const translateMetricName = (name: string) => {
    const nameMap: { [key: string]: string } = {
      'Purity Level': t('quality.purity.level'),
      'Dissolution Rate': t('quality.dissolution.rate'),
      'Content Uniformity': t('quality.content.uniformity'),
      'Disintegration Time': t('quality.disintegration.time'),
      'Friability': t('quality.friability'),
      'Hardness': t('quality.hardness')
    }
    return nameMap[name] || name
  }

  const translateTestName = (name: string) => {
    const nameMap: { [key: string]: string } = {
      'Visual Inspection': t('quality.test.visual.inspection'),
      'Weight Variation': t('quality.test.weight.variation'),
      'Content Uniformity': t('quality.test.content.uniformity'),
      'Dissolution Test': t('quality.test.dissolution'),
      'Disintegration Test': t('quality.test.disintegration'),
      'Friability Test': t('quality.test.friability'),
      'Hardness Test': t('quality.test.hardness'),
      'Moisture Content': t('quality.test.moisture.content'),
      'pH Measurement': t('quality.test.ph.measurement'),
      'Viscosity Test': t('quality.test.viscosity')
    }
    return nameMap[name] || name
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

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'fail': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '→'
      default: return '→'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
             <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">{t('quality.title')}</h1>
           <p className="text-gray-600 mt-1">{t('quality.subtitle')}</p>
         </div>
        <div className="flex items-center space-x-3">
          <div className="status-indicator status-success">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {t('quality.status.active')}
          </div>
          <div className="text-sm text-gray-500">
            {t('dashboard.last.updated')}: {new Date().toLocaleTimeString()}
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

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">✓</span>
            </div>
                         <div>
               <p className="text-sm text-green-600">{t('quality.pass.rate')}</p>
                               <p className="text-2xl font-bold text-green-900">
                  {loading ? '...' : error ? 'N/A' : (qualityMetrics.length > 0 ? (qualityMetrics.filter(m => m.status === 'pass').length / qualityMetrics.length * 100).toFixed(1) : (98 + Math.random() * 2).toFixed(1)) + '%'}
                </p>
             </div>
          </div>
        </div>
        
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">🧪</span>
            </div>
                         <div>
               <p className="text-sm text-blue-600">{t('quality.tests.today')}</p>
               <p className="text-2xl font-bold text-blue-900">{20 + selectedLine * 2}</p>
             </div>
          </div>
        </div>
        
        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white text-xl">⚡</span>
            </div>
                         <div>
               <p className="text-sm text-purple-600">{t('quality.avg.test.time')}</p>
               <p className="text-2xl font-bold text-purple-900">{(2.1 + selectedLine * 0.2).toFixed(1)}h</p>
             </div>
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('quality.metrics.title')} - {productionLines.find(line => line.id === selectedLine) ? translateProductionLineName(productionLines.find(line => line.id === selectedLine)!.name) : t('dashboard.production.line')}
        </h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600">
            <h3 className="font-semibold">Error Loading Quality Data</h3>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{translateMetricName(metric.name)}</h4>
                  <span className="text-sm">{getTrendIcon(metric.trend)}</span>
                </div>
                <div className="flex items-end space-x-2 mb-1">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                <p className="text-xs text-gray-600">{t('quality.target')}: {metric.target}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quality Tests Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('quality.tests.title')} - {productionLines.find(line => line.id === selectedLine) ? translateProductionLineName(productionLines.find(line => line.id === selectedLine)!.name) : t('dashboard.production.line')}
        </h3>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="text-red-600">
            <h3 className="font-semibold">Error Loading Test Data</h3>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quality.test.id')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quality.test.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quality.test.result')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quality.test.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quality.test.timestamp')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quality.test.operator')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qualityTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {test.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {translateTestName(test.name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {test.result === 'PASS' ? t('quality.test.pass') : test.result === 'MARGINAL' ? t('quality.test.marginal') : t('quality.test.fail')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(test.status)}`}>
                        {test.status === 'pass' ? t('quality.test.pass') : test.status === 'warning' ? t('quality.test.marginal') : t('quality.test.fail')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.operator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quality Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quality.insights.title')}</h3>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-green-800">{t('quality.insights.excellent')}</h4>
                <p className="text-sm text-green-700 mt-1">
                  {t('quality.insights.excellent.desc')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-800">{t('quality.insights.recommendation')}</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {t('quality.insights.recommendation.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QualityControl
