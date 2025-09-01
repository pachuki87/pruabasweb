import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const CheckTables: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTables = async () => {
      try {
        console.log('Checking tables...');
        
        // Intentar consultar diferentes nombres de tabla
        const checks = {
          users: null,
          courses: null,
          cursos: null,
          inscripciones: null
        };

        // Verificar users
        try {
          const { data, error } = await supabase.from('users').select('id').limit(1);
          checks.users = error ? error.message : 'EXISTS';
        } catch (e) {
          checks.users = 'ERROR: ' + (e as Error).message;
        }

        // Verificar usuarios
        try {
          const { data, error } = await supabase.from('usuarios').select('id').limit(1);
          checks.usuarios = error ? error.message : 'EXISTS';
        } catch (e) {
          checks.usuarios = 'ERROR: ' + (e as Error).message;
        }

        // Verificar courses
        try {
          const { data, error } = await supabase.from('courses').select('id').limit(1);
          checks.courses = error ? error.message : 'EXISTS';
        } catch (e) {
          checks.courses = 'ERROR: ' + (e as Error).message;
        }

        // Verificar cursos
        try {
          const { data, error } = await supabase.from('cursos').select('id').limit(1);
          checks.cursos = error ? error.message : 'EXISTS';
        } catch (e) {
          checks.cursos = 'ERROR: ' + (e as Error).message;
        }

        // Verificar inscripciones
    try {
      const { data, error } = await supabase.from('inscripciones').select('id').limit(1);
      checks.inscripciones = error ? error.message : 'EXISTS';
    } catch (e) {
      checks.inscripciones = 'ERROR: ' + (e as Error).message;
    }



        setResults(checks);
        console.log('Table check results:', checks);
      } catch (error) {
        console.error('Error checking tables:', error);
        setResults({ error: (error as Error).message });
      } finally {
        setLoading(false);
      }
    };

    checkTables();
  }, []);

  if (loading) {
    return <div>Checking database tables...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Database Table Check Results:</h3>
      <pre className="text-sm">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};

export default CheckTables;