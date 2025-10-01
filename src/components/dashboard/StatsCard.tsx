import React from 'react';

type StatsCardProps = {
  titulo: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'gray' | 'green' | 'red';
};

const StatsCard: React.FC<StatsCardProps> = ({ titulo, value, subtitle, color = 'red' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 text-white';
      case 'gray':
        return 'bg-gray-600 text-white';
      case 'green':
        return 'bg-green-600 text-white';
      case 'red':
        return 'bg-red-600 text-white';
      default:
        return 'bg-red-600 text-white';
    }
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${getColorClasses()}`}>
      <div className="p-5 text-center">
        <h3 className="text-lg font-medium mb-2">{titulo}</h3>
        <p className="text-3xl font-bold mb-2">{value}</p>
        {subtitle && (
          <p className="text-sm opacity-90 italic">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;