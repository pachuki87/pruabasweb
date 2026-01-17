import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type LoginFormProps = {
  role: string;
};

// Define GoogleIcon component here
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.7772 2.7218v2.2582h2.9086c1.7018-1.5664 2.6836-3.8745 2.6836-6.621Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1818l-2.9086-2.2582c-.8064.5436-1.8364.8618-3.0477.8618-2.3455 0-4.3273-1.5818-5.0364-3.7109H.9573v2.3318C2.4382 16.1455 5.4818 18 9 18Z" fill="#34A853"/>
      <path d="M3.9636 10.71c-.18-.5436-.2836-1.1164-.2836-1.71s.1036-1.1664.2836-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.9636 10.71Z" fill="#FBBC05"/>
      <path d="M9 3.5782c1.3227 0 2.5077.4545 3.4409 1.3455l2.5818-2.5818C13.4636.8918 11.4273 0 9 0 5.4818 0 2.4382 1.8545.9573 4.9582L3.9636 7.29C4.6727 5.16 6.6545 3.5782 9 3.5782Z" fill="#EA4335"/>
    </g>
  </svg>
);

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const { signIn } = useAuth(); // <-- Usar el hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        // El error se obtiene del objeto de retorno, no se lanza
        let errorMessage = 'Error al iniciar sesión';
        if (error.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else if (error.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirma tu email antes de iniciar sesión.';
        }
        throw new Error(errorMessage);
      }

      // Login exitoso - esperar un momento para la redirección
      console.log('✅ Login exitoso, esperando redirección...');

      // Timeout de seguridad por si la redirección falla
      setTimeout(() => {
        if (isLoading) {
          console.warn('⏰ La redirección está tardando más de lo esperado');
          setIsLoading(false);
        }
      }, 3000);

    } catch (err: any) {
      console.error('❌ Error en handleLogin:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'google') {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🚀 Iniciando login con Google...');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) {
          console.error('❌ Error al iniciar sesión con Google:', error);
          setError(`Error con Google: ${error.message}`);
          setIsLoading(false);
        }
        // Don't set loading to false here as the redirect will handle it
      } catch (error: any) {
        console.error('❌ Error inesperado con Google OAuth:', error);
        setError('Error inesperado al iniciar sesión con Google');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex w-full max-w-3xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="hidden md:block md:w-1/2">
        <img 
          src="https://images.pexels.com/photos/8636596/pexels-photo-8636596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Learning illustration" 
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="w-full md:w-1/2 p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          {role === 'teacher' ? 'Inicio de Sesión del Profesor' : 'Inicio de Sesión del Estudiante'}
        </h2>
        
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span className="ml-2">
              {isLoading ? 'Conectando...' : 'Continuar con Google'}
            </span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <span className="w-1/5 border-b border-gray-300 md:w-1/4"></span>
          <p className="text-xs text-gray-500 uppercase">O</p>
          <span className="w-1/5 border-b border-gray-300 md:w-1/4"></span>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-600">Dirección de correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-600">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-600">
                Recordarme
              </label>
            </div>
            
            <a href="#" className="text-sm text-blue-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
        
        {role === 'student' && (
          <p className="mt-6 text-sm text-center text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register/student" className="text-blue-500 hover:underline">
              Regístrate como Alumno
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
