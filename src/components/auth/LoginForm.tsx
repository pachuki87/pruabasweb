import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type LoginFormProps = {
  role: string;
  onLogin: (user: any) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ role, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

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
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
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
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center w-10 h-10 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google"><path d="M12 10.9c1.846 0 3.413 0.73 4.588 1.963l3.481-3.481C19.245 6.007 16.86 4 12 4c-3.248 0-6.286 1.64-8.065 4.334L8.095 12.44A7.96 7.96 0 0 1 12 10.9z" fill="#4285F4"></path><path d="M22 12c0-1.58-0.13-3.1-0.45-4.5L18.02 9.02C18.59 10.09 19 11.04 19 12c0 1.04-0.41 2.09-1.02 3.02l3.48 3.48C21.87 18.1 22 16.58 22 15z" fill="#34A853"></path><path d="M4 12c0 1.04 0.41 2.09 1.02 3.02l-3.48 3.48C2.13 18.1 2 16.58 2 15c0-1.58 0.13-3.1 0.45-4.5L5.98 9.02C5.41 10.09 5 11.04 5 12z" fill="#FBBC05"></path><path d="M12 13.9c-1.846 0-3.413-0.73-4.588-1.963L3.93 15.413C6.007 19.245 8.993 20 12 20c3.248 0 6.286-1.64 8.065-4.334L15.905 11.56A7.96 7.96 0 0 1 12 13.9z" fill="#EA4335"></path></svg>
          </button>
          <button
            onClick={() => handleSocialLogin('linkedin')}
            className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <span className="w-1/5 border-b border-gray-300 md:w-1/4"></span>
          <p className="text-xs text-gray-500 uppercase">O</p>
          <span className="w-1/5 border-b border-gray-300 md:w-1/4"></span>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
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
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
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
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
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
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors"
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
