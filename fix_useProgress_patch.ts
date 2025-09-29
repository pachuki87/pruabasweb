// PARCHE PARA CORREGIR ERRORES EN useProgress.ts
// Aplicar estos cambios al archivo src/hooks/useProgress.ts

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { ProgressService } from '../lib/services/progressService';
import type { Database } from '../lib/database.types';

type UserCourseProgress = Database['public']['Tables']['user_course_progress']['Row'];

// Función auxiliar para validar UUIDs
const isValidUUID = (uuid: string | undefined | null): boolean => {
  if (!uuid || uuid === 'undefined' || uuid === 'null') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Función auxiliar para logging de errores
const logError = (context: string, error: any, additionalInfo?: any) => {
  console.error(`❌ [useProgress] ${context}:`, {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    additionalInfo
  });
};

interface UseProgressReturn {
  cargando: boolean;
  progresoDelCurso: UserCourseProgress[] | null;
  resultadosPruebas: any[] | null;
  estadisticasUsuario: any | null;
  error: string | null;
  actualizarProgresoCapitulo: (params: {
    courseId: string;
    chapterId: string;
    progressPercentage?: number;
    timeSpentMinutes?: number;
    isCompleted?: boolean;
  }) => Promise<void>;
  marcarCapituloCompletado: (courseId: string, chapterId: string) => Promise<void>;
  registrarTiempoEstudio: (courseId: string, chapterId: string, minutes: number) => Promise<void>;
  saveTestResults: (params: {
    courseId: string;
    lessonId: string;
    quizId: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
  }) => Promise<void>;
  refreshProgress: () => Promise<void>;
  getCourseProgress: (courseId: string) => Promise<UserCourseProgress[] | null>;
  getUserTestResults: (courseId: string) => Promise<any[] | null>;
}

export const useProgress = (courseId?: string): UseProgressReturn => {
  const { user } = useAuth();
  const [progresoDelCurso, setProgresoDelCurso] = useState<UserCourseProgress[] | null>(null);
  const [resultadosPruebas, setResultadosPruebas] = useState<any[] | null>(null);
  const [estadisticasUsuario, setEstadisticasUsuario] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadInitialData();
    } else {
      setLoading(false);
      setError('Usuario no autenticado');
    }
  }, [user?.id, courseId]);

  const loadInitialData = async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Validar courseId si se proporciona
      if (courseId && !isValidUUID(courseId)) {
        throw new Error(`ID de curso inválido: ${courseId}`);
      }
      
      // Cargar progreso del curso específico o general
      if (courseId) {
        console.log(`🔄 Cargando progreso para curso: ${courseId}`);
        
        const progress = await ProgressService.getCourseProgress(user.id, courseId);
        setProgresoDelCurso(progress);
        
        const tests = await ProgressService.getUserTestResults(user.id, courseId);
        setResultadosPruebas(tests);
        
        console.log(`✅ Progreso cargado: ${progress?.length || 0} registros`);
      } else {
        console.log('🔄 Cargando estadísticas generales del usuario');
        
        // Cargar estadísticas generales
        const stats = await ProgressService.getUserProgressStats(user.id);
        setEstadisticasUsuario(stats);
        setProgresoDelCurso(stats.courseProgress);
        setResultadosPruebas(stats.recentTests);
        
        console.log('✅ Estadísticas generales cargadas');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      logError('loadInitialData', err, { courseId, userId: user.id });
      
      // Manejo específico de errores comunes
      if (errorMessage.includes('invalid input syntax for type uuid')) {
        setError('Error de formato de identificador. Por favor, recarga la página.');
      } else if (errorMessage.includes('PGRST205')) {
        setError('Tabla de base de datos no encontrada. Contacta al administrador.');
      } else if (errorMessage.includes('Auth session missing')) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateChapterProgress = async (params: {
    courseId: string;
    chapterId: string;
    progressPercentage?: number;
    timeSpentMinutes?: number;
    isCompleted?: boolean;
  }) => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    // Validar UUIDs
    if (!isValidUUID(params.courseId)) {
      throw new Error(`ID de curso inválido: ${params.courseId}`);
    }
    if (!isValidUUID(params.chapterId)) {
      throw new Error(`ID de capítulo inválido: ${params.chapterId}`);
    }
    
    try {
      console.log('🔄 Actualizando progreso del capítulo:', params);
      
      await ProgressService.updateChapterProgress({
        userId: user.id,
        ...params
      });
      
      console.log('✅ Progreso actualizado exitosamente');
      
      // Refrescar datos después de la actualización
      await refreshProgress();
    } catch (err) {
      logError('updateChapterProgress', err, params);
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando progreso';
      setError(errorMessage);
      throw err;
    }
  };

  const markChapterCompleted = async (courseId: string, chapterId: string) => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    // Validar UUIDs
    if (!isValidUUID(courseId)) {
      throw new Error(`ID de curso inválido: ${courseId}`);
    }
    if (!isValidUUID(chapterId)) {
      throw new Error(`ID de capítulo inválido: ${chapterId}`);
    }
    
    try {
      console.log(`🔄 Marcando capítulo como completado: ${chapterId}`);
      
      await ProgressService.markChapterCompleted(user.id, courseId, chapterId);
      await refreshProgress();
      
      console.log('✅ Capítulo marcado como completado');
    } catch (err) {
      logError('markChapterCompleted', err, { courseId, chapterId });
      throw err;
    }
  };

  const trackStudyTime = async (courseId: string, chapterId: string, minutes: number) => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    // Validar UUIDs
    if (!isValidUUID(courseId)) {
      throw new Error(`ID de curso inválido: ${courseId}`);
    }
    if (!isValidUUID(chapterId)) {
      throw new Error(`ID de capítulo inválido: ${chapterId}`);
    }
    
    try {
      console.log(`🔄 Registrando tiempo de estudio: ${minutes} minutos`);
      
      await ProgressService.trackStudyTime(user.id, courseId, chapterId, minutes);
      
      console.log('✅ Tiempo de estudio registrado');
    } catch (err) {
      logError('trackStudyTime', err, { courseId, chapterId, minutes });
      throw err;
    }
  };

  const saveTestResults = async (params: {
    courseId: string;
    lessonId: string;
    quizId: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
  }) => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    // Validar UUIDs
    if (!isValidUUID(params.courseId)) {
      throw new Error(`ID de curso inválido: ${params.courseId}`);
    }
    if (!isValidUUID(params.lessonId)) {
      throw new Error(`ID de lección inválido: ${params.lessonId}`);
    }
    if (!isValidUUID(params.quizId)) {
      throw new Error(`ID de cuestionario inválido: ${params.quizId}`);
    }
    
    try {
      console.log('🔄 Guardando resultados del test:', params);
      
      await ProgressService.saveTestResults({
        userId: user.id,
        ...params
      });
      
      await refreshProgress();
      
      console.log('✅ Resultados del test guardados');
    } catch (err) {
      logError('saveTestResults', err, params);
      throw err;
    }
  };

  const refreshProgress = async () => {
    await loadInitialData();
  };

  const getCourseProgress = async (courseId: string): Promise<UserCourseProgress[] | null> => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    if (!isValidUUID(courseId)) {
      throw new Error(`ID de curso inválido: ${courseId}`);
    }
    
    try {
      return await ProgressService.getCourseProgress(user.id, courseId);
    } catch (err) {
      logError('getCourseProgress', err, { courseId });
      return null;
    }
  };

  const getUserTestResults = async (courseId: string): Promise<any[] | null> => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    if (!isValidUUID(courseId)) {
      throw new Error(`ID de curso inválido: ${courseId}`);
    }
    
    try {
      return await ProgressService.getUserTestResults(user.id, courseId);
    } catch (err) {
      logError('getUserTestResults', err, { courseId });
      return null;
    }
  };

  return {
    cargando: loading,
    progresoDelCurso,
    resultadosPruebas,
    estadisticasUsuario,
    error,
    actualizarProgresoCapitulo: updateChapterProgress,
    marcarCapituloCompletado: markChapterCompleted,
    registrarTiempoEstudio: trackStudyTime,
    saveTestResults,
    refreshProgress: refreshProgress,
    getCourseProgress: getCourseProgress,
    getUserTestResults: getUserTestResults
  };
};

export default useProgress;

// INSTRUCCIONES DE APLICACIÓN:
// 1. Reemplaza el contenido completo de src/hooks/useProgress.ts con este código
// 2. Este parche incluye:
//    - Validación de UUIDs antes de hacer queries
//    - Mejor manejo de errores específicos
//    - Logging detallado para debugging
//    - Prevención de errores "undefined" en queries
//    - Manejo específico de errores de autenticación y base de datos