import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface ViajesYTalleresPageProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const ViajesYTalleresPage: React.FC<ViajesYTalleresPageProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentRole={currentRole} onRoleChange={onRoleChange} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Retiro espiritual en la naturaleza" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Viajes, Retiros y Talleres
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Desarrollo personal y crecimiento profesional
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Desarrollo Personal y Crecimiento
              </h2>
              <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed">
                <p className="mb-6">
                  Los viajes, retiros y talleres de desarrollo personal o crecimiento personal se orientan a la 
                  actualización de las potencialidades humanas (psicológicas y espirituales) que la persona puede 
                  hacer más allá de su desarrollo natural en función de la edad.
                </p>
                <p className="mb-6">
                  Con el trabajo de crecimiento personal la persona aprende, a través de la conciencia de sí mismo, 
                  a aprovechar sus posibilidades de pensar, sentir y actuar para:
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Meditación y pensamiento libre" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Pensamiento Libre
                  </h3>
                  <p className="text-gray-600">
                    Usar el pensamiento libre o autónomo para tomar decisiones conscientes y reflexivas.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Liderazgo personal y crecimiento" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Liderazgo Personal
                  </h3>
                  <p className="text-gray-600">
                    Dominar una libertad responsable, siendo líder de sí mismo en todas las áreas de la vida.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Bienestar emocional y yoga" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Salud Emocional
                  </h3>
                  <p className="text-gray-600">
                    Tener salud emocional y desarrollar inteligencia emocional para una vida plena.
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-16">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Desde esta sección, brindamos información sobre lo que el desarrollo o crecimiento personal 
                    nos puede ayudar a cada uno de nosotros. Por ello os proponemos interesantes talleres y 
                    viajes experienciales, además de conferencias, charlas y otros eventos que nos ayudan para 
                    nuestro crecimiento personal diario.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Si estás interesado en que te mantengamos informado acerca de todas nuestras actividades, 
                    no dudes en ponerte en contacto con nosotros bien por teléfono o por email y te enviaremos 
                    la programación de eventos que realizamos habitualmente para que puedas escoger sin compromiso 
                    a cuál acudir.
                  </p>
                </div>
                <div className="h-64 md:h-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Grupo en taller de desarrollo personal" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                Nuestros valores y compromisos contigo
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Innovación terapéutica
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Métodos innovadores y actualizados para el desarrollo personal
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Amplia oferta didáctica
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Variedad de talleres, retiros y actividades para todos los niveles
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Inserción laboral
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Desarrollo de habilidades aplicables al ámbito profesional
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Calidad formativa
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Excelencia en todos nuestros programas de desarrollo personal
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 rounded-lg text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                ¿Listo para comenzar tu viaje de crecimiento personal?
              </h3>
              <p className="text-blue-100 mb-6">
                Contáctanos para recibir información sobre nuestros próximos talleres y retiros
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Contactar por Email
                </button>
                <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                  Llamar Ahora
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViajesYTalleresPage;
