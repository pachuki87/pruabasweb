import React from 'react';
import { auth } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfilePageProps {
  role: 'student' | 'teacher';
}

function UserProfilePage({ role }: UserProfilePageProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Perfil de Usuario</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <p className="mt-1 text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <p className="mt-1 capitalize text-gray-900">{role}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cuenta Creada</label>
            <p className="mt-1 text-gray-900">
<<<<<<< HEAD
              {user?.creado_en ? new Date(user.creado_en).toLocaleDateString() : 'N/A'}
=======
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;