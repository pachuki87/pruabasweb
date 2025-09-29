
// Definición de tipos para el curso
export interface Lesson {
  id: number;
  title: string;
  slug: string;
  folder: string;
  hasContent: boolean;
  hasQuiz: boolean;
  pdfs: string[];
  images: string[];
  contentPath: string;
}

export interface CourseModule {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  description: string;
  modules: CourseModule[];
  totalLessons: number;
  totalPdfs: number;
}

// Funciones para procesar el contenido del curso
export async function getCourseData(): Promise<Course> {
  // Los PDFs disponibles según el index.txt
  const allPdfs = [
    'Actividad-casos-clinicos.pdf',
    'Clasificacion-de-sustancias.pdf',
    'Fundamentos-de-la-conducta-adictiva.pdf',
    'Informe-europeo-sobre-drogas-2020.pdf',
    'Programa-Ibiza.pdf',
    'Articilo-Terapia-Integral-de-Pareja.pdf',
    'Psicolgia-positiva-introduccion.pdf',
    'Psicologia-positiva-la-investigacion-sobre-los-efectos-de-las-emociones-positivas.pdf'
  ];

  // Definición manual de las lecciones basada en el index.txt
  const lessons: Lesson[] = [
    {
      id: 1,
      title: '¿Qué significa ser adicto?',
      slug: 'que-significa-ser-adicto',
      folder: '01_¿Qué significa ser adicto_',
      hasContent: true,
      hasQuiz: false,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/01_¿Qué significa ser adicto_/contenido.html'
    },
    {
      id: 2,
      title: '¿Qué es una adicción?',
      slug: 'que-es-una-adiccion',
      folder: '02_¿Qué es una adicción_1 Cuestionario',
      hasContent: true,
      hasQuiz: true,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/02_¿Qué es una adicción_1 Cuestionario/contenido.html'
    },
    {
      id: 3,
      title: 'Consecuencias de las adicciones',
      slug: 'consecuencias-de-las-adicciones',
      folder: '03_Consecuencias de las adicciones',
      hasContent: true,
      hasQuiz: false,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/03_Consecuencias de las adicciones/contenido.html'
    },
    {
      id: 4,
      title: 'Criterios para diagnosticar una conducta adictiva según DSM 5',
      slug: 'criterios-dsm5-conducta-adictiva',
      folder: '04_Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario',
      hasContent: true,
      hasQuiz: true,
      pdfs: ['Actividad-casos-clinicos.pdf'],
      images: [],
      contentPath: '/course-content/Módulo 1/04_Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario/contenido.html'
    },
    {
      id: 5,
      title: 'Material Complementario y Ejercicios',
      slug: 'material-complementario-ejercicios',
      folder: '05_Material Complementario y Ejercicios2 Cuestionarios',
      hasContent: true,
      hasQuiz: true,
      pdfs: [
        'Clasificacion-de-sustancias.pdf',
        'Fundamentos-de-la-conducta-adictiva.pdf',
        'Informe-europeo-sobre-drogas-2020.pdf',
        'Programa-Ibiza.pdf'
      ],
      images: [],
      contentPath: '/course-content/Módulo 1/05_Material Complementario y Ejercicios2 Cuestionarios/contenido.html'
    },
    {
      id: 6,
      title: 'Adicciones Comportamentales',
      slug: 'adicciones-comportamentales',
      folder: '06_Adicciones Comportamentales2 Cuestionarios',
      hasContent: true,
      hasQuiz: true,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/06_Adicciones Comportamentales2 Cuestionarios/contenido.html'
    },
    {
      id: 7,
      title: 'La familia',
      slug: 'la-familia',
      folder: '07_La familia',
      hasContent: true,
      hasQuiz: false,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/07_La familia/contenido.html'
    },
    {
      id: 8,
      title: 'La recaída',
      slug: 'la-recaida',
      folder: '08_La recaída',
      hasContent: true,
      hasQuiz: false,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/08_La recaída/contenido.html'
    },
    {
      id: 9,
      title: 'Nuevas terapias psicológicas',
      slug: 'nuevas-terapias-psicologicas',
      folder: '09_Nuevas terapias psicológicas',
      hasContent: true,
      hasQuiz: false,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/09_Nuevas terapias psicológicas/contenido.html'
    },
    {
      id: 10,
      title: 'Terapia integral de pareja',
      slug: 'terapia-integral-de-pareja',
      folder: '10_Terapia integral de pareja1 Cuestionario',
      hasContent: true,
      hasQuiz: true,
      pdfs: ['Articilo-Terapia-Integral-de-Pareja.pdf'],
      images: [],
      contentPath: '/course-content/Módulo 1/10_Terapia integral de pareja1 Cuestionario/contenido.html'
    },
    {
      id: 11,
      title: 'Psicología positiva',
      slug: 'psicologia-positiva',
      folder: '11_Psicología positiva1 Cuestionario',
      hasContent: true,
      hasQuiz: true,
      pdfs: [
        'Psicolgia-positiva-introduccion.pdf',
        'Psicologia-positiva-la-investigacion-sobre-los-efectos-de-las-emociones-positivas.pdf'
      ],
      images: [],
      contentPath: '/course-content/Módulo 1/11_Psicología positiva1 Cuestionario/contenido.html'
    },
    {
      id: 12,
      title: 'Mindfulness aplicado a la Conducta Adictiva',
      slug: 'mindfulness-conducta-adictiva',
      folder: '12_Mindfulness aplicado a la Conducta Adictiva1 Cuestionario',
      hasContent: true,
      hasQuiz: true,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/12_Mindfulness aplicado a la Conducta Adictiva1 Cuestionario/contenido.html'
    },
    {
      id: 13,
      title: 'Material complementario Mindfulness y ejercicio',
      slug: 'material-complementario-mindfulness',
      folder: '13_Material complementario Mindfulness y ejercicio1 Cuestionario',
      hasContent: true,
      hasQuiz: true,
      pdfs: [],
      images: [],
      contentPath: '/course-content/Módulo 1/13_Material complementario Mindfulness y ejercicio1 Cuestionario/contenido.html'
    }
  ];

  const module1: CourseModule = {
    id: 1,
    title: 'Fundamentos y Terapias',
    lessons
  };

  const course: Course = {
    title: 'Experto en Conductas Adictivas',
    description: 'Curso completo para especialistas en el tratamiento de conductas adictivas, abordando desde los fundamentos teóricos hasta las terapias más innovadoras.',
    modules: [module1],
    totalLessons: 13,
    totalPdfs: 8
  };

  return course;
}

// Funciones de utilidad para navegación
export async function getLessonById(id: number): Promise<Lesson | null> {
  const courseData = await getCourseData();
  const allLessons = courseData.modules.flatMap(module => module.lessons);
  return allLessons.find(lesson => lesson.id === id) || null;
}

export async function getNextLesson(currentId: number): Promise<Lesson | null> {
  const courseData = await getCourseData();
  const allLessons = courseData.modules.flatMap(module => module.lessons);
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentId);
  if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  return null;
}

export async function getPreviousLesson(currentId: number): Promise<Lesson | null> {
  const courseData = await getCourseData();
  const allLessons = courseData.modules.flatMap(module => module.lessons);
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentId);
  if (currentIndex > 0) {
    return allLessons[currentIndex - 1];
  }
  return null;
}

export function getProgressPercentage(completedLessons: number[], totalLessons: number): number {
  return Math.round((completedLessons.length / totalLessons) * 100);
}
