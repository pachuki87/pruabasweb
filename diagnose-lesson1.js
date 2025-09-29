import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseLessonOne() {
  console.log('🔍 Diagnosticando lección 1...');
  console.log('ID de lección: 172b9f29-17dd-4c7f-8a98-8c3989e296d8');
  console.log('ID de curso: d7c3e503-ed61-4d7a-9e5f-aedc407d4836');
  console.log('\n' + '='.repeat(50));

  try {
    // 1. Verificar si la lección existe
    console.log('\n1. Verificando existencia de la lección...');
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', '172b9f29-17dd-4c7f-8a98-8c3989e296d8')
      .single();

    if (lessonError) {
      console.error('❌ Error al buscar la lección:', lessonError.message);
      return;
    }

    if (!lesson) {
      console.log('❌ La lección no existe en la base de datos');
      return;
    }

    console.log('✅ Lección encontrada:');
    console.log(`   - Título: ${lesson.titulo}`);
    console.log(`   - Número de lección: ${lesson.numero_leccion}`);
    console.log(`   - Curso ID: ${lesson.curso_id}`);
    console.log(`   - Archivo URL: ${lesson.archivo_url || 'No definido'}`);
    console.log(`   - Contenido HTML: ${lesson.contenido_html ? 'Presente (' + lesson.contenido_html.length + ' caracteres)' : 'Vacío'}`);
    console.log(`   - Descripción: ${lesson.descripcion || 'No definida'}`);
    console.log(`   - Duración: ${lesson.duracion_estimada || 'No definida'}`);
    console.log(`   - Activa: ${lesson.activa}`);

    // 2. Verificar el curso asociado
    console.log('\n2. Verificando curso asociado...');
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('titulo, descripcion')
      .eq('id', lesson.curso_id)
      .single();

    if (courseError) {
      console.error('❌ Error al buscar el curso:', courseError.message);
    } else {
      console.log(`✅ Curso: ${course.titulo}`);
    }

    // 3. Verificar si hay archivo físico
    if (lesson.archivo_url) {
      console.log('\n3. Verificando archivo físico...');
      console.log(`   - Ruta del archivo: ${lesson.archivo_url}`);
      
      // Intentar verificar si el archivo existe en el sistema de archivos
      const fs = await import('fs');
      const path = await import('path');
      
      const fullPath = path.join(process.cwd(), 'public', lesson.archivo_url);
      console.log(`   - Ruta completa: ${fullPath}`);
      
      try {
        const exists = fs.existsSync(fullPath);
        if (exists) {
          const stats = fs.statSync(fullPath);
          console.log(`   ✅ Archivo existe (${stats.size} bytes)`);
          
          // Leer una muestra del contenido
          const content = fs.readFileSync(fullPath, 'utf8');
          console.log(`   - Contenido del archivo: ${content.length} caracteres`);
          console.log(`   - Primeros 200 caracteres: ${content.substring(0, 200)}...`);
        } else {
          console.log('   ❌ Archivo no existe en el sistema de archivos');
        }
      } catch (fileError) {
        console.log(`   ❌ Error al verificar archivo: ${fileError.message}`);
      }
    }

    // 4. Resumen del diagnóstico
    console.log('\n' + '='.repeat(50));
    console.log('📋 RESUMEN DEL DIAGNÓSTICO:');
    console.log(`   - Lección existe: ✅`);
    console.log(`   - Contenido HTML: ${lesson.contenido_html ? '✅ Presente' : '❌ Vacío'}`);
    console.log(`   - Archivo URL: ${lesson.archivo_url ? '✅ Definido' : '❌ No definido'}`);
    console.log(`   - Estado activo: ${lesson.activa ? '✅' : '❌'}`);
    
    if (!lesson.contenido_html && !lesson.archivo_url) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO: La lección no tiene contenido HTML ni archivo URL definido');
      console.log('💡 SOLUCIÓN: Necesita restaurar el contenido usando restore_experto_content.cjs');
    } else if (lesson.archivo_url && !lesson.contenido_html) {
      console.log('\n⚠️  POSIBLE PROBLEMA: La lección tiene archivo_url pero no contenido_html');
      console.log('💡 VERIFICAR: Si el archivo existe y tiene contenido válido');
    }

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error.message);
  }
}

// Ejecutar diagnóstico
diagnoseLessonOne().catch(console.error);