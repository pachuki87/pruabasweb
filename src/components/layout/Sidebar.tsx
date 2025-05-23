import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileQuestion, 
  PlusCircle, 
  Users, 
  Settings, 
  KeyRound,
  LogOut,
  Menu,
  X
} from 'lucide-react';

type SidebarProps = {
  role: string;
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile sidebar toggle button - only visible on small screens */}
      <button 
        className="fixed z-20 bottom-4 right-4 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Overlay - only on mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md fixed md:static inset-y-0 left-0 z-20 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 h-screen overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Panel de Control</h2>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú lateral"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-1">
              <li>
                <Link
                  to={`/${role}/dashboard`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isActive(`/${role}/dashboard`)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  <span>Panel de Control</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${role}/courses`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isActive(`/${role}/courses`) || location.pathname.includes(`/${role}/courses/`)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  <span>Mis Cursos</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${role}/quizzes`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isActive(`/${role}/quizzes`) || location.pathname.includes(`/${role}/quizzes/`)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileQuestion className="h-5 w-5 mr-3" />
                  <span>Cuestionarios</span>
                </Link>
              </li>
              {role === 'teacher' && (
                <>
                  <li>
                    <Link
                      to={`/${role}/quizzes/add`}
                      className={`flex items-center px-4 py-2 text-sm rounded-md ${
                        isActive(`/${role}/quizzes/add`)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <PlusCircle className="h-5 w-5 mr-3" />
                      <span>Añadir Cuestionario</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${role}/users`}
                      className={`flex items-center px-4 py-2 text-sm rounded-md ${
                        isActive(`/${role}/users`)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Users className="h-5 w-5 mr-3" />
                      <span>Mis Estudiantes</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${role}/courses/add`}
                      className={`flex items-center px-4 py-2 text-sm rounded-md ${
                        isActive(`/${role}/courses/add`)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <PlusCircle className="h-5 w-5 mr-3" />
                      <span>Añadir Curso</span>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to={`/${role}/profile`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isActive(`/${role}/profile`)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Configuración de Perfil</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/${role}/change-password`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    isActive(`/${role}/change-password`)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <KeyRound className="h-5 w-5 mr-3" />
                  <span>Cambiar Contraseña</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="flex items-center px-4 py-2 text-sm rounded-md text-red-600 hover:bg-red-50"
                  onClick={() => setSidebarOpen(false)}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Cerrar Sesión</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
