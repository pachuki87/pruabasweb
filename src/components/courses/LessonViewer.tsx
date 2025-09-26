import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileText, Download, ExternalLink, BookOpen, Clock, User, Video } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizComponent from '../QuizComponent';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Lesson {
  id: string;
  titulo: string;
  slug: string;
  contenido?: string;
  archivo_url?: string;
  pdfs?: string[];
  pdfUrls?: string[]; // URLs originales para construcción de enlaces
  videos?: string[];
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

interface QuizResults {
  puntuacionObtenida: number;
  puntuacionMaxima: number;
  porcentajeAcierto: number;
  tiempoTotal: number;
  aprobado: boolean;
  respuestasCorrectas: number;
  totalPreguntas: number;
  questionsSummary?: any[];
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  // Extraer propiedades del objeto lesson
  const lessonSlug = lesson.slug;
  const lessonTitle = lesson.titulo;
  const lessonContent = lesson.contenido;
  const lessonFileUrl = lesson.archivo_url;

  // Memoizar PDFs para evitar duplicados en re-renders
  const pdfs = useMemo(() => {
    const pdfList = lesson.pdfs || [];
    // Eliminar duplicados usando Set
    const uniquePdfs = [...new Set(pdfList)];
    console.log('🔍 PDFs memoizados:', uniquePdfs.length, 'únicos de', pdfList.length, 'totales');
    return uniquePdfs;
  }, [lesson.pdfs]);

  // Memoizar URLs de PDFs para evitar duplicados en re-renders
  const pdfUrls = useMemo(() => {
    const urlList = lesson.pdfUrls || [];
    // Eliminar duplicados usando Set
    const uniqueUrls = [...new Set(urlList)];
    console.log('🔗 PDF URLs memoizadas:', uniqueUrls.length, 'únicas de', urlList.length, 'totales');
    return uniqueUrls;
  }, [lesson.pdfUrls]);
  
  const externalLinks = lesson.enlaces_externos || [];
  const hasQuiz = lesson.tiene_cuestionario || false;
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();

  const handleQuizClick = () => {
    setShowQuiz(true);
    setQuizCompleted(false);
  };

  const handleQuizComplete = async (results: QuizResults) => {
    console.log('📊 Cuestionario completado con resultados:', results);

    // Verificar si tenemos usuario autenticado
    if (!user) {
      console.error('❌ No hay usuario autenticado para completar el cuestionario');
      return;
    }

    // Preparar datos para la página de resumen
    const summaryData = {
      studentName: user.user_metadata?.nombre || user.email || 'Estudiante',
      studentEmail: user.email || 'No disponible',
      completionDate: new Date().toISOString(),
      timeSpent: results.tiempoTotal || 0,
      score: results.puntuacionObtenida || 0,
      maxScore: results.puntuacionMaxima || 100,
      percentage: results.porcentajeAcierto || 0,
      passed: results.aprobado || false,
      totalQuestions: results.totalPreguntas || 0,
      correctAnswers: results.respuestasCorrectas || 0,
      incorrectAnswers: (results.totalPreguntas || 0) - (results.respuestasCorrectas || 0),
      quizTitle: lesson?.titulo || 'Cuestionario',
      questions: results.questionsSummary || []
    };

    // Guardar resultados en localStorage
    localStorage.setItem('lastQuizResults', JSON.stringify(summaryData));

    // Redirigir a la página de resumen
    const summaryUrl = '/resumen-cuestionario.html';
    console.log('🔄 Redirigiendo a página de resumen (usando localStorage)...');
    window.location.href = summaryUrl;
  };

  const handleBackToLesson = () => {
    setShowQuiz(false);
    setQuizCompleted(false);
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
        const isPdfLink = href.includes('.pdf') || href.includes('/Experto en Conductas Adictivas/');

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

  // Efecto para marcar la lección como vista cuando se carga
  useEffect(() => {
    const markLessonAsViewed = async () => {
      if (lesson.id && course.id && user) {
        try {
          console.log('👁️ Marcando lección como vista:', lesson.id, 'Usuario:', user.id);

          // Actualizar progreso de la lección
          const { data, error } = await supabase
            .from('user_course_progress')
            .upsert({
              user_id: user.id,
              curso_id: course.id,
              leccion_id: lesson.id,
              progreso_porcentaje: 50, // 50% por ver la lección
              tiempo_estudiado: 1, // 1 minuto por defecto
              estado: 'en_progreso',
              ultima_actividad: new Date().toISOString(),
              fecha_inicio: new Date().toISOString()
            })
            .select();

          if (error) {
            console.error('❌ Error guardando progreso:', error);
          } else {
            console.log('✅ Progreso guardado correctamente:', data);
          }
        } catch (error) {
          console.error('❌ Error marcando lección como vista:', error);
        }
      } else {
        console.log('❌ Faltan datos:', {
          lessonId: lesson.id,
          courseId: course.id,
          user: user?.id || 'No disponible'
        });
      }
    };

    // Esperar un poco antes de marcar como vista para asegurar que es una visita real
    const timer = setTimeout(markLessonAsViewed, 3000);

    return () => clearTimeout(timer);
  }, [lesson.id, course.id, user, supabase]);

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
          
          // Determinar la ruta del contenido basado en el curso
          const isMasterCourse = course.id === 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
          const contentUrl = isMasterCourse 
            ? `/master-content/${lessonSlug}/contenido.html`
            : `/Experto en Conductas Adictivas/Módulo 1/${lessonSlug}/contenido.html`;
          console.log('🌐 Fetching content from:', contentUrl, 'isMasterCourse:', isMasterCourse);
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
  }, [lessonSlug, lessonContent, lessonFileUrl, course.id]);

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
        '.container',  // Añadido para lecciones que usan .container
        // Añadir un selector más genérico para el contenido principal si existe
        '[role="main"]',
        '#main',
        '#content',
        // Selector específico para las lecciones master que tienen estructura .container
        '.container > div:not(.navigation)',
        // Selector de respaldo para cualquier div dentro del body
        'body div'
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

    // Para las lecciones master, remover la sección de navegación si existe
    if (course.id === 'b5ef8c64-fe26-4f20-8221-80a1bf475b05') {
      mainContent = mainContent.replace(
        /<div[^>]*class="[^"]*navigation[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        ''
      );
    }
    
    // Ajustar rutas de imágenes
    mainContent = mainContent.replace(
      /src="([^"]*)"/g,
      (match, src) => {
        if (src.startsWith('http') || src.startsWith('/')) {
          return match;
        }
        // Determinar la ruta de imágenes basado en el curso
        const isMasterCourse = course.id === 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
        const imagePath = isMasterCourse 
          ? `/master-content/${slug}/imagenes/${src}`
          : `/Experto en Conductas Adictivas/Módulo 1/${slug}/imagenes/${src}`;
        return `src="${imagePath}"`;
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
        // Determinar la ruta basado en el curso
        const isMasterCourse = course.id === 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
        const linkPath = isMasterCourse 
          ? `/master-content/${slug}/${href}`
          : `/Experto en Conductas Adictivas/Módulo 1/${slug}/${href}`;
        return `href="${linkPath}"`;
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
          <div className="space-y-4">
            {pdfs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📄 Materiales de la Lección</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pdfs.map((pdf, index) => {
                    // Usar la URL original de la base de datos si está disponible
                    let pdfPath;
                    if (pdfUrls && pdfUrls[index]) {
                      // Usar la URL original de la base de datos
                      pdfPath = pdfUrls[index].startsWith('/') ? pdfUrls[index] : `/${pdfUrls[index]}`;
                      console.log(`📄 Using original URL for ${pdf}: ${pdfPath}`);
                    } else {
                      // Fallback al método anterior de construcción de rutas
                      const isMasterCourse = course.id === 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

                      // Si la ruta del PDF ya es absoluta o contiene la estructura completa, usarla directamente
                      if (pdf.startsWith('/') || pdf.includes('master en adicciones/') || pdf.includes('experto-conductas-adictivas/')) {
                        pdfPath = `/${pdf}`; // Asegurarse de que siempre empiece con /
                      } else if (isMasterCourse && lessonSlug.includes('Material Complementario y Ejercicios2 Cuestionarios')) {
                        // Lección 5 del máster, los PDFs están en la subcarpeta "5) PSICOLOGIA ADICCIONES"
                        pdfPath = `/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/${pdf}`;
                      } else if (isMasterCourse) {
                        // Otras lecciones del máster
                        pdfPath = `/pdfs/master-adicciones/${pdf}`;
                      } else {
                        // Curso experto
                        pdfPath = `/pdfs/experto-conductas-adictivas/${pdf}`;
                      }
                      console.log(`📄 Fallback path for ${pdf}: ${pdfPath}`);
                    }
                    
                    // Detectar tipo de archivo
                    const isVideo = pdf.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i);
                    const isPdf = pdf.endsWith('.pdf');
                    
                    // Configurar estilos y colores según el tipo de archivo
                    const fileConfig = isVideo 
                      ? {
                          bgColor: 'bg-blue-50',
                          borderColor: 'border-blue-200',
                          icon: <Video className="w-5 h-5 mr-2 text-blue-600" />,
                          buttonColor: 'bg-blue-600 hover:bg-blue-700',
                          buttonText: 'Ver Video'
                        }
                      : {
                          bgColor: 'bg-red-50',
                          borderColor: 'border-red-200',
                          icon: <FileText className="w-5 h-5 mr-2 text-red-600" />,
                          buttonColor: 'bg-red-600 hover:bg-red-700',
                          buttonText: isPdf ? 'Ver PDF' : 'Ver Documento'
                        };
                    
                    return (
                      <div key={index} className={`${fileConfig.bgColor} ${fileConfig.borderColor} rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          {fileConfig.icon}
                          <span className="text-sm font-medium text-gray-900 truncate">{pdf}</span>
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={pdfPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 ${fileConfig.buttonColor} text-white px-3 py-2 rounded-md transition-colors text-xs text-center`}
                          >
                            {fileConfig.buttonText}
                          </a>
                          <a
                            href={pdfPath}
                            download
                            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-xs text-center"
                          >
                            Descargar
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {lesson.videos && lesson.videos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎬 Videos de la Lección</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lesson.videos.map((video, index) => {
                    const videoPath = video.startsWith('/') ? video : `/videos/${video}`;
                    return (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Video className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900 truncate">{video}</span>
                        </div>
                        <video controls src={videoPath} className="w-full rounded-md" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {externalLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🔗 Enlaces Externos</h3>
                <div className="flex flex-wrap gap-3">
                  {externalLinks.map((link, index) => (
                    <button
                      key={`external-${index}`}
                      onClick={() => handleExternalLinkClick(link.url)}
                      className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{link.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {hasQuiz && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Evaluación</h3>
                {!showQuiz ? (
                  <button 
                    onClick={handleQuizClick}
                    className="inline-flex items-center px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="font-medium">Realizar Cuestionario</span>
                  </button>
                ) : (
                  <div className="mt-4">
                    <QuizComponent 
                      leccionId={lesson.id}
                      courseId={course?.id || courseId}
                      onQuizComplete={handleQuizComplete}
                      onBackToLesson={handleBackToLesson}
                    />
                  </div>
                )}
              </div>
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
        
        <style>{`
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

export default LessonViewer;
