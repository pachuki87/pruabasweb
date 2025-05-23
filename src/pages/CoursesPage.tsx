import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';

interface CoursesPageProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

type Course = {
  id: string;
  title: string;
  teacher_name: string;
};

function CoursesPage({ currentRole, onRoleChange }: CoursesPageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    // Datos de ejemplo para simular cursos sobre adicciones
    const exampleCourses: Course[] = [
      { id: '1', title: 'Máster en Prevención y Tratamiento de Adicciones', teacher_name: 'Dr. Elena Gómez' },
      { id: '2', title: 'Intervención en Adicciones Tecnológicas', teacher_name: 'Lic. Carlos Fernández' },
      { id: '3', title: 'Adicciones Comportamentales: Juego y Compras', teacher_name: 'Psic. Ana Torres' },
      { id: '4', title: 'Neurociencia de las Adicciones', teacher_name: 'Dr. Javier Ruíz' },
    ];

    setCourses(exampleCourses);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentRole={currentRole} onRoleChange={onRoleChange} />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cursos Disponibles</h1>
          <p className="text-xl text-gray-600 mb-12">
            Explora nuestra amplia gama de cursos diseñados para ayudarte a tener éxito
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <p className="col-span-full text-center text-gray-600">
              Cargando cursos...
            </p>
          ) : courses.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">
              No hay cursos disponibles.
            </p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-500">Profesor: {course.teacher_name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
