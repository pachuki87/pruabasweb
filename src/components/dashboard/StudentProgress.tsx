import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import useProgress from '../../hooks/useProgress';

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

  useEffect(() => {
    fetchStudentProgress();
  }, [user, estadisticasUsuario]);

  const fetchStudentProgress = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch enrolled courses
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('inscripciones')
        .select(`
          curso_id,
          cursos!inner (
            id,
            titulo
          )
        `)
        .eq('user_id', user.id);

      if (enrollmentsError) throw enrollmentsError;

      if (!enrollments || enrollments.length === 0) {
        setCourseProgress([]);
        setIsLoading(false);
        return;
      }

      const progressData: CourseProgress[] = [];

      for (const enrollment of enrollments) {
        const courseId = enrollment.curso_id;
        const courseTitle = enrollment.cursos?.titulo || 'Curso sin título';

        // Count total chapters
        const { count: totalChapters, error: chaptersError } = await supabase
          .from('lecciones')
          .select('*', { count: 'exact', head: true })
          .eq('curso_id', courseId);

        if (chaptersError) {
          console.error('Error fetching chapters:', chaptersError);
          continue;
        }

        // Count total quizzes
        const { count: totalQuizzes, error: quizzesError } = await supabase
          .from('cuestionarios')
          .select('*', { count: 'exact', head: true })
          .eq('curso_id', courseId);

        if (quizzesError) {
          console.error('Error fetching quizzes:', quizzesError);
          continue;
        }

        // Count completed quizzes (quiz attempts by this student)
        const { count: completedQuizzes, error: attemptsError } = await supabase
          .from('respuestas_texto_libre')
          .select('pregunta_id', { count: 'exact', head: true })
          .or(`user_id.eq.${user.id},user_id.eq.anonymous`)
          .in('pregunta_id', 
            await supabase
              .from('cuestionarios')
              .select('id')
              .eq('curso_id', courseId)
              .then(({ data }) => data?.map(q => q.id) || [])
          );

        if (attemptsError) {
          console.error('Error fetching quiz attempts:', attemptsError);
        }

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
          completedChapters = Math.min(completedQuizzes || 0, totalChapters || 0);
          const totalItems = (totalChapters || 0) + (totalQuizzes || 0);
          const completedItems = completedChapters + (completedQuizzes || 0);
          progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        }

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

      setCourseProgress(progressData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching student progress:', error);
      setIsLoading(false);
    }
  };

  // Show loading if either local loading or progress loading
  const showLoading = isLoading || progressLoading;

  // Debug information
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