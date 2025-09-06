import { ArrowRight, TrendingUp, Users, Globe, Brain } from 'lucide-react';

const Research = () => {
  const articles = [
    {
      category: "LIDERAZGO",
      titulo: "El futuro del liderazgo en la era digital",
      excerpt: "Un análisis sobre cómo los líderes deben adaptarse a las nuevas tecnologías y modelos de trabajo híbrido para mantener la efectividad organizacional.",
      author: "Equipo Instituto Lidera",
      icon: <Brain className="h-6 w-6" />,
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      category: "GESTIÓN",
      titulo: "Estrategias de gestión del cambio que funcionan",
      excerpt: "Metodologías probadas para liderar procesos de transformación organizacional y gestionar la resistencia al cambio de manera efectiva.",
      author: "Equipo Instituto Lidera",
      icon: <Globe className="h-6 w-6" />,
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      category: "INNOVACIÓN",
      titulo: "Desarrollo de equipos de alto rendimiento",
      excerpt: "Claves para formar y liderar equipos que superen las expectativas y generen resultados excepcionales en entornos competitivos.",
      author: "Equipo Instituto Lidera",
      icon: <TrendingUp className="h-6 w-6" />,
      image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ideas &</h2>
          <p className="text-xl text-gray-600">Investigación e ideas de nuestros profesores</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="relative rounded-xl overflow-hidden mb-6">
                <img 
                  src={article.image}
                  alt={article.titulo}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="text-white mb-2">
                    {article.icon}
                  </div>
                  <span className="inline-block bg-lidera-light-blue text-white text-xs px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-lidera-light-blue transition-colors line-clamp-3">
                  {article.titulo}
                </h3>
                
                <p className="text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Por {article.author}</span>
                  <button className="text-lidera-light-blue hover:text-[#6a96c0] font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                    <span>Leer más</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            VER TODAS LAS IDEAS
          </button>
        </div>
      </div>
    </section>
  );
};

export default Research;
