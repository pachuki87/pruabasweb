import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  
  // If role param is not valid, redirect to student login
  if (role !== 'student' && role !== 'teacher') {
    return <Navigate to="/login/student" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm role={role} />
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;