require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPDFMaterials() {
  try {
    console.log('🔍 Analizando materiales PDF y sus rutas...');
    
    // Obtener todos los materiales PDF con información del curso
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select(`
        id,
        titulo,
        url_archivo,
        curso_id,
        cursos(id, titulo)
      `)
      .eq('tipo_material', 'pdf');

    if (materialsError) {
      console.error('❌ Error al obtener materiales:', materialsError);
      return;
    }

    console.log(`\n=== MATERIALES PDF ENCONTRADOS (${materials?.length || 0}) ===\n`);
    
    if (!materials || materials.length === 0) {
      console.log('No se encontraron materiales PDF.');
      return;
    }

    // Separar por curso
    const materialsByCourse = {};
    materials.forEach(material => {
      const courseTitle = material.cursos?.titulo || 'Sin curso';
      if (!materialsByCourse[courseTitle]) {
        materialsByCourse[courseTitle] = [];
      }
      materialsByCourse[courseTitle].push(material);
    });

    // Mostrar materiales por curso
    Object.entries(materialsByCourse).forEach(([courseTitle, courseMaterials]) => {
      console.log(`\n📚 CURSO: ${courseTitle}`);
      console.log(`   Materiales: ${courseMaterials.length}`);
      
      courseMaterials.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      URL: ${material.url_archivo}`);
        
        // Detectar problemas de ruta
        if (courseTitle.toLowerCase().includes('experto') && 
            material.url_archivo && 
            material.url_archivo.includes('master-adicciones')) {
          console.log(`      🚨 PROBLEMA: Material del curso EXPERTO con ruta de MASTER`);
        }
        
        if (courseTitle.toLowerCase().includes('master') && 
            material.url_archivo && 
            material.url_archivo.includes('experto-conductas-adictivas')) {
          console.log(`      🚨 PROBLEMA: Material del curso MASTER con ruta de EXPERTO`);
        }
      });
    });

    // Buscar específicamente el archivo problemático
    const problematicFile = materials.find(m => 
      m.url_archivo && m.url_archivo.includes('Informe-europeo-sobre-drogas-2020.pdf')
    );

    if (problematicFile) {
      console.log('\n🚨 === ARCHIVO PROBLEMÁTICO ENCONTRADO ===');
      console.log(`ID: ${problematicFile.id}`);
      console.log(`Título: ${problematicFile.titulo}`);
      console.log(`Curso: ${problematicFile.cursos?.titulo}`);
      console.log(`URL actual: ${problematicFile.url_archivo}`);
      
      // Sugerir corrección
      if (problematicFile.url_archivo.includes('master-adicciones')) {
        const correctUrl = problematicFile.url_archivo.replace('master-adicciones', 'experto-conductas-adictivas');
        console.log(`\n💡 SOLUCIÓN SUGERIDA:`);
        console.log(`URL corregida: ${correctUrl}`);
        console.log(`\nComando SQL para corregir:`);
        console.log(`UPDATE materiales SET url_archivo = '${correctUrl}' WHERE id = '${problematicFile.id}';`);
      }
    } else {
      console.log('\n✅ El archivo "Informe-europeo-sobre-drogas-2020.pdf" no está en la base de datos.');
    }

    // Resumen de problemas
    console.log('\n🔍 === RESUMEN DE PROBLEMAS DE RUTAS ===');
    
    const expertMaterialsWithMasterPath = materials.filter(m => 
      m.cursos?.titulo && 
      m.cursos.titulo.toLowerCase().includes('experto') &&
      m.url_archivo && 
      m.url_archivo.includes('master-adicciones')
    );
    
    const masterMaterialsWithExpertPath = materials.filter(m => 
      m.cursos?.titulo && 
      m.cursos.titulo.toLowerCase().includes('master') &&
      m.url_archivo && 
      m.url_archivo.includes('experto-conductas-adictivas')
    );

    if (expertMaterialsWithMasterPath.length > 0) {
      console.log(`\n🚨 ${expertMaterialsWithMasterPath.length} materiales del curso EXPERTO con ruta de MASTER:`);
      expertMaterialsWithMasterPath.forEach(material => {
        console.log(`   - ${material.titulo}`);
        console.log(`     ID: ${material.id}`);
        console.log(`     URL actual: ${material.url_archivo}`);
        const correctUrl = material.url_archivo.replace('master-adicciones', 'experto-conductas-adictivas');
        console.log(`     URL correcta: ${correctUrl}`);
      });
    }

    if (masterMaterialsWithExpertPath.length > 0) {
      console.log(`\n🚨 ${masterMaterialsWithExpertPath.length} materiales del curso MASTER con ruta de EXPERTO:`);
      masterMaterialsWithExpertPath.forEach(material => {
        console.log(`   - ${material.titulo}`);
        console.log(`     URL: ${material.url_archivo}`);
      });
    }

    if (expertMaterialsWithMasterPath.length === 0 && masterMaterialsWithExpertPath.length === 0) {
      console.log('\n✅ No se encontraron problemas de rutas entre cursos.');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPDFMaterials();