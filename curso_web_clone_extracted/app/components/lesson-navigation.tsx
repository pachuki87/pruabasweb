
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home,
  CheckCircle2
} from 'lucide-react';
import type { Lesson } from '@/lib/course-data';

interface LessonNavigationProps {
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
  currentLesson: Lesson;
  totalLessons: number;
}

export function LessonNavigation({ 
  previousLesson, 
  nextLesson, 
  currentLesson, 
  totalLessons 
}: LessonNavigationProps) {
  const progressPercentage = Math.round((currentLesson.id / totalLessons) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Progreso de la lección */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Progreso del Curso</h3>
              <span className="text-sm text-muted-foreground">
                {currentLesson.id} de {totalLessons} lecciones
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-sm text-center text-muted-foreground">
              {progressPercentage}% completado
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación entre lecciones */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Lección anterior */}
        <div className="order-1">
          {previousLesson ? (
            <Link href={`/lessons/${previousLesson.id}`}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">
                      ANTERIOR
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                    {previousLesson.title}
                  </h4>
                  <div className="flex items-center mt-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-muted-foreground">
                      Lección {previousLesson.id}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Link href="/">
              <Card className="h-full cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">
                      INICIO
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm">
                    Volver al Inicio
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Página principal del curso
                  </span>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Botón completar lección */}
        <div className="order-3 md:order-2">
          <Card className="h-full">
            <CardContent className="p-4 text-center">
              <Button 
                className="w-full mb-2"
                onClick={() => {
                  // Aquí se marcaría la lección como completada
                  console.log('Lección completada:', currentLesson.id);
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar como Completada
              </Button>
              <p className="text-xs text-muted-foreground">
                Marca tu progreso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Siguiente lección */}
        <div className="order-2 md:order-3">
          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.id}`}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2 mb-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      SIGUIENTE
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                    {nextLesson.title}
                  </h4>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    Lección {nextLesson.id}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="h-full bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    COMPLETADO
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-green-800">
                  ¡Curso Terminado!
                </h4>
                <p className="text-xs text-green-700 mt-1">
                  Has completado todas las lecciones
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Links de acción rápida */}
      <div className="flex justify-center space-x-4 pt-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Inicio del Curso
          </Link>
        </Button>
      </div>
    </div>
  );
}
