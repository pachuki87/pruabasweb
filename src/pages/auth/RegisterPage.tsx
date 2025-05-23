import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RegisterForm from '../../components/auth/RegisterForm';

type RegisterPageProps = {
  onRegister: (user: any) => void;
};

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const { role } = useParams<{ role: string }>();
  
  // If role param is not valid, redirect to student registration
  if (role !== 'student' && role !== 'teacher') {
    return <Navigate to="/register/student" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentRole={role} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm role={role} onRegister={onRegister} />
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;