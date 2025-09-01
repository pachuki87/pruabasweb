import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Lesson {
  id: string;
  titulo: string;
  slug: string;
  contenido?: string;
  archivo_url?: string;
  pdfs?: string[];
  enlaces_externos?: Array<{title: string; url: string; isExternal: boolean}>;
  tiene_cuestionario?: boolean;
}

interface Course {
  id: string;
  titulo: string;
  descripcion: string;
}

interface LessonViewerProps {
  lesson: Lesson;
  course: Course;
  quizId?: string | null;
  onBackToCourse?: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  course,
  quizId = null,
  onBackToCourse,
  onNextLesson,
  onPreviousLesson,
  canGoNext = false,
  canGoPrevious = false
}) => {
  // Extraer propiedades del objeto lesson
  const lessonSlug = lesson.slug;
  const lessonTitle = lesson.titulo;
  const lessonContent = lesson.contenido;
  const lessonFileUrl = lesson.archivo_url;
  const pdfs = lesson.pdfs || [];
  const externalLinks = lesson.enlaces_externos || [];
  const hasQuiz = lesson.tiene_cuestionario || false;
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const handleQuizClick = () => {
    if (quizId && courseId) {
      // Determinar el rol del usuario desde la URL actual
      const currentPath = window.location.pathname;
      const isStudent = currentPath.includes('/student/');
      const isTeacher = currentPath.includes('/teacher/');
      
      if (isStudent) {
        navigate(`/student/quizzes/attempt/${quizId}`);
      } else if (isTeacher) {
        navigate(`/teacher/quizzes/attempt/${quizId}`);
      } else {
        // Fallback para rutas sin rol específico
        navigate(`/student/quizzes/attempt/${quizId}`);
      }
    }
  };
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleNavigationClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[data-navigation-link="true"]') as HTMLAnchorElement;
      
      if (link) {
        const href = link.getAttribute('data-href') || link.getAttribute('href') || '';
        const linkText = link.textContent?.trim() || '';
        
        // Solo interceptar enlaces de navegación del curso, NO enlaces PDF
        const isPdfLink = href.includes('.pdf') || href.includes('/course-content/');
        
        if (isPdfLink) {
          // Permitir que los enlaces PDF funcionen normalmente
          console.log('📄 PDF link clicked, allowing normal behavior:', linkText, href);
          return;
        }
        
        // Solo prevenir el comportamiento por defecto para enlaces de navegación
        event.preventDefault();
        console.log('🔗 Navigation link clicked:', linkText, href);
        
        // Detectar tipo de navegación por el texto del enlace
        if (linkText.includes('Volver al Curso') || linkText.includes('Página principal del curso')) {
          console.log('🏠 Back to course clicked');
          onBackToCourse?.();
        } else if (linkText.includes('Siguiente Lección') || linkText.includes('Siguiente')) {
          console.log('➡️ Next lesson clicked');
          onNextLesson?.();
        } else if (linkText.includes('Anterior Lección') || linkText.includes('Anterior')) {
          console.log('⬅️ Previous lesson clicked');
          onPreviousLesson?.();
        }
      }
    };
    
    // Agregar event listener para interceptar clics
    document.addEventListener('click', handleNavigationClick);
    
    return () => {
      document.removeEventListener('click', handleNavigationClick);
    };
  }, [onBackToCourse, onNextLesson, onPreviousLesson]);

  useEffect(() => {
    console.log('🔄 LessonViewer useEffect triggered - lessonContent available:', !!lessonContent);
    
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Prioridad 1: Usar archivo HTML migrado si está disponible y tiene contenido válido
        if (lessonFileUrl && lessonFileUrl.trim()) {
          console.log('📁 Loading content from migrated file:', lessonFileUrl);
          try {
            const response = await fetch(lessonFileUrl);
            if (response.ok) {
              const htmlContent = await response.text();
              console.log('✅ Migrated file content loaded, length:', htmlContent.length);
              
              // Verificar si el contenido es válido (no es placeholder)
              if (!htmlContent.includes('Contenido pendiente de asignar')) {
                const processedContent = processHtmlContent(htmlContent, lessonSlug);
                console.log('✅ Migrated content processed and ready to display');
                setContent(processedContent);
                setLoading(false);
                return;
              } else {
                console.log('⚠️ Migrated file contains placeholder content, trying fallbacks...');
              }
            } else {
              console.log('⚠️ Failed to load migrated file, trying fallbacks...');
            }
          } catch (fetchError) {
            console.log('⚠️ Error loading migrated file:', fetchError, 'trying fallbacks...');
          }
        }
        
        // Prioridad 2: Usar contenido de la base de datos (legacy)
        if (lessonContent && lessonContent.trim()) {
          console.log('📄 Using legacy database content, length:', lessonContent.length);
          const processedContent = processHtmlContent(lessonContent, lessonSlug);
          console.log('✅ Legacy database content processed and ready to display');
          setContent(processedContent);
        } else {
          // Prioridad 3: Fallback a archivos estáticos
          console.log('🎬 LessonViewer - Fallback to static content for lessonSlug:', lessonSlug);
          if (!lessonSlug || lessonSlug.trim() === '' || lessonSlug === 'undefined') {
            console.log('❌ No valid lessonSlug provided:', lessonSlug);
            setError('No se proporcionó contenido para esta lección');
            return;
          }
          
          const contentUrl = `/course-content/Módulo 1/${lessonSlug}/contenido.html`;
          console.log('🌐 Fetching content from:', contentUrl);
          const response = await fetch(contentUrl);
          console.log('📡 Response status:', response.status, response.statusText);
          
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          
          const htmlContent = await response.text();
          console.log('📄 HTML content loaded, length:', htmlContent.length);
          const processedContent = processHtmlContent(htmlContent, lessonSlug);
          console.log('✅ Content processed and ready to display');
          setContent(processedContent);
        }
      } catch (err) {
        console.error('❌ Error loading lesson content:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        console.log('🏁 LessonViewer loading finished');
        setLoading(false);
      }
    };

    loadContent();
  }, [lessonSlug, lessonContent, lessonFileUrl]);

  const processHtmlContent = (html: string, slug: string): string => {
    // Crear un parser DOM temporal
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extraer el contenido principal
    let mainContent = '';
    
    // Primero, intentar encontrar el contenedor principal de Elementor
    let elementorContainer = doc.querySelector('.elementor[data-elementor-post-type="sfwd-lessons"]');
    
    if (elementorContainer) {
      mainContent = elementorContainer.innerHTML;
    } else {
      // Buscar diferentes estructuras de contenido
      const contentSelectors = [
        '.entry-content',
        '.main-content', 
        '.content',
        'main',
        '.lesson-content',
        'article .entry-content',
        'body > div',
        // Añadir un selector más genérico para el contenido principal si existe
        '[role="main"]',
        '#main',
        '#content'
      ];

      for (const selector of contentSelectors) {
        const element = doc.querySelector(selector);
        if (element) {
          console.log(`✅ Content found with selector: ${selector}`);
          mainContent = element.innerHTML;
          break;
        }
      }
      
      // Si después de buscar los selectores no se encuentra contenido, usar el body
      if (!mainContent && doc.body) {
        console.log('⚠️ No specific content container found, falling back to body content.');
        mainContent = doc.body.innerHTML;
      }
    }

    // Si el contenido principal sigue vacío, devolver el HTML original
    if (!mainContent) {
      console.log('⚠️ Could not extract main content, returning full HTML body.');
      return doc.body.innerHTML || html;
    }
    
    // Ajustar rutas de imágenes
    mainContent = mainContent.replace(
      /src="([^"]*)"/g,
      (match, src) => {
        if (src.startsWith('http') || src.startsWith('/')) {
          return match;
        }
        return `src="/course-content/Módulo 1/${slug}/imagenes/${src}"`;
      }
    );
    
    // Ajustar rutas de enlaces y interceptar navegación
    mainContent = mainContent.replace(
      /href="([^"]*)"/g,
      (match, href) => {
        // Interceptar enlaces a institutolidera.com para navegación local, EXCEPTO PDFs
        if (href.includes('institutolidera.com') && !href.includes('.pdf')) {
          // Detectar tipo de enlace por el contexto
          return 'href="#" data-navigation-link="true" data-href="' + href + '"';
        }
        
        // Mantener enlaces PDF como enlaces normales
        if (href.includes('.pdf')) {
          return match;
        }
        
        // Mantener enlaces internos y anclas
        if (href.startsWith('http') || href.startsWith('/') || href.startsWith('#')) {
          return match;
        }
        
        // Ajustar rutas relativas
        return `href="/course-content/Módulo 1/${slug}/${href}"`;
      }
    );
    
    // Mantener botones de navegación pero marcarlos para interceptación
    mainContent = mainContent.replace(
      /<div class="ld-content-action">\s*<a([^>]*href="[^"]*institutolidera\.com[^"]*"[^>]*)>([\s\S]*?)<\/a>\s*<\/div>/gi,
      '<div class="ld-content-action"><a$1 data-navigation-link="true">$2</a></div>'
    );
    
    // Remover navegación de entradas que contiene enlaces externos
    mainContent = mainContent.replace(
      /<nav[^>]*class="[^"]*navigation[^"]*post-navigation[^"]*"[^>]*>[\s\S]*?<\/nav>/gi,
      ''
    );
    
    return mainContent;
  };

  const handlePdfDownload = (pdfName: string) => {
    const pdfPath = `/pdfs/master-adicciones/${pdfName}`;
    window.open(pdfPath, '_blank');
  };

  const handleExternalLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando lección...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error al cargar la lección</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header de la lección */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{lessonTitle}</h1>
        
        {/* Materiales y recursos */}
        {(pdfs.length > 0 || externalLinks.length > 0 || hasQuiz) && (
          <div className="flex flex-wrap gap-3">
            {pdfs.map((pdf, index) => (
              <button
                key={index}
                onClick={() => handlePdfDownload(pdf)}
                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{pdf}</span>
                <Download className="w-4 h-4 ml-2" />
              </button>
            ))}
            
            {externalLinks.map((link, index) => (
              <button
                key={`external-${index}`}
                onClick={() => handleExternalLinkClick(link.url)}
                className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{link.title}</span>
                <Download className="w-4 h-4 ml-2" />
              </button>
            ))}
            
            {hasQuiz && quizId && (
              <button 
                onClick={handleQuizClick}
                className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Cuestionario disponible - Hacer clic para acceder</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contenido de la lección */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div 
          className="prose prose-lg max-w-none lesson-content elementor-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        <style jsx="true">{`
          .elementor-content .elementor-section {
            margin-bottom: 2rem;
          }
          
          .elementor-content .elementor-widget-container {
            margin-bottom: 1rem;
          }
          
          .elementor-content .elementor-widget-text-editor p {
            margin-bottom: 1rem;
            line-height: 1.6;
            color: #374151;
          }
          
          .elementor-content .elementor-button {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            background-color: #dc2626;
            color: white;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 500;
            margin: 0.5rem 0;
            transition: background-color 0.2s;
          }
          
          .elementor-content .elementor-button:hover {
            background-color: #b91c1c;
          }
          
          .elementor-content .elementor-button-icon {
            margin-right: 0.5rem;
          }
          
          .elementor-content iframe {
            width: 100%;
            max-width: 640px;
            height: 360px;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          
          .elementor-content .has-inline-color {
            color: inherit;
          }
          
          .elementor-content .has-woostify-heading-color {
            color: #1f2937;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LessonViewer