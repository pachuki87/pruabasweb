import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import CartIcon from '../cart/CartIcon';
import Cart from '../cart/Cart';
import logo2 from '../../assets/logo 2.png';
import { useAuth } from '../../contexts/AuthContext';
import { getUserById } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

interface UserData {
  nombre?: string;
  name?: string;
  email?: string;
}

const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Obtener datos del usuario desde la base de datos
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoadingUserData(true);
        try {
          const userDataFromDb = await getUserById(user.id);
          if (userDataFromDb) {
            setUserData({
              nombre: userDataFromDb.nombre,
              name: userDataFromDb.name,
              email: userDataFromDb.email
            });
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
        } finally {
          setLoadingUserData(false);
        }
      } else {
        setUserData(null);
      }
    };

    fetchUserData();
  }, [user]);

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
            <a href="/formacion" className="text-gray-700 hover:text-blue-600 transition-colors">Formación</a>
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
            <CartIcon onClick={() => setIsCartOpen(true)} className="text-gray-600 hover:text-blue-600" />
            
            {/* User Authentication Section */}
            <div className="hidden md:flex items-center space-x-2">
              {loadingUserData ? (
                <div className="text-sm text-gray-500">Cargando...</div>
              ) : user && userData ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Bienvenido, {userData.nombre || userData.name || userData.email || 'Usuario'}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                    }}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
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
              )}
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
              <div className="flex flex-col items-center mb-4">
                <img src={logo2} alt="Logo" className="h-20 w-20" />
              </div>
              <a href="/" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">
                Inicio
              </a>
              <a href="/courses" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Cursos</a>
              <a href="/formacion" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Formación</a>
              <a href="/viajes-y-talleres" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Viajes y Talleres</a>
              <a href="/testimonios" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Testimonios</a>
              <a href="/contact" className="block text-gray-700 hover:text-lidera-light-blue transition-colors">Contacto</a>
              
              {/* Mobile Authentication Section */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {loadingUserData ? (
                  <div className="text-sm text-gray-500 text-center">Cargando...</div>
                ) : user && userData ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Bienvenido, {userData.nombre || userData.name || userData.email || 'Usuario'}</span>
                    </div>
                    <button
                      onClick={async () => {
                        await signOut();
                        navigate('/');
                      }}
                      className="flex items-center justify-center space-x-1 w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
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
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
