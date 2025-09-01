import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDuplicateLessons() {
  try {
    console.log('Consultando lecciones del curso b5ef8c64-fe26-4f20-8221-80a1bf475b05...');
    
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error al consultar lecciones:', error);
      return;
    }

    console.log(`\nTotal de lecciones encontradas: ${lessons.length}`);
    console.log('\n=== LISTADO DE LECCIONES ===');
    
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ID: ${lesson.id}`);
      console.log(`   Título: ${lesson.titulo}`);
      console.log(`   Orden: ${lesson.orden}`);
      console.log(`   Archivo HTML: ${lesson.archivo_html}`);
      console.log(`   Creado: ${lesson.created_at}`);
      console.log('   ---');
    });

    // Buscar duplicados por título
    console.log('\n=== ANÁLISIS DE DUPLICADOS ===');
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

    // Mostrar duplicados por título
    console.log('\nDuplicados por TÍTULO:');
    let titleDuplicates = false;
    Object.keys(titleCounts).forEach(title => {
      if (titleCounts[title].length > 1) {
        titleDuplicates = true;
        console.log(`\n⚠️  TÍTULO DUPLICADO: "${title}"`);
        titleCounts[title].forEach(lesson => {
          console.log(`   - ID: ${lesson.id}, Orden: ${lesson.orden}, Creado: ${lesson.created_at}`);
        });
      }
    });
    
    if (!titleDuplicates) {
      console.log('   ✅ No se encontraron duplicados por título');
    }

    // Mostrar duplicados por orden
    console.log('\nDuplicados por ORDEN:');
    let orderDuplicates = false;
    Object.keys(orderCounts).forEach(order => {
      if (orderCounts[order].length > 1) {
        orderDuplicates = true;
        console.log(`\n⚠️  ORDEN DUPLICADO: ${order}`);
        orderCounts[order].forEach(lesson => {
          console.log(`   - ID: ${lesson.id}, Título: "${lesson.titulo}", Creado: ${lesson.created_at}`);
        });
      }
    });
    
    if (!orderDuplicates) {
      console.log('   ✅ No se encontraron duplicados por orden');
    }

    if (titleDuplicates || orderDuplicates) {
      console.log('\n🚨 SE ENCONTRARON DUPLICADOS - Revisar y eliminar');
    } else {
      console.log('\n✅ No se encontraron duplicados en el curso');
    }

  } catch (error) {
    console.error('Error general:', error);
  }
}

checkDuplicateLessons();