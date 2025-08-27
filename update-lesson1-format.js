import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase (usando service_role_key para permisos completos)
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLesson1Format() {
  try {
    // Leer el nuevo contenido HTML formateado
    const newHtmlContent = fs.readFileSync('lesson1-formatted-content.html', 'utf8');
    
    // Leer la información de la lección desde el archivo JSON
    const lessonInfo = JSON.parse(fs.readFileSync('lesson1-info.json', 'utf8'));
    const lessonId = lessonInfo.id;
    
    console.log('Actualizando lección 1 con nuevo formato...');
    console.log('ID de la lección:', lessonId);
    
    // Primero verificar si la lección existe
    const { data: existingLesson, error: selectError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', lessonId)
      .single();
    
    if (selectError) {
      console.error('Error al buscar la lección:', selectError);
      return;
    }
    
    if (!existingLesson) {
      console.log('⚠️ No se encontró la lección con ID:', lessonId);
      return;
    }
    
    console.log('✅ Lección encontrada:', existingLesson.titulo);
    
    // Actualizar la lección en Supabase
    const { data, error } = await supabase
      .from('lecciones')
      .update({
        contenido_html: newHtmlContent
      })
      .eq('id', lessonId)
      .select();
    
    if (error) {
      console.error('Error al actualizar la lección:', error);
      return;
    }
    
    console.log('Respuesta de actualización:', { data, error });
    
    if (data && data.length > 0) {
      console.log('✅ Lección 1 actualizada exitosamente con el nuevo formato');
      console.log('Título:', data[0].titulo);
      console.log('Contenido HTML actualizado (longitud):', data[0].contenido_html.length, 'caracteres');
    } else {
      console.log('⚠️ No se encontró la lección para actualizar');
      console.log('Data recibida:', data);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Ejecutar la actualización
updateLesson1Format();