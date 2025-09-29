import React from 'react';
import { GraduationCap, Briefcase, Users, BookOpen } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Master's & Management",
      subtitle: "ADMISSIONS",
      programs: ["Global Executive MBA", "Executive MBA", "MBA", "Master in Management", "PhD in Management"],
      color: "bg-red-600"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "FORMACIÓN EJECUTIVA",
      subtitle: "EXECUTIVE EDUCATION",
      programs: ["AMP - Advanced Management Program", "PADE - Programa Alta Dirección", "PMD - Program for Management Development"],
      color: "bg-gray-800"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "COMPETENCIAS Y LIDERAZGO",
      subtitle: "LEADERSHIP PROGRAMS",
      programs: ["CDP - Chief Digital Program", "WLP - Women Leadership Program", "YMP - Young Managers Program"],
      color: "bg-red-600"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "PROGRAMAS CUSTOM",
      subtitle: "CUSTOM PROGRAMS",
      programs: ["In-company programs", "Open enrollment programs", "Consulting projects"],
      color: "bg-gray-800"
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
              Programas diseñados para desarrollar líderes empresariales con una sólida 
              formación que combina excelencia académica y valores humanísticos.
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
                  className={`${program.color} text-white p-8 rounded-2xl hover:scale-105 transition-transform cursor-pointer`}
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