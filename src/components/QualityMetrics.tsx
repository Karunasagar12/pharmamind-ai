import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { pharmaApi, QualityMetric } from '../services/pharmaApi'

const QualityMetrics: React.FC = () => {
  const [qualityData, setQualityData] = useState<QualityMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQualityData = async () => {
      try {
        setLoading(true)
        const response = await pharmaApi.getQualityMetrics()
        
        if (response.error) {
          setError(response.error)
        } else if (response.data) {
          setQualityData(response.data.quality_data)
        }
      } catch (err) {
        setError('Failed to load quality metrics')
        console.error('Quality metrics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQualityData()
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchQualityData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Transform quality data for charts
  const chartData = qualityData.map(item => ({
    name: item.name,
    value: item.value,
    target: item.target,
    status: item.value >= item.target ? 'success' : item.value >= item.target * 0.9 ? 'warning' : 'danger'
  }))

  // Calculate pie chart data based on quality status
  const passCount = chartData.filter(item => item.status === 'success').length
  const warningCount = chartData.filter(item => item.status === 'warning').length
  const failCount = chartData.filter(item => item.status === 'danger').length

  const pieData = [
    { name: 'Pass', value: passCount, color: '#22c55e' },
    { name: 'Warning', value: warningCount, color: '#f59e0b' },
    { name: 'Fail', value: failCount, color: '#ef4444' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#22c55e'
      case 'warning': return '#f59e0b'
      case 'danger': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-red-600">
          <h3 className="font-semibold">Error Loading Quality Data</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (qualityData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-gray-600">
          <p>No quality data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quality Details */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Quality Parameters</h4>
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getStatusColor(item.status) }}
              ></div>
              <span className="font-medium text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-gray-900">{item.value}</span>
              <span className="text-sm text-gray-500">Target: {item.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QualityMetrics
