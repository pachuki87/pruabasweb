import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { BookOpen, Users, Award, BookMarked } from 'lucide-react';
import { supabase, getUsers } from '../lib/supabase';
import CourseCard from '../components/courses/CourseCard';

type HomePageProps = {
  currentRole: string;
  onRoleChange: (role: string) => void;
};

type Curso = {
  id: string;
  titulo: string;
  imagen: string;
  inscripcion: number;
};

const HomePage: React.FC<HomePageProps> = ({ currentRole, onRoleChange }) => {
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      if (users) {
        console.log('Usuarios de Supabase:', users);
      }
    };
    fetchUsers();
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentRole={currentRole} onRoleChange={onRoleChange} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-950 text-white py-12 md:py-20 h-auto md:h-[57.5vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Aprende Sin Límites
                </h1>
                <p className="text-lg sm:text-xl mb-8 text-blue-100">
                  Descubre cursos impartidos por instructores expertos. Únete a miles de estudiantes que ya están aprendiendo en Instituto Lidera.
                </p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <Link
                    to={`/login/${currentRole}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    Comenzar
                  </Link>
                  <Link
                    to="/courses"
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg transition-colors"
                  >
                    Explorar Cursos
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex items-center justify-center px-4">
                <img
                  key="hero-image"
                  src="https://images.pexels.com/photos/4144294/pexels-photo-4144294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Estudiantes aprendiendo"
                  className="rounded-lg shadow-lg max-w-full h-auto object-contain md:object-cover max-h-[30vh] md:max-h-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir Instituto Lidera?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-blue-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cursos Diversos</h3>
                <p className="text-gray-600">
                  Elige entre una amplia gama de cursos en programación, diseño, negocios y más.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instructores Expertos</h3>
                <p className="text-gray-600">
                  Aprende de profesionales de la industria con experiencia real y conocimientos especializados.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookMarked className="text-yellow-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aprendizaje Interactivo</h3>
                <p className="text-gray-600">
                  Participa en cuestionarios, tareas y proyectos prácticos para reforzar tu aprendizaje.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-purple-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comunidad</h3>
                <p className="text-gray-600">
                  Conéctate con otros estudiantes para compartir ideas y colaborar en proyectos.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Popular Courses Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Cursos Populares</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cursos.map(curso => (
                <CourseCard
                  key={curso.id}
                  id={curso.id}
                  title={curso.titulo}
                  image={curso.imagen}
                  enrollment={curso.inscripcion}
                  role={currentRole}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explorar Todos los Cursos
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para Empezar a Aprender?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Únete a miles de estudiantes que ya están aprendiendo en nuestra plataforma. Regístrate hoy y da el primer paso hacia tus metas.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register/student"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Registrarse como Estudiante
              </Link>
              <Link
                to="/register/teacher"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg transition-colors"
              >
                Regístrate como profesor
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
