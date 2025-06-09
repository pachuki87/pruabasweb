import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const News = () => {
  const news = [
    {
      title: "Adiós a José Felipe Bertrán, consejero delegado de IESE",
      excerpt: "El pasado 15 de mayo falleció José Felipe Bertrán, consejero delegado de IESE durante más de dos décadas.",
      date: "15 MAY 2024",
      category: "IESE"
    },
    {
      title: "IESE's Top Foundational Business Model Playbook para Knowledge sobre el futuro del trabajo",
      excerpt: "Un nuevo estudio analiza los modelos de negocio más exitosos en la era digital.",
      date: "12 MAY 2024",
      category: "Research"
    },
    {
      title: "La Alumni Association presenta las mejores startups del año 2024",
      excerpt: "Conoce las startups más innovadoras creadas por alumni de IESE este año.",
      date: "10 MAY 2024",
      category: "Alumni"
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
              <div className="bg-gray-900 h-48 rounded-xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {article.date}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-red-600 group-hover:text-red-700 transition-colors">
                  <span className="text-sm font-semibold mr-2">Leer más</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            TODAS LAS NOTICIAS
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;