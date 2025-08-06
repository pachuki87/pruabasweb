import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface LessonViewerProps {
  lessonSlug: string;
  lessonTitle: string;
  pdfs?: string[];
  hasQuiz?: boolean;
  onBackToCourse?: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ 
  lessonSlug, 
  lessonTitle, 
  pdfs = [], 
  hasQuiz = false,
  onBackToCourse,
  onNextLesson,
  onPreviousLesson
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleNavigationClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[data-navigation-link="true"]') as HTMLAnchorElement;
      
      if (link) {
        event.preventDefault();
        const href = link.getAttribute('data-href') || link.getAttribute('href') || '';
        const linkText = link.textContent?.trim() || '';
        
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
    console.log('🔄 LessonViewer useEffect triggered - lessonSlug:', lessonSlug);
    
    const loadContent = async () => {
      console.log('🎬 LessonViewer - Loading content for lessonSlug:', lessonSlug);
      if (!lessonSlug || lessonSlug.trim() === '' || lessonSlug === 'undefined') {
        console.log('❌ No valid lessonSlug provided:', lessonSlug);
        setLoading(false);
        setError('No se proporcionó un identificador de lección válido');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
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
      } catch (err) {
        console.error('❌ Error loading lesson content:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        console.log('🏁 LessonViewer loading finished');
        setLoading(false);
      }
    };

    loadContent();
  }, [lessonSlug]);

  const processHtmlContent = (html: string, slug: string): string => {
    // Crear un parser DOM temporal
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extraer el contenido principal
    let mainContent = '';
    
    // Buscar diferentes estructuras de contenido
    const contentSelectors = [
      '.main-content',
      '.content',
      'main',
      '.lesson-content',
      'body > div',
      'body'
    ];
    
    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element && element.innerHTML.trim()) {
        mainContent = element.innerHTML;
        break;
      }
    }
    
    if (!mainContent) {
      mainContent = doc.body?.innerHTML || html;
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
        // Interceptar enlaces a institutolidera.com para navegación local
        if (href.includes('institutolidera.com')) {
          // Detectar tipo de enlace por el contexto
          return 'href="#" data-navigation-link="true" data-href="' + href + '"';
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
    const pdfPath = `/course-content/Módulo 1/${lessonSlug}/${pdfName}`;
    window.open(pdfPath, '_blank');
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
        {(pdfs.length > 0 || hasQuiz) && (
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
            
            {hasQuiz && (
              <div className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Cuestionario disponible</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido de la lección */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div 
          className="prose prose-lg max-w-none lesson-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default LessonViewer