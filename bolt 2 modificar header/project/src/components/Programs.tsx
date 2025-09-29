import React from 'react';
import { GraduationCap, Briefcase, Users, BookOpen } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "LIDERAZGO EJECUTIVO",
      subtitle: "DESARROLLO DIRECTIVO",
      programs: ["Programa Superior en Liderazgo", "Dirección de Equipos", "Gestión del Cambio", "Comunicación Ejecutiva", "Toma de Decisiones"],
      color: "bg-red-600",
      image: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "GESTIÓN EMPRESARIAL",
      subtitle: "MANAGEMENT SKILLS",
      programs: ["Dirección General", "Gestión Financiera", "Marketing y Ventas", "Recursos Humanos", "Operaciones y Logística"],
      color: "bg-gray-800",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "HABILIDADES DIRECTIVAS",
      subtitle: "SOFT SKILLS",
      programs: ["Inteligencia Emocional", "Negociación Avanzada", "Presentaciones Ejecutivas", "Coaching Empresarial", "Trabajo en Equipo"],
      color: "bg-red-600",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "FORMACIÓN IN-COMPANY",
      subtitle: "SOLUCIONES A MEDIDA",
      programs: ["Programas corporativos", "Consultoría organizacional", "Desarrollo de talento", "Transformación digital", "Cultura empresarial"],
      color: "bg-gray-800",
      image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="text-white">
            <h2 className="text-5xl font-bold mb-6">
              Encuentra<br />
              tu<br />
              programa
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Programas diseñados para desarrollar líderes empresariales con una sólida 
              formación que combina excelencia académica, metodología práctica y casos reales.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              VER TODOS LOS PROGRAMAS
            </button>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className={`${program.color} text-white rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer group`}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      {program.icon}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                    <p className="text-sm opacity-80 mb-4">{program.subtitle}</p>
                    <ul className="space-y-2">
                      {program.programs.map((prog, idx) => (
                        <li key={idx} className="text-sm opacity-90">
                          • {prog}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;