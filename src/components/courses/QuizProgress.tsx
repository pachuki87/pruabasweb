import React, { useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../contexts/AuthContext';

interface QuizProgressProps {
  courseId: string;
  lessonId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  onProgressSaved?: () => void;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  courseId,
  lessonId,
  quizId,
  score,
  totalQuestions,
  timeSpent,
  onProgressSaved
}) => {
  const { user } = useAuth();
  const { saveTestResults, marcarCapituloCompletado } = useProgress(courseId);

  useEffect(() => {
    const saveProgress = async () => {
      if (!user || !courseId || !lessonId || !quizId) return;

      try {
        // Calcular porcentaje
        const percentage = Math.round((score / totalQuestions) * 100);
        const passed = percentage >= 70; // 70% para aprobar

        // Guardar resultado del test
        await saveTestResults({
          lessonId,
          quizId,
          score,
          totalQuestions,
          percentage,
          timeSpent,
          passed
        });

        // Si aprobó, marcar la lección como completada
        if (passed) {
          await marcarCapituloCompletado(lessonId);
        }

        // Notificar que se guardó el progreso
        if (onProgressSaved) {
          onProgressSaved();
        }

        console.log('✅ Quiz progress saved:', {
          lessonId,
          quizId,
          score,
          percentage,
          passed
        });
      } catch (error) {
        console.error('❌ Error saving quiz progress:', error);
      }
    };

    saveProgress();
  }, [user, courseId, lessonId, quizId, score, totalQuestions, timeSpent, saveTestResults, marcarCapituloCompletado, onProgressSaved]);

  return null; // Este componente no renderiza nada, solo maneja la lógica
};

export default QuizProgress;