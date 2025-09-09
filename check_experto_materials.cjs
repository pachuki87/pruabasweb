require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExpertoMaterials() {
  try {
    console.log('🔍 VERIFICANDO MATERIALES DEL CURSO EXPERTO EN CONDUCTAS ADICTIVAS\n');
    
    // Obtener el ID del curso Experto
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%experto%');
    
    if (coursesError) {
      console.error('❌ Error al obtener cursos:', coursesError);
      return;
    }
    
    console.log('📚 CURSOS ENCONTRADOS:');
    courses.forEach(course => {
      console.log(`   - ${course.titulo} (ID: ${course.id})`);
    });
    
    if (courses.length === 0) {
      console.log('❌ No se encontró el curso Experto');
      return;
    }
    
    const expertoCourseId = courses[0].id;
    console.log(`\n🎯 ANALIZANDO CURSO: ${courses[0].titulo}`);
    console.log(`📋 ID del curso: ${expertoCourseId}\n`);
    
    // Obtener todos los materiales del curso Experto
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', expertoCourseId)
      .eq('tipo_material', 'pdf')
      .order('titulo');
    
    if (materialsError) {
      console.error('❌ Error al obtener materiales:', materialsError);
      return;
    }
    
    console.log(`📊 TOTAL DE MATERIALES PDF EN BASE DE DATOS: ${materials.length}\n`);
    
    console.log('📋 LISTA DETALLADA DE MATERIALES:');
    materials.forEach((material, index) => {
      console.log(`${index + 1}. ${material.titulo}`);
      console.log(`   📂 Tipo: ${material.tipo_material}`);
      console.log(`   🔗 URL: ${material.url_archivo}`);
      console.log(`   📅 Creado: ${material.creado_en}`);
      console.log(`   🆔 ID: ${material.id}\n`);
    });
    
    // Analizar las rutas de los PDFs
    console.log('🔍 ANÁLISIS DE RUTAS:');
    const rutasOrganizadas = materials.filter(m => m.url_archivo.includes('/experto-conductas-adictivas/'));
    const rutasGenerales = materials.filter(m => m.url_archivo.startsWith('/pdfs/') && !m.url_archivo.includes('/experto-conductas-adictivas/') && !m.url_archivo.includes('/master-adicciones/'));
    const rutasOtras = materials.filter(m => !m.url_archivo.startsWith('/pdfs/'));
    
    console.log(`   📁 En carpeta organizada (/pdfs/experto-conductas-adictivas/): ${rutasOrganizadas.length}`);
    console.log(`   📁 En carpeta general (/pdfs/): ${rutasGenerales.length}`);
    console.log(`   📁 Otras rutas: ${rutasOtras.length}\n`);
    
    if (rutasOrganizadas.length > 0) {
      console.log('📂 MATERIALES EN CARPETA ORGANIZADA:');
      rutasOrganizadas.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo} -> ${material.url_archivo}`);
      });
      console.log('');
    }
    
    if (rutasGenerales.length > 0) {
      console.log('📂 MATERIALES EN CARPETA GENERAL:');
      rutasGenerales.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo} -> ${material.url_archivo}`);
      });
      console.log('');
    }
    
    if (rutasOtras.length > 0) {
      console.log('📂 MATERIALES CON OTRAS RUTAS:');
      rutasOtras.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo} -> ${material.url_archivo}`);
      });
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkExpertoMaterials();