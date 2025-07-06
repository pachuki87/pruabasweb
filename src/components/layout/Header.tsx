import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import CartIcon from '../CartIcon';
import logo2 from '../../assets/logo 2.png';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2">
              <img src={logo2} alt="Logo" className="h-20 w-20" />
              <span>Inicio</span>
            </a>
            <a href="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">Cursos</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Formación</a>
            <a href="/viajes-y-talleres" className="text-gray-700 hover:text-blue-600 transition-colors">Viajes y Talleres</a>
            <a href="/testimonios" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonios</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
          </nav>

          {/* Search, Cart, Login and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Cart Icon */}
            <CartIcon />
            
            {/* Login Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <a
                href="/login/student"
                className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                Estudiante
              </a>
              <a
                href="/login/teacher"
                className="px-4 py-2 text-sm bg-lidera-light-blue text-white rounded-lg hover:bg-[#6a96c0] transition-colors"
              >
                Profesor
              </a>
            </div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-lidera-light-blue transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lidera-light-blue focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200">
            <nav className="px-4 py-6 space-y-4">
              <a href="/" className="block text-gray-700 hover:text-lidera-light-blue transition-colors flex items-center space-x-2">
                    <img src={logo2} alt="Logo" className="h-20 w-20" />
                    <span>Inicio</span>
                  </a>
              <a href="/courses" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Cursos</a>
              <a href="#" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Formación</a>
              <a href="/viajes-y-talleres" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Viajes y Talleres</a>
              <a href="/testimonios" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Testimonios</a>
              <a href="/contact" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Contacto</a>
              
              {/* Mobile Login Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <a
                  href="/login/student"
                  className="block w-full px-4 py-2 text-center text-gray-700 border border-gray-300 rounded-lg hover:text-lidera-light-blue hover:border-lidera-light-blue transition-colors"
                >
                  Acceso Estudiante
                </a>
                <a
                  href="/login/teacher"
                  className="block w-full px-4 py-2 text-center bg-lidera-light-blue text-white rounded-lg hover:bg-[#6a96c0] transition-colors"
                >
                  Acceso Profesor
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
