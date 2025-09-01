import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function countLessons() {
  try {
    console.log('Consultando las lecciones en la base de datos...');
    
    // Contar todas las lecciones
    const { count, error } = await supabase
      .from('lecciones')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error al consultar las lecciones:', error);
      return;
    }
    
    console.log(`\n📊 RESULTADO:`);
    console.log(`Total de lecciones en la base de datos: ${count}`);
    
    // Obtener información detallada de las lecciones con información del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select(`
        id,
        titulo,
        descripcion,
        orden,
        curso_id,
        duracion_estimada,
        tiene_cuestionario,
        creado_en,
        cursos!inner(
          titulo
        )
      `)
      .order('curso_id')
      .order('orden');
    
    if (lessonsError) {
      console.error('Error al obtener detalles de las lecciones:', lessonsError);
      return;
    }
    
    if (lessons && lessons.length > 0) {
      console.log('\n📚 LECCIONES ENCONTRADAS:');
      
      // Agrupar por curso
      const lessonsByCourse = {};
      lessons.forEach(lesson => {
        const courseTitle = lesson.cursos.titulo;
        if (!lessonsByCourse[courseTitle]) {
          lessonsByCourse[courseTitle] = [];
        }
        lessonsByCourse[courseTitle].push(lesson);
      });
      
      // Mostrar lecciones agrupadas por curso
      Object.keys(lessonsByCourse).forEach(courseTitle => {
        console.log(`\n🎓 CURSO: ${courseTitle}`);
        console.log('='.repeat(50));
        
        lessonsByCourse[courseTitle].forEach((lesson, index) => {
          console.log(`${index + 1}. Lección ${lesson.orden}: ${lesson.titulo}`);
          console.log(`   ID: ${lesson.id}`);
          console.log(`   Descripción: ${lesson.descripcion || 'Sin descripción'}`);
          console.log(`   Curso ID: ${lesson.curso_id}`);
          console.log(`   Duración estimada: ${lesson.duracion_estimada || 'No especificada'} min`);
          console.log(`   Tiene cuestionario: ${lesson.tiene_cuestionario ? 'Sí' : 'No'}`);
          console.log(`   Creado: ${new Date(lesson.creado_en).toLocaleDateString('es-ES')}`);
          console.log('');
        });
      });
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

// Ejecutar la función
countLessons();