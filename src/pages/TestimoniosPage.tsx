import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface TestimoniosPageProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const TestimoniosPage: React.FC<TestimoniosPageProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentRole={currentRole} onRoleChange={onRoleChange} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Testimonios
            </h1>
            <p className="text-xl md:text-2xl text-red-100">
              Conoce las experiencias de nuestros estudiantes
            </p>
          </div>
        </section>

        {/* Video Testimonials Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Video Testimonios
              </h2>
              <p className="text-lg text-gray-600">
                Escucha directamente de nuestros estudiantes sobre su experiencia en Instituto Lidera
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Video Testimonio 1 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Testimonio 1
                </h3>
                <div className="aspect-video w-full">
                  <video 
                    controls 
                    className="w-full h-full rounded-lg"
                    preload="metadata"
                    controlsList="nodownload"
                  >
                    <source src="/video-testimonio_01.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>

              {/* Video Testimonio 2 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Testimonio 2
                </h3>
                <div className="aspect-video w-full">
                  <video 
                    controls 
                    className="w-full h-full rounded-lg"
                    preload="metadata"
                    controlsList="nodownload"
                  >
                    <source src="/video-testimonio_02.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Written Testimonials Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Lo que dicen nuestros estudiantes
              </h2>
              <p className="text-lg text-gray-600">
                Testimonios escritos de nuestra comunidad educativa
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "La formación en Instituto Lidera ha transformado mi carrera profesional. Los contenidos son de alta calidad y los profesores tienen una experiencia excepcional."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">María González</p>
                  <p className="text-sm text-gray-500">Máster en Adicciones</p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "El enfoque práctico y la metodología blended learning me permitieron estudiar mientras trabajaba. Recomiendo totalmente los cursos de Instituto Lidera."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Carlos Rodríguez</p>
                  <p className="text-sm text-gray-500">Diplomado en Terapia Familiar</p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Los talleres presenciales complementan perfectamente la formación online. He adquirido herramientas muy valiosas para mi práctica profesional."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Ana Martínez</p>
                  <p className="text-sm text-gray-500">Experto en Intervención Familiar</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-red-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para comenzar tu transformación?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Únete a nuestra comunidad de estudiantes y profesionales
            </p>
            <div className="space-x-4">
              <a
                href="/courses"
                className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Cursos
              </a>
              <a
                href="/about"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                Conoce Más
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestimoniosPage;
