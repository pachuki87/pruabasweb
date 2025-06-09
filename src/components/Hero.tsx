import { } from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Creativas
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              La sociedad actual requiere de profesionales especializados en el tratamiento 
              y prevención de adicciones con competencias avanzadas para responder a las 
              necesidades del sector sanitario y social. En Instituto Lidera no sólo 
              desarrollamos expertos en adicciones sino que fundamentamos los resultados con 
              una sólida formación científica y humanística que permite a nuestros alumnos 
              convertirse en profesionales íntegros.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                SOLICITAR
              </button>
              <button className="border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                INFORMACIÓN
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                ADMISIÓN
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Statistics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-red-400 mb-2">+60.000</div>
                  <div className="text-sm text-gray-300">Alumni alrededor del mundo</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-red-400 mb-2">2º</div>
                  <div className="text-sm text-gray-300">Del mundo, según el Financial Times</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-red-400 mb-2">15</div>
                  <div className="text-sm text-gray-300">Escuelas asociadas</div>
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
