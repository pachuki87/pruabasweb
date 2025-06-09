import { GraduationCap, Briefcase, Users, BookOpen } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "MASTER EN ADICCIONES E INTERVENCIÓN",
      subtitle: "82 ESTUDIANTES",
      programs: ["Neurobiología de las Adicciones", "Intervención Psicosocial", "Terapias Especializadas", "Prevención y Rehabilitación"],
      color: "bg-red-600",
      link: "/master-adicciones-intervencion"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "MASTER EN ADICCIONES",
      subtitle: "29 ESTUDIANTES",
      programs: ["Fundamentos de Adicciones", "Evaluación y Diagnóstico", "Tratamiento Integral", "Investigación Aplicada"],
      color: "bg-gray-800",
      link: "/master-adicciones"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "EXPERTO EN CONDUCTAS ADICTIVAS",
      subtitle: "83 ESTUDIANTES",
      programs: ["Psicología de las Adicciones", "Conductas Compulsivas", "Intervención Familiar", "Casos Clínicos"],
      color: "bg-red-600",
      link: "/experto-conductas-adictivas"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="text-white">
            <h2 className="text-5xl font-bold mb-6">
              Encuentra<br />
              tu<br />
              programa
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Programas especializados en adicciones e intervención psicosocial, diseñados 
              para formar profesionales expertos en el tratamiento y prevención de conductas adictivas.
            </p>
            <a href="/courses" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
              VER TODOS LOS CURSOS
            </a>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <a
                  key={index}
                  href={program.link}
                  className={`${program.color} text-white p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer block`}
                >
                  <div className="mb-4">
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                  <p className="text-sm opacity-80 mb-4">{program.subtitle}</p>
                  <ul className="space-y-2">
                    {program.programs.map((prog, idx) => (
                      <li key={idx} className="text-sm opacity-90">
                        • {prog}
                      </li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
