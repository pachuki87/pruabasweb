import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';
import CourseCard from '../components/courses/CourseCard';

interface CoursesPageProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

type Curso = {
  id: string;
  titulo: string;
  imagen: string;
  inscripcion: number;
};

function CoursesPage({ currentRole, onRoleChange }: CoursesPageProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select('id, titulo, imagen_url');

      if (error) {
        console.error('Error al obtener cursos de Supabase:', error);
        throw error;
      }

      const cursosFormateados = data.map(curso => ({
        id: curso.id,
        titulo: curso.titulo,
        imagen: curso.imagen_url || '',
        inscripcion: Math.floor(Math.random() * 100) + 1,
      }));

      setCursos(cursosFormateados);
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      setCursos([]);
    } finally {
      setIsLoading(false);
    }
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
          ) : cursos.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">
              No hay cursos disponibles.
            </p>
          ) : (
            cursos.map(curso => (
              <CourseCard
                key={curso.id}
                id={curso.id}
                title={curso.titulo}
                image={curso.imagen}
                enrollment={curso.inscripcion}
                role={currentRole}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
