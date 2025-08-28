import React, { useState, useEffect } from 'react'
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { pharmaApi, BatchData } from '../services/pharmaApi'

const BatchTable: React.FC = () => {
  const [batches, setBatches] = useState<BatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true)
        const response = await pharmaApi.getBatches(10)
        
        if (response.error) {
          setError(response.error)
        } else if (response.data) {
          setBatches(response.data.batches)
        }
      } catch (err) {
        setError('Failed to load batch data')
        console.error('Batch table error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBatches()
    
    // Refresh data every 45 seconds
    const interval = setInterval(fetchBatches, 45000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-pharma-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <XCircle className="w-4 h-4 text-danger-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'status-info'
      case 'completed':
        return 'status-success'
      case 'warning':
        return 'status-warning'
      case 'pending':
        return 'status-indicator bg-gray-100 text-gray-800'
      default:
        return 'status-danger'
    }
  }

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="overflow-x-auto">
        <div className="text-center py-8 text-red-600">
          <h3 className="font-semibold">Error Loading Batch Data</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (batches.length === 0) {
    return (
      <div className="overflow-x-auto">
        <div className="text-center py-8 text-gray-600">
          <p>No batch data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Batch ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quality Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Production Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {batches.map((batch) => (
            <tr key={batch.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{batch.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{batch.product}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(batch.status)}
                  <span className={`status-indicator ${getStatusColor(batch.status)}`}>
                    {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-pharma-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${batch.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{batch.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{batch.startTime}</div>
                <div className="text-sm text-gray-500">Est. end: {batch.estimatedEnd}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {batch.quality ? (
                  <div className="text-sm font-medium text-gray-900">{batch.quality}%</div>
                ) : (
                  <div className="text-sm text-gray-500">-</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {batch.production ? (
                  <div className="text-sm font-medium text-gray-900">{batch.production} tablets/min</div>
                ) : (
                  <div className="text-sm text-gray-500">-</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BatchTable
