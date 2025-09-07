import React, { useState } from 'react';
import { FaGraduationCap, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaEuroSign, FaPhone, FaEnvelope, FaHome, FaBook, FaChalkboardTeacher, FaLaptop, FaHandsHelping, FaBrain, FaHeart, FaUserFriends, FaStar, FaAward, FaClock, FaUserTie, FaBriefcase, FaWhatsapp, FaCreditCard, FaMapPin } from 'react-icons/fa';
import { getMasterPrice } from '../../config/pricing';

const MasterAdiccionesContent: React.FC = () => {
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">Máster en Adicciones e Intervención Psicosocial</h1>
              <p className="text-gray-100 text-sm mt-1">Formación especializada en tratamiento de adicciones</p>
            </div>
          </div>
          <nav className="space-x-4 hidden md:flex">
            {["inicio", "metodología", "módulos", "profesorado", "contacto"].map((tab) => (
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
          {["inicio", "metodología", "módulos", "profesorado", "contacto"].map((tab) => (
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
        {activeTab === "metodología" && <MetodologiaSection />}
        {activeTab === "módulos" && <ModulosSection />}
        {activeTab === "profesorado" && <ProfesoradoSection />}
        {activeTab === "contacto" && <ContactoSection />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Máster en Adicciones e Intervención Psicosocial. Todos los derechos reservados.</p>
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
      description: 'Máster práctico en adicciones, modalidad blended, duración Oct 2025-Jun 2026, 20-80 plazas',
      icon: <FaHome className="text-2xl" />,
      color: 'from-lidera-light-blue to-gray-600'
    },
    {
      id: 'metodologia',
      title: 'Metodología',
      description: 'Blended learning con talleres presenciales en Jerez/Valencia y prácticas online',
      icon: <FaChalkboardTeacher className="text-2xl" />,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'modulos',
      title: 'Módulos',
      description: '10 módulos desde fundamentos hasta trabajo final, incluyendo terapia cognitiva, familia, recovery coaching, género e inteligencia emocional',
      icon: <FaBook className="text-2xl" />,
      color: 'from-gray-600 to-gray-700'
    },
    {
      id: 'profesorado',
      title: 'Profesorado',
      description: '4 expertos con más de 25 años de experiencia en adicciones',
      icon: <FaUsers className="text-2xl" />,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'contacto',
      title: 'Contacto',
      description: 'Matrícula abierta junio 2025, financiación Fundae disponible',
      icon: <FaPhone className="text-2xl" />,
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Resumen del Programa</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Descubre todos los aspectos de nuestro Máster en Adicciones e Intervención
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
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Terapia y rehabilitación" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
        </div>
        <div className="relative z-10 px-8 py-16 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Transforma Vidas a Través de la 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Intervención Especializada</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Máster orientado a la práctica, centrado en el diseño y aplicación de intervenciones terapéuticas eficaces frente a las adicciones y conductas autodestructivas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaAward className="mr-2 text-yellow-400" />
                <span className="text-sm font-medium">Certificación Oficial</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaUserFriends className="mr-2 text-green-400" />
                <span className="text-sm font-medium">Profesorado Experto</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FaLaptop className="mr-2 text-lidera-light-blue" />
                <span className="text-sm font-medium">Modalidad Blended</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Información del Programa</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">Un programa integral diseñado para formar profesionales especializados en el tratamiento de adicciones</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-8 max-w-md mx-auto">
          <StatCard titulo="Duración" value="Octubre 2025 - Junio 2026" icon={<FaClock />} />
        </div>
        <div className="mt-12 text-center">
          <button className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg">
            <FaStar className="inline mr-2" />
            Inscríbete Ahora
          </button>
        </div>
      </section>
    </>
  );
}

function MetodologiaSection() {
  return (
    <section>
      {/* Header with image */}
      <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Metodología de aprendizaje" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/80"></div>
        </div>
        <div className="relative z-10 px-8 py-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Metodología Innovadora</h2>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Modalidad <strong className="text-yellow-400">blended learning</strong> que combina la flexibilidad del aprendizaje online 
            con la experiencia práctica de talleres presenciales especializados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TalleresPresenciales />
        <PracticasOnline />
      </div>
    </section>
  );
}

function TalleresPresenciales() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-lidera-light-blue to-gray-600 p-3 rounded-full mr-4">
          <FaUsers className="text-white text-xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Talleres Presenciales</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-gray-700">
          <FaClock className="text-lidera-light-blue mr-3" />
          <span><strong>Duración:</strong> Domingo intensivo (09:00 - 15:00 h)</span>
        </div>
        <div className="flex items-center text-gray-700">
          <FaMapMarkerAlt className="text-red-500 mr-3" />
          <span><strong>Lugar:</strong> Reinservida en Jerez</span>
        </div>
        <div className="flex items-center text-gray-700">
          <FaUserFriends className="text-green-500 mr-3" />
          <span><strong>Mínimo:</strong> 15 alumnos para Jerez</span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <p className="text-sm text-gray-800">
          <FaHome className="inline mr-2" />
          Si no se alcanza el mínimo, los talleres se realizarán en Valencia sin gastos adicionales.
        </p>
      </div>
      
      <div>
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <FaBook className="text-lidera-light-blue mr-2" />
          Temarios Especializados:
        </h4>
        <div className="space-y-2">
          <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
            <FaHeart className="text-pink-500 mr-3" />
            <span className="font-medium">El Perdón Interior</span>
          </div>
          <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
            <FaBrain className="text-lidera-light-blue mr-3" />
            <span className="font-medium">Inteligencia Emocional</span>
          </div>
          <div className="flex items-center bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg">
            <FaUserFriends className="text-teal-500 mr-3" />
            <span className="font-medium">Intervención Familiar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PracticasOnline() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-full mr-4">
          <FaLaptop className="text-white text-xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Prácticas Online</h3>
      </div>
      
      <div className="mb-6">
        <img 
          src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
          alt="Sesiones online" 
          className="w-full h-32 object-cover rounded-xl mb-4"
        />
        <p className="text-gray-700 leading-relaxed">
          Acceso a sesiones grupales online donde aplicar los conocimientos adquiridos en un entorno colaborativo y supervisado.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <FaChalkboardTeacher className="text-green-600 mr-3" />
            <span className="font-bold text-gray-800">Terapia Grupal</span>
          </div>
          <p className="text-sm text-gray-700">Tres sesiones online dirigidas por especialistas en adicciones</p>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <FaHandsHelping className="text-lidera-light-blue mr-3" />
            <span className="font-bold text-gray-800">Networking Profesional</span>
          </div>
          <p className="text-sm text-gray-700">Talleres y seminarios para crear redes profesionales especializadas</p>
        </div>
      </div>
    </div>
  );
}

function ModulosSection() {
  const modulos = [
    {
      numero: 1,
      nombre: "Fundamentos del Programa Terapéutico en Adicciones",
      temas: [
        "Fases de un programa terapéutico",
        "Autonomía del paciente en entornos no supervisados",
        "Rol del entorno en el proceso de recuperación",
        "Farmacoterapia: uso de fármacos interdictores y de apoyo",
      ],
      resumen:
        "Se enseñan los elementos esenciales de un tratamiento integral, desde la desintoxicación hasta el mantenimiento de la abstinencia, incluyendo el abordaje en contextos abiertos.",
    },
    {
      numero: 2,
      nombre: "Terapia Cognitiva de las Drogodependencias",
      temas: [
        "Fundamentos de la Terapia Cognitivo-Conductual (TCC)",
        "Principios de la Terapia de Aceptación y Compromiso (ACT)",
        "Introducción a Mindfulness como herramienta terapéutica",
        "Modelo transteórico del cambio (Prochaska y DiClemente)",
      ],
      resumen:
        "Brinda una base teórica y práctica sobre la terapia cognitiva utilizada en el tratamiento de las adicciones.",
    },
    {
      numero: 3,
      nombre: "Familia y Trabajo en Equipo",
      temas: [
        "Principios del enfoque sistémico",
        "Ciclos vitales familiares y crisis",
        "Roles, reglas y lealtades familiares",
      ],
      resumen:
        "Capacita al estudiante en el análisis y abordaje de las dinámicas familiares como sistema.",
    },
    {
      numero: 4,
      nombre: "Recovery Coaching en Adicciones",
      temas: ["Burnout y estrategias de prevención", "Relación terapéutica y contratransferencia"],
      resumen:
        "Ofrece un espacio de reflexión y formación sobre la práctica profesional, con énfasis en el Recovery Coaching.",
    },
    {
      numero: 5,
      nombre: "Psicología Aplicada a las Adicciones",
      temas: [
        "Negación y ambivalencia frente al cambio",
        "Psicoeducación para pacientes y familias",
      ],
      resumen:
        "Profundiza en las dinámicas psicológicas de la persona adicta y su entorno, ofreciendo herramientas para facilitar el insight.",
    },
    {
      numero: 6,
      nombre: "Intervención Familiar y Recovery Mentoring",
      temas: [
        "Impacto de la adicción en la estructura familiar",
        "Rol del mentor en recuperación",
      ],
      resumen:
        "Capacita al estudiante para trabajar con la familia como parte del proceso de recuperación.",
    },
    {
      numero: 7,
      nombre: "Nuevos Modelos Terapéuticos Aplicados a las Adicciones",
      temas: [
        "Técnica de los cinco pasos",
        "Reencuentro con el niño interior y trabajo con el trauma",
      ],
      resumen:
        "Ofrece enfoques contemporáneos e integradores para abordar las raíces emocionales de la adicción.",
    },
    {
      numero: 8,
      nombre: "Gestión de las Adicciones desde la Perspectiva de Género",
      temas: [
        "Violencias asociadas y consumo en mujeres",
        "Masculinidades y adicción",
      ],
      resumen:
        "Profundiza en cómo las cuestiones de género atraviesan la experiencia adictiva y su tratamiento.",
    },
    {
      numero: 9,
      nombre: "Inteligencia Emocional",
      temas: [
        "Estructuras cerebrales implicadas en la adicción",
        "Gestión de las emociones disfuncionales",
      ],
      resumen:
        "Brinda fundamentos científicos para entender cómo las adicciones afectan nuestras emociones.",
    },
    {
      numero: 10,
      nombre: "Trabajo Final de Máster",
      temas: [],
      resumen:
        "Elaboración de un proyecto inédito e innovador sobre cualquier aspecto metodológico relacionado con las adicciones.",
    },
  ];

  return (
    <section>
      {/* Header with image */}
      <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Módulos académicos" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/80"></div>
        </div>
        <div className="relative z-10 px-8 py-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Programa Académico</h2>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            10 módulos especializados que abarcan desde los fundamentos teóricos hasta las técnicas más innovadoras en el tratamiento de adicciones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {modulos.map((modulo) => (
          <ModuloCard key={modulo.numero} modulo={modulo} />
        ))}
      </div>
    </section>
  );
}

function ModuloCard({ modulo }) {
  const getModuleIcon = (numero) => {
    const icons = {
      1: <FaBook className="text-blue-500" />,
      2: <FaBrain className="text-purple-500" />,
      3: <FaUserFriends className="text-green-500" />,
      4: <FaHandsHelping className="text-orange-500" />,
      5: <FaHeart className="text-red-500" />,
      6: <FaUsers className="text-teal-500" />,
      7: <FaStar className="text-yellow-500" />,
      8: <FaAward className="text-pink-500" />,
      9: <FaBrain className="text-indigo-500" />,
      10: <FaGraduationCap className="text-gray-700" />
    };
    return icons[numero] || <FaBook className="text-blue-500" />;
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
      <div className="flex items-start mb-6">
        <div className="bg-gray-50 p-4 rounded-full mr-4 group-hover:bg-blue-50 transition-colors duration-300">
          <div className="text-2xl">{getModuleIcon(modulo.numero)}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
              Módulo {modulo.numero}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 leading-tight">
            {modulo.nombre}
          </h3>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed bg-gray-50 p-4 rounded-xl italic">
        {modulo.resumen}
      </p>
      
      {modulo.temas.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
            <FaChalkboardTeacher className="text-blue-500 mr-2" />
            Contenidos:
          </h4>
          <div className="space-y-2">
            {modulo.temas.map((tema, index) => (
              <div key={index} className="flex items-start bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm text-gray-700 font-medium">{tema}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfesoradoSection() {
  const profesores = [
    {
      nombre: "José Manuel Zaldua Mellado",
      cargo: "Fundador de Reinservida y Director terapéutico",
      detalles: "Psicólogo y Experto en Detección e Intervención en la adicción a las nuevas tecnologías.",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      nombre: "Javier Carbonell Lledó",
      cargo: "Psicoterapeuta con más de 25 años de experiencia",
      detalles:
        "Director del Instituto Lidera y conferenciante en el ámbito de las adicciones.",
      avatar: "https://images.unsplash.com/photo-1594824388853-d0c4e3efb5d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      nombre: "Lidia de Ramón",
      cargo: "Terapeuta especializada en conductas adictivas",
      detalles:
        "Directora del área terapéutica de Síndrome-Adicciones. Intervencionista en adicciones y especialista en tratamientos de juego de azar.",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      nombre: "Montserrat Pintado Gellida",
      cargo: "Asesora terapéutica y responsable de gestión comercial",
      detalles:
        "Experta en Intervención Familiar en Adicciones y profesora del Master.",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
  ];

  return (
    <section>
      {/* Header with image */}
      <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Equipo de profesores" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-teal-900/80"></div>
        </div>
        <div className="relative z-10 px-8 py-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Nuestro Equipo Docente</h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            Profesionales con más de 25 años de experiencia en el tratamiento y la investigación de adicciones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {profesores.map((profesor) => (
          <ProfesorCard key={profesor.nombre} profesor={profesor} />
        ))}
      </div>
    </section>
  );
}

function ProfesorCard({ profesor }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
      <div className="flex items-start mb-6">
        <div className="relative mr-6">
          <img 
            src={profesor.avatar} 
            alt={profesor.nombre}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-teal-600 w-8 h-8 rounded-full flex items-center justify-center">
            <FaChalkboardTeacher className="text-white text-sm" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{profesor.nombre}</h3>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-3">
            {profesor.cargo}
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-xl">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center">
          <FaUserFriends className="text-green-600 mr-2" />
          Experiencia:
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">{profesor.detalles}</p>
      </div>
    </div>
  );
}

function ContactoSection() {
  return (
    <section>
      {/* Header with image */}
      <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Contacto e información" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
        </div>
        <div className="relative z-10 px-8 py-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Información y Contacto</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            ¿Tienes dudas? Estamos aquí para ayudarte. Contacta con nosotros para más información sobre el máster.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información de Contacto */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full mr-4">
              <FaPhone className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Contacto Directo</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors duration-200">
              <FaPhone className="text-blue-600 mr-4 text-lg" />
              <div>
                <p className="font-semibold text-gray-800">Teléfono</p>
                <p className="text-blue-600 font-medium">691 29 83 17 / 622 25 86 15</p>
              </div>
            </div>
            
            <div className="flex items-center bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors duration-200">
              <FaEnvelope className="text-blue-600 mr-4 text-lg" />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-blue-600 font-medium">liderainstituto@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors duration-200">
              <FaMapMarkerAlt className="text-blue-600 mr-4 text-lg mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Dirección</p>
                <p className="text-gray-700">C/ Poeta Mas y Ros nº 41 bajo<br />46022 Valencia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información Académica */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-full mr-4">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Información Académica</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-green-600 mr-3" />
                <p className="font-semibold text-gray-800">Matrícula</p>
              </div>
              <p className="text-gray-700 ml-6">Abierta durante todo el mes de junio de 2025</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-green-600 mr-3" />
                <p className="font-semibold text-gray-800">Inicio del Máster</p>
              </div>
              <p className="text-gray-700 ml-6">Octubre de 2025 (primera edición)</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <FaEuroSign className="text-green-600 mr-3" />
                <p className="font-semibold text-gray-800">Financiación</p>
              </div>
              <p className="text-gray-700 ml-6">Ayudamos a gestionar bonificaciones de la Fundación Tripartita (Fundae)</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <FaUsers className="text-green-600 mr-3" />
                <p className="font-semibold text-gray-800">Descuentos</p>
              </div>
              <p className="text-gray-700 ml-6">Consultar descuentos especiales para familiares y personas vinculadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ titulo, value, icon }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center group border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
        <div className="text-white text-2xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{titulo}</h3>
      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{value}</p>
    </div>
  );
}

export default MasterAdiccionesContent;
