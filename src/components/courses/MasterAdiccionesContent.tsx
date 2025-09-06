import React, { useState } from 'react';
import { FaGraduationCap, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaEuroSign, FaPhone, FaEnvelope, FaHome, FaBook, FaChalkboardTeacher, FaLaptop, FaHandsHelping } from 'react-icons/fa';
import { getMasterPrice } from '../../config/pricing';

const MasterAdiccionesContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Máster en Adicciones e Intervención Psicosocial</h1>
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
                activeTab === tab ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "inicio" && <HomeSection />}
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

function HomeSection() {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sobre el Máster</h2>
        <p className="mb-4">
          El Máster en Adicciones e Intervención Psicosocial es una formación orientada a la práctica,
          centrada en el diseño y aplicación de intervenciones terapéuticas eficaces frente a las adicciones
          y conductas autodestructivas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard titulo="Duración" value="Octubre 2025 - Junio 2026" />
          <StatCard titulo="Plazas" value="20 - 80 por edición" />
          <StatCard titulo="Precio" value={`${getMasterPrice()} €`} />
        </div>
        <div className="mt-6 text-center">
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
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
      <h2 className="text-2xl font-semibold mb-4">Metodología</h2>
      <p className="mb-4">
        El máster sigue una modalidad <strong>blended learning</strong>, combinando clases teóricas online
        con talleres prácticos presenciales. Esta metodología permite una mayor flexibilidad a los alumnos,
        quienes podrán organizar su tiempo de estudio y aplicar los conocimientos en entornos controlados
        durante los talleres.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TalleresPresenciales />
        <PracticasOnline />
      </div>
    </section>
  );
}

function TalleresPresenciales() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3">Talleres Presenciales</h3>
      <ul className="space-y-2 list-disc pl-5">
        <li>
          <strong>Duración:</strong> Domingo intensivo (09:00 - 15:00 h)
        </li>
        <li>
          <strong>Lugar:</strong> Reinservida en Jerez
        </li>
        <li>
          <strong>Mínimo de alumnos:</strong> 15 para desplazamiento a Jerez
        </li>
        <li>
          Si no se alcanza el mínimo, los talleres se realizarán en Valencia sin gastos adicionales.
        </li>
      </ul>
      <h4 className="mt-4 font-medium">Temarios:</h4>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>El Perdón Interior</li>
        <li>Inteligencia Emocional</li>
        <li>Intervención Familiar</li>
      </ul>
    </div>
  );
}

function PracticasOnline() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3">Prácticas Online</h3>
      <p className="mb-3">
        Los estudiantes tendrán acceso a sesiones grupales online donde podrán poner en práctica los
        conocimientos adquiridos.
      </p>
      <ul className="space-y-2 list-disc pl-5">
        <li>Tres sesiones online de Terapia Grupal dirigidas por un especialista.</li>
        <li>Talleres y seminarios para actualizar conocimientos y crear redes profesionales.</li>
      </ul>
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
      <h2 className="text-2xl font-semibold mb-6">Módulos del Máster</h2>
      <div className="space-y-6">
        {modulos.map((modulo) => (
          <ModuloCard key={modulo.numero} modulo={modulo} />
        ))}
      </div>
    </section>
  );
}

function ModuloCard({ modulo }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">
        {modulo.numero}. {modulo.nombre}
      </h3>
      <p className="text-sm italic text-gray-600 mb-3">{modulo.resumen}</p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {modulo.temas.map((tema, index) => (
          <li key={index}>{tema}</li>
        ))}
      </ul>
    </div>
  );
}

function ProfesoradoSection() {
  const profesores = [
    {
      nombre: "José Manuel Zaldua Mellado",
      cargo: "Fundador de Reinservida y Director terapéutico",
      detalles: "Psicólogo y Experto en Detección e Intervención en la adicción a las nuevas tecnologías.",
    },
    {
      nombre: "Javier Carbonell Lledó",
      cargo: "Psicoterapeuta con más de 25 años de experiencia",
      detalles:
        "Director del Instituto Lidera y conferenciante en el ámbito de las adicciones.",
    },
    {
      nombre: "Lidia de Ramón",
      cargo: "Terapeuta especializada en conductas adictivas",
      detalles:
        "Directora del área terapéutica de Síndrome-Adicciones. Intervencionista en adicciones y especialista en tratamientos de juego de azar.",
    },
    {
      nombre: "Montserrat Pintado Gellida",
      cargo: "Asesora terapéutica y responsable de gestión comercial",
      detalles:
        "Experta en Intervención Familiar en Adicciones y profesora del Master.",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">Profesorado</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profesores.map((profesor) => (
          <ProfesorCard key={profesor.nombre} profesor={profesor} />
        ))}
      </div>
    </section>
  );
}

function ProfesorCard({ profesor }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800">{profesor.nombre}</h3>
      <p className="text-sm text-gray-600 font-medium">{profesor.cargo}</p>
      <p className="mt-2 text-sm text-gray-700">{profesor.detalles}</p>
    </div>
  );
}

function ContactoSection() {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
      <div className="space-y-4 text-gray-700">
        <p>
          <strong>Teléfono:</strong> 691 29 83 17 / 622 25 86 15
        </p>
        <p>
          <strong>Email:</strong> liderainstituto@gmail.com
        </p>
        <p>
          <strong>Dirección:</strong> C/ Poeta Mas y Ros nº 41 bajo, 46022 Valencia
        </p>
        <p>
          <strong>Matrícula:</strong> Abierta durante todo el mes de junio de 2025
        </p>
        <p>
          <strong>Inicio del Máster:</strong> Octubre de 2025 (primera edición)
        </p>
        <p>
          <strong>Financiación:</strong> Ayudamos a gestionar bonificaciones de la Fundación Tripartita
          (Fundae)
        </p>
        <p>
          <strong>Descuentos:</strong> Consultar descuentos especiales para familiares y personas vinculadas
        </p>
      </div>
    </section>
  );
}

function StatCard({ titulo, value }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-gray-600">{titulo}</h3>
      <p className="text-xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}

export default MasterAdiccionesContent;
