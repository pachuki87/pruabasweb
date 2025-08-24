import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreMasterLessons() {
  console.log('🔄 Iniciando restauración de lecciones del MÁSTER EN ADICCIONES...');
  
  try {
    // Obtener todas las lecciones del curso máster
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden');
    
    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }
    
    console.log(`📚 Encontradas ${lessons.length} lecciones`);
    
    let restored = 0;
    let skipped = 0;
    
    for (const lesson of lessons) {
      console.log(`\n--- Procesando Lección ${lesson.orden}: ${lesson.titulo} ---`);
      
      // Si ya tiene contenido en BD, saltar
      if (lesson.contenido_html && lesson.contenido_html.trim().length > 100) {
        console.log('✅ Ya tiene contenido en BD, saltando...');
        skipped++;
        continue;
      }
      
      // Si tiene archivo_url, intentar leer el archivo
      if (lesson.archivo_url) {
        const filePath = path.join(process.cwd(), 'public', lesson.archivo_url);
        
        if (fs.existsSync(filePath)) {
          try {
            const htmlContent = fs.readFileSync(filePath, 'utf8');
            
            // Actualizar la lección con el contenido del archivo
            const { error: updateError } = await supabase
              .from('lecciones')
              .update({ 
                contenido_html: htmlContent
              })
              .eq('id', lesson.id);
            
            if (updateError) {
              console.error(`❌ Error al actualizar lección ${lesson.orden}:`, updateError);
            } else {
              console.log(`✅ Contenido restaurado desde archivo (${htmlContent.length} caracteres)`);
              restored++;
            }
          } catch (fileError) {
            console.error(`❌ Error al leer archivo ${filePath}:`, fileError.message);
          }
        } else {
          console.log(`⚠️  Archivo no encontrado: ${filePath}`);
        }
      } else {
        console.log('⚠️  No tiene archivo_url definido');
      }
    }
    
    console.log('\n============================================================');
    console.log('📊 RESUMEN DE RESTAURACIÓN');
    console.log('============================================================');
    console.log(`✅ Lecciones restauradas: ${restored}`);
    console.log(`⏭️  Lecciones saltadas (ya tenían contenido): ${skipped}`);
    console.log(`📚 Total procesadas: ${lessons.length}`);
    
    if (restored > 0) {
      console.log('\n🎉 ¡Restauración completada exitosamente!');
    } else {
      console.log('\n💡 No se necesitó restaurar ninguna lección.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la restauración
restoreMasterLessons();