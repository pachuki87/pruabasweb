import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan las variables de entorno de Supabase');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'No configurada');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Configurada' : 'No configurada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson5() {
  try {
    console.log('🔍 Verificando la lección 5 en la base de datos...');
    
    // Buscar la lección con título que contenga "Material Complementario"
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('id, titulo, archivo_url, curso_id')
      .ilike('titulo', '%Material Complementario%');
    
    if (error) {
      console.error('❌ Error al consultar la base de datos:', error);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No se encontró ninguna lección con "Material Complementario" en el título');
      return;
    }
    
    console.log(`✅ Encontradas ${lessons.length} lección(es):`);
    
    lessons.forEach((lesson, index) => {
      console.log(`\n📖 Lección ${index + 1}:`);
      console.log(`   ID: ${lesson.id}`);
      console.log(`   Título: ${lesson.titulo}`);
      console.log(`   Curso ID: ${lesson.curso_id}`);
      console.log(`   archivo_url: ${lesson.archivo_url || 'NULL/vacío'}`);
      
      // Verificar si el archivo existe en el sistema
      if (lesson.archivo_url) {
        console.log(`   📁 Archivo referenciado: ${lesson.archivo_url}`);
      } else {
        console.log(`   ⚠️  Sin archivo_url - probablemente usa contenido de base de datos`);
      }
    });
    
  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

checkLesson5();