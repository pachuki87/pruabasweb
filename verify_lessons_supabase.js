import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLessons() {
  try {
    console.log('🔍 Verificando lecciones en Supabase...');
    
    // Consultar todas las lecciones del curso específico
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });

    if (error) {
      console.error('❌ Error al consultar lecciones:', error);
      return;
    }

    console.log(`📊 Total de lecciones encontradas: ${lessons.length}`);
    console.log('\n📋 Detalles de las lecciones:');
    
    lessons.forEach((lesson, index) => {
      console.log(`\n--- Lección ${index + 1} ---`);
      console.log(`ID: ${lesson.id}`);
      console.log(`Título: ${lesson.titulo}`);
      console.log(`Orden: ${lesson.orden}`);
      console.log(`Archivo URL: ${lesson.archivo_url || 'NO ASIGNADO'}`);
      console.log(`Descripción: ${lesson.descripcion ? lesson.descripcion.substring(0, 100) + '...' : 'Sin descripción'}`);
      console.log(`Activo: ${lesson.activo}`);
      console.log(`Creado: ${lesson.created_at}`);
      console.log(`Actualizado: ${lesson.updated_at}`);
    });

    // Verificar si hay problemas específicos
    const lessonsWithoutFiles = lessons.filter(l => !l.archivo_url);
    const inactiveLessons = lessons.filter(l => !l.activo);
    
    console.log('\n🔍 Análisis de problemas:');
    console.log(`- Lecciones sin archivo_url: ${lessonsWithoutFiles.length}`);
    console.log(`- Lecciones inactivas: ${inactiveLessons.length}`);
    
    if (lessonsWithoutFiles.length > 0) {
      console.log('\n⚠️ Lecciones sin archivo HTML:');
      lessonsWithoutFiles.forEach(l => console.log(`  - ${l.titulo}`));
    }
    
    if (inactiveLessons.length > 0) {
      console.log('\n⚠️ Lecciones inactivas:');
      inactiveLessons.forEach(l => console.log(`  - ${l.titulo}`));
    }

    // Verificar permisos de la tabla
    console.log('\n🔐 Verificando permisos de la tabla...');
    const { data: permissions, error: permError } = await supabase
      .rpc('check_table_permissions', { table_name: 'lecciones' })
      .single();
    
    if (permError) {
      console.log('⚠️ No se pudieron verificar permisos automáticamente');
    } else {
      console.log('✅ Permisos verificados');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyLessons();