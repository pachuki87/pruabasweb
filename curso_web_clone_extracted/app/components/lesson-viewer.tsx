
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  BookOpen,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import type { Lesson } from '@/lib/course-data';
import { cn } from '@/lib/utils';

interface LessonViewerProps {
  lesson: Lesson;
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLessonContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Cargar el contenido HTML de la lección
        const response = await fetch(lesson.contentPath);
        if (!response.ok) {
          throw new Error(`Error al cargar el contenido: ${response.status}`);
        }
        
        const htmlContent = await response.text();
        
        // Procesar el HTML para extraer el contenido principal
        const processedContent = processLessonHTML(htmlContent);
        setLessonContent(processedContent);
      } catch (err) {
        console.error('Error loading lesson content:', err);
        setError('No se pudo cargar el contenido de la lección');
      } finally {
        setIsLoading(false);
      }
    };

    loadLessonContent();
  }, [lesson.contentPath]);

  // Función para procesar el HTML y extraer el contenido relevante
  const processLessonHTML = (html: string): string => {
    try {
      // Crear un DOM parser para procesar el HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Intentar encontrar el contenido principal por diferentes selectores
      let mainContent = doc.querySelector('article')?.innerHTML ||
                       doc.querySelector('.entry-content')?.innerHTML ||
                       doc.querySelector('.lesson-content')?.innerHTML ||
                       doc.querySelector('main')?.innerHTML ||
                       doc.querySelector('.content')?.innerHTML;

      if (!mainContent) {
        // Si no encuentra contenido específico, buscar el body y limpiar
        const bodyContent = doc.querySelector('body')?.innerHTML || html;
        
        // Crear un contenedor temporal para limpiar el HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = bodyContent;
        
        // Remover elementos no deseados
        const unwantedSelectors = [
          'script', 'style', 'nav', 'header', 'footer', 
          '.navigation', '.sidebar', '.admin-bar',
          '#wpadminbar', '.yoast-breadcrumbs'
        ];
        
        unwantedSelectors.forEach(selector => {
          const elements = tempDiv.querySelectorAll(selector);
          elements.forEach(el => el?.remove?.());
        });
        
        mainContent = tempDiv.innerHTML;
      }

      // Limpiar y procesar URLs de imágenes para que funcionen localmente
      if (mainContent) {
        mainContent = mainContent.replace(
          /src="https:\/\/institutolidera\.com\/wp-content\/uploads\/[^"]*"/g,
          'src="/placeholder-image.jpg"'
        );
        
        // Limpiar otros assets externos
        mainContent = mainContent.replace(
          /href="https:\/\/institutolidera\.com[^"]*"/g,
          'href="#"'
        );
      }

      return mainContent || '<p>Contenido no disponible</p>';
    } catch (err) {
      console.error('Error processing HTML:', err);
      return '<p>Error al procesar el contenido</p>';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header de la lección */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary">
            Lección {lesson.id}
          </Badge>
          {lesson.hasQuiz && (
            <Badge variant="outline" className="text-orange-600">
              <HelpCircle className="h-3 w-3 mr-1" />
              Incluye Quiz
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">
          {lesson.title}
        </h1>

        {/* Recursos de la lección */}
        {lesson.pdfs?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Material de Apoyo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {lesson.pdfs.map((pdf, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium truncate">
                        {pdf.replace('.pdf', '')}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/course-content/Módulo 1/${lesson.folder}/${pdf}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `/course-content/Módulo 1/${lesson.folder}/${pdf}`;
                          link.download = pdf;
                          link.click();
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contenido de la lección */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Cargando contenido...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : (
            <div 
              className="course-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: lessonContent }}
            />
          )}
        </CardContent>
      </Card>

      {/* Sección de quiz si está disponible */}
      {lesson.hasQuiz && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <HelpCircle className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-800">
                Evaluación de la Lección
              </h3>
            </div>
            <p className="text-orange-700 mb-4">
              Esta lección incluye un cuestionario para evaluar tu comprensión del material.
            </p>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              <BookOpen className="h-4 w-4 mr-2" />
              Iniciar Cuestionario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
