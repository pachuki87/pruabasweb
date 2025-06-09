import React from 'react';
import { MapPin } from 'lucide-react';

const Campus = () => {
  const campuses = [
    { name: 'Nueva York', active: true },
    { name: 'São Paulo', active: false },
    { name: 'Madrid', active: false },
    { name: 'Barcelona', active: false },
    { name: 'Munich', active: false },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Nuestros campus
        </h2>
        
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {campuses.map((campus, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  campus.active
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{campus.name}</span>
              </button>
            ))}
          </div>
          
          {/* City Skyline Visualization */}
          <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-gray-600">
              {/* Skyline silhouette */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center space-x-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 opacity-80"
                    style={{
                      width: `${Math.random() * 30 + 20}px`,
                      height: `${Math.random() * 80 + 40}px`,
                    }}
                  />
                ))}
              </div>
              
              {/* City name overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-4xl font-bold text-white">Nueva York</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Campus;