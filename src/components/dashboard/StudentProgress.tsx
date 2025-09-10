import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useProgress } from '../../hooks/useProgress';

type CourseProgress = {
  id: string;
  titulo: string;
  totalChapters: number;
  completedChapters: number;
  totalQuizzes: number;
  completedQuizzes: number;
  progressPercentage: number;
};

const StudentProgress: React.FC = () => {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { estadisticasUsuario, cargando: progressLoading, error: progressError } = useProgress();

  // AbortController para cancelar requests anteriores
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStudentProgress = useCallback(async () => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Verificar si fue cancelado
      if (signal.aborted) return;

      // Fetch enrolled courses con AbortSignal
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('inscripciones')
        .select(`
          curso_id,
          cursos!inner (
            id,
            titulo
          )
        `)
        .eq('user_id', user.id)
        .abortSignal(signal);

      if (enrollmentsError) throw enrollmentsError;

      if (!enrollments || enrollments.length === 0) {
        setCourseProgress([]);
        setIsLoading(false);
        return;
      }

      // Verificar si fue cancelado
      if (signal.aborted) return;

      const progressData: CourseProgress[] = [];

      for (const enrollment of enrollments) {
        // Verificar cancelación en cada iteración
        if (signal.aborted) return;
        
        const courseId = enrollment.curso_id;
        const courseTitle = enrollment.cursos?.titulo || 'Curso sin título';

        // Delay entre requests para evitar cancelaciones
        await new Promise(resolve => setTimeout(resolve, 100));
        if (signal.aborted) return;

        // Count total chapters con AbortSignal
        const { count: totalChapters, error: chaptersError } = await supabase
          .from('lecciones')
          .select('*', { count: 'exact', head: true })
          .eq('curso_id', courseId)
          .abortSignal(signal);

        if (chaptersError) {
          console.error('Error fetching chapters:', chaptersError);
          continue;
        }

        // Delay y verificación de cancelación
        await new Promise(resolve => setTimeout(resolve, 100));
        if (signal.aborted) return;

        // Count total quizzes con AbortSignal
        const { count: totalQuizzes, error: quizzesError } = await supabase
          .from('cuestionarios')
          .select('*', { count: 'exact', head: true })
          .eq('curso_id', courseId)
          .abortSignal(signal);

        if (quizzesError) {
          console.error('Error fetching quizzes:', quizzesError);
          continue;
        }

        // Delay y verificación de cancelación
        await new Promise(resolve => setTimeout(resolve, 100));
        if (signal.aborted) return;

        // Obtener IDs de cuestionarios primero
        const { data: quizIds } = await supabase
          .from('cuestionarios')
          .select('id')
          .eq('curso_id', courseId)
          .abortSignal(signal);

        const questionIds = quizIds?.map(q => q.id) || [];
        
        // Delay y verificación de cancelación
        await new Promise(resolve => setTimeout(resolve, 100));
        if (signal.aborted) return;

        // Count completed quizzes from user_test_results
        let completedQuizzes = 0;
        if (questionIds.length > 0) {
          const { count, error: attemptsError } = await supabase
            .from('user_test_results')
            .select('cuestionario_id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .in('cuestionario_id', questionIds)
            .abortSignal(signal);

          if (attemptsError) {
            console.error('Error fetching quiz attempts:', attemptsError);
          } else {
            completedQuizzes = count || 0;
          }
        }
        
        console.log(`📊 Curso ${courseTitle}: ${completedQuizzes}/${totalQuizzes} cuestionarios completados`);

        // Use progress from useProgress hook if available
        let progressPercentage = 0;
        let completedChapters = 0;
        
        if (estadisticasUsuario && estadisticasUsuario.courses) {
           const courseStats = estadisticasUsuario.courses.find(c => c.curso_id === courseId);
          if (courseStats) {
            progressPercentage = Math.round(courseStats.overall_progress || 0);
            // Estimate completed chapters based on progress
            completedChapters = Math.round((progressPercentage / 100) * (totalChapters || 0));
          }
        }
        
        // Fallback to manual calculation if no stats available
        if (progressPercentage === 0) {
          // Si hay cuestionarios completados, calcular progreso basado en eso
          if (totalQuizzes > 0 && completedQuizzes > 0) {
            progressPercentage = Math.round((completedQuizzes / totalQuizzes) * 100);
            // Estimar capítulos completados basado en cuestionarios
            completedChapters = Math.round((progressPercentage / 100) * (totalChapters || 0));
          } else {
            // Cálculo tradicional si no hay datos de cuestionarios
            completedChapters = Math.min(completedQuizzes || 0, totalChapters || 0);
            const totalItems = (totalChapters || 0) + (totalQuizzes || 0);
            const completedItems = completedChapters + (completedQuizzes || 0);
            progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
          }
        }
        
        console.log(`📈 Progreso calculado para ${courseTitle}: ${progressPercentage}%`);

        progressData.push({
          id: courseId,
          titulo: courseTitle,
          totalChapters: totalChapters || 0,
          completedChapters,
          totalQuizzes: totalQuizzes || 0,
          completedQuizzes: completedQuizzes || 0,
          progressPercentage
        });
      }

      // Verificar cancelación antes de actualizar estado
      if (!signal.aborted) {
        setCourseProgress(progressData);
        setIsLoading(false);
      }
    } catch (error) {
      // No mostrar error si fue cancelado intencionalmente
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request cancelled - this is normal');
        return;
      }
      
      console.error('Error fetching student progress:', error);
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [user, estadisticasUsuario]);

  useEffect(() => {
    fetchStudentProgress();
  }, [fetchStudentProgress]);



  // Show loading if either local loading or progress loading
  const showLoading = isLoading || progressLoading;

  // Debug information - consolidated into single useEffect
  useEffect(() => {
    if (progressError) {
      console.error('Progress hook error:', progressError);
    }
    if (estadisticasUsuario) {
      console.log('User stats from hook:', estadisticasUsuario);
    }
  }, [progressError, estadisticasUsuario]);

  if (showLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (courseProgress.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tienes cursos inscritos aún.</p>
        <p className="text-sm text-gray-400 mt-1">Inscríbete en un curso para ver tu progreso aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium text-gray-700 mb-4">
        Tienes <span className="font-bold text-blue-600">{courseProgress.length}</span> curso{courseProgress.length !== 1 ? 's' : ''} inscrito{courseProgress.length !== 1 ? 's' : ''}
      </p>
      {courseProgress.map((course) => (
        <div key={course.id} className="border-b border-gray-100 pb-4 last:border-b-0">
          <h3 className="text-md font-medium mb-3">{course.titulo}</h3>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-red-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${course.progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Progreso: {course.progressPercentage}%</span>
            <span>
              {course.completedChapters}/{course.totalChapters} lecciones • {' '}
              {course.completedQuizzes}/{course.totalQuizzes} cuestionarios
            </span>
          </div>
          
          {course.progressPercentage === 100 && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Curso Completado
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentProgress;