import React, { ReactNode } from 'react';
import { MetricItem } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  metrics: MetricItem[];
  icon?: ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, metrics, icon }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">{title}</h3>
          {icon && <div className="text-blue-400">{icon}</div>}
        </div>
        
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <div className="flex items-center">
                <span className="font-medium">{metric.value}</span>
                
                {metric.change !== undefined && (
                  <div className={`flex items-center ml-2 text-xs ${
                    metric.status === 'positive' ? 'text-green-500' :
                    metric.status === 'negative' ? 'text-red-500' :
                    'text-gray-400'
                  }`}>
                    {metric.status === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {metric.status === 'negative' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {metric.status === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;