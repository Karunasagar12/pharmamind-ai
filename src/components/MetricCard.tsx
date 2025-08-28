import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  unit: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color: 'pharma' | 'success' | 'warning' | 'danger'
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  icon: Icon,
  color
}) => {
  const colorClasses = {
    pharma: 'from-pharma-500 to-pharma-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-danger-500 to-danger-600'
  }

  const bgColorClasses = {
    pharma: 'bg-pharma-50',
    success: 'bg-success-50',
    warning: 'bg-warning-50',
    danger: 'bg-danger-50'
  }

  return (
    <div className={`metric-card ${bgColorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline mt-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          </div>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last hour</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default MetricCard
