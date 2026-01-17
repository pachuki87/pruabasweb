import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface QuizResult {
  id: string;
  user_id: string;
  cuestionario_id: string;
  curso_id: string;
  leccion_id?: string | null;
  puntuacion: number;
  puntuacion_maxima: number;
  porcentaje: number;
  aprobado: boolean;
  fecha_completado: string;
  tiempo_completado: number | null;
  respuestas_detalle?: Record<string, unknown> | null;
  creado_en: string;
}

interface QuizResultsHistoryProps {
  user: User | null;
}

function QuizResultsHistory({ user }: QuizResultsHistoryProps) {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    fetchQuizResults();
  }, [user]);

  const fetchQuizResults = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_completado', { ascending: false });

      if (error) {
        console.error('Error fetching quiz results:', error);
        setError('No se pudieron cargar los resultados');
      } else {
        setResults(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los resultados');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const openResultDetails = (result: QuizResult) => {
    setSelectedResult(result);
  };

  const closeResultDetails = () => {
    setSelectedResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <i className="fas fa-clipboard-list text-gray-400 text-4xl mb-4"></i>
        <p className="text-gray-600">No has completado ningún cuestionario aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          <i className="fas fa-history text-blue-600 mr-2"></i>
          Historial de Cuestionarios
        </h3>
        <span className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? 'cuestionario' : 'cuestionarios'} completado{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">Cuestionario #{result.cuestionario_id.slice(0, 8)}</h4>
                <p className="text-sm text-gray-500">{formatDate(result.fecha_completado)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getScoreColor(result.porcentaje)}`}>
                    {result.puntuacion}/{result.puntuacion_maxima}
                  </p>
                  <p className="text-sm text-gray-600">{result.porcentaje.toFixed(1)}%</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.aprobado)}`}>
                  {result.aprobado ? 'Aprobado' : 'No aprobado'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Puntuación:</span> {result.puntuacion}/{result.puntuacion_maxima}
              </div>
              <div>
                <span className="font-medium">Porcentaje:</span>
                <span className={`ml-1 ${getScoreColor(result.porcentaje)}`}>{result.porcentaje.toFixed(1)}%</span>
              </div>
              <div>
                <span className="font-medium">Tiempo:</span> {formatTime(result.tiempo_completado)}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => openResultDetails(result)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                <i className="fas fa-eye mr-2"></i>
                Ver detalles completos
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Detalles del Cuestionario</h3>
                <button
                  onClick={closeResultDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Cuestionario #{selectedResult.cuestionario_id.slice(0, 8)}</h4>
                  <p className="text-sm text-gray-600">
                    Completado: {formatDate(selectedResult.fecha_completado)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{selectedResult.porcentaje.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Porcentaje de acierto</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{selectedResult.puntuacion}</p>
                    <p className="text-sm text-gray-600">Puntuación obtenida</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium">Puntuación:</span>
                    <span className="text-blue-600 ml-2">{selectedResult.puntuacion}/{selectedResult.puntuacion_maxima}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium">Estado:</span>
                    <span className={`ml-2 ${selectedResult.aprobado ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedResult.aprobado ? 'Aprobado' : 'No aprobado'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium">Tiempo empleado:</span>
                    <span className="ml-2">{formatTime(selectedResult.tiempo_completado)}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium">Fecha:</span>
                    <span className="ml-2">{formatDate(selectedResult.creado_en)}</span>
                  </div>
                </div>

                {selectedResult.curso_id && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <span className="font-medium">ID del curso:</span>
                    <span className="ml-2">{selectedResult.curso_id}</span>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={closeResultDetails}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizResultsHistory;