
import { notFound } from 'next/navigation';
import { getCourseData } from '@/lib/course-data';
import { LessonViewer } from '@/components/lesson-viewer';
import { LessonSidebar } from '@/components/lesson-sidebar';
import { LessonNavigation } from '@/components/lesson-navigation';

interface LessonPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  const courseData = await getCourseData();
  const allLessons = courseData.modules.flatMap(module => module.lessons);
  
  return allLessons.map((lesson) => ({
    id: lesson.id.toString(),
  }));
}

export default async function LessonPage({ params }: LessonPageProps) {
  const courseData = await getCourseData();
  const allLessons = courseData.modules.flatMap(module => module.lessons);
  const lesson = allLessons.find(l => l.id.toString() === params?.id);
  
  if (!lesson) {
    notFound();
  }

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center space-x-4 px-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Instituto Lidera</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm text-muted-foreground">
              Lección {lesson.id} de {allLessons.length}
            </span>
          </div>
          <div className="text-sm font-medium">
            {courseData.title}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <LessonSidebar 
          lessons={allLessons} 
          currentLessonId={lesson.id}
          courseTitle={courseData.title}
        />

        {/* Contenido principal */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto">
            <LessonViewer lesson={lesson} />
            
            {/* Navegación entre lecciones */}
            <LessonNavigation 
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              currentLesson={lesson}
              totalLessons={allLessons.length}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
