import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProgressService } from '../lib/services/progressService';
import type { Database } from '../lib/database.types';

type UserCourseProgress = Database['public']['Tables']['user_course_progress']['Row'];
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
    cursoId: string;
    capituloId: string;
    porcentajeProgreso?: number;
    tiempoEstudioMinutos?: number;
    estaCompletado?: boolean;
  }) => Promise<void>;
  
  marcarCapituloCompletado: (cursoId: string, capituloId: string) => Promise<void>;
  registrarTiempoEstudio: (cursoId: string, capituloId: string, minutos: number) => Promise<void>;
  
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
  const [courseProgress, setCourseProgress] = useState<UserCourseProgress[] | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [testResults, setTestResults] = useState<UserTestResults[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.id) {
      loadInitialData();
    }
  }, [user?.id, courseId]);

  const loadInitialData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Cargar progreso del curso específico o general
      if (courseId) {
        const progress = await ProgressService.getCourseProgress(user.id, courseId);
        setCourseProgress(progress);
        
        const tests = await ProgressService.getUserTestResults(user.id, courseId);
        setTestResults(tests);
      } else {
        // Cargar estadísticas generales
        const stats = await ProgressService.getUserProgressStats(user.id);
        setUserStats(stats);
        setCourseProgress(stats.courseProgress);
        setTestResults(stats.recentTests);
      }
    } catch (err) {
      console.error('Error loading progress data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
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
    
    try {
      await ProgressService.updateChapterProgress({
        userId: user.id,
        ...params
      });
      
      // Refrescar datos después de la actualización
      await refreshProgress();
    } catch (err) {
      console.error('Error updating chapter progress:', err);
      setError(err instanceof Error ? err.message : 'Error actualizando progreso');
      throw err;
    }
  };

  const markChapterCompleted = async (courseId: string, chapterId: string) => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    try {
      await ProgressService.markChapterCompleted(user.id, courseId, chapterId);
      await refreshProgress();
    } catch (err) {
      console.error('Error marking chapter completed:', err);
      setError(err instanceof Error ? err.message : 'Error marcando capítulo como completado');
      throw err;
    }
  };

  const trackStudyTime = async (courseId: string, chapterId: string, minutes: number) => {
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    try {
      await ProgressService.trackStudyTime(user.id, courseId, chapterId, minutes);
      // No refrescar inmediatamente para evitar muchas llamadas
    } catch (err) {
      console.error('Error tracking study time:', err);
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
    if (!user?.id) throw new Error('Usuario no autenticado');
    
    try {
      await ProgressService.saveTestResults({
        userId: user.id,
        ...params
      });
      
      await refreshProgress();
    } catch (err) {
      console.error('Error saving test results:', err);
      setError(err instanceof Error ? err.message : 'Error guardando resultados del examen');
      throw err;
    }
  };

  const refreshProgress = async () => {
    await loadInitialData();
  };

  const getCourseProgress = async (courseId: string): Promise<UserCourseProgress[] | null> => {
    if (!user?.id) return null;
    
    try {
      return await ProgressService.getCourseProgress(user.id, courseId);
    } catch (err) {
      console.error('Error getting course progress:', err);
      return null;
    }
  };

  const getUserTestResults = async (courseId?: string): Promise<UserTestResults[] | null> => {
    if (!user?.id) return null;
    
    try {
      return await ProgressService.getUserTestResults(user.id, courseId);
    } catch (err) {
      console.error('Error getting test results:', err);
      return null;
    }
  };

  return {
    courseProgress: courseProgress,
    userStats: userStats,
    testResults: testResults,
    loading: loading,
    error: error,
    updateChapterProgress: updateChapterProgress,
    markChapterCompleted: markChapterCompleted,
    trackStudyTime: trackStudyTime,
    saveTestResults: saveTestResults,
    refreshProgress: refreshProgress,
    getCourseProgress: getCourseProgress,
    getUserTestResults: getUserTestResults
  };
};

export default useProgress;