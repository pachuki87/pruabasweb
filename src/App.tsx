import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { CartProvider } from 'react-use-cart';
import { supabase, getUserById, getUsers } from './lib/supabase'; // Import supabase, getUsers
import { AuthProvider } from './contexts/AuthContext';
import CookieConsent from './components/CookieConsent';
import ChatBot from './components/ChatBot';

// Layouts
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
import CoursePage from './pages/courses/CoursePage'; // Import the course page component
import NotFoundPage from './pages/NotFoundPage';
import MasterAdiccionesPage from './pages/MasterAdiccionesPage'; // Import the new page
import ExpertoConductasPage from './pages/ExpertoConductasPage'; // Import the experto page
import PaymentPage from './pages/PaymentPage'; // Import the payment page
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
import AddStudentForm from './components/students/AddStudentForm'; // Import AddStudentForm
import AssignCoursesToStudent from './components/students/AssignCoursesToStudent'; // Import AssignCoursesToStudent
import QuizAttemptPage from './pages/dashboard/QuizAttemptPage'; // Import QuizAttemptPage
import UpdateLesson1 from './components/UpdateLesson1'; // Temporary component for database update

// Type definitions
type User = {
  id: string;
  email: string;
  role: string;
  accessToken?: string; // Add accessToken
  refreshToken?: string; // Add refreshToken
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<string>('visitor');

  const handleLogin = async (userData: User) => {
    // Set Supabase session after successful login
    if (userData.accessToken && userData.refreshToken) { // Ensure tokens are not undefined
      const { error } = await supabase.auth.setSession({
        access_token: userData.accessToken,
        refresh_token: userData.refreshToken,
      });
      if (error) {
        console.error('Error al establecer la sesión de Supabase:', error);
      }

      // Get user data from Supabase
      const supabaseUser = await supabase.auth.getUser();
      const userId = supabaseUser.data?.user?.id;

      if (userId) {
        console.log('🔍 Buscando usuario en BD con ID:', userId);
        const userFromDb = await getUserById(userId);
        if (userFromDb) {
          console.log('✅ Usuario encontrado en BD:', { id: userFromDb.id, email: userFromDb.email, rol: userFromDb.rol });
          const newUser: User = {
            id: userFromDb.id,
            email: userFromDb.email,
            role: userFromDb.rol,
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
          };
          console.log('🔄 Estableciendo usuario con rol:', newUser.role);
          setUser(newUser);
          setCurrentRole(newUser.role);
          console.log('✅ Rol establecido en currentRole:', newUser.role);
        } else {
          console.error('❌ Usuario no encontrado en la base de datos');
        }
      } else {
        console.error('ID de usuario no encontrado en la autenticación de Supabase');
      }
    } else {
      console.warn('Falta el token de acceso o de actualización en los datos del usuario.');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    }
    setUser(null);
  };

  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
  };

  // Función para mapear roles de la BD a roles de rutas
  const mapRoleForRouting = (dbRole: string): string => {
    const roleMapping: { [key: string]: string } = {
      'profesor': 'teacher',
      'estudiante': 'student',
      'student': 'student',
      'teacher': 'teacher'
    };
    return roleMapping[dbRole] || dbRole;
  };

  // Verificar sesión activa al cargar la aplicación
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        console.log('🔍 Verificando sesión activa...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error al verificar sesión:', error);
          return;
        }

        if (session?.user) {
          console.log('✅ Sesión activa encontrada:', { id: session.user.id, email: session.user.email });

          // Buscar usuario en la base de datos
          const userFromDb = await getUserById(session.user.id);
          if (userFromDb) {
            console.log('✅ Usuario encontrado en BD:', { id: userFromDb.id, email: userFromDb.email, rol: userFromDb.rol });
            const newUser: User = {
              id: userFromDb.id,
              email: userFromDb.email,
              role: userFromDb.rol,
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
            };
            console.log('🔄 Estableciendo usuario con rol:', newUser.role);
            setUser(newUser);
            setCurrentRole(newUser.role);
            console.log('✅ Rol establecido en currentRole:', newUser.role);
          } else {
            console.error('❌ Usuario no encontrado en la base de datos');
          }
        } else {
          console.log('⏳ No hay sesión activa');
        }
      } catch (error) {
        console.error('❌ Error al verificar sesión activa:', error);
      }
    };

    checkActiveSession();
  }, []);

  // Redirigir automáticamente al dashboard después del login
  useEffect(() => {
    console.log('🔄 useEffect de redirección ejecutado');
    console.log('👤 Usuario:', user ? { id: user.id, email: user.email, role: user.role } : 'null');
    console.log('🎯 currentRole:', currentRole);

    if (user && user.role) {
      console.log('✅ Usuario y rol detectados, evaluando redirección...');
      
      // Mapear el rol de la BD al rol de las rutas
      const routeRole = mapRoleForRouting(user.role);
      console.log('🔄 Rol mapeado:', `${user.role} -> ${routeRole}`);
      
      // Evitar redirección si ya estamos en una ruta de dashboard
      const currentPath = window.location.pathname;
      console.log('📍 Ruta actual:', currentPath);

      const isDashboardRoute = currentPath.includes(`/${routeRole}/dashboard`) ||
                               currentPath.includes(`/${routeRole}/courses`) ||
                               currentPath.includes(`/${routeRole}/profile`);

      console.log('🚦 ¿Es ruta de dashboard?', isDashboardRoute);
      console.log('🎯 Ruta esperada:', `/${routeRole}/dashboard`);

      // Redirigir si no está en una ruta de dashboard
      if (!isDashboardRoute) {
        console.log('🚀 Redirigiendo a:', `/${routeRole}/dashboard`);
        // Usar window.location.href para la redirección en lugar de navigate
        window.location.href = `/${routeRole}/dashboard`;
      } else {
        console.log('⏭️  No se redirige (ya está en ruta adecuada)');
      }
    } else {
      console.log('⏳ Esperando usuario y rol...');
    }
  }, [user, currentRole]);

  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <CookieConsent />
        
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
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
          <Route path="/update-lesson1" element={<UpdateLesson1 />} /> {/* Temporary route for database update */}
          
          {/* Auth routes */}
          <Route path="/login/:role" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register/:role" element={<RegisterPage onRegister={handleLogin} />} />
          
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
            <Route path="users" element={<StudentList />} /> {/* Added route for StudentList */}
            <Route path="users/add" element={<AddStudentForm />} /> {/* Added route for AddStudentForm */}
            <Route path="users/:id/assign-courses" element={<AssignCoursesToStudent />} /> {/* Added route for AssignCoursesToStudent */}
            <Route path="profile" element={<UserProfilePage role="teacher" />} />
            <Route path="change-password" element={<ChangePasswordPage role="teacher" />} />
          </Route>
          
          {/* Redirect /login to the appropriate role login page */}
          <Route path="/login" element={<Navigate to={`/login/${currentRole}`} replace />} />
          <Route path="/register" element={<Navigate to={`/register/${currentRole}`} replace />} />
          
          {/* Logout route */}
          <Route 
            path="/logout" 
            element={<LogoutPage onLogout={handleLogout} />} // Create a LogoutPage component
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <CookieConsent />
        <ChatBot />
        <Toaster position="top-right" />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

// Create a simple LogoutPage component to handle the logout logic and redirection
const LogoutPage: React.FC<{ onLogout: () => Promise<void> }> = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await onLogout();
      navigate('/'); // Redirect to home after logout
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
