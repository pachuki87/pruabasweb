import React from 'react';
import { Facebook, Twitter, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="mb-2">C. del Poeta Mas y Ros, 41</p>
            <p className="mb-2">Algirós, 46022 València</p>
            <p className="mb-2">Valencia</p>
            <p className="mb-2">Tel: 644 30 02 86</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Horario</h3>
            <p className="mb-1">Lunes a Viernes:</p>
            <p className="mb-2">9:00–14:00, 17:00–22:00</p>
            <p className="mb-1">Sábado y Domingo:</p>
            <p>Cerrado</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
        <div className="flex justify-center space-x-4 mb-4">
          <a 
            href="#" 
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a 
            href="#" 
            className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
          <a 
            href="#" 
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            aria-label="Google"
          >
            <Mail size={20} />
          </a>
          <a 
            href="#" 
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition-colors"
            aria-label="Github"
          >
            <Github size={20} />
          </a>
        </div>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Instituto Lidera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;