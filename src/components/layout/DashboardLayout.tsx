import React from 'react';
<<<<<<< HEAD
import { Outlet, useLocation } from 'react-router-dom';
=======
import { Outlet } from 'react-router-dom';
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

type DashboardLayoutProps = {
  role: string;
  onRoleChange: (role: string) => void;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, onRoleChange }) => {
<<<<<<< HEAD
  const location = useLocation();
  
  // Detectar si estamos en una página de lección
  const isLessonPage = location.pathname.includes('/lessons/');
  
=======
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onRoleChange={onRoleChange} currentRole={role} />
      <div className="flex flex-1 relative">
<<<<<<< HEAD
        {/* Ocultar sidebar en páginas de lecciones */}
        {!isLessonPage && <Sidebar role={role} />}
        <main className={`flex-1 p-4 md:p-6 overflow-y-auto ${isLessonPage ? 'w-full' : ''}`}>
=======
        <Sidebar role={role} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;