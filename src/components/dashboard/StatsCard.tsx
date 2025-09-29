import React from 'react';

type StatsCardProps = {
<<<<<<< HEAD
  titulo: string;
=======
  title: string;
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
  value: string | number;
  color?: 'blue' | 'gray' | 'green' | 'red';
};

<<<<<<< HEAD
const StatsCard: React.FC<StatsCardProps> = ({ titulo, value, color = 'red' }) => {
=======
const StatsCard: React.FC<StatsCardProps> = ({ title, value, color = 'blue' }) => {
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
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
<<<<<<< HEAD
        return 'bg-red-600 text-white';
=======
        return 'bg-blue-600 text-white';
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
    }
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${getColorClasses()}`}>
      <div className="p-5 text-center">
<<<<<<< HEAD
        <h3 className="text-lg font-medium mb-2">{titulo}</h3>
=======
        <h3 className="text-lg font-medium mb-2">{title}</h3>
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;