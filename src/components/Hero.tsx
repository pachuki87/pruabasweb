import React, { useState, useEffect } from 'react';
import lideraLogo from '../assets/WhatsApp Image 2025-06-30 at 18.03.49.png';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array de imágenes relacionadas con terapias y psicología
  const backgroundImages = [
    {
      url: "/pexels-shvets-production-7176026.jpg",
      alt: "Sesión de terapia psicológica con terapeuta tomando notas"
    },
    {
      url: "/pexels-airamdphoto-15189548.jpg",
      alt: "Consulta de psicología en ambiente relajado"
    },
    {
      url: "/pexels-bertellifotografia-3321791.jpg",
      alt: "Terapia de pareja y familiar"
    },
    {
      url: "/pexels-canvastudio-3153199.jpg",
      alt: "Sesión de terapia grupal y apoyo psicológico"
    },
    {
      url: "/pexels-hillaryfox-1595385.jpg",
      alt: "Consulta psicológica profesional"
    }
  ];

  // Efecto para cambiar automáticamente las imágenes cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
      {/* Background Images with Transition */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
               index === currentImageIndex ? 'opacity-60' : 'opacity-0'
             }`}
          >
            <img 
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/40 to-gray-900/40"></div>
        
        {/* Indicadores de imagen */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-lidera-light-blue scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Cambiar a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo grande */}
        <div className="text-center mb-12">
          <img 
            src={lideraLogo}
            alt="Instituto Lidera"
            className="h-64 w-auto mx-auto mb-4"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Especialízate en<br />
              <span className="text-lidera-light-blue">adicciones</span><br />
              e intervención familiar
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              En Instituto Lidera formamos profesionales especializados en el tratamiento 
              y prevención de adicciones con las competencias necesarias para responder a las 
              necesidades del sector sanitario y social. Metodología científica, casos reales 
              y formación personalizada.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
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
                  <div className="text-3xl font-bold text-lidera-light-blue mb-2">95%</div>
                  <div className="text-sm text-gray-300">Tasa de inserción laboral</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-lidera-light-blue mb-2">500+</div>
                  <div className="text-sm text-gray-300">Profesionales formados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-lidera-light-blue mb-2">15</div>
                  <div className="text-sm text-gray-300">Años de experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-lidera-light-blue mb-2">98%</div>
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
