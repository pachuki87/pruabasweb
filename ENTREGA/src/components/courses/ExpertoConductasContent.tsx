import React, { useState } from 'react';
import { FaGraduationCap, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHome, FaBook, FaChalkboardTeacher, FaLaptop, FaBrain, FaHeart, FaUserFriends, FaStar, FaAward, FaClock, FaUserTie, FaBriefcase, FaWhatsapp, FaMapPin, FaCheckCircle, FaPlay } from 'react-icons/fa';

const ExpertoConductasContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="container mx-auto px-4 py-8 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <FaBrain className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">Experto en Conductas Adictivas</h1>
              <p className="text-gray-100 text-sm mt-1">Formación especializada en tratamiento y comprensión de adicciones</p>
            </div>
          </div>
          <nav className="space-x-4 hidden md:flex">
            {["inicio", "contenido", "metodología", "profesorado", "contacto"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize hover:underline transition ${
                  activeTab === tab ? "font-semibold underline" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white shadow-inner p-2 overflow-x-auto">
        <nav className="flex space-x-4">
          {["inicio", "contenido", "metodología", "profesorado", "contacto"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-md capitalize transition ${
                activeTab === tab ? "bg-lidera-light-blue text-white font-medium" : "hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "inicio" && (
          <>
            <SectionSummary />
            <HomeSection />
          </>
        )}
        {activeTab === "contenido" && <ContenidoSection />}
        {activeTab === "metodología" && <MetodologiaSection />}
        {activeTab === "profesorado" && <ProfesoradoSection />}
        {activeTab === "contacto" && <ContactoSection />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Experto en Conductas Adictivas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionSummary() {
  const sections = [
    {
      id: 'inicio',
      title: 'Inicio',
      description: 'Curso completo sobre tratamiento y comprensión de conductas adictivas con enfoque práctico',
      icon: <FaHome className="text-2xl" />,
      color: 'from-lidera-light-blue to-gray-600'
    },
    {
      id: 'contenido',
      title: 'Contenido',
      description: '13 lecciones especializadas desde fundamentos hasta terapias innovadoras y mindfulness',
      icon: <FaBook className="text-2xl" />,
      color: 'from-gray-600 to-gray-700'
    },
    {
      id: 'metodologia',
      title: 'Metodología',
      description: 'Aprendizaje online con materiales complementarios, PDFs y cuestionarios interactivos',
      icon: <FaChalkboardTeacher className="text-2xl" />,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'profesorado',
      title: 'Profesorado',
      description: 'Expertos especializados en adicciones con amplia experiencia clínica y académica',
      icon: <FaUsers className="text-2xl" />,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'contacto',
      title: 'Contacto',
      description: 'Información de matrícula y acceso al programa de formación especializada',
      icon: <FaPhone className="text-2xl" />,
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Resumen del Programa</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Descubre todos los aspectos de nuestro curso Experto en Conductas Adictivas
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div key={section.id} className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
            <div className={`bg-gradient-to-r ${section.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <div className="text-white">{section.icon}</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{section.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed text-center">{section.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative mb-16 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80" 
            alt="Experto en Conductas Adictivas" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/85 via-blue-800/75 to-purple-900/85"></div>
        </div>
        <div className="relative z-10 px-8 py-16 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Conviértete en 
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Experto en Conductas Adictivas</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Curso especializado en el diagnóstico y tratamiento de adicciones según DSM-5. Aprende terapias innovadoras, mindfulness aplicado y técnicas de intervención específicas para conductas adictivas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaBrain className="mr-2 text-cyan-400" />
                <span className="text-sm font-medium">Criterios DSM-5</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaHeart className="mr-2 text-pink-400" />
                <span className="text-sm font-medium">Mindfulness Aplicado</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaUserFriends className="mr-2 text-green-400" />
                <span className="text-sm font-medium">Terapia Integral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Información del Curso</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">Programa especializado en conductas adictivas con enfoque práctico y basado en evidencia científica</p>
        </div>
        
        {/* ¿Qué aprenderás? Section */}
        <div className="mb-12">
          <h4 className="text-2xl font-bold text-gray-800 mb-8 text-center">¿Qué aprenderás?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaBrain className="text-purple-600 text-xl" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Criterios Diagnósticos DSM-5</h5>
              <p className="text-gray-600 text-sm">Domina los criterios oficiales para el diagnóstico de trastornos adictivos</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaHeart className="text-blue-600 text-xl" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Mindfulness Aplicado</h5>
              <p className="text-gray-600 text-sm">Técnicas de mindfulness específicas para el tratamiento de adicciones</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaUserFriends className="text-green-600 text-xl" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Terapia Integral de Pareja</h5>
              <p className="text-gray-600 text-sm">Intervención familiar y de pareja en contextos de adicción</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Psicología Positiva</h5>
              <p className="text-gray-600 text-sm">Enfoque en fortalezas y recursos para la recuperación</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-red-600 text-xl" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Prevención de Recaídas</h5>
              <p className="text-gray-600 text-sm">Estrategias efectivas para mantener la abstinencia</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaBriefcase className="text-indigo-600 text-xl" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Adicciones Comportamentales</h5>
              <p className="text-gray-600 text-sm">Tratamiento de adicciones sin sustancias (juego, internet, etc.)</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <StatCard titulo="Lecciones" value="13 Lecciones" icon={<FaBook />} />
          <StatCard titulo="Cuestionarios" value="9 Evaluaciones" icon={<FaCheckCircle />} />
          <StatCard titulo="Material" value="8 PDFs Complementarios" icon={<FaGraduationCap />} />
        </div>
        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg">
            <FaStar className="inline mr-2" />
            Comenzar Especialización
          </button>
        </div>
      </section>
    </>
  );
}

function ContenidoSection() {
  const lecciones = [
    { numero: 1, titulo: "¿Qué significa ser adicto?", tipo: "Contenido" },
    { numero: 2, titulo: "¿Qué es una adicción?", tipo: "Contenido + Cuestionario" },
    { numero: 3, titulo: "Consecuencias de las adicciones", tipo: "Contenido" },
    { numero: 4, titulo: "Criterios para diagnosticar una conducta adictiva según DSM 5", tipo: "Contenido + Cuestionario" },
    { numero: 5, titulo: "Material Complementario y Ejercicios", tipo: "Contenido + 2 Cuestionarios" },
    { numero: 6, titulo: "Adicciones Comportamentales", tipo: "Contenido + 2 Cuestionarios" },
    { numero: 7, titulo: "La familia", tipo: "Contenido" },
    { numero: 8, titulo: "La recaída", tipo: "Contenido" },
    { numero: 9, titulo: "Nuevas terapias psicológicas", tipo: "Contenido" },
    { numero: 10, titulo: "Terapia integral de pareja", tipo: "Contenido + Cuestionario" },
    { numero: 11, titulo: "Psicología positiva", tipo: "Contenido + Cuestionario" },
    { numero: 12, titulo: "Mindfulness aplicado a la Conducta Adictiva", tipo: "Contenido + Cuestionario" },
    { numero: 13, titulo: "Material complementario Mindfulness y ejercicio", tipo: "Contenido + Cuestionario" }
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Contenido del Curso</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          13 lecciones especializadas que cubren desde los fundamentos hasta las terapias más innovadoras
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {lecciones.map((leccion) => (
          <div key={leccion.numero} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-lidera-light-blue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                  {leccion.numero}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{leccion.titulo}</h3>
                  <p className="text-sm text-gray-600">{leccion.tipo}</p>
                </div>
              </div>
              <FaPlay className="text-lidera-light-blue" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MetodologiaSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Metodología</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Aprendizaje online con materiales complementarios y evaluaciones interactivas
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="bg-lidera-light-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLaptop className="text-2xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Modalidad Online</h3>
          <p className="text-gray-600 leading-relaxed text-center">
            Acceso completo a contenidos HTML interactivos, materiales descargables y recursos multimedia desde cualquier dispositivo.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-2xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Evaluación Continua</h3>
          <p className="text-gray-600 leading-relaxed text-center">
            9 cuestionarios interactivos distribuidos a lo largo del curso para evaluar el progreso y consolidar conocimientos.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfesoradoSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Profesorado Especializado</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Expertos en adicciones con amplia experiencia clínica y académica
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="bg-lidera-light-blue w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaUserTie className="text-3xl text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Equipo Docente Especializado</h3>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Profesionales con amplia experiencia en el tratamiento de conductas adictivas, formación en criterios diagnósticos DSM-5, 
          terapias psicológicas innovadoras y aplicación de mindfulness en el ámbito clínico.
        </p>
      </div>
    </section>
  );
}

function ContactoSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Contacto e Información</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          ¿Tienes preguntas sobre el curso? Contáctanos para más información
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="bg-lidera-light-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaEnvelope className="text-2xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Email</h3>
          <p className="text-gray-600 leading-relaxed text-center">
            <a href="mailto:info@institutolidera.com" className="text-lidera-light-blue hover:underline">
              info@institutolidera.com
            </a>
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaWhatsapp className="text-2xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">WhatsApp</h3>
          <p className="text-gray-600 leading-relaxed text-center">
            <a href="https://wa.me/34123456789" className="text-green-500 hover:underline">
              +34 123 456 789
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ titulo, value, icon }: { titulo: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="bg-lidera-light-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{titulo}</h4>
      <p className="text-2xl font-bold text-lidera-light-blue">{value}</p>
    </div>
  );
}

export default ExpertoConductasContent;