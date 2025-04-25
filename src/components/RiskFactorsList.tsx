import React from 'react';
import { RiskFactor } from '../types';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface RiskFactorsListProps {
  factors: RiskFactor[];
}

const RiskFactorsList: React.FC<RiskFactorsListProps> = ({ factors }) => {
  const getSeverityColor = (score: number) => {
    if (score >= 75) return 'text-red-500 bg-red-500/10 border-red-500/30';
    if (score >= 50) return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    if (score >= 25) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    return 'text-green-500 bg-green-500/10 border-green-500/30';
  };
  
  const getIcon = (score: number) => {
    if (score >= 50) return <AlertTriangle className="h-5 w-5" />;
    if (score >= 25) return <Info className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };
  
  // Sort factors by importance
  const sortedFactors = [...factors].sort((a, b) => b.importance - a.importance);
  
  return (
    <div className="space-y-4">
      {sortedFactors.map((factor, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg border ${getSeverityColor(factor.score)} transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-1 ${getSeverityColor(factor.score).split(' ')[0]}`}>
              {getIcon(factor.score)}
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">{factor.name}</h4>
              <p className="text-gray-300 text-sm">{factor.description}</p>
              
              <div className="mt-3 flex items-center">
                <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      factor.score >= 75 ? 'bg-red-500' :
                      factor.score >= 50 ? 'bg-orange-500' :
                      factor.score >= 25 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-300">
                  {factor.score}/100
                </span>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                Impact: {Math.round(factor.importance * 100)}% of overall score
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {factors.length === 0 && (
        <div className="p-6 rounded-lg border border-green-500/30 bg-green-500/10 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h4 className="text-white font-medium">No Risk Factors Detected</h4>
          <p className="text-gray-300 text-sm mt-1">This address appears to be safe based on our analysis.</p>
        </div>
      )}
    </div>
  );
};

export default RiskFactorsList;