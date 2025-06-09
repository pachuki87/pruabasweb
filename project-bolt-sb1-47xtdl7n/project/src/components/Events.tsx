import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const events = [
    {
      date: { day: "09", month: "JUN" },
      title: "Cultura de innovación ejecutiva y ética",
      time: "18:30",
      location: "Madrid",
      type: "Conferencia"
    },
    {
      date: { day: "10", month: "JUN" },
      title: "DE BIG FOOD TO BEVERAGE - UN CAMINO",
      time: "19:00",
      location: "Barcelona",
      type: "Mesa Redonda"
    },
    {
      date: { day: "10", month: "JUN" },
      title: "The Executive MBA in Europe Programme",
      time: "18:00",
      location: "Online",
      type: "Info Session"
    },
    {
      date: { day: "10", month: "JUN" },
      title: "IESE Alumni & Friends Reunion",
      time: "20:00",
      location: "Munich",
      type: "Networking"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-16">Próximos eventos.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-gray-900 text-white rounded-lg p-3 text-center min-w-[60px]">
                  <div className="text-2xl font-bold">{event.date.day}</div>
                  <div className="text-xs uppercase">{event.date.month}</div>
                </div>
                
                <div className="flex-1">
                  <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full mb-2">
                    {event.type}
                  </span>
                  <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            VER TODOS LOS EVENTOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;