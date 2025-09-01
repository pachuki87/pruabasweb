import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAllCourses() {
  try {
    console.log('Consultando todos los cursos y sus lecciones...');
    
    // Primero obtener todos los cursos
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('id, titulo');

    if (coursesError) {
      console.error('Error al consultar cursos:', coursesError);
      return;
    }

    console.log(`\nTotal de cursos encontrados: ${courses.length}`);
    
    for (const course of courses) {
      console.log(`\n=== CURSO: ${course.titulo} (ID: ${course.id}) ===`);
      
      const { data: lessons, error: lessonsError } = await supabase
        .from('lecciones')
        .select('*')
        .eq('curso_id', course.id)
        .order('orden', { ascending: true });

      if (lessonsError) {
        console.error(`Error al consultar lecciones del curso ${course.id}:`, lessonsError);
        continue;
      }

      console.log(`Lecciones: ${lessons.length}`);
      
      if (lessons.length > 0) {
        // Buscar duplicados por título en este curso
        const titleCounts = {};
        const orderCounts = {};
        
        lessons.forEach(lesson => {
          // Contar por título
          if (titleCounts[lesson.titulo]) {
            titleCounts[lesson.titulo].push(lesson);
          } else {
            titleCounts[lesson.titulo] = [lesson];
          }
          
          // Contar por orden
          if (orderCounts[lesson.orden]) {
            orderCounts[lesson.orden].push(lesson);
          } else {
            orderCounts[lesson.orden] = [lesson];
          }
        });

        // Verificar duplicados por título
        let hasTitleDuplicates = false;
        Object.keys(titleCounts).forEach(title => {
          if (titleCounts[title].length > 1) {
            if (!hasTitleDuplicates) {
              console.log('\n⚠️  DUPLICADOS POR TÍTULO:');
              hasTitleDuplicates = true;
            }
            console.log(`   - "${title}" (${titleCounts[title].length} veces)`);
            titleCounts[title].forEach(lesson => {
              console.log(`     * ID: ${lesson.id}, Orden: ${lesson.orden}`);
            });
          }
        });
        
        // Verificar duplicados por orden
        let hasOrderDuplicates = false;
        Object.keys(orderCounts).forEach(order => {
          if (orderCounts[order].length > 1) {
            if (!hasOrderDuplicates) {
              console.log('\n⚠️  DUPLICADOS POR ORDEN:');
              hasOrderDuplicates = true;
            }
            console.log(`   - Orden ${order} (${orderCounts[order].length} veces)`);
            orderCounts[order].forEach(lesson => {
              console.log(`     * ID: ${lesson.id}, Título: "${lesson.titulo}"`);
            });
          }
        });
        
        if (!hasTitleDuplicates && !hasOrderDuplicates) {
          console.log('✅ Sin duplicados');
        }
      }
    }
    
    // También buscar lecciones con títulos similares de inteligencia emocional
    console.log('\n=== BÚSQUEDA DE LECCIONES DE INTELIGENCIA EMOCIONAL ===');
    const { data: emotionalLessons, error: emotionalError } = await supabase
      .from('lecciones')
      .select('*')
      .or('titulo.ilike.%inteligencia%,titulo.ilike.%emocional%,titulo.ilike.%autoconciencia%,titulo.ilike.%regulacion%,titulo.ilike.%empatia%')
      .order('created_at', { ascending: true });

    if (emotionalError) {
      console.error('Error al buscar lecciones emocionales:', emotionalError);
    } else {
      console.log(`\nLecciones relacionadas con inteligencia emocional: ${emotionalLessons.length}`);
      emotionalLessons.forEach(lesson => {
        console.log(`- ID: ${lesson.id}`);
        console.log(`  Título: ${lesson.titulo}`);
        console.log(`  Curso ID: ${lesson.curso_id}`);
        console.log(`  Orden: ${lesson.orden}`);
        console.log(`  Creado: ${lesson.created_at}`);
        console.log('  ---');
      });
    }

  } catch (error) {
    console.error('Error general:', error);
  }
}

checkAllCourses();