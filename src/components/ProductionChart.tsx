import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { pharmaApi, ProductionChartData } from '../services/pharmaApi'

const ProductionChart: React.FC = () => {
  const [data, setData] = useState<ProductionChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await pharmaApi.getProductionChartData()
        
        if (response.error) {
          setError(response.error)
        } else if (response.data) {
          setData(response.data.data)
        }
      } catch (err) {
        setError('Failed to load production chart data')
        console.error('Production chart error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchChartData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pharma-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading production data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error Loading Chart Data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>No production data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Area 
            type="monotone" 
            dataKey="target" 
            stroke="#e5e7eb" 
            fill="#f9fafb" 
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Area 
            type="monotone" 
            dataKey="production" 
            stroke="#0ea5e9" 
            fill="#0ea5e9" 
            fillOpacity={0.1}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-pharma-500 rounded mr-2"></div>
          <span className="text-gray-600">Production Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
          <span className="text-gray-600">Target</span>
        </div>
      </div>
    </div>
  )
}

export default ProductionChart
