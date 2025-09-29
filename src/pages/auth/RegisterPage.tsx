import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import Header from '../../components/layout/Header';
=======
import Navbar from '../../components/layout/Navbar';
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
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
<<<<<<< HEAD
      <Header />
=======
      <Navbar currentRole={role} />
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm role={role} onRegister={onRegister} />
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;