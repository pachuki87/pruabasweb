import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { CartProvider } from 'react-use-cart';
import { supabase, getUserById, getUsers } from './lib/supabase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { User } from '@supabase/supabase-js';
import CookieConsent from './components/CookieConsent';
import ChatBot from './components/ChatBot';
import DashboardLayout from './components/layout/DashboardLayout';

function ErrorFallback({error, resetErrorBoundary}: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Algo salió mal:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Intentar de nuevo</button>
    </div>
  )
}

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AboutPage from './pages/AboutPage';
import FaqsPage from './pages/FaqsPage';
import CoursesPage from './pages/CoursesPage';
import CoursePage from './pages/courses/CoursePage';
import NotFoundPage from './pages/NotFoundPage';
import MasterAdiccionesPage from './pages/MadiccionesPage';
import ExpertoConductasPage from './pages/ExpertoConductasPage';
import PaymentPage from './pages/PaymentPage';
import Formacion from './components/Formacion';
import TestimoniosPage from './pages/TestimoniosPage';
import ViajesYTalleresPage from './pages/ViajesYTalleresPage';
import StripeTest from './components/StripeTest';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import UserCoursesPage from './pages/dashboard/UserCoursesPage';
import AddCoursePage from './pages/dashboard/AddCoursePage';
import EditCoursePage from './pages/dashboard/EditCoursePage';
import CourseDetailsPage from './pages/dashboard/CourseDetailsPage';
import QuizzesPage from './pages/dashboard/QuizzesPage';
import AddQuizPage from './pages/dashboard/AddQuizPage';
import AssignQuizPage from './pages/dashboard/AssignQuizPage';
import StudyMaterialsPage from './pages/dashboard/StudyMaterialsPage';
import UserProfilePage from './pages/dashboard/UserProfilePage';
import ChangePasswordPage from './pages/dashboard/ChangePasswordPage';
import NewLessonPage from './pages/courses/NewLessonPage';

// Components
import StudentList from './components/students/StudentList';
import AddStudentForm from './components/students/AddStudentForm';
import AssignCoursesToStudent from './components/students/AssignCoursesToStudent';
import QuizAttemptPage from './pages/dashboard/QuizAttemptPage';
import UpdateLesson1 from './components/UpdateLesson1';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <CookieConsent />
          <AppRoutes />
          <ChatBot />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppRoutes() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const mapRoleForRouting = (dbRole: string): string => {
    const roleMapping: { [key: string]: string } = {
      'profesor': 'teacher',
      'estudiante': 'student',
      'student': 'student',
      'teacher': 'teacher'
    };
    return roleMapping[dbRole] || dbRole;
  };

  const [currentRole, setCurrentRole] = useState<string>('visitor');

  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
  };

  useEffect(() => {
    if (user) {
      console.log('🔍 Usuario detectado en useEffect:', { id: user.id, email: user.email });

      const getUserRole = async () => {
        try {
          console.log('🔍 Buscando datos del usuario en la base de datos...');
          const userData = await getUserById(user.id);

          if (userData) {
            console.log('✅ Datos del usuario encontrados:', { rol: userData.rol, nombre: userData.nombre });
            const routeRole = mapRoleForRouting(userData.rol);
            const currentPath = window.location.pathname;

            console.log('🎯 Evaluando redirección:', { currentPath, routeRole, targetPath: `/${routeRole}/dashboard` });

            // Rutas válidas para el rol
            const validPaths = [
              `/${routeRole}/dashboard`,
              `/${routeRole}/courses`,
              `/${routeRole}/courses/`,
              `/${routeRole}/quizzes`,
              `/${routeRole}/users`,
              `/${routeRole}/users/`,
              `/${routeRole}/profile`,
              `/${routeRole}/change-password`
            ];

            const isValidPath = validPaths.some(path => currentPath.startsWith(path));

            if (!isValidPath) {
              console.log('🚀 Redirigiendo a dashboard:', `/${routeRole}/dashboard`);
              navigate(`/${routeRole}/dashboard`);
            } else {
              console.log('✅ Ruta válida, no se redirige');
            }
          } else {
            console.error('❌ No se encontraron datos del usuario en la tabla usuarios');
            // Fallback: intentar redirigir a student dashboard por defecto
            navigate('/student/dashboard');
          }
        } catch (error) {
          console.error('❌ Error al obtener rol del usuario:', error);
          // Fallback: redirigir a student dashboard
          navigate('/student/dashboard');
        }
      };

      // Agregar timeout para evitar que se quede esperando indefinidamente
      const timeoutId = setTimeout(() => {
        console.warn('⏰ Timeout obteniendo rol del usuario, redirigiendo por defecto');
        navigate('/student/dashboard');
      }, 5000); // 5 segundos

      getUserRole().finally(() => {
        clearTimeout(timeoutId);
      });
    } else {
      console.log('⏳ Esperando usuario autenticado...');
    }
  }, [user, navigate]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage currentRole={currentRole} onRoleChange={handleRoleChange} />} />
      <Route path="/about" element={<AboutPage currentRole={currentRole} onRoleChange={handleRoleChange} />} />
      <Route path="/contacto" element={<AboutPage currentRole={currentRole} onRoleChange={handleRoleChange} />} />
      <Route path="/faqs" element={<FaqsPage currentRole={currentRole} onRoleChange={handleRoleChange} />} />
      <Route path="/courses" element={<CoursesPage currentRole={currentRole} onRoleChange={handleRoleChange} />} />
      <Route path="/courses/:courseId" element={<CoursePage />} />
      <Route path="/visitor/courses/:courseId" element={<CoursePage />} />
      <Route path="/formacion" element={<Formacion />} />
      <Route path="/testimonios" element={<TestimoniosPage currentRole={currentRole} onRoleChange={handleRoleChange} />} />
      <Route path="/viajes-talleres" element={<ViajesYTalleresPage currentRole={currentRole} onRoleChange={handleRoleChange} />} />
      <Route path="/master-adicciones-intervencion" element={<CoursePage />} />
      <Route path="/experto-conductas-adictivas" element={<ExpertoConductasPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/stripe-test" element={<StripeTest />} />
      <Route path="/update-lesson1" element={<UpdateLesson1 />} />

      {/* Auth routes */}
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/register/:role" element={<RegisterPage />} />

      {/* Dashboard routes */}
      <Route path="/student" element={<DashboardLayout role="student" onRoleChange={handleRoleChange} />}>
        <Route path="dashboard" element={<DashboardPage role="student" />} />
        <Route path="courses" element={<UserCoursesPage role="student" />} />
        <Route path="courses/:courseId" element={<CourseDetailsPage role="student" />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<NewLessonPage />} />
        <Route path="quizzes" element={<QuizzesPage role="student" />} />
        <Route path="quizzes/attempt/:quizId" element={<QuizAttemptPage />} />
        <Route path="profile" element={<UserProfilePage role="student" />} />
        <Route path="change-password" element={<ChangePasswordPage role="student" />} />
      </Route>

      <Route path="/teacher" element={<DashboardLayout role="teacher" onRoleChange={handleRoleChange} />}>
        <Route path="dashboard" element={<DashboardPage role="teacher" />} />
        <Route path="courses" element={<UserCoursesPage role="teacher" />} />
        <Route path="courses/add" element={<AddCoursePage />} />
        <Route path="courses/edit/:courseId" element={<EditCoursePage />} />
        <Route path="courses/:courseId" element={<CourseDetailsPage role="teacher" />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<NewLessonPage />} />
        <Route path="courses/:courseId/materials" element={<StudyMaterialsPage role="teacher" />} />
        <Route path="quizzes" element={<QuizzesPage role="teacher" />} />
        <Route path="quizzes/attempt/:quizId" element={<QuizAttemptPage />} />
        <Route path="quizzes/add" element={<AddQuizPage />} />
        <Route path="quizzes/assign/:id" element={<AssignQuizPage />} />
        <Route path="users" element={<StudentList />} />
        <Route path="users/add" element={<AddStudentForm />} />
        <Route path="users/:id/assign-courses" element={<AssignCoursesToStudent />} />
        <Route path="profile" element={<UserProfilePage role="teacher" />} />
        <Route path="change-password" element={<ChangePasswordPage role="teacher" />} />
      </Route>

      {/* Redirect /login to the appropriate role login page */}
      <Route path="/login" element={<Navigate to={`/login/${currentRole}`} replace />} />
      <Route path="/register" element={<Navigate to={`/register/${currentRole}`} replace />} />

      {/* Logout route */}
      <Route
        path="/logout"
        element={<LogoutPage onLogout={handleLogout} />}
      />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Create a simple LogoutPage component
const LogoutPage: React.FC<{ onLogout: () => Promise<void> }> = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await onLogout();
      navigate('/');
    };
    performLogout();
  }, [onLogout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-xl text-gray-700">Cerrando sesión...</p>
    </div>
  );
};

export default App;