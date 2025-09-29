import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { BookOpen, Users, Award, BookMarked, Target, Globe, Zap } from 'lucide-react';
import { supabase, getUsers } from '../lib/supabase';
import CourseCard from '../components/courses/CourseCard';

type HomePageCloneProps = {
  currentRole: string;
  onRoleChange: (role: string) => void;
};

type Curso = {
  id: string;
  titulo: string;
  imagen: string;
  inscripcion: number;
};

const HomePageClone: React.FC<HomePageCloneProps> = ({ currentRole, onRoleChange }) => {
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
        <section className="relative bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-800 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(147,51,234,0.1) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-200 rounded-full text-sm font-medium mb-4">
                    🚀 Innovación Educativa
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Impulsa tu
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                    Carrera Digital
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
                  Programas avanzados en tecnología y negocios digitales. 
                  Forma parte de la próxima generación de líderes digitales.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to={`/login/${currentRole}`}
                    className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Iniciar Ahora
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    to="/courses"
                    className="group border-2 border-purple-400/30 hover:border-purple-400/50 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:bg-purple-400/10 backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Ver Programas
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </span>
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">15K+</div>
                    <div className="text-sm text-slate-400">Profesionales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-400">75+</div>
                    <div className="text-sm text-slate-400">Cursos Tech</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">98%</div>
                    <div className="text-sm text-slate-400">Empleabilidad</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="relative z-10">
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Profesionales trabajando con tecnología"
                    className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  />
                  {/* Floating Cards */}
                  <div className="absolute -top-6 -left-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">IA & Machine Learning</div>
                        <div className="text-purple-200 text-sm">Futuro Ahora</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Certificación Pro</div>
                        <div className="text-indigo-200 text-sm">Industria 4.0</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl transform rotate-6 scale-105 -z-10"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                Tecnología Avanzada
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                ¿Por qué elegir
                <span className="text-purple-600"> TechAcademy Pro</span>?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Nuestra plataforma integra las últimas tecnologías con metodologías de aprendizaje adaptativo
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">IA Personalizada</h3>
                <p className="text-slate-600 leading-relaxed">
                  Algoritmos de machine learning que adaptan el contenido a tu ritmo y estilo de aprendizaje.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-purple-600 font-semibold text-sm">Adaptativo 100%</span>
                </div>
              </div>
              
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Mentores Globales</h3>
                <p className="text-slate-600 leading-relaxed">
                  Acceso directo a expertos de Google, Microsoft, Amazon y otras empresas tecnológicas líderes.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-indigo-600 font-semibold text-sm">FAANG Experts</span>
                </div>
              </div>
              
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookMarked className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Proyectos Reales</h3>
                <p className="text-slate-600 leading-relaxed">
                  Desarrolla aplicaciones y soluciones para empresas reales mientras aprendes.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-purple-600 font-semibold text-sm">Portfolio Pro</span>
                </div>
              </div>
              
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">Comunidad Tech</h3>
                <p className="text-slate-600 leading-relaxed">
                  Únete a una red de más de 25,000 desarrolladores y profesionales tech en todo el mundo.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-indigo-600 font-semibold text-sm">25K+ Devs</span>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-20 text-center">
              <p className="text-slate-500 mb-8">Certificado por las mejores empresas tecnológicas</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="bg-slate-100 px-6 py-3 rounded-lg">
                  <span className="font-semibold text-slate-700">Google Cloud</span>
                </div>
                <div className="bg-slate-100 px-6 py-3 rounded-lg">
                  <span className="font-semibold text-slate-700">AWS Partner</span>
                </div>
                <div className="bg-slate-100 px-6 py-3 rounded-lg">
                  <span className="font-semibold text-slate-700">Microsoft Learn</span>
                </div>
                <div className="bg-slate-100 px-6 py-3 rounded-lg">
                  <span className="font-semibold text-slate-700">Meta Blueprint</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Popular Courses Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Programas Más Demandados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cursos.map(curso => (
                <CourseCard
                  key={curso.id}
                  id={curso.id}
                  titulo={curso.titulo}
                  image={curso.imagen}
                  enrollment={curso.inscripcion}
                  role={currentRole}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/courses"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Explorar Todos los Programas
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-200 rounded-full text-sm font-medium mb-6">
                  🎯 Acelera tu Carrera
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                ¿Preparado para dominar
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  la tecnología?
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Únete a miles de profesionales que ya están construyendo el futuro. Desarrolla las habilidades que las empresas tech buscan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link
                  to="/register/student"
                  className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    Comenzar mi Evolución Tech
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                {/* Teacher registration disabled - only student registration allowed */}
              </div>
              
              {/* Success Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-purple-400 mb-2">96%</div>
                  <div className="text-slate-300">Inserción Laboral</div>
                  <div className="text-sm text-slate-400 mt-1">en 6 meses</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-indigo-400 mb-2">€95K</div>
                  <div className="text-slate-300">Salario Tech Promedio</div>
                  <div className="text-sm text-slate-400 mt-1">desarrolladores senior</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-purple-300 mb-2">200+</div>
                  <div className="text-slate-300">Empresas Tech</div>
                  <div className="text-sm text-slate-400 mt-1">contratan graduados</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePageClone;