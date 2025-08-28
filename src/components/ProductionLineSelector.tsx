import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductionLine {
  id: number;
  name: string;
  product: string;
  status: string;
  batches_range: string;
  total_batches: number;
}

interface ProductionLineSelectorProps {
  selectedLine: number;
  onLineChange: (lineId: number) => void;
  productionLines: ProductionLine[];
  loading?: boolean;
}

const ProductionLineSelector: React.FC<ProductionLineSelectorProps> = ({
  selectedLine,
  onLineChange,
  productionLines,
  loading = false
}) => {
  const { t } = useLanguage();

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return t('dashboard.running');
      case 'stopped':
        return t('dashboard.status.stopped');
      case 'maintenance':
        return t('dashboard.status.maintenance');
      default:
        return t('dashboard.status.unknown');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('production.lines.title')}</h2>
        {loading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            {t('loading')}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productionLines.map((line) => (
          <div
            key={line.id}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedLine === line.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => onLineChange(line.id)}
          >
            {/* Status indicator */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{translateProductionLineName(line.name)}</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(line.status)} mr-2`}></div>
                <span className="text-xs text-gray-600">{getStatusText(line.status)}</span>
              </div>
            </div>
            
            {/* Product info */}
            <div className="mb-2">
              <p className="text-sm text-gray-700 font-medium">{translateProductName(line.product)}</p>
              <p className="text-xs text-gray-500">{t('production.lines.batches')}: {line.batches_range}</p>
            </div>
            
            {/* Batch count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {line.total_batches} {t('production.lines.total.batches')}
              </span>
              {selectedLine === line.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            
            {/* Selected indicator */}
            {selectedLine === line.id && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {t('production.lines.selected')}: <span className="font-medium text-gray-900">
              {productionLines.find(line => line.id === selectedLine) ? translateProductionLineName(productionLines.find(line => line.id === selectedLine)!.name) : t('production.lines.none')}
            </span>
          </span>
          <span>
            {t('production.lines.total')}: <span className="font-medium text-gray-900">
              {productionLines.reduce((sum, line) => sum + line.total_batches, 0)} {t('production.lines.batches')}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductionLineSelector;
