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

interface MaintenanceAlert {
  id: string;
  equipment: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  severity: 'low' | 'medium' | 'high';
  predictedDate: string;
  confidence: number;
  status: 'active' | 'resolved' | 'scheduled';
}

interface EquipmentHealth {
  name: string;
  health: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastMaintenance: string;
  nextMaintenance: string;
  uptime: number;
  performance: number;
}

const PredictiveMaintenance: React.FC = () => {
  const { t } = useLanguage()
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([])
  const [equipmentHealth, setEquipmentHealth] = useState<EquipmentHealth[]>([])
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

  // Generate maintenance data
  useEffect(() => {
    const generateMaintenanceData = async () => {
      try {
        setLoading(true)
        const response = await pharmaApi.getRealtimeProductionLineMetrics(selectedLine)
        
        // Generate production line-specific equipment health data
        const metrics = response.metrics
        const productionRate = parseFloat(metrics.find(m => m.title === 'Tablet Production Rate')?.value || '200')
        const qualityScore = parseFloat(metrics.find(m => m.title === 'Quality Score')?.value || '95')
        
        // Equipment varies by production line
        const equipment = [
          'Tablet Press',
          'Granulation Unit',
          'Coating Machine',
          'Packaging Line',
          'Compression Unit',
          'Quality Control System'
        ]
        
        const healthData: EquipmentHealth[] = equipment.map((name, index) => {
          // Base health on production line performance
          const baseHealth = Math.min(100, Math.max(60, 
            (productionRate / 250) * 40 + (qualityScore / 100) * 40 + 20
          ))
          const health = baseHealth + Math.random() * 10 - (index * 1.5)
          let status: 'excellent' | 'good' | 'warning' | 'critical'
          if (health >= 90) status = 'excellent'
          else if (health >= 75) status = 'good'
          else if (health >= 60) status = 'warning'
          else status = 'critical'
          
          const lastMaintenance = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          const nextMaintenance = new Date(lastMaintenance.getTime() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000)
          
          return {
            name,
            health: Math.round(health * 10) / 10,
            status,
            lastMaintenance: lastMaintenance.toLocaleDateString(),
            nextMaintenance: nextMaintenance.toLocaleDateString(),
            uptime: 85 + Math.random() * 15,
            performance: 80 + Math.random() * 20
          }
        })
        
        // Generate maintenance alerts
        const alertTypes = [
          'Vibration levels increasing',
          'Temperature deviation detected',
          'Pressure fluctuations observed',
          'Wear indicators approaching threshold',
          'Lubrication system needs attention',
          'Motor efficiency declining'
        ]
        
        const alerts: MaintenanceAlert[] = []
        const numAlerts = Math.floor(Math.random() * 4) + 1
        
        for (let i = 0; i < numAlerts; i++) {
          const type = Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'warning' : 'info'
          const severity = type === 'critical' ? 'high' : type === 'warning' ? 'medium' : 'low'
          const predictedDate = new Date(Date.now() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000)
          
          alerts.push({
            id: `alert-${i + 1}`,
            equipment: equipment[Math.floor(Math.random() * equipment.length)],
            type,
            message: alertTypes[Math.floor(Math.random() * alertTypes.length)],
            severity,
            predictedDate: predictedDate.toLocaleDateString(),
            confidence: Math.round((70 + Math.random() * 25) * 10) / 10,
            status: Math.random() > 0.8 ? 'scheduled' : 'active'
          })
        }
        
        setEquipmentHealth(healthData)
        setMaintenanceAlerts(alerts)
        setError(null)
      } catch (err) {
        setError('Failed to load maintenance data')
        console.error('Maintenance error:', err)
      } finally {
        setLoading(false)
      }
    }

    generateMaintenanceData()
    
    // Refresh data every 60 seconds for maintenance monitoring
    const interval = setInterval(generateMaintenanceData, 60000)
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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '❓'
    }
  }

  const translateEquipmentName = (name: string) => {
    const nameMap: { [key: string]: string } = {
      'Tablet Press': t('maintenance.equipment.tablet.press'),
      'Granulation Unit': t('maintenance.equipment.granulation.unit'),
      'Coating Machine': t('maintenance.equipment.coating.machine'),
      'Packaging Line': t('maintenance.equipment.packaging.line'),
      'Compression Unit': t('maintenance.equipment.compression.unit'),
      'Quality Control System': t('maintenance.equipment.qc.system')
    }
    return nameMap[name] || name
  }

  const translateAlertMessage = (message: string) => {
    const messageMap: { [key: string]: string } = {
      'Vibration levels increasing': t('maintenance.alert.vibration'),
      'Temperature deviation detected': t('maintenance.alert.temperature'),
      'Pressure fluctuations observed': t('maintenance.alert.pressure'),
      'Wear indicators approaching threshold': t('maintenance.alert.wear'),
      'Lubrication system needs attention': t('maintenance.alert.lubrication'),
      'Motor efficiency declining': t('maintenance.alert.motor')
    }
    return messageMap[message] || message
  }

  const translateSeverity = (severity: string) => {
    const severityMap: { [key: string]: string } = {
      'low': t('maintenance.severity.low'),
      'medium': t('maintenance.severity.medium'),
      'high': t('maintenance.severity.high')
    }
    return severityMap[severity] || severity.toUpperCase()
  }

  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': t('maintenance.alert.status.active'),
      'scheduled': t('maintenance.alert.status.scheduled'),
      'resolved': t('maintenance.alert.status.resolved')
    }
    return statusMap[status] || status.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('maintenance.title')}</h1>
          <p className="text-gray-600 mt-1">{t('maintenance.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="status-indicator status-success">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {t('maintenance.monitoring.active')}
          </div>
          <div className="text-sm text-gray-500">
            {t('maintenance.last.updated')}: {new Date().toLocaleTimeString()}
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

      {/* Maintenance Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('maintenance.alerts.title')}</h3>
          <div className="text-sm text-gray-500">
            {maintenanceAlerts.filter(alert => alert.status === 'active').length} {t('maintenance.active.alerts')}
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600">
            <h3 className="font-semibold">{t('maintenance.error.loading')}</h3>
            <p className="text-sm">{error}</p>
          </div>
        ) : maintenanceAlerts.length > 0 ? (
          <div className="space-y-3">
            {maintenanceAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{translateEquipmentName(alert.equipment)}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertColor(alert.type)}`}>
                          {translateSeverity(alert.severity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{translateAlertMessage(alert.message)}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{t('maintenance.predicted')}: {alert.predictedDate}</span>
                        <span>{t('maintenance.confidence')}: {alert.confidence}%</span>
                        <span className={`px-2 py-1 rounded ${
                          alert.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {translateStatus(alert.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    {t('maintenance.schedule')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{t('maintenance.no.active.alerts')}</h3>
            <p className="text-sm text-gray-500">{t('maintenance.no.alerts.desc')}</p>
          </div>
        )}
      </div>

              {/* Equipment Health Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equipment Health Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('maintenance.equipment.health.status')}</h3>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {equipmentHealth.map((equipment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{translateEquipmentName(equipment.name)}</h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(equipment.status)}`}>
                      <span className="mr-1">{getStatusIcon(equipment.status)}</span>
                      {equipment.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('maintenance.health.score')}</span>
                      <span className="text-sm font-medium text-gray-900">{equipment.health}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          equipment.status === 'excellent' ? 'bg-green-500' :
                          equipment.status === 'good' ? 'bg-blue-500' :
                          equipment.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${equipment.health}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">{t('maintenance.uptime')}:</span>
                        <span className="ml-1 font-medium">{equipment.uptime.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">{t('maintenance.performance')}:</span>
                        <span className="ml-1 font-medium">{equipment.performance.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Schedule */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('maintenance.schedule.title')}</h3>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {equipmentHealth
                .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
                .slice(0, 5)
                .map((equipment, index) => {
                  const daysUntil = Math.ceil((new Date(equipment.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  const isUrgent = daysUntil <= 7
                  const isSoon = daysUntil <= 30
                  
                  return (
                    <div key={index} className={`p-3 border rounded-lg ${
                      isUrgent ? 'border-red-200 bg-red-50' :
                      isSoon ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{translateEquipmentName(equipment.name)}</h4>
                        <span className={`text-sm font-medium ${
                          isUrgent ? 'text-red-600' :
                          isSoon ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {daysUntil} {t('maintenance.days')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{t('maintenance.next')}: {equipment.nextMaintenance}</div>
                        <div>{t('maintenance.last')}: {equipment.lastMaintenance}</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('maintenance.insights.title')}</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('maintenance.insights.equipment.health')}:</strong> {equipmentHealth.filter(e => e.status === 'excellent' || e.status === 'good').length} {t('maintenance.insights.equipment.health.desc')} {equipmentHealth.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('maintenance.insights.schedule')}:</strong> {equipmentHealth.filter(e => {
                    const daysUntil = Math.ceil((new Date(e.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    return daysUntil <= 30
                  }).length} {t('maintenance.insights.schedule.desc')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>{t('maintenance.insights.alerts')}:</strong> {maintenanceAlerts.length} {t('maintenance.insights.alerts.desc')} {maintenanceAlerts.filter(a => a.type === 'critical').length}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-pharma-50 rounded-lg border border-pharma-200">
              <p className="text-sm text-pharma-800">
                <strong>{t('maintenance.recommendation')}:</strong> {maintenanceAlerts.filter(a => a.type === 'critical').length > 0 ? 
                  t('maintenance.recommendation.immediate') :
                  equipmentHealth.filter(e => e.status === 'warning' || e.status === 'critical').length > 0 ?
                  t('maintenance.recommendation.monitor') :
                  t('maintenance.recommendation.continue')
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictiveMaintenance
