import { ArrowRight, TrendingUp, Users, Globe, Brain } from 'lucide-react';

const Research = () => {
  const articles = [
    {
<<<<<<< HEAD
      category: "PSICOLOGÍA",
      titulo: "Neuropsicología de las adicciones: Nuevos enfoques terapéuticos",
      excerpt: "Investigación sobre los mecanismos neurobiológicos de las adicciones y cómo los avances en neurociencia están revolucionando los tratamientos.",
=======
      category: "LIDERAZGO",
      title: "El futuro del liderazgo en la era digital",
      excerpt: "Un análisis sobre cómo los líderes deben adaptarse a las nuevas tecnologías y modelos de trabajo híbrido para mantener la efectividad organizacional.",
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      author: "Equipo Instituto Lidera",
      icon: <Brain className="h-6 w-6" />,
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      category: "GESTIÓN",
<<<<<<< HEAD
      titulo: "Estrategias de gestión del cambio que funcionan",
=======
      title: "Estrategias de gestión del cambio que funcionan",
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      excerpt: "Metodologías probadas para liderar procesos de transformación organizacional y gestionar la resistencia al cambio de manera efectiva.",
      author: "Equipo Instituto Lidera",
      icon: <Globe className="h-6 w-6" />,
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      category: "INNOVACIÓN",
<<<<<<< HEAD
      titulo: "Desarrollo de equipos de alto rendimiento",
=======
      title: "Desarrollo de equipos de alto rendimiento",
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
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
<<<<<<< HEAD
                  alt={article.titulo}
=======
                  alt={article.title}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="text-white mb-2">
                    {article.icon}
                  </div>
<<<<<<< HEAD
                  <span className="inline-block bg-lidera-light-blue text-white text-xs px-3 py-1 rounded-full">
=======
                  <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
<<<<<<< HEAD
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-lidera-light-blue transition-colors line-clamp-3">
                  {article.titulo}
=======
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3">
                  {article.title}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                </h3>
                
                <p className="text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Por {article.author}</span>
<<<<<<< HEAD
                  <button className="text-lidera-light-blue hover:text-[#6a96c0] font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
=======
                  <button className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                    <span>Leer más</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
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
            VER TODAS LAS IDEAS
          </button>
        </div>
      </div>
    </section>
  );
};

export default Research;
