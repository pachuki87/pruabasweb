import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Carpetas que realmente existen en inteligencia_emocional_drive
const existingFolders = [
  '1)FUNDAMENTOS P TERAPEUTICO',
  '2) TERAPIA COGNITIVA DROGODEPENDENENCIAS', 
  '3) FAMILIA Y TRABAJO EQUIPO',
  '4)RECOVERY COACHING',
  '6) INTERVENCION FAMILIAR Y RECOVERY MENTORING',
  '7) NUEVOS MODELOS TERAPEUTICOS',
  '9) INTELIGENCIA EMOCIONAL'
];

// Mapeo de números de lección que realmente existen
const validLessonNumbers = [1, 2, 3, 4, 6, 7, 9];

async function fixMissingLessonsContent() {
  console.log('🔍 Iniciando verificación de lecciones con contenido real...');
  
  try {
    // 1. Obtener el ID del curso
    const { data: courses, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();

    if (courseError || !courses) {
      console.error('❌ Error al obtener el curso:', courseError);
      return;
    }

    console.log(`✅ Curso encontrado: ${courses.titulo} (ID: ${courses.id})`);

    // 2. Obtener todas las lecciones del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courses.id)
      .order('orden', { ascending: true });

    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError);
      return;
    }

    console.log(`📚 Total de lecciones encontradas: ${lessons.length}`);
    
    // 3. Identificar lecciones que NO tienen contenido real
    const lessonsToDelete = [];
    const validLessons = [];
    
    lessons.forEach(lesson => {
      if (validLessonNumbers.includes(lesson.orden)) {
        validLessons.push(lesson);
        console.log(`✅ Lección ${lesson.orden}: "${lesson.titulo}" - TIENE CONTENIDO`);
      } else {
        lessonsToDelete.push(lesson);
        console.log(`❌ Lección ${lesson.orden}: "${lesson.titulo}" - SIN CONTENIDO REAL`);
      }
    });

    // 4. Crear backup antes de eliminar
    const backupData = {
      timestamp: new Date().toISOString(),
      course: courses,
      lessonsToDelete: lessonsToDelete,
      validLessons: validLessons
    };
    
    fs.writeFileSync('lessons-cleanup-backup.json', JSON.stringify(backupData, null, 2));
    console.log('💾 Backup creado: lessons-cleanup-backup.json');

    // 5. Eliminar lecciones sin contenido real
    if (lessonsToDelete.length > 0) {
      console.log(`\n🗑️  Eliminando ${lessonsToDelete.length} lecciones sin contenido real...`);
      
      for (const lesson of lessonsToDelete) {
        const { error: deleteError } = await supabase
          .from('lecciones')
          .delete()
          .eq('id', lesson.id);
          
        if (deleteError) {
          console.error(`❌ Error al eliminar lección ${lesson.orden}:`, deleteError);
        } else {
          console.log(`✅ Eliminada: Lección ${lesson.orden} - "${lesson.titulo}"`);
        }
      }
    } else {
      console.log('✅ No hay lecciones sin contenido para eliminar.');
    }

    // 6. Generar reporte final
    const report = {
      timestamp: new Date().toISOString(),
      course: courses.titulo,
      existingFolders: existingFolders,
      validLessonNumbers: validLessonNumbers,
      totalLessonsFound: lessons.length,
      validLessonsKept: validLessons.length,
      lessonsDeleted: lessonsToDelete.length,
      deletedLessons: lessonsToDelete.map(l => ({ orden: l.orden, titulo: l.titulo })),
      keptLessons: validLessons.map(l => ({ orden: l.orden, titulo: l.titulo }))
    };
    
    fs.writeFileSync('lessons-cleanup-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📊 REPORTE FINAL:');
    console.log('==================');
    console.log(`📁 Carpetas con contenido real: ${existingFolders.length}`);
    console.log(`📚 Lecciones válidas mantenidas: ${validLessons.length}`);
    console.log(`🗑️  Lecciones eliminadas: ${lessonsToDelete.length}`);
    
    if (lessonsToDelete.length > 0) {
      console.log('\n❌ Lecciones eliminadas (sin contenido real):');
      lessonsToDelete.forEach(l => console.log(`   - Lección ${l.orden}: "${l.titulo}"`));
    }
    
    console.log('\n✅ Lecciones mantenidas (con contenido real):');
    validLessons.forEach(l => console.log(`   - Lección ${l.orden}: "${l.titulo}"`));
    
    console.log('\n📄 Reporte guardado en: lessons-cleanup-report.json');
    console.log('💾 Backup guardado en: lessons-cleanup-backup.json');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el script
fixMissingLessonsContent();