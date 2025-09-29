import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import Header from '../../components/layout/Header';
=======
import Navbar from '../../components/layout/Navbar';
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
import Footer from '../../components/layout/Footer';
import LoginForm from '../../components/auth/LoginForm';

type LoginPageProps = {
  onLogin: (user: any) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { role } = useParams<{ role: string }>();
  
  // If role param is not valid, redirect to student login
  if (role !== 'student' && role !== 'teacher') {
    return <Navigate to="/login/student" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
<<<<<<< HEAD
      <Header />
=======
      <Navbar currentRole={role} />
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm role={role} onLogin={onLogin} />
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;