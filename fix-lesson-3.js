import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Function to clean Unicode characters
function cleanUnicodeText(text) {
  if (!text) return text;
  
  // Remove null characters and other problematic Unicode characters
  let cleanedText = text
    .replace(/\u0000/g, '') // Remove null characters
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Remove control characters
    .replace(/\uFFFD/g, '') // Remove replacement characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
    .trim();
  
  return cleanedText;
}

// Function to convert text to structured HTML
function convertToHTML(text) {
  if (!text) return '';
  
  const lines = text.split('\n').filter(line => line.trim());
  let html = '';
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Check if it's a heading (starts with numbers, uppercase, or common heading patterns)
    if (/^\d+\./.test(line) || /^[A-Z\s]{3,}$/.test(line) || /^(TEMA|MÓDULO|CAPÍTULO|UNIDAD)/i.test(line)) {
      html += `<h2>${line}</h2>\n`;
    }
    // Check if it's a subheading
    else if (/^[a-z]\)|^-\s|^\*\s/.test(line)) {
      html += `<h3>${line}</h3>\n`;
    }
    // Check if it's a list item
    else if (/^[•·-]\s/.test(line) || /^\d+\)/.test(line)) {
      html += `<li>${line.replace(/^[•·-]\s/, '').replace(/^\d+\)\s/, '')}</li>\n`;
    }
    // Regular paragraph
    else {
      html += `<p>${line}</p>\n`;
    }
  }
  
  return html;
}

// Main function to fix Lesson 3
async function fixLesson3() {
  try {
    console.log('🔍 Buscando el curso "MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL"...');
    
    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (courseError || !course) {
      console.error('❌ Error al encontrar el curso:', courseError);
      return;
    }
    
    console.log(`✅ Curso encontrado: ${course.titulo} (ID: ${course.id})`);
    
    // Get Lesson 3
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html')
      .eq('curso_id', course.id)
      .eq('orden', 3)
      .single();
    
    if (lessonError || !lesson) {
      console.error('❌ Error al encontrar la Lección 3:', lessonError);
      return;
    }
    
    console.log(`📖 Lección 3 encontrada: ${lesson.titulo}`);
    console.log(`📝 Contenido actual (primeros 200 caracteres): ${lesson.contenido_html?.substring(0, 200)}...`);
    
    // Clean the content
    const originalContent = lesson.contenido_html || '';
    const cleanedContent = cleanUnicodeText(originalContent);
    
    if (originalContent === cleanedContent) {
      console.log('✅ No se encontraron caracteres Unicode problemáticos en la Lección 3.');
      return;
    }
    
    console.log('🧹 Limpiando caracteres Unicode problemáticos...');
    console.log(`📊 Caracteres removidos: ${originalContent.length - cleanedContent.length}`);
    
    // Update the lesson
    const { error: updateError } = await supabase
      .from('lecciones')
      .update({ contenido_html: cleanedContent })
      .eq('id', lesson.id);
    
    if (updateError) {
      console.error('❌ Error al actualizar la lección:', updateError);
      return;
    }
    
    console.log('✅ Lección 3 actualizada exitosamente!');
    console.log(`📝 Nuevo contenido (primeros 200 caracteres): ${cleanedContent.substring(0, 200)}...`);
    
    // Verify the update
    const { data: updatedLesson, error: verifyError } = await supabase
      .from('lecciones')
      .select('contenido_html')
      .eq('id', lesson.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error al verificar la actualización:', verifyError);
      return;
    }
    
    console.log('🔍 Verificación completada - La lección se actualizó correctamente.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Execute the script
fixLesson3().then(() => {
  console.log('🎉 Script completado.');
}).catch(error => {
  console.error('💥 Error fatal:', error);
});