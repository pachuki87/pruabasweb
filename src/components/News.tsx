import { Calendar, ArrowRight } from 'lucide-react';

const News = () => {
  const news = [
    {
<<<<<<< HEAD
      titulo: "Nuevo protocolo de intervención en adicciones comportamentales",
      excerpt: "Instituto Lidera presenta un innovador protocolo para el tratamiento de adicciones comportamentales desarrollado por nuestro equipo de investigación.",
      date: "15 MAY 2025",
=======
      title: "Nuevo protocolo de intervención en adicciones comportamentales",
      excerpt: "Instituto Lidera presenta un innovador protocolo para el tratamiento de adicciones comportamentales desarrollado por nuestro equipo de investigación.",
      date: "15 MAY 2024",
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      category: "Instituto Lidera",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
<<<<<<< HEAD
      titulo: "Estudio sobre eficacia de terapias grupales en adicciones",
      excerpt: "Un nuevo estudio analiza la efectividad de las terapias grupales en el tratamiento de diferentes tipos de adicciones.",
      date: "12 MAY 2025",
=======
      title: "Estudio sobre eficacia de terapias grupales en adicciones",
      excerpt: "Un nuevo estudio analiza la efectividad de las terapias grupales en el tratamiento de diferentes tipos de adicciones.",
      date: "12 MAY 2024",
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      category: "Research",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
<<<<<<< HEAD
      titulo: "La Alumni Association presenta casos de éxito en centros de tratamiento",
      excerpt: "Conoce los casos de éxito más destacados de alumni de Instituto Lidera en centros de tratamiento de adicciones.",
      date: "10 MAY 2025",
=======
      title: "La Alumni Association presenta casos de éxito en centros de tratamiento",
      excerpt: "Conoce los casos de éxito más destacados de alumni de Instituto Lidera en centros de tratamiento de adicciones.",
      date: "10 MAY 2024",
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      category: "Alumni",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Noticias.</h2>
            <p className="text-xl text-gray-600">Tenemos mucho que contar.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="relative h-48 rounded-xl mb-6 overflow-hidden">
                <img 
                  src={article.image}
<<<<<<< HEAD
                  alt={article.titulo}
=======
                  alt={article.title}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
<<<<<<< HEAD
                  <span className="inline-block bg-lidera-light-blue text-white text-xs px-3 py-1 rounded-full mb-2">
=======
                  <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full mb-2">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {article.date}
                </div>
                
<<<<<<< HEAD
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-lidera-light-blue transition-colors line-clamp-2">
                  {article.titulo}
=======
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                </h3>
                
                <p className="text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                
<<<<<<< HEAD
                <div className="flex items-center text-lidera-light-blue group-hover:text-[#6a96c0] transition-colors">
=======
                <div className="flex items-center text-red-600 group-hover:text-red-700 transition-colors">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                  <span className="text-sm font-semibold mr-2">Leer más</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
<<<<<<< HEAD
          <button className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
=======
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
            TODAS LAS NOTICIAS
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;
