import React from 'react';

type StatsCardProps = {
  title: string;
  value: string | number;
  color?: 'blue' | 'gray' | 'green' | 'red';
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color = 'blue' }) => {
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
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${getColorClasses()}`}>
      <div className="p-5 text-center">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;