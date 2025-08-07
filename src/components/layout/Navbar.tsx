import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Importamos los iconos necesarios
import { Menu, X, Search } from 'lucide-react';
import CartIcon from '../CartIcon';

type NavbarProps = {
  onRoleChange?: (role: string) => void;
  currentRole?: string;
};

const Navbar: React.FC<NavbarProps> = ({ onRoleChange, currentRole = 'student' }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirigir a la página de cursos con el parámetro de búsqueda
    window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Top bar with logo and mobile menu button */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Instituto Lidera</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Search form - visible on all screens but styled differently */}
        <div className="mt-4 md:mt-0 md:flex-grow md:ml-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por título del curso"
              className="py-2 px-3 pr-10 rounded-md text-gray-800 text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 h-full px-3 bg-yellow-500 rounded-r-md flex items-center justify-center"
              aria-label="Buscar"
            >
              <Search size={18} className="text-gray-800" />
            </button>
          </form>
        </div>
        
        {/* Navigation - desktop (always visible on md+) and mobile (toggleable) */}
        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium py-2 md:py-0 ${location.pathname === '/' ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}
            >
              Inicio
            </Link>
            <Link 
              to="/courses" 
              className={`text-sm font-medium py-2 md:py-0 ${location.pathname.includes('/courses') ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}
            >
              Cursos
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium py-2 md:py-0 ${location.pathname === '/about' ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}
            >
              Sobre Nosotros
            </Link>
            <Link 
              to="/faqs" 
              className={`text-sm font-medium py-2 md:py-0 ${location.pathname === '/faqs' ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`}
            >
              Preguntas Frecuentes
            </Link>
            
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center md:space-x-2 space-y-2 md:space-y-0">
              {/* Cart Icon */}
              <div className="flex justify-center md:justify-start">
                <CartIcon />
              </div>
              
              <Link
                to="/register"
                className="py-2 px-3 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Regístrate
              </Link>
              <Link
                to="/login"
                className="py-2 px-3 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
