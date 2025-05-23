import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

type AboutPageProps = {
  currentRole: string;
  onRoleChange: (role: string) => void;
};

const AboutPage: React.FC<AboutPageProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
