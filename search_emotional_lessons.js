import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function searchEmotionalLessons() {
  try {
    console.log('Buscando lecciones de inteligencia emocional en todos los cursos...');
    
    // Buscar todas las lecciones
    const { data: allLessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error al consultar lecciones:', error);
      return;
    }

    console.log(`\nTotal de lecciones en la base de datos: ${allLessons.length}`);
    
    // Filtrar lecciones relacionadas con inteligencia emocional
    const emotionalKeywords = [
      'inteligencia', 'emocional', 'autoconciencia', 'regulacion', 'regulación',
      'empatia', 'empatía', 'habilidades sociales', 'evaluacion', 'evaluación',
      'seguimiento emocional'
    ];
    
    const emotionalLessons = allLessons.filter(lesson => {
      const title = lesson.titulo.toLowerCase();
      return emotionalKeywords.some(keyword => title.includes(keyword.toLowerCase()));
    });
    
    console.log(`\n=== LECCIONES DE INTELIGENCIA EMOCIONAL ENCONTRADAS: ${emotionalLessons.length} ===`);
    
    // Agrupar por curso
    const lessonsByCourse = {};
    emotionalLessons.forEach(lesson => {
      if (!lessonsByCourse[lesson.curso_id]) {
        lessonsByCourse[lesson.curso_id] = [];
      }
      lessonsByCourse[lesson.curso_id].push(lesson);
    });
    
    // Mostrar lecciones agrupadas por curso
    for (const courseId of Object.keys(lessonsByCourse)) {
      console.log(`\n--- CURSO ID: ${courseId} ---`);
      lessonsByCourse[courseId].forEach((lesson, index) => {
        console.log(`${index + 1}. ID: ${lesson.id}`);
        console.log(`   Título: ${lesson.titulo}`);
        console.log(`   Orden: ${lesson.orden}`);
        console.log(`   Archivo HTML: ${lesson.archivo_html || 'No definido'}`);
        console.log('   ---');
      });
    }
    
    // Buscar posibles duplicados por título similar
    console.log('\n=== ANÁLISIS DE POSIBLES DUPLICADOS ===');
    const titleGroups = {};
    
    emotionalLessons.forEach(lesson => {
      const normalizedTitle = lesson.titulo.toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
      
      if (!titleGroups[normalizedTitle]) {
        titleGroups[normalizedTitle] = [];
      }
      titleGroups[normalizedTitle].push(lesson);
    });
    
    let foundDuplicates = false;
    Object.keys(titleGroups).forEach(normalizedTitle => {
      if (titleGroups[normalizedTitle].length > 1) {
        foundDuplicates = true;
        console.log(`\n⚠️  POSIBLES DUPLICADOS:`);
        console.log(`Título normalizado: "${normalizedTitle}"`);
        titleGroups[normalizedTitle].forEach(lesson => {
          console.log(`   - ID: ${lesson.id}`);
          console.log(`     Título original: "${lesson.titulo}"`);
          console.log(`     Curso ID: ${lesson.curso_id}`);
          console.log(`     Orden: ${lesson.orden}`);
        });
      }
    });
    
    if (!foundDuplicates) {
      console.log('✅ No se encontraron duplicados evidentes por título');
    }
    
    // Mostrar estadísticas finales
    console.log('\n=== RESUMEN ===');
    console.log(`Total de lecciones de inteligencia emocional: ${emotionalLessons.length}`);
    console.log(`Distribuidas en ${Object.keys(lessonsByCourse).length} curso(s)`);
    Object.keys(lessonsByCourse).forEach(courseId => {
      console.log(`  - Curso ${courseId}: ${lessonsByCourse[courseId].length} lecciones`);
    });

  } catch (error) {
    console.error('Error general:', error);
  }
}

searchEmotionalLessons();