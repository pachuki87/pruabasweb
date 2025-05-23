import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

type DashboardLayoutProps = {
  role: string;
  onRoleChange: (role: string) => void;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, onRoleChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onRoleChange={onRoleChange} currentRole={role} />
      <div className="flex flex-1 relative">
        <Sidebar role={role} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;