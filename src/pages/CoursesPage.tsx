import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/layout/Header';
import CourseCard from '../components/courses/CourseCard';
import { useLocation } from 'react-router-dom';

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
  const [cursosFiltrados, setCursosFiltrados] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    obtenerCursos();
  }, []);
  
  useEffect(() => {
    // Obtener el parámetro de búsqueda de la URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    
    if (searchQuery && cursos.length > 0) {
      // Filtrar cursos según el término de búsqueda
      const resultados = cursos.filter(curso =>
        curso.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCursosFiltrados(resultados);
    } else {
      setCursosFiltrados(cursos);
    }
  }, [location.search, cursos]);

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
        imagen: curso.titulo.toLowerCase().includes('experto en conductas adictivas') ? '' : (curso.imagen_url || ''), // Si es "Experto en Conductas Adictivas", forzar imagen vacía para usar lógica de CourseCard
        inscripcion: Math.floor(Math.random() * 100) + 1,
      }));

      setCursos(cursosFormateados);
      
      // Inicializar cursos filtrados con todos los cursos
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get('search');
      
      if (searchQuery) {
        const resultados = cursosFormateados.filter(curso =>
          curso.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setCursosFiltrados(resultados);
      } else {
        setCursosFiltrados(cursosFormateados);
      }
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      setCursos([]);
      setCursosFiltrados([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header currentRole={currentRole} onRoleChange={onRoleChange} />
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Cursos <span className="text-lidera-light-blue">Disponibles</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Explora nuestra amplia gama de cursos diseñados para ayudarte a tener éxito
          </p>
          {location.search && (
            <div className="mb-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <p className="text-lg text-gray-300">
                Resultados de búsqueda para: <span className="font-semibold text-lidera-light-blue">"{new URLSearchParams(location.search).get('search')}"</span>
                {cursosFiltrados.length === 0 && " - No se encontraron cursos"}
                {cursosFiltrados.length > 0 && ` - ${cursosFiltrados.length} curso(s) encontrado(s)`}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <p className="col-span-full text-center text-gray-300">
              Cargando cursos...
            </p>
          ) : cursosFiltrados.length === 0 ? (
            <p className="col-span-full text-center text-gray-300">
              No hay cursos disponibles.
            </p>
          ) : (
            cursosFiltrados.map(curso => (
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
