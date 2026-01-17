import { supabase } from '../supabase';
import type { Database } from '../database.types';

type UserCourseProgress = Database['public']['Tables']['user_course_progress']['Row'];
type UserCourseProgressInsert = Database['public']['Tables']['user_course_progress']['Insert'];
type UserCourseProgressUpdate = Database['public']['Tables']['user_course_progress']['Update'];

type UserTestResults = Database['public']['Tables']['user_test_results']['Row'];
type UserTestResultsInsert = Database['public']['Tables']['user_test_results']['Insert'];

export class ProgressService {
  /**
   * Actualiza o crea el progreso de un usuario en un capítulo específico
   */
  static async updateChapterProgress({
    userId,
    courseId,
    chapterId,
    progressPercentage = 0,
    timeSpentMinutes = 0,
    isCompleted = false
  }: {
    userId: string;
    courseId: string;
    chapterId: string;
    progressPercentage?: number;
    timeSpentMinutes?: number;
    isCompleted?: boolean;
  }) {
    try {
      // Verificar si ya existe un registro de progreso
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('curso_id', courseId)
        .eq('leccion_id', chapterId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const now = new Date().toISOString();

      if (existingProgress) {
        // Actualizar progreso existente
        const updateData = {
          progreso_porcentaje: Math.max(existingProgress.progreso_porcentaje || 0, progressPercentage),
          tiempo_estudiado: (existingProgress.tiempo_estudiado || 0) + timeSpentMinutes,
          estado: isCompleted ? 'completado' : (existingProgress.estado || 'en_progreso'),
          ultima_actividad: now,
          fecha_completado: isCompleted && !existingProgress.fecha_completado ? now : existingProgress.fecha_completado
        };

        const { data, error } = await supabase
          .from('user_course_progress')
          .update(updateData)
          .eq('id', existingProgress.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Crear nuevo registro de progreso
        const insertData = {
          user_id: userId,
          curso_id: courseId,
          leccion_id: chapterId,
          progreso_porcentaje: progressPercentage,
          tiempo_estudiado: timeSpentMinutes,
          estado: isCompleted ? 'completado' : 'en_progreso',
          ultima_actividad: now,
          fecha_completado: isCompleted ? now : null,
          fecha_inicio: now
        };

        const { data, error } = await supabase
          .from('user_course_progress')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error updating chapter progress:', error);
      throw error;
    }
  }

  /**
   * Obtiene el progreso de un usuario en un curso específico
   */
  static async getCourseProgress(userId: string, courseId: string) {
    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('curso_id', courseId)
        .order('ultima_actividad', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw error;
    }
  }

  /**
   * Obtiene el progreso general de un usuario en todos sus cursos
   */
  static async getUserOverallProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_course_summary')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user overall progress:', error);
      throw error;
    }
  }

  /**
   * Guarda los resultados de un examen/cuestionario
   */
  static async saveTestResults({
    userId,
    quizId,
    courseId,
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    timeTakenMinutes,
    passed = false,
    answersData,
    startedAt,
    completedAt
  }: {
    userId: string;
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
  }) {
    try {
      const insertData: UserTestResultsInsert = {
        user_id: userId,
        cuestionario_id: quizId,
        curso_id: courseId,
        puntuacion: score,
        puntuacion_maxima: totalQuestions,
        tiempo_completado: timeTakenMinutes,
        respuestas_detalle: answersData,
        // aprobado es columna generada
        fecha_completado: completedAt || new Date().toISOString()
        // Nota: completed_at fue eliminado - usar fecha_completado
      };

      const { data, error } = await supabase
        .from('user_test_results')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving test results:', error);
      throw error;
    }
  }

  /**
   * Obtiene los resultados de exámenes de un usuario
   */
  static async getUserTestResults(userId: string, courseId?: string) {
    try {
      let query = supabase
        .from('user_test_results')
        .select(`
          *,
          cuestionarios:cuestionario_id (
            id,
            titulo
          ),
          courses:curso_id (
            id,
            titulo
          )
        `)
        .eq('user_id', userId)
        .order('fecha_completado', { ascending: false });

      if (courseId) {
        query = query.eq('curso_id', courseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  }

  /**
   * Obtiene las estadísticas de progreso de un usuario
   */
  static async getUserProgressStats(userId: string) {
    try {
      // Progreso por curso
      const { data: courseProgress, error: courseError } = await supabase
        .from('user_course_summary')
        .select('*')
        .eq('user_id', userId);

      if (courseError) throw courseError;

      // Resultados de exámenes recientes
      const { data: recentTests, error: testsError } = await supabase
        .from('user_test_results')
        .select(`
          *,
          cuestionarios:cuestionario_id (
            titulo
          ),
          courses:curso_id (
            titulo
          )
        `)
        .eq('user_id', userId)
        .order('fecha_completado', { ascending: false })
        .limit(10);

      if (testsError) throw testsError;

      // Calcular estadísticas generales
      const totalCourses = courseProgress?.length || 0;
      const completedCourses = courseProgress?.filter(c => c.porcentaje_progreso === 100).length || 0;
      const averageProgress = courseProgress?.reduce((acc, c) => acc + (c.porcentaje_progreso || 0), 0) / totalCourses || 0;
      const totalTimeSpent = courseProgress?.reduce((acc, c) => acc + (c.tiempo_total_gastado || 0), 0) || 0;
      const averageTestScore = 0; // No hay campo de puntuación promedio en user_course_summary

      return {
        courseProgress,
        recentTests,
        stats: {
          totalCourses,
          completedCourses,
          averageProgress: Math.round(averageProgress * 100) / 100,
          totalTimeSpent,
          averageTestScore: averageTestScore
        }
      };
    } catch (error) {
      console.error('Error fetching user progress stats:', error);
      throw error;
    }
  }

  /**
   * Marca un capítulo como completado
   */
  static async markChapterCompleted(userId: string, courseId: string, chapterId: string) {
    return this.updateChapterProgress({
      userId,
      courseId,
      chapterId,
      progressPercentage: 100,
      isCompleted: true
    });
  }

  /**
   * Registra el tiempo de estudio en un capítulo
   */
  static async trackStudyTime(userId: string, courseId: string, chapterId: string, minutes: number) {
    return this.updateChapterProgress({
      userId,
      courseId,
      chapterId,
      timeSpentMinutes: minutes
    });
  }
}

export default ProgressService;