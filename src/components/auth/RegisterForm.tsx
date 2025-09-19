import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Briefcase, Award } from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';

// Define GoogleIcon component
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

type RegisterFormProps = {
  role: string;
  onRegister: (user: any) => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ role, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    skills: '',
    qualification: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Handle Google OAuth callback
  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // User is authenticated via Google, create user object and call onRegister
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          role: role,
          accessToken: session.access_token,
          refreshToken: session.refresh_token
        };
        onRegister(user);
      }
    };

    handleAuthStateChange();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if user already exists in database
        const { data: existingUser } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!existingUser) {
          // Crear registro de usuario para usuarios de Google OAuth usando supabaseAdmin
          await supabaseAdmin.from('usuarios').insert({
            id: session.user.id,
            email: session.user.email,
            rol: role,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
          });
        }

        const user = {
          id: session.user.id,
          email: session.user.email || '',
          role: role,
          accessToken: session.access_token,
          refreshToken: session.refresh_token
        };
        onRegister(user);
      }
    });

    return () => subscription.unsubscribe();
  }, [role, onRegister]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      // Usar supabaseAdmin para bypasear RLS durante la creación inicial del perfil
      await supabaseAdmin.from('usuarios').insert({
        id: data.user?.id,
        email: formData.email,
        rol: role,
        mobile: formData.mobile || null,
        skills: formData.skills || null,
        qualification: formData.qualification || null,
      });

      setRegistrationSuccess(true);
      setIsLoading(false);
      
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/${role}/dashboard`
        }
      });
      if (error) {
        console.error('Error al registrarse con Google:', error);
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse con Google');
    }
  };

  if (registrationSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">¡Registro Exitoso!</h2>
        <p className="text-gray-600 mb-6">
          Por favor, verifica tu correo electrónico para completar el registro.
        </p>
        <Link to="/login/student" className="text-red-500 hover:underline">
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            {role === 'teacher' ? 'Registro de Profesor' : 'Registro de Estudiante'}
          </h2>
          
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={handleGoogleRegister}
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
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <User className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Su Nombre"
                required
              />
            </div>
            
            <div className="mb-4 relative">
              <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Su Correo Electrónico"
                required
              />
            </div>
            
            <div className="mb-4 relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Contraseña"
                required
              />
            </div>
            
            {role === 'teacher' && (
              <div className="mb-4 relative">
                <Award className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                  placeholder="Título"
                />
              </div>
            )}
            
            <div className="mb-4 relative">
              <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Número de Móvil"
              />
            </div>
            
            {role === 'teacher' && (
              <div className="mb-6 relative">
                <Briefcase className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                  placeholder="Habilidades"
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Regístrate'}
            </button>
          </form>
          
          <p className="mt-6 text-sm text-center text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to={`/login/${role}`} className="text-blue-500 hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
        
        <div className="hidden md:block md:w-1/2 bg-blue-50 flex items-center justify-center">
          <img 
            src="https://images.pexels.com/photos/4144294/pexels-photo-4144294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Registration illustration" 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
