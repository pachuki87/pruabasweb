
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Clock, Award, PlayCircle } from 'lucide-react';
import { getCourseData, type Course } from '@/lib/course-data';

export default function HomePage() {
  const [courseData, setCourseData] = useState<Course | null>(null);

  useEffect(() => {
    getCourseData().then(setCourseData);
  }, []);

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center space-x-4 px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Instituto Lidera</span>
          </div>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={() => console.log('Perfil clicked')}>
            Mi Perfil
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container px-4 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Curso Profesional
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {courseData.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {courseData.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium">{courseData.totalLessons} Lecciones</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Nivel Experto</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">40+ Horas</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">{courseData.totalPdfs} PDFs</span>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <Button asChild size="lg" className="mr-4">
              <Link href="/lessons/1">
                <PlayCircle className="mr-2 h-5 w-5" />
                Comenzar Curso
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                const element = document.getElementById('course-content');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Contenido
            </Button>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section id="course-content" className="py-16 bg-white/50">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contenido del Curso</h2>
            <p className="text-muted-foreground">
              Módulo completo con {courseData.totalLessons} lecciones especializadas
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courseData.modules[0].lessons.map((lesson, index) => (
              <Card key={lesson.id} className="lesson-card group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mb-2">
                      Lección {lesson.id}
                    </Badge>
                    {lesson.hasQuiz && (
                      <Badge variant="secondary">
                        Quiz
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {lesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lesson.pdfs?.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        📄 {lesson.pdfs.length} PDF{lesson.pdfs.length > 1 ? 's' : ''}
                      </div>
                    )}
                    
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link href={`/lessons/${lesson.id}`}>
                        Ver Lección
                        <PlayCircle className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Instituto Lidera</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Instituto Lidera. Curso Experto en Conductas Adictivas.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
