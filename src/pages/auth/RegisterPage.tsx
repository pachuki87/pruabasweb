import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  
  // If role param is not valid, redirect to student registration
  if (role !== 'student' && role !== 'teacher') {
    return <Navigate to="/register/student" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm role={role} />
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;