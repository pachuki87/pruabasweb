import { ArrowRight, TrendingUp, Users, Globe } from 'lucide-react';

const Research = () => {
  const articles = [
    {
      category: "INVESTIGACIÓN",
      title: "Cuatro factores que dan sentido al trabajo del cuidador",
      excerpt: "Un estudio analiza los elementos clave que proporcionan significado y satisfacción en el trabajo de cuidado.",
      author: "Miguel Rial",
      icon: <Users className="h-6 w-6" />
    },
    {
      category: "SOSTENIBILIDAD",
      title: "Pide datos climáticos a tus proveedores y reduce el impacto medioambiental de tu empresa",
      excerpt: "Estrategias para involucrar a proveedores en la reducción de la huella de carbono empresarial.",
      author: "Julián Vázquez",
      icon: <Globe className="h-6 w-6" />
    },
    {
      category: "LIDERAZGO",
      title: "Retos comunes, respuestas similares: las ciudades líderes del mundo van por buen camino",
      excerpt: "Análisis de las mejores prácticas en gestión urbana y liderazgo municipal a nivel global.",
      author: "Andrea González",
      icon: <TrendingUp className="h-6 w-6" />
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
              <div className="bg-gray-100 rounded-xl p-8 mb-6 hover:bg-gray-200 transition-colors">
                <div className="text-red-600 mb-4">
                  {article.icon}
                </div>
                <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full mb-4">
                  {article.category}
                </span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Por {article.author}</span>
                  <div className="flex items-center text-red-600 group-hover:text-red-700 transition-colors">
                    <span className="text-sm font-semibold mr-2">Leer más</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            VER TODAS LAS IDEAS
          </button>
        </div>
      </div>
    </section>
  );
};

export default Research;
