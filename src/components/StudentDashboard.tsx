import React, { useEffect, useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Trophy, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface ProgressCardProps {
  titulo: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  titulo, 
  value, 
  subtitle, 
  icon, 
  color, 
  progress 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{titulo}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progress}%`, 
                    backgroundColor: color 
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="ml-4 p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CourseProgressItemProps {
  course: any;
  onClick?: () => void;
}

const CourseProgressItem: React.FC<CourseProgressItemProps> = ({ course, onClick }) => {
  const progress = course.overall_progress || 0;
  const isCompleted = progress === 100;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{course.course_titulo}</h4>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {course.chapters_completed || 0}/{course.chapters_accessed || 0} capítulos
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {Math.round((course.total_time_spent || 0) / 60)} horas
            </span>
            {course.average_test_score && (
              <span className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                {Math.round(course.average_test_score)}% promedio
              </span>
            )}
          </div>
        </div>
        <div className="ml-4">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progreso del curso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {course.last_activity && (
        <p className="text-xs text-gray-500">
          Última actividad: {new Date(course.last_activity).toLocaleDateString('es-ES')}
        </p>
      )}
    </div>
  );
};

interface RecentTestItemProps {
  test: any;
}

const RecentTestItem: React.FC<RecentTestItemProps> = ({ test }) => {
  const passed = test.passed;
  const score = Math.round(test.score);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{test.quizzes?.titulo || 'Examen'}</h4>
          <p className="text-sm text-gray-600">{test.courses?.titulo}</p>
        </div>
        <div className="ml-4 text-right">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {passed ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {passed ? 'Aprobado' : 'No aprobado'}
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">{score}%</p>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>{test.correct_answers}/{test.total_questions} correctas</span>
        <span>Intento #{test.attempt_number}</span>
      </div>
      
      {test.fecha_completado && (
        <p className="text-xs text-gray-500 mt-2">
          {new Date(test.fecha_completado).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      )}
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userStats, loading, error, refreshProgress } = useProgress();
  
  useEffect(() => {
    if (user?.id) {
      refreshProgress();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">Error cargando el dashboard: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = userStats?.stats || {};
  const courseProgress = userStats?.courseProgress || [];
  const recentTests = userStats?.recentTests || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user?.nombre || user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Aquí tienes un resumen de tu progreso académico
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="cursor-pointer transform hover:scale-105 transition-transform"
            onClick={() => window.location.href = '/student/courses'}
          >
            <ProgressCard
              titulo="Cursos Totales"
              value={stats.totalCourses || 0}
              subtitle={`${stats.completedCourses || 0} completados`}
              icon={<BookOpen className="w-6 h-6" />}
              color="#3B82F6"
              progress={stats.totalCourses > 0 ? (stats.completedCourses / stats.totalCourses) * 100 : 0}
            />
          </div>
          
          <ProgressCard
            titulo="Progreso Promedio"
            value={`${Math.round(stats.averageProgress || 0)}%`}
            subtitle="En todos los cursos"
            icon={<TrendingUp className="w-6 h-6" />}
            color="#10B981"
            progress={stats.averageProgress || 0}
          />
          
          <ProgressCard
            titulo="Tiempo de Estudio"
            value={`${Math.round((stats.totalTimeSpent || 0) / 60)}h`}
            subtitle="Total acumulado"
            icon={<Clock className="w-6 h-6" />}
            color="#F59E0B"
          />
          
          <ProgressCard
            titulo="Promedio Exámenes"
            value={`${Math.round(stats.averageTestScore || 0)}%`}
            subtitle="Calificación promedio"
            icon={<Trophy className="w-6 h-6" />}
            color="#8B5CF6"
            progress={stats.averageTestScore || 0}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Progreso por Curso</h2>
              <button
                onClick={() => window.location.href = '/student/courses'}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ver Todos los Cursos</span>
              </button>
            </div>
            <div className="space-y-4">
              {courseProgress.length > 0 ? (
                courseProgress.map((course: any) => (
                  <CourseProgressItem
                    key={course.curso_id}
                    course={course}
                    onClick={() => {
                      // Navegar al curso
                      window.location.href = `/courses/${course.curso_id}`;
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tienes cursos inscritos aún</p>
                  <button
                    onClick={() => window.location.href = '/student/courses'}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Explorar Cursos
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Test Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Exámenes Recientes</h2>
            <div className="space-y-4">
              {recentTests.length > 0 ? (
                recentTests.slice(0, 5).map((test: any) => (
                  <RecentTestItem key={test.id} test={test} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No has realizado exámenes aún</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;