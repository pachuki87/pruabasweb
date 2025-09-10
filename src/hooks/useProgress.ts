import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
type UserTestResults = Database['public']['Tables']['user_test_results']['Row'];

interface UseProgressReturn {
  // Estado del progreso
  progresoDelCurso: UserCourseProgress[] | null;
  estadisticasUsuario: any;
  resultadosPruebas: UserTestResults[] | null;
  cargando: boolean;
  error: string | null;
  
  // Funciones para actualizar progreso
  actualizarProgresoCapitulo: (params: {
    courseId: string;
    chapterId: string;
    progressPercentage?: number;
    timeSpentMinutes?: number;
    isCompleted?: boolean;
  }) => Promise<void>;
  
  marcarCapituloCompletado: (courseId: string, chapterId: string) => Promise<void>;
  registrarTiempoEstudio: (courseId: string, chapterId: string, minutos: number) => Promise<void>;
  
  saveTestResults: (params: {
    quizId: string;
    courseId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeTakenMinutes?: number;
    passed?: boolean;
    answersData?: any;
    startedAt?: string;
    completedAt?: string;
  }) => Promise<void>;
  
  // Funciones para obtener datos
  refreshProgress: () => Promise<void>;
  getCourseProgress: (courseId: string) => Promise<UserCourseProgress[] | null>;
  getUserTestResults: (courseId?: string) => Promise<UserTestResults[] | null>;
}

export const useProgress = (courseId?: string): UseProgressReturn => {
  const { user } = useAuth();
  const [progresoDelCurso, setProgresoDelCurso] = useState<UserCourseProgress[] | null>(null);
  const [estadisticasUsuario, setEstadisticasUsuario] = useState<any>(null);
  const [resultadosPruebas, setResultadosPruebas] = useState<UserTestResults[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Referencias para control de requests
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const requestControlRef = useRef<{
    abortController: AbortController | null;
    timeoutId: NodeJS.Timeout | null;
  }>({ abortController: null, timeoutId: null });

  // Función para cancelar requests anteriores
  const cancelPreviousRequests = useCallback(() => {
    // Cancelar AbortController principal
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Cancelar controles de request específicos
    if (requestControlRef.current.abortController) {
      requestControlRef.current.abortController.abort();
    }
    if (requestControlRef.current.timeoutId) {
      clearTimeout(requestControlRef.current.timeoutId);
    }
    requestControlRef.current = { abortController: null, timeoutId: null };
    
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  }, []);

  // Función de retry con backoff exponencial
  const retryWithBackoff = useCallback(async <T>(
    fn: (signal?: AbortSignal) => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Crear nuevo AbortController para cada intento
        const controller = new AbortController();
        abortControllerRef.current = controller;
        
        return await fn(controller.signal);
      } catch (error) {
        // Si fue cancelado, no reintentar
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        
        if (attempt === maxRetries - 1) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`⚠️ Intento ${attempt + 1} fallido, reintentando en ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }, []);

  // Cargar datos iniciales con debounce
  useEffect(() => {
    if (user?.id) {
      // Cancelar requests anteriores
      cancelPreviousRequests();
      
      // Debounce para evitar múltiples llamadas simultáneas
      loadingTimeoutRef.current = setTimeout(() => {
        loadInitialData();
      }, 300);
    }
    
    return () => {
      cancelPreviousRequests();
    };
  }, [user?.id, courseId, cancelPreviousRequests]);

  const loadInitialData = useCallback(async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }

    // Crear nuevo AbortController para esta carga
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      setError(null);
      
      // Validar courseId si se proporciona
      if (courseId && !isValidUUID(courseId)) {
        console.warn(`⚠️ ID de curso inválido proporcionado: ${courseId}`);
        console.warn('⚠️ Saltando carga de datos hasta que se proporcione un courseId válido');
        setLoading(false);
        return;
      }
      
      // Usar retry con backoff para las operaciones
      await retryWithBackoff(async (signal) => {
        if (signal?.aborted) {
          throw new Error('Request aborted');
        }
        
        if (courseId) {
          console.log(`🔄 Cargando progreso para curso: ${courseId}`);
          
          // Cargar datos secuencialmente para evitar conflictos
          const progress = await ProgressService.getCourseProgress(user.id, courseId);
          
          if (signal?.aborted) {
            throw new Error('Request aborted');
          }
          
          setProgresoDelCurso(progress);
          
          // Pequeña pausa entre requests
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (signal?.aborted) {
            throw new Error('Request aborted');
          }
          
          const tests = await ProgressService.getUserTestResults(user.id, courseId);
          setResultadosPruebas(tests);
          
          console.log(`✅ Progreso cargado: ${progress?.length || 0} registros`);
        } else {
          console.log('🔄 Cargando estadísticas generales del usuario');
          
          const stats = await ProgressService.getUserProgressStats(user.id);
          
          if (signal?.aborted) {
            throw new Error('Request aborted');
          }
          
          setEstadisticasUsuario(stats);
          setProgresoDelCurso(stats.courseProgress);
          setResultadosPruebas(stats.recentTests);
          
          console.log('✅ Estadísticas generales cargadas');
        }
      });
    } catch (err) {
      // Ignorar errores de abort
      if (signal.aborted || (err instanceof Error && err.message.includes('aborted'))) {
        console.log('🔄 Request cancelado (normal)');
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      logError('loadInitialData', err, { courseId, userId: user.id });
      
      // Manejo específico de errores comunes
      if (errorMessage.includes('invalid input syntax for type uuid')) {
        setError('Error de formato de identificador. Por favor, recarga la página.');
      } else if (errorMessage.includes('PGRST205')) {
        setError('Tabla de base de datos no encontrada. Contacta al administrador.');
      } else if (errorMessage.includes('Auth session missing')) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (errorMessage.includes('ERR_ABORTED') || errorMessage.includes('net::ERR_ABORTED')) {
        console.warn('⚠️ Request abortado, reintentando...');
        // No establecer error para requests abortados
      } else {
        setError(errorMessage);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [user?.id, courseId, retryWithBackoff]);

  const updateChapterProgress = async (params: {
    courseId: string;
    chapterId: string;
    progressPercentage?: number;
    timeSpentMinutes?: number;
    isCompleted?: boolean;
  }) => {
    if (!user?.id) {
      console.warn('⚠️ Usuario no autenticado para actualizar progreso');
      return;
    }
    
    // Validar UUIDs - no lanzar error, solo log y return
    if (!isValidUUID(params.courseId)) {
      console.warn(`⚠️ ID de curso inválido en updateChapterProgress: ${params.courseId}`);
      return;
    }
    if (!isValidUUID(params.chapterId)) {
      console.warn(`⚠️ ID de capítulo inválido en updateChapterProgress: ${params.chapterId}`);
      return;
    }
    
    try {
      console.log('🔄 Actualizando progreso del capítulo:', params);
      
      await ProgressService.updateChapterProgress({
        userId: user.id,
        ...params
      });
      
      console.log('✅ Progreso actualizado exitosamente');
      
      // Refrescar datos después de la actualización con delay
      setTimeout(() => {
        refreshProgress();
      }, 500);
    } catch (err) {
      logError('updateChapterProgress', err, params);
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando progreso';
      setError(errorMessage);
      throw err;
    }
  };

  const markChapterCompleted = async (courseId: string, chapterId: string) => {
    if (!user?.id) {
      console.warn('⚠️ Usuario no autenticado para marcar capítulo completado');
      return;
    }
    
    // Validar UUIDs - no lanzar error, solo log y return
    if (!isValidUUID(courseId)) {
      console.warn(`⚠️ ID de curso inválido en markChapterCompleted: ${courseId}`);
      return;
    }
    if (!isValidUUID(chapterId)) {
      console.warn(`⚠️ ID de capítulo inválido en markChapterCompleted: ${chapterId}`);
      return;
    }
    
    try {
      console.log(`🔄 Marcando capítulo como completado: ${chapterId}`);
      
      await ProgressService.markChapterCompleted(user.id, courseId, chapterId);
      
      // Refrescar con delay para evitar conflictos
      setTimeout(() => {
        refreshProgress();
      }, 500);
      
      console.log('✅ Capítulo marcado como completado');
    } catch (err) {
      logError('markChapterCompleted', err, { courseId, chapterId });
      setError(err instanceof Error ? err.message : 'Error marcando capítulo como completado');
      throw err;
    }
  };

  const trackStudyTime = async (courseId: string, chapterId: string, minutes: number) => {
    if (!user?.id) {
      console.warn('⚠️ Usuario no autenticado para registrar tiempo de estudio');
      return;
    }
    
    // Validar UUIDs - no lanzar error, solo log y return
    if (!isValidUUID(courseId)) {
      console.warn(`⚠️ ID de curso inválido en trackStudyTime: ${courseId}`);
      return;
    }
    if (!isValidUUID(chapterId)) {
      console.warn(`⚠️ ID de capítulo inválido en trackStudyTime: ${chapterId}`);
      return;
    }
    
    try {
      console.log(`🔄 Registrando tiempo de estudio: ${minutes} minutos`);
      
      await ProgressService.trackStudyTime(user.id, courseId, chapterId, minutes);
      // No refrescar inmediatamente para evitar muchas llamadas
      
      console.log('✅ Tiempo de estudio registrado');
    } catch (err) {
      logError('trackStudyTime', err, { courseId, chapterId, minutes });
      // No mostrar error al usuario para el tracking de tiempo
    }
  };

  const saveTestResults = async (params: {
    quizId: string;
    courseId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeTakenMinutes?: number;
    passed?: boolean;
    answersData?: any;
    startedAt?: string;
    completedAt?: string;
  }) => {
    if (!user?.id) {
      console.warn('⚠️ Usuario no autenticado para guardar resultados de test');
      return;
    }
    
    // Validar UUIDs - no lanzar error, solo log y return
    if (!isValidUUID(params.courseId)) {
      console.warn(`⚠️ ID de curso inválido en saveTestResults: ${params.courseId}`);
      return;
    }
    if (!isValidUUID(params.quizId)) {
      console.warn(`⚠️ ID de cuestionario inválido en saveTestResults: ${params.quizId}`);
      return;
    }
    
    try {
      console.log('🔄 Guardando resultados del test:', params);
      
      await ProgressService.saveTestResults({
        userId: user.id,
        ...params
      });
      
      // Refrescar con delay para evitar conflictos
      setTimeout(() => {
        refreshProgress();
      }, 500);
      
      console.log('✅ Resultados del test guardados');
    } catch (err) {
      logError('saveTestResults', err, params);
      setError(err instanceof Error ? err.message : 'Error guardando resultados del examen');
      throw err;
    }
  };

  const refreshProgress = useCallback(async () => {
    // Cancelar requests anteriores antes de refrescar
    cancelPreviousRequests();
    
    // Pequeño delay para evitar conflictos
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await loadInitialData();
  }, [loadInitialData, cancelPreviousRequests]);

  const getCourseProgress = async (courseId: string): Promise<UserCourseProgress[] | null> => {
    if (!user?.id) {
      console.warn('⚠️ Usuario no autenticado para obtener progreso del curso');
      return null;
    }
    
    // Validar UUID - no lanzar error, solo log y return
    if (!isValidUUID(courseId)) {
      console.warn(`⚠️ ID de curso inválido en getCourseProgress: ${courseId}`);
      return null;
    }
    
    try {
      return await ProgressService.getCourseProgress(user.id, courseId);
    } catch (err) {
      logError('getCourseProgress', err, { courseId });
      return null;
    }
  };

  const getUserTestResults = async (courseId?: string): Promise<UserTestResults[] | null> => {
    if (!user?.id) {
      console.warn('⚠️ Usuario no autenticado para obtener resultados de tests');
      return null;
    }
    
    // Validar UUID - no lanzar error, solo log y return
    if (courseId && !isValidUUID(courseId)) {
      console.warn(`⚠️ ID de curso inválido en getUserTestResults: ${courseId}`);
      return null;
    }
    
    try {
      return await ProgressService.getUserTestResults(user.id, courseId);
    } catch (err) {
      logError('getUserTestResults', err, { courseId });
      return null;
    }
  };

  return {
    // Propiedades de estado (español)
    progresoDelCurso,
    estadisticasUsuario,
    resultadosPruebas,
    cargando: loading,
    error: error,
    
    // Funciones (español)
    actualizarProgresoCapitulo: updateChapterProgress,
    marcarCapituloCompletado: markChapterCompleted,
    registrarTiempoEstudio: trackStudyTime,
    saveTestResults: saveTestResults,
    refreshProgress: refreshProgress,
    getCourseProgress: getCourseProgress,
    getUserTestResults: getUserTestResults
  };
};

export default useProgress;