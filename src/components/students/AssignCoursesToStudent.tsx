import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type Course = {
  id: string;
  titulo: string;
};

const AssignCoursesToStudent: React.FC = () => {
  const { id: studentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studentEmail, setStudentEmail] = useState('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [assignedCourseIds, setAssignedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch student email
      const { data: studentData, error: studentError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;
      if (studentData) {
        setStudentEmail(studentData.email);
      }

      // Fetch all courses
      // Ensure the user is authenticated for RLS to work
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setMessage('Error: Usuario no autenticado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      const { data: coursesData, error: coursesError } = await supabase
        .from('cursos')
        .select('id, titulo');

      if (coursesError) throw coursesError;
      if (coursesData) {
        setAllCourses(coursesData);
      }

      // Fetch assigned courses for this student
      const { data: assignedData, error: assignedError } = await supabase
        .from('inscripciones')
        .select('curso_id')
        .eq('usuario_id', studentId);

      if (assignedError) throw assignedError;
      if (assignedData) {
        setAssignedCourseIds(assignedData.map(item => item.curso_id));
      }

    } catch (error: any) {
      setMessage(`Error al cargar datos: ${error.message}`);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (courseId: string) => {
    setAssignedCourseIds(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Delete existing assignments for this student
      const { error: deleteError } = await supabase
        .from('inscripciones')
        .delete()
        .eq('usuario_id', studentId);

      if (deleteError) throw deleteError;

      // Insert new assignments
      if (assignedCourseIds.length > 0) {
        const assignmentsToInsert = assignedCourseIds.map(courseId => ({
          usuario_id: studentId,
          curso_id: courseId
        }));
        const { error: insertError } = await supabase
          .from('inscripciones')
          .insert(assignmentsToInsert);

        if (insertError) throw insertError;
      }

      setMessage('Cursos asignados con éxito!');
    } catch (error: any) {
      setMessage(`Error al guardar asignaciones: ${error.message}`);
      console.error('Error saving assignments:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Cargando asignaciones de cursos...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Asignar Cursos a {studentEmail}</h2>
      
      {message && (
        <p className={`mb-4 text-center ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Cursos Disponibles:</h3>
        {allCourses.length === 0 ? (
          <p className="text-gray-500">No hay cursos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCourses.map(course => (
              <div key={course.id} className="flex items-center bg-gray-50 p-3 rounded-md">
                <input
                  type="checkbox"
                  id={course.id}
                  checked={assignedCourseIds.includes(course.id)}
                  onChange={() => handleCheckboxChange(course.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor={course.id} className="ml-3 text-gray-900 text-lg">
                  {course.titulo}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/teacher/users')}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Asignaciones'}
        </button>
      </div>
    </div>
  );
};

export default AssignCoursesToStudent;
