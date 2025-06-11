import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Formación en adicciones"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Especialízate en<br />
              <span className="text-red-400">adicciones</span><br />
              e intervención familiar
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              En Instituto Lidera formamos profesionales especializados en el tratamiento 
              y prevención de adicciones con las competencias necesarias para responder a las 
              necesidades del sector sanitario y social. Metodología científica, casos reales 
              y formación personalizada.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                VER CURSOS
              </button>
              <button className="border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                SOLICITAR INFO
              </button>
            </div>
          </div>
          
          {/* Statistics Section */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Nuestros Resultados</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">95%</div>
                  <div className="text-sm text-gray-300">Tasa de inserción laboral</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">500+</div>
                  <div className="text-sm text-gray-300">Profesionales formados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">15</div>
                  <div className="text-sm text-gray-300">Años de experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">98%</div>
                  <div className="text-sm text-gray-300">Satisfacción del alumno</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
