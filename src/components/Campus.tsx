import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const Campus = () => {
  const [activeLocation, setActiveLocation] = useState(0);
  
  const locations = [
    { 
      name: 'Valencia', 
      image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      description: 'Centro de formación en prevención de adicciones'
    },
    { 
      name: 'Online', 
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      description: 'Formación online especializada en adicciones'
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Dónde nos encontramos
        </h2>
        
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {locations.map((location, index) => (
              <button
                key={index}
                onClick={() => setActiveLocation(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  activeLocation === index
                    ? 'bg-lidera-light-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{location.name}</span>
              </button>
            ))}
          </div>
          
          {/* Location Image and Info */}
          <div className="relative h-96 bg-white rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={locations[activeLocation].image}
              alt={locations[activeLocation].name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-4xl font-bold mb-2">{locations[activeLocation].name}</h3>
              <p className="text-lg opacity-90">{locations[activeLocation].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Campus;
