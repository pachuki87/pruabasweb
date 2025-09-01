import React from 'react';
import { CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  status: 'not_started' | 'in_progress' | 'completed';
  percentage?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  status,
  percentage = 0,
  size = 'md',
  showText = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <CheckCircle 
            className={`${sizeClasses[size]} text-green-500`}
          />
        );
      case 'in_progress':
        return (
          <Clock 
            className={`${sizeClasses[size]} text-blue-500`}
          />
        );
      default:
        return (
          <PlayCircle 
            className={`${sizeClasses[size]} text-gray-400`}
          />
        );
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in_progress':
        return `En progreso ${percentage > 0 ? `(${percentage}%)` : ''}`;
      default:
        return 'No iniciado';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon()}
      {showText && (
        <span className={`${textSizeClasses[size]} ${getStatusColor()} font-medium`}>
          {getStatusText()}
        </span>
      )}
      {status === 'in_progress' && percentage > 0 && (
        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;