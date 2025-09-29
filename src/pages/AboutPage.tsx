import React from 'react';
<<<<<<< HEAD
import Header from '../components/layout/Header';
=======
import Navbar from '../components/layout/Navbar';
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
import Footer from '../components/layout/Footer';

type AboutPageProps = {
  currentRole: string;
  onRoleChange: (role: string) => void;
};

const AboutPage: React.FC<AboutPageProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
<<<<<<< HEAD
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-center mb-12 leading-tight">
              Sobre <span className="text-blue-400">Nosotros</span>
            </h1>
            
            <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
              <p className="text-xl">
                ¡Bienvenido a nuestra plataforma de aprendizaje! Nos dedicamos a proporcionar educación de alta calidad
                a través de nuestro innovador entorno de aprendizaje en línea.
              </p>
              
              <p>
                Nuestra misión es hacer que la educación sea accesible para todos, en todas partes. Creemos en
                el poder del conocimiento y su capacidad para transformar vidas.
              </p>
              
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Nuestra <span className="text-blue-400">Visión</span>
                </h2>
                <p>
                  Crear una comunidad global de estudiantes y educadores, fomentando un entorno
                  donde el intercambio de conocimientos no tenga fronteras.
                </p>
              </div>
              
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Lo que <span className="text-blue-400">Ofrecemos</span>
                </h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                    Cursos interactivos en línea
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                    Instructores expertos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                    Horarios de aprendizaje flexibles
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                    Materiales de estudio completos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                    Soporte de la comunidad
                  </li>
                </ul>
              </div>
            </div>
=======
      <Navbar currentRole={currentRole} onRoleChange={onRoleChange} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Sobre Nosotros</h1>
          
          <div className="prose prose-lg mx-auto">
            <p className="mb-6">
              ¡Bienvenido a nuestra plataforma de aprendizaje! Nos dedicamos a proporcionar educación de alta calidad
              a través de nuestro innovador entorno de aprendizaje en línea.
            </p>
            
            <p className="mb-6">
              Nuestra misión es hacer que la educación sea accesible para todos, en todas partes. Creemos en
              el poder del conocimiento y su capacidad para transformar vidas.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Nuestra Visión</h2>
            <p className="mb-6">
              Crear una comunidad global de estudiantes y educadores, fomentando un entorno
              donde el intercambio de conocimientos no tenga fronteras.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Lo que Ofrecemos</h2>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Cursos interactivos en línea</li>
              <li className="mb-2">Instructores expertos</li>
              <li className="mb-2">Horarios de aprendizaje flexibles</li>
              <li className="mb-2">Materiales de estudio completos</li>
              <li>Soporte de la comunidad</li>
            </ul>
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
