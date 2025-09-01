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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (role === 'teacher') {
        // Fetch total courses for teacher
        const { count: coursesCount, error: coursesError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', user.id);

        if (coursesError) throw coursesError;

        // Fetch total students enrolled in teacher's courses
        const { data: teacherCourses } = await supabase
          .from('courses')
          .select('id')
          .eq('teacher_id', user.id);

        const courseIds = teacherCourses?.map(course => course.id) || [];
        
        const { count: studentsCount, error: studentsError } = await supabase
          .from('inscripciones')
          .select('*', { count: 'exact', head: true })
          .in('curso_id', courseIds);

        if (studentsError) throw studentsError;

        // Fetch total quizzes for teacher's courses
        const { count: quizzesCount, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds);

        if (quizzesError) throw quizzesError;

        setStats({
          courses: coursesCount || 0,
          students: studentsCount || 0,
          chapters: 0,
          quizzes: quizzesCount || 0,
          materials: 0,
          completedCourses: 0,
        });
      } else {
        // Student stats
        // Fetch enrolled courses
        const { count: enrolledCoursesCount, error: enrolledError } = await supabase
          .from('inscripciones')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', user.id);

        if (enrolledError) throw enrolledError;

        // Fetch completed quizzes
        const { count: completedQuizzesCount, error: quizzesError } = await supabase
          .from('quiz_attempts')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id);

        if (quizzesError) throw quizzesError;

        // Calculate completed courses (simplified: courses with at least one quiz attempt)
        const { data: enrollments } = await supabase
        .from('inscripciones')
          .select('curso_id')
          .eq('usuario_id', user.id);

        let completedCoursesCount = 0;
        if (enrollments) {
          for (const enrollment of enrollments) {
            const { data: quizAttempts } = await supabase
              .from('quiz_attempts')
              .select('quiz_id')
              .eq('student_id', user.id)
              .eq('quiz_id', enrollment.course_id);
            
            if (quizAttempts && quizAttempts.length > 0) {
              completedCoursesCount++;
            }
          }
        }

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
      console.error('Error fetching stats:', error);
      setStats({
        courses: 0,
        students: 0,
        chapters: 0,
        quizzes: 0,
        materials: 0,
        completedCourses: 0,
      });
      setIsLoading(false);
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
            value={`${stats.courses} curso(s)`}
            color="blue"
          />
          
          {role === 'teacher' ? (
            <StatsCard
              title="Total de Estudiantes"
              value={`${stats.students} estudiante(s)`}
              color="gray"
            />
          ) : (
            <StatsCard
              title="Cursos Completados"
              value={`${stats.completedCourses} curso(s)`}
              color="green"
            />
          )}
          
          <StatsCard
            title="Total de Cuestionarios"
            value={`${stats.quizzes} cuestionario(s)`}
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
