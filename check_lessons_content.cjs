const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Leer variables de entorno del archivo .env
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase credentials');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLessons() {
  try {
    // Buscar el curso de Inteligencia Emocional
    const { data: courses, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Inteligencia Emocional');
    
    if (courseError) throw courseError;
    
    if (!courses || courses.length === 0) {
      console.log('No se encontró el curso Inteligencia Emocional');
      return;
    }
    
    const courseId = courses[0].id;
    console.log('Curso encontrado:', courses[0].titulo, 'ID:', courseId);
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html, orden')
      .eq('curso_id', courseId)
      .order('orden');
    
    if (lessonError) throw lessonError;
    
    console.log('\n=== CONTENIDO DE LECCIONES ===');
    lessons.forEach(lesson => {
      console.log(`\nLección ${lesson.orden}: ${lesson.titulo}`);
      console.log('ID:', lesson.id);
      console.log('Contenido:', lesson.contenido_html ? `${lesson.contenido_html.substring(0, 100)}...` : 'VACÍO');
      console.log('Longitud del contenido:', lesson.contenido_html ? lesson.contenido_html.length : 0);
    });
    
    // Contar lecciones vacías
    const emptyLessons = lessons.filter(lesson => !lesson.contenido_html || lesson.contenido_html.trim() === '');
    const filledLessons = lessons.filter(lesson => lesson.contenido_html && lesson.contenido_html.trim() !== '');
    
    console.log('\n=== RESUMEN ===');
    console.log('Total de lecciones:', lessons.length);
    console.log('Lecciones con contenido:', filledLessons.length);
    console.log('Lecciones vacías:', emptyLessons.length);
    
    if (emptyLessons.length > 0) {
      console.log('\nLecciones vacías:');
      emptyLessons.forEach(lesson => {
        console.log(`- Lección ${lesson.orden}: ${lesson.titulo} (ID: ${lesson.id})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkLessons();