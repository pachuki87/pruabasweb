const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson10URL() {
  console.log('🔧 Corrigiendo URL de la lección 10...');
  
  try {
    // Verificar que el archivo existe en la ruta correcta
    const correctPath = path.join(__dirname, 'public', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL', 'TRABAJO FINAL MASTER', 'contenido.html');
    
    if (fs.existsSync(correctPath)) {
      console.log('✅ Archivo encontrado en:', correctPath);
      
      // Actualizar la URL en la base de datos
      const { data, error } = await supabase
        .from('lecciones')
        .update({
          archivo_url: '/MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL/TRABAJO FINAL MASTER/contenido.html'
        })
        .eq('id', '3df75902-4d3e-4141-b564-e85c06603365')
        .select();
      
      if (error) {
        console.error('❌ Error al actualizar:', error);
        return;
      }
      
      console.log('✅ URL actualizada correctamente');
      console.log('📊 Datos:', data);
      
    } else {
      console.error('❌ Archivo no encontrado en:', correctPath);
      
      // Buscar el archivo en otras ubicaciones posibles
      const possiblePaths = [
        path.join(__dirname, 'public', 'course-content', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL', 'TRABAJO FINAL MASTER', 'contenido.html'),
        path.join(__dirname, 'public', 'lessons', 'leccion-10-trabajo-final-master.html'),
        path.join(__dirname, 'public', 'master en adicciones', '10) TRABAJO FINAL MASTER', 'contenido.html')
      ];
      
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          console.log('✅ Archivo encontrado en ubicación alternativa:', testPath);
          const relativePath = path.relative(path.join(__dirname, 'public'), testPath).replace(/\\/g, '/');
          console.log('📁 Ruta relativa:', '/' + relativePath);
          
          // Actualizar con la ruta correcta
          const { data, error } = await supabase
            .from('lecciones')
            .update({
              archivo_url: '/' + relativePath
            })
            .eq('id', '3df75902-4d3e-4141-b564-e85c06603365')
            .select();
          
          if (error) {
            console.error('❌ Error al actualizar:', error);
          } else {
            console.log('✅ URL actualizada con ruta alternativa');
            console.log('📊 Datos:', data);
          }
          break;
        }
      }
    }
    
    // Verificar el resultado final
    const { data: verification, error: verifyError } = await supabase
      .from('lecciones')
      .select('id, titulo, archivo_url')
      .eq('id', '3df75902-4d3e-4141-b564-e85c06603365')
      .single();
    
    if (verifyError) {
      console.error('❌ Error al verificar:', verifyError);
      return;
    }
    
    console.log('\n=== VERIFICACIÓN FINAL ===');
    console.log('ID:', verification.id);
    console.log('Título:', verification.titulo);
    console.log('Archivo URL:', verification.archivo_url);
    
    // Verificar que el archivo es accesible desde la web
    const fullPath = path.join(__dirname, 'public', verification.archivo_url.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      console.log('✅ Archivo accesible desde la web');
      console.log('🎉 ¡Lección 10 corregida exitosamente!');
    } else {
      console.log('❌ Archivo NO accesible desde la web');
      console.log('📁 Ruta completa esperada:', fullPath);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixLesson10URL();