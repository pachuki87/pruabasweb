import { GraduationCap, Briefcase, Users, BookOpen } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
<<<<<<< HEAD
      titulo: "MASTER EN ADICCIONES E INTERVENCIÓN",
      subtitle: "82 ESTUDIANTES",
      programs: ["Neurobiología de las Adicciones", "Intervención Psicosocial", "Terapias Especializadas", "Prevención y Rehabilitación"],
      color: "bg-lidera-light-blue",
      link: "https://academialidera.es",
      image: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      icon: <Users className="h-8 w-8" />,
      titulo: "EXPERTO EN CONDUCTAS ADICTIVAS",
      subtitle: "83 ESTUDIANTES",
      programs: ["Psicología de las Adicciones", "Conductas Compulsivas", "Intervención Familiar", "Casos Clínicos"],
      color: "bg-lidera-light-blue",
      link: "/experto-conductas-adictivas",
      image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
=======
      title: "MASTER EN ADICCIONES E INTERVENCIÓN",
      subtitle: "82 ESTUDIANTES",
      programs: ["Neurobiología de las Adicciones", "Intervención Psicosocial", "Terapias Especializadas", "Prevención y Rehabilitación"],
      color: "bg-red-600",
      link: "/master-adicciones-intervencion",
      image: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "MASTER EN ADICCIONES",
      subtitle: "29 ESTUDIANTES",
      programs: ["Fundamentos de Adicciones", "Evaluación y Diagnóstico", "Tratamiento Integral", "Investigación Aplicada"],
      color: "bg-gray-800",
      link: "/master-adicciones",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "EXPERTO EN CONDUCTAS ADICTIVAS",
      subtitle: "83 ESTUDIANTES",
      programs: ["Psicología de las Adicciones", "Conductas Compulsivas", "Intervención Familiar", "Casos Clínicos"],
      color: "bg-red-600",
      link: "/experto-conductas-adictivas",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
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
<<<<<<< HEAD
            <a href="/courses" className="bg-lidera-light-blue hover:bg-[#6a96c0] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
=======
            <a href="/courses" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
              VER TODOS LOS CURSOS
            </a>
          </div>
          
          <div className="lg:col-span-2">
<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
=======
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
              {programs.map((program, index) => (
                <a
                  key={index}
                  href={program.link}
<<<<<<< HEAD
                  target={program.link.startsWith('http') ? '_blank' : '_self'}
                  rel={program.link.startsWith('http') ? 'noopener noreferrer' : undefined}
=======
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                  className={`${program.color} text-white rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer group block`}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={program.image}
<<<<<<< HEAD
                      alt={program.titulo}
=======
                      alt={program.title}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <div className="text-white">
                        {program.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
<<<<<<< HEAD
                    <h3 className="text-xl font-bold mb-2">{program.titulo}</h3>
=======
                    <h3 className="text-xl font-bold mb-2">{program.title}</h3>
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                    <p className="text-sm opacity-80 mb-4">{program.subtitle}</p>
                    
                    <div className="space-y-2">
                      {program.programs.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm opacity-90">
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
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
