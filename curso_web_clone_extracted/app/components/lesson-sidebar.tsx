
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/course-data';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: number;
  courseTitle: string;
}

export function LessonSidebar({ lessons, currentLessonId, courseTitle }: LessonSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Simulamos lecciones completadas (en una app real esto vendría del estado del usuario)
  const completedLessons = lessons
    .filter(lesson => lesson.id < currentLessonId)
    .map(lesson => lesson.id);

  const progressPercentage = Math.round((completedLessons.length / lessons.length) * 100);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header del sidebar */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {!isCollapsed && (
              <span className="font-semibold text-sm">{courseTitle}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso del curso</span>
              <span>{completedLessons.length}/{lessons.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-center text-muted-foreground">
              {progressPercentage}% completado
            </div>
          </div>
        )}
      </div>

      {/* Lista de lecciones */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {lessons.map((lesson) => {
          const isActive = lesson.id === currentLessonId;
          const isCompleted = completedLessons.includes(lesson.id);

          return (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
              <Card 
                className={cn(
                  "p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
                  isActive && "lesson-active bg-primary text-primary-foreground",
                  isCompleted && !isActive && "bg-green-50 border-green-200"
                )}
              >
                <div className="flex items-start space-x-3">
                  {/* Ícono de estado */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : isActive ? (
                      <PlayCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-current opacity-50" />
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      {/* Número y título */}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {lesson.id}
                        </span>
                        {lesson.hasQuiz && (
                          <HelpCircle className="h-3 w-3 opacity-75" />
                        )}
                      </div>
                      
                      <h4 className="text-sm font-medium leading-tight mb-2 line-clamp-2">
                        {lesson.title}
                      </h4>

                      {/* Recursos */}
                      <div className="flex flex-wrap gap-1">
                        {lesson.hasContent && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            Contenido
                          </Badge>
                        )}
                        {lesson.pdfs?.length > 0 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            <FileText className="h-3 w-3 mr-1" />
                            {lesson.pdfs.length}
                          </Badge>
                        )}
                        {lesson.hasQuiz && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            Quiz
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-20 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "bg-gray-50 border-r transition-all duration-300 flex flex-col",
          "fixed left-0 top-16 bottom-0 z-50 lg:relative lg:top-0",
          isCollapsed ? "w-16" : "w-80",
          isMobileOpen || !isCollapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
