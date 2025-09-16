import React, { useState } from 'react';
import { updateLesson1Quiz, checkLesson1Status } from '../utils/updateLesson1Quiz';

const UpdateLesson1 = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setStatus('🔄 Actualizando...');
    
    const result = await updateLesson1Quiz();
    
    if (result.success) {
      setStatus('✅ ¡Lección 1 actualizada! El cuestionario ahora está habilitado.');
    } else {
      setStatus(`❌ Error: ${result.error?.message || 'Error desconocido'}`);
    }
    
    setLoading(false);
  };

  const handleCheck = async () => {
    setLoading(true);
    setStatus('🔍 Verificando estado...');
    
    const result = await checkLesson1Status();
    
    if (result.success && result.data?.length > 0) {
      const lesson = result.data[0];
      setStatus(`📊 Estado: ${lesson.titulo} - Cuestionario: ${lesson.tiene_cuestionario ? '✅ Habilitado' : '❌ Deshabilitado'}`);
    } else {
      setStatus(`❌ Error al verificar: ${result.error?.message || 'Error desconocido'}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">🔧 Actualizar Lección 1</h2>
      <p className="text-gray-600 mb-4">
        Habilitar cuestionario para "FUNDAMENTOS P TERAPEUTICO"
      </p>
      
      <div className="space-y-3">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '⏳ Cargando...' : '🔍 Verificar Estado'}
        </button>
        
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? '⏳ Actualizando...' : '🔄 Habilitar Cuestionario'}
        </button>
      </div>
      
      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          {status}
        </div>
      )}
    </div>
  );
};

export default UpdateLesson1;