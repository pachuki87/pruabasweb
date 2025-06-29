import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type LoginFormProps = {
  role: string;
  onLogin: (user: any) => void;
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

const LoginForm: React.FC<LoginFormProps> = ({ role, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Handle Google OAuth callback
  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // User is authenticated, create user object and call onLogin
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          role: role,
          accessToken: session.access_token,
          refreshToken: session.refresh_token
        };
        onLogin(user);
      }
    };

    handleAuthStateChange();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          role: role,
          accessToken: session.access_token,
          refreshToken: session.refresh_token
        };
        onLogin(user);
      }
    });

    return () => subscription.unsubscribe();
  }, [role, onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, we would use Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // For demo purposes (no login required)
      // setTimeout(() => {
      //   // Simulate a successful login
      //   const user = {
      //     id: '123',
      //     email,
      //     role
      //   };
        
      //   onLogin(user);
      //   navigate(`/${role}/dashboard`);
        
      //   setIsLoading(false);
      // }, 800);

      // Pass user data including tokens to onLogin
      const user = {
        id: data.user?.id,
        email: data.user?.email,
        role, // Role is determined by the login page, not from Supabase user data directly
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
      };
      
      onLogin(user);
      navigate(`/${role}/dashboard`);
      
      setIsLoading(false);
      
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // For demo purposes only
    // console.log(`Login with ${provider}`);

    // In a real implementation, we would use Supabase auth
    if (provider === 'google') {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/${role}/dashboard`
        }
      });
      if (error) {
        console.error('Error al iniciar sesión con Google:', error);
        setError(error.message);
      }
    } else {
       // For other providers or demo fallback
       console.log(`Login with ${provider}`);
       // You might want to add logic for other providers or remove this fallback
       const user = {
         id: '123',
         email: 'user@example.com',
         role
       };

       onLogin(user);
       navigate(`/${role}/dashboard`);
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
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <GoogleIcon />
            <span className="ml-2">Continuar con Google</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <span className="w-1/5 border-b border-gray-300 md:w-1/4"></span>
          <p className="text-xs text-gray-500 uppercase">O</p>
          <span className="w-1/5 border-b border-gray-300 md:w-1/4"></span>
        </div>
        
        {error && (
          <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            {error}
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <p className="mt-6 text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to={`/register/${role}`} className="text-blue-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
