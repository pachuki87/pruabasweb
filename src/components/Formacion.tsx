import React, { useState } from 'react';
import { Play, Users, Award, BookOpen, ChevronRight, Star } from 'lucide-react';
import Header from './layout/Header';
import Footer from './layout/Footer';

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
    }
  ];

  const profesores = [
    {
      nombre: "José Manuel Zaldúa Mellado",
      cargo: "Fundador del proyecto Reinservida y Director terapéutico",
      especialidad: "Experto en Detección e Intervención en la adicción a las nuevas tecnologías",
      descripcion: "Fundador del proyecto Reinservida y Director terapéutico. Experto en Detección e Intervención en la adicción a las nuevas tecnologías",
      imagen: "/jose-manuel.jpg"
    },
    {
      nombre: "Javier Carbonell Lledó",
      cargo: "Psicoterapeuta con más de 25 años de experiencia",
      especialidad: "Director del Instituto Lídera y conferenciante en el ámbito de las adicciones",
      descripcion: "Psicoterapeuta con más de 25 años de experiencia, Director del Instituto Lídera y conferenciante en el ámbito de las adicciones.",
      imagen: "/javier.jpg"
    },
    {
      nombre: "Lidia de Ramón",
      cargo: "Terapeuta especializada en conductas adictivas",
      especialidad: "Directora del área terapéutica de adicciones comportamentales",
      descripcion: "Terapeuta especializada en conductas adictivas y directora del área terapéutica de adicciones comportamentales.",
      imagen: "/lidia.jpg"
    },
    {
      nombre: "Montserrat Pintado Gellida",
      cargo: "Asesora terapéutica",
      especialidad: "Responsable de la gestión comercial y de expansión",
      descripcion: "Asesora terapéutica, responsable de la gestión comercial y de expansión. Experta en coordinación de programas terapéuticos.",
      imagen: "/montse.jpg"
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
      <Header />
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

          <div className="grid md:grid-cols-2 gap-12">
            {programas.map((programa) => (
              <div key={programa.id} className={`bg-white border hover:border-gray-300 transition-colors ${
                programa.destacado ? 'border-l-4 border-slate-700' : 'border-gray-200'
              }`}>
                {programa.destacado && (
                  <div className="bg-white text-gray-800 text-center py-3 text-sm font-medium tracking-wide uppercase border-b border-gray-200">
                    Programa Destacado
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-4 py-2 text-xs font-medium uppercase tracking-wider ${
                      programa.nivel === 'Máster' ? 'bg-gray-100 text-gray-700 border border-gray-300' :
                      programa.nivel === 'Experto' ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                      'bg-stone-100 text-stone-700 border border-stone-300'
                    }`}>
                      {programa.nivel}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {programa.titulo}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed font-light">
                    {programa.descripcion}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-3" />
                      <span className="font-light">Duración: {programa.duracion}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-3" />
                      <span className="font-light">Modalidad: {programa.modalidad}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 font-medium transition-colors flex items-center justify-center">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {videos.map((video) => (
              <div key={video.id} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
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
                      <div className="bg-gray-900 p-4 group-hover:bg-gray-800 transition-colors">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {video.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm font-light">
                    {video.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profesores Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Equipo Docente
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales especializados con amplia experiencia en el tratamiento de adicciones
            </p>
          </div>

          <div className="space-y-8">
            {profesores.map((profesor, index) => (
              <div key={index} className="col-12 col-md-6 employee-card-box">
                <div className="employee-card-link">
                  <figure className="row employee-card employee-card--subdirector bg-white border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden flex">
                    <div className="col-12 col-lg-4 col-xl-4 employee-card__picture">
                      {profesor.imagen ? (
                        <img 
                          src={profesor.imagen} 
                          alt={profesor.nombre}
                          className="w-full h-full object-cover aspect-square"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                          <div className="w-20 h-20 bg-lidera-light-blue rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-lg-8 col-xl-8 col-employee-card flex items-center">
                      <figcaption className="employee-card__description bg-lidera-light-blue p-8 h-full flex flex-col justify-center">
                        <div className="titleone">
                          <h1 className="title text-3xl font-bold text-white mb-4">
                            {profesor.nombre.split(' ').slice(0, -1).join(' ')}<br/>
                            <span className="subtitle text-2xl font-light">{profesor.nombre.split(' ').slice(-1)[0]}</span>
                          </h1>
                        </div>
                        <div className="employee-jobs">
                          <p className="employee-card__description__job text-lg text-white font-medium mb-4">
                            {profesor.cargo}
                          </p>
                        </div>
                        <p className="text-base text-white mb-4">
                          • {profesor.especialidad}
                        </p>
                        <p className="text-base text-white leading-relaxed">
                          {profesor.descripcion}
                        </p>
                      </figcaption>
                    </div>
                  </figure>
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

          <div className="grid md:grid-cols-2 gap-12">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="bg-white border border-gray-200 p-12">
                <div className="flex items-center mb-6">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-8 font-light text-lg leading-relaxed">
                  "{testimonio.testimonio}"
                </p>
                <div>
                  <div className="font-medium text-gray-900">{testimonio.nombre}</div>
                  <div className="text-sm text-gray-500 font-light">{testimonio.programa}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
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
      <Footer />
    </div>
  );
};

export default Formacion;