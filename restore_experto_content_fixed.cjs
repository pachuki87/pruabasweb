require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.log('URL:', supabaseUrl ? 'Found' : 'Missing');
  console.log('Service Key:', supabaseServiceKey ? 'Found' : 'Missing');
  process.exit(1);
}

// Use SERVICE_ROLE_KEY for write operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapeo de títulos de lecciones a nombres de carpetas
const titleMappings = {
  '¿Qué significa ser adicto?': '01_¿Qué significa ser adicto_',
  '¿Qué significa ser adicto': '01_¿Qué significa ser adicto_',
  '¿Qué es una adicción 1 Cuestionario': '02_¿Qué es una adicción_1 Cuestionario',
  'Consecuencias de las adicciones': '03_Consecuencias de las adicciones',
  'Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario': '04_Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario',
  'Criterios para diagnosticar una conducta adictiva (DSM-5) Cuestionario': '04_Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario',
  'Material Complementario y Ejercicios2 Cuestionarios': '05_Material Complementario y Ejercicios2 Cuestionarios',
  'Adicciones Comportamentales2 Cuestionarios': '06_Adicciones Comportamentales2 Cuestionarios',
  'La familia': '07_La familia',
  'La recaída': '08_La recaída',
  'Nuevas terapias psicológicas': '09_Nuevas terapias psicológicas',
  'Terapia integral de pareja1 Cuestionario': '10_Terapia integral de pareja1 Cuestionario',
  'Psicología positiva1 Cuestionario': '11_Psicología positiva1 Cuestionario',
  'Mindfulness aplicado a la Conducta Adictiva1 Cuestionario': '12_Mindfulness aplicado a la Conducta Adictiva1 Cuestionario'
};

function mapTitleToSlug(titulo) {
  // Buscar coincidencia exacta primero
  if (titleMappings[titulo]) {
    return titleMappings[titulo];
  }
  
  // Buscar coincidencia parcial
  for (const [key, value] of Object.entries(titleMappings)) {
    if (titulo.includes(key.split(' ')[0]) || key.includes(titulo.split(' ')[0])) {
      return value;
    }
  }
  
  // Fallback: crear slug básico desde el título
  return titulo.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
}

async function restoreExpertoContent() {
  try {
    console.log('🔄 Restoring content for "Experto en Conductas Adictivas" with SERVICE_ROLE_KEY...');
    
    // Get course ID
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (courseError) {
      console.error('❌ Course error:', courseError);
      return;
    }
    
    console.log('✅ Course found:', course);
    
    // Get all lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', course.id)
      .order('orden', { ascending: true });
    
    if (lessonsError) {
      console.error('❌ Lessons error:', lessonsError);
      return;
    }
    
    console.log(`\n📚 Found ${lessons.length} lessons to restore:`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const lesson of lessons) {
      console.log(`\n--- Processing: ${lesson.titulo} ---`);
      
      // Map title to folder slug
      const folderSlug = mapTitleToSlug(lesson.titulo);
      console.log('📁 Mapped to folder:', folderSlug);
      
      // Check if content file exists
      const contentPath = path.join(__dirname, 'curso_extraido', 'Módulo 1', folderSlug, 'contenido.html');
      
      if (!fs.existsSync(contentPath)) {
        console.log('⚠️ Content file not found:', contentPath);
        skippedCount++;
        continue;
      }
      
      // Read content file
      const htmlContent = fs.readFileSync(contentPath, 'utf8');
      console.log('📄 Content loaded, length:', htmlContent.length);
      
      // Update lesson in database with SERVICE_ROLE_KEY
      const { data: updateData, error: updateError } = await supabase
        .from('lecciones')
        .update({ contenido_html: htmlContent })
        .eq('id', lesson.id)
        .select();
      
      if (updateError) {
        console.error('❌ Update error for lesson:', lesson.titulo, updateError);
        continue;
      }
      
      console.log('✅ Content updated successfully, affected rows:', updateData?.length || 0);
      updatedCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎉 Restoration complete!`);
    console.log(`✅ Updated: ${updatedCount} lessons`);
    console.log(`⚠️ Skipped: ${skippedCount} lessons`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

restoreExpertoContent();