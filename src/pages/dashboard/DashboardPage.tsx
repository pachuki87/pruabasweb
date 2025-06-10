import React, { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
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
      // Fetch total courses
      const { count: coursesCount, error: coursesError } = await supabase
        .from('cursos')
        .select('*', { count: 'exact', head: true });

      if (coursesError) throw coursesError;

      // Fetch total students (assuming all users in 'usuarios' are students for now, or filter by role if needed)
      const { count: studentsCount, error: studentsError } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true });

      if (studentsError) throw studentsError;

      // TODO: Fetch total chapters - need to determine how chapters are stored

      setStats(prevStats => ({
        ...prevStats,
        courses: coursesCount || 0,
        students: studentsCount || 0,
        // chapters: chaptersCount || 0, // Uncomment when chapters are fetched
      }));
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      // Set stats to 0 or previous values on error
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
                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
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
             <div>
               <div>
                 <h3 className="text-md font-medium mb-2">Master en Adicciones</h3>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                   <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                 </div>
                 <div className="flex justify-between text-sm text-gray-500 mt-1">
                   <span>Progreso: 45%</span>
                   <span>5/12 lecciones completadas</span>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   );
 };

export default DashboardPage;
