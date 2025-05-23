import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AddStudentForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Add user to auth.users table (Supabase handles this via sign-up)
      // For simplicity here, we'll assume the user will be invited or signed up separately
      // and we are just adding their profile to the 'usuarios' table.
      // In a real application, you might use Supabase Admin client for server-side user creation.

      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          { email: email, rol: 'estudiante' } // Assuming 'rol' column exists and 'estudiante' is a valid role
        ]);

      if (error) {
        throw error;
      }

      setMessage('Alumno añadido con éxito!');
      setEmail('');
      setName('');
    } catch (error: any) {
      setMessage(`Error al añadir alumno: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Añadir Nuevo Alumno</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {/* Optional: Add a name field if your 'usuarios' table has one */}
        {/* <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div> */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Añadiendo...' : 'Añadir Alumno'}
          </button>
        </div>
        {message && (
          <p className={`mt-4 text-center ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddStudentForm;
