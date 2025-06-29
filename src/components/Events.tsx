import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const Events = () => {
  const events = [
    {
      date: { day: "15", month: "DIC" },
      title: "Conferencia de Liderazgo Empresarial 2025",
      time: "18:30",
      location: "Madrid",
      type: "Conferencia",
      attendees: "150+",
      image: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      date: { day: "18", month: "DIC" },
      title: "Taller de Gestión del Cambio",
      time: "19:00",
      location: "Barcelona",
      type: "Taller",
      attendees: "50+",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      date: { day: "20", month: "DIC" },
      title: "Sesión Informativa Programas 2025",
      time: "18:00",
      location: "Online",
      type: "Info Session",
      attendees: "100+",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    },
    {
      date: { day: "22", month: "DIC" },
      title: "Networking Alumni Navidad",
      time: "20:00",
      location: "Valencia",
      type: "Networking",
      attendees: "80+",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-16">Próximos eventos.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative h-48">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-gray-900 text-white rounded-lg p-3 text-center min-w-[60px]">
                    <div className="text-2xl font-bold">{event.date.day}</div>
                    <div className="text-xs uppercase">{event.date.month}</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="inline-block bg-lidera-light-blue text-white text-xs px-2 py-1 rounded-full">
                    {event.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-lidera-light-blue transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} asistentes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            VER TODOS LOS EVENTOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;
