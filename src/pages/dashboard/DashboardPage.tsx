import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import StudentProgress from '../../components/dashboard/StudentProgress';
import { supabase, getUserById } from '../../lib/supabase'; // Import getUserById

type DashboardProps = {
  role: string;
};

type Stats = {
  courses: number;
  students: number;
  chapters: number;
  quizzes?: number;
  materials?: number;
  completedCourses?: number;
};

const DashboardPage: React.FC<DashboardProps> = ({ role }) => {
  const [stats, setStats] = useState<Stats>({
    courses: 0,
    students: 0,
    chapters: 0,
    quizzes: 0,
    materials: 0,
    completedCourses: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null); // State for user name

  useEffect(() => {
    fetchStats();
    fetchUserName(); // Fetch user name on component mount or role change
  }, [role]);

  const fetchStats = async () => {
    setIsLoading(true);
    
    try {
      // Add timeout for auth check
      const authTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth timeout')), 10000)
      );
      
      const authPromise = supabase.auth.getUser();
      const { data: { user } } = await Promise.race([authPromise, authTimeout]);
      
      if (!user) {
        console.warn('⚠️ No user found, setting default stats');
        setStats({
          courses: 0,
          students: 0,
          chapters: 0,
          quizzes: 0,
          materials: 0,
          completedCourses: 0,
        });
        setIsLoading(false);
        return;
      }

      if (role === 'teacher') {
        // Add timeout for all queries
        const queryTimeout = 15000; // 15 seconds
        
        // Fetch total courses for teacher with timeout
        const coursesPromise = supabase
          .from('cursos')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', user.id);
        
        const coursesTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Courses query timeout')), queryTimeout)
        );
        
        const { count: coursesCount, error: coursesError } = await Promise.race([
          coursesPromise, 
          coursesTimeout
        ]);

        if (coursesError) {
          console.error('❌ Error fetching courses:', coursesError);
          throw coursesError;
        }

        // Fetch total students enrolled in teacher's courses with timeout
        const teacherCoursesPromise = supabase
          .from('cursos')
          .select('id')
          .eq('teacher_id', user.id);
        
        const teacherCoursesTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Teacher courses query timeout')), queryTimeout)
        );

        const { data: teacherCourses, error: teacherCoursesError } = await Promise.race([
          teacherCoursesPromise,
          teacherCoursesTimeout
        ]);

        if (teacherCoursesError) {
          console.error('❌ Error fetching teacher courses:', teacherCoursesError);
          throw teacherCoursesError;
        }

        const courseIds = teacherCourses?.map(course => course.id) || [];
        
        if (courseIds.length > 0) {
          // Fetch students count with timeout
          const studentsPromise = supabase
            .from('inscripciones')
            .select('*', { count: 'exact', head: true })
            .in('curso_id', courseIds);
          
          const studentsTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Students query timeout')), queryTimeout)
          );

          const { count: studentsCount, error: studentsError } = await Promise.race([
            studentsPromise,
            studentsTimeout
          ]);

          if (studentsError) {
            console.error('❌ Error fetching students:', studentsError);
            // Don't throw, continue with 0 count
          }

          // Fetch total quizzes for teacher's courses with timeout
          const quizzesPromise = supabase
            .from('cuestionarios')
            .select('*', { count: 'exact', head: true })
            .in('curso_id', courseIds);
          
          const quizzesTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Quizzes query timeout')), queryTimeout)
          );

          const { count: quizzesCount, error: quizzesError } = await Promise.race([
            quizzesPromise,
            quizzesTimeout
          ]);

          if (quizzesError) {
            console.error('❌ Error fetching quizzes:', quizzesError);
            // Don't throw, continue with 0 count
          }

          setStats({
            courses: coursesCount || 0,
            students: studentsCount || 0,
            chapters: 0,
            quizzes: quizzesCount || 0,
            materials: 0,
            completedCourses: 0,
          });
        } else {
          // No courses found for teacher
          setStats({
            courses: 0,
            students: 0,
            chapters: 0,
            quizzes: 0,
            materials: 0,
            completedCourses: 0,
          });
        }
      } else {
        // Student stats with timeout
        const queryTimeout = 15000; // 15 seconds
        
        // Fetch enrolled courses with timeout
        const enrolledPromise = supabase
          .from('inscripciones')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        const enrolledTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Enrolled courses query timeout')), queryTimeout)
        );

        const { count: enrolledCoursesCount, error: enrolledError } = await Promise.race([
          enrolledPromise,
          enrolledTimeout
        ]);

        if (enrolledError) {
          console.error('❌ Error fetching enrolled courses:', enrolledError);
          // Don't throw, continue with 0 count
        }

        // Fetch completed quizzes with timeout (FIXED: use intentos_cuestionario table for approved quizzes)
        console.log('📊 Fetching completed quizzes for user:', user.id);
        const quizzesPromise = supabase
          .from('intentos_cuestionario')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('aprobado', true);
        
        const quizzesTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Completed quizzes query timeout')), queryTimeout)
        );

        const { count: completedQuizzesCount, error: quizzesError } = await Promise.race([
          quizzesPromise,
          quizzesTimeout
        ]);

        if (quizzesError) {
          console.error('❌ Error fetching completed quizzes:', quizzesError);
          // Don't throw, continue with 0 count
        }

        // Calculate completed courses (simplified: courses with at least one quiz attempt)
        let completedCoursesCount = 0;
        
        try {
          const enrollmentsPromise = supabase
            .from('inscripciones')
            .select('curso_id')
            .eq('user_id', user.id);
          
          const enrollmentsTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Enrollments query timeout')), queryTimeout)
          );

          const { data: enrollments, error: enrollmentsError } = await Promise.race([
            enrollmentsPromise,
            enrollmentsTimeout
          ]);

          if (enrollmentsError) {
            console.error('❌ Error fetching enrollments for completed courses:', enrollmentsError);
          } else if (enrollments && enrollments.length > 0) {
            // Process enrollments with timeout for each course
            for (const enrollment of enrollments.slice(0, 10)) { // Limit to 10 courses to prevent timeout
              try {
                // Get quizzes for this course with timeout
                const courseQuizzesPromise = supabase
                  .from('cuestionarios')
                  .select('id')
                  .eq('curso_id', enrollment.curso_id);
                
                const courseQuizzesTimeout = new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Course quizzes query timeout')), 5000)
                );

                const { data: courseQuizzes, error: courseQuizzesError } = await Promise.race([
                  courseQuizzesPromise,
                  courseQuizzesTimeout
                ]);
                
                if (courseQuizzesError) {
                  console.error(`❌ Error fetching quizzes for course ${enrollment.curso_id}:`, courseQuizzesError);
                  continue;
                }
                
                if (courseQuizzes && courseQuizzes.length > 0) {
                  // Check if user has completed any approved quiz from this course with timeout (FIXED: use intentos_cuestionario)
                  const quizIds = courseQuizzes.map(q => q.id);
                  console.log(`🔍 Checking completed quizzes for course ${enrollment.curso_id}, quizIds:`, quizIds);
                  const quizAttemptsPromise = supabase
                    .from('intentos_cuestionario')
                    .select('cuestionario_id')
                    .eq('user_id', user.id)
                    .eq('aprobado', true)
                    .in('cuestionario_id', quizIds);
                  
                  const quizAttemptsTimeout = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Quiz attempts query timeout')), 5000)
                  );

                  const { data: quizAttempts, error: quizAttemptsError } = await Promise.race([
                    quizAttemptsPromise,
                    quizAttemptsTimeout
                  ]);
                  
                  if (quizAttemptsError) {
                    console.error(`❌ Error fetching quiz attempts for course ${enrollment.curso_id}:`, quizAttemptsError);
                    continue;
                  }
                  
                  if (quizAttempts && quizAttempts.length > 0) {
                    completedCoursesCount++;
                    console.log(`✅ Course ${enrollment.curso_id} marked as completed. Found ${quizAttempts.length} approved quiz attempts`);
                  } else {
                    console.log(`❌ Course ${enrollment.curso_id} not completed. No approved quiz attempts found`);
                  }
                }
              } catch (courseError) {
                console.error(`❌ Error processing course ${enrollment.curso_id}:`, courseError);
                continue;
              }
            }
          }
        } catch (completedCoursesError) {
          console.error('❌ Error calculating completed courses:', completedCoursesError);
        }

        console.log('📈 Final student stats calculation:', {
          enrolledCoursesCount,
          completedQuizzesCount,
          completedCoursesCount,
          userId: user.id
        });

        // Set stats with fallback values
        setStats({
          courses: enrolledCoursesCount || 0,
          students: 0,
          chapters: 0,
          quizzes: completedQuizzesCount || 0,
          materials: 0,
          completedCourses: completedCoursesCount,
        });
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Error fetching stats:', error);
      
      // Set default stats on error to prevent infinite loading
      setStats({
        courses: 0,
        students: 0,
        chapters: 0,
        quizzes: 0,
        materials: 0,
        completedCourses: 0,
      });
      setIsLoading(false);
      
      // Show user-friendly error message
      if (error.message?.includes('timeout')) {
        console.warn('⚠️ Dashboard data loading timed out, showing default values');
      } else {
        console.warn('⚠️ Dashboard data loading failed, showing default values');
      }
    }
  };

  const fetchUserName = async () => {
    const { data: { user } } = await supabase.auth.getUser(); // Get current authenticated user
    if (user) {
      const userData = await getUserById(user.id); // Fetch user data from 'usuarios' table
      if (userData) {
        setUserName(userData.nombre); // Assuming 'nombre' is the column for the user's name
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {userName ? `Bienvenido de nuevo, ${userName}` : 'Dashboard'} {/* Display welcome message */}
      </h1>
      <p className="text-gray-600 mb-6">Panel de Control</p> {/* Add Panel de Control below welcome */}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total de Cursos"
            value={`${stats.courses}`}
subtitle="Cursos"
            color="blue"
          />

          {role === 'teacher' ? (
            <StatsCard
              title="Total de Estudiantes"
              value={`${stats.students}`}
              subtitle="Estudiantes inscritos en sus cursos"
              color="gray"
            />
          ) : (
            <StatsCard
              title="Cursos Completados"
              value={`${stats.completedCourses}`}
              subtitle="Cursos finalizados exitosamente"
              color="green"
            />
          )}

          <StatsCard
            title="Total de Cuestionarios"
            value={`${stats.quizzes}`}
            subtitle="Cuestionarios creados en sus cursos"
            color="green"
          />
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {role === 'teacher' ? 'Actividad Reciente' : 'Tu Progreso de Aprendizaje'}
        </h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          {role === 'teacher' ? (
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                <span>Un nuevo estudiante se inscribió en <strong>Master en Adicciones</strong></span>
                <span className="ml-auto text-gray-400">hace 2 horas</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                <span>Agregaste un nuevo capítulo a <strong>Master en Adicciones</strong></span>
                <span className="ml-auto text-gray-400">Ayer</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                <span>El cuestionario <strong>Master en Adicciones Quiz</strong> fue intentado por 2 estudiantes</span>
                <span className="ml-auto text-gray-400">hace 3 días</span>
              </li>
            </ul>
           ) : (
             <StudentProgress />
           )}
         </div>
       </div>
     </div>
   );
 };

export default DashboardPage;
