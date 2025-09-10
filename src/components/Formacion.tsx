import React, { useState } from 'react';
import { Play, Users, Award, BookOpen, ChevronRight, Star } from 'lucide-react';

const Formacion = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const programas = [
    {
      id: 1,
      titulo: "Experto en Conductas Adictivas",
      descripcion: "Programa especializado en el tratamiento y comprensión de las conductas adictivas desde una perspectiva integral.",
      duracion: "6 meses",
      modalidad: "Online",
      nivel: "Experto",
      destacado: true
    },
    {
      id: 2,
      titulo: "Máster en Adicciones e Intervención Psicosocial",
      descripcion: "Formación avanzada en intervención psicosocial y tratamiento integral de adicciones.",
      duracion: "12 meses",
      modalidad: "Híbrida",
      nivel: "Máster",
      destacado: true
    },
    {
      id: 3,
      titulo: "Recovery Coaching Certificado",
      descripcion: "Especialización en técnicas de coaching para procesos de recuperación.",
      duracion: "4 meses",
      modalidad: "Online",
      nivel: "Certificación",
      destacado: false
    }
  ];

  const testimonios = [
    {
      nombre: "María González",
      programa: "Experto en Conductas Adictivas",
      testimonio: "Una formación que transformó mi práctica profesional. Los contenidos son actuales y muy aplicables.",
      rating: 5
    },
    {
      nombre: "Carlos Ruiz",
      programa: "Máster en Adicciones",
      testimonio: "Excelente calidad académica y un enfoque muy práctico. Recomiendo totalmente esta formación.",
      rating: 5
    }
  ];

  const videos = [
    {
      id: 1,
      titulo: "Testimonio de Estudiante - Parte 1",
      archivo: "/video-testimonio_01.mp4",
      descripcion: "Experiencia de nuestros estudiantes en el programa"
    },
    {
      id: 2,
      titulo: "Testimonio de Estudiante - Parte 2",
      archivo: "/video-testimonio_02.mp4",
      descripcion: "Más testimonios de éxito de nuestros graduados"
    },
    {
      id: 3,
      titulo: "Presentación Institucional",
      archivo: "/4053047-uhd_3840_2160_25fps.mp4",
      descripcion: "Conoce más sobre nuestra institución"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/4053047-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          </video>

        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Formación<br />
              <span className="text-lidera-light-blue">Profesional</span><br />
              Especializada
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Desarrolla tu carrera profesional con nuestros programas de formación avanzada. 
              Metodología innovadora, casos reales y certificación oficial.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                EXPLORAR PROGRAMAS
              </button>
              <button className="border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                SOLICITAR INFORMACIÓN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-lidera-light-blue mb-2">500+</div>
              <div className="text-gray-600">Estudiantes Graduados</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-lidera-light-blue mb-2">15+</div>
              <div className="text-gray-600">Años de Experiencia</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-lidera-light-blue mb-2">95%</div>
              <div className="text-gray-600">Satisfacción</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-lidera-light-blue mb-2">24/7</div>
              <div className="text-gray-600">Soporte Académico</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programas Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestros Programas
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Formación especializada diseñada por expertos para profesionales que buscan la excelencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programas.map((programa) => (
              <div key={programa.id} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                programa.destacado ? 'ring-2 ring-lidera-light-blue' : ''
              }`}>
                {programa.destacado && (
                  <div className="bg-lidera-light-blue text-white text-center py-2 text-sm font-semibold">
                    ⭐ Programa Destacado
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      programa.nivel === 'Máster' ? 'bg-lidera-light-blue/10 text-lidera-light-blue' :
                      programa.nivel === 'Experto' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {programa.nivel}
                    </span>
                    <Award className="h-6 w-6 text-lidera-light-blue" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {programa.titulo}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {programa.descripcion}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Duración: {programa.duracion}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      Modalidad: {programa.modalidad}
                    </div>
                  </div>
                  
                  <button className="w-full bg-lidera-light-blue hover:bg-[#6a96c0] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    Más Información
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Testimonios y Experiencias
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce las experiencias de nuestros estudiantes y graduados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative aspect-video bg-gray-900">
                  {activeVideo === video.archivo ? (
                    <video 
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                    >
                      <source src={video.archivo} type="video/mp4" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center cursor-pointer group"
                      onClick={() => setActiveVideo(video.archivo)}
                    >
                      <div className="bg-lidera-light-blue rounded-full p-4 group-hover:bg-[#6a96c0] transition-colors">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {video.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {video.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que Dicen Nuestros Estudiantes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonio.testimonio}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonio.nombre}</div>
                  <div className="text-sm text-gray-500">{testimonio.programa}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Transformar tu Carrera?
          </h2>
          <p className="text-xl mb-8">
            Únete a nuestra comunidad de profesionales especializados en adicciones e intervención psicosocial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Solicitar Información
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Hablar con un Asesor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Formacion;