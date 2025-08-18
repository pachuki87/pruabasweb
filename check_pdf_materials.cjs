require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPDFMaterials() {
  try {
    console.log('🔍 Verificando materiales PDF del curso Inteligencia Emocional...');
    
    // Obtener el curso
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Inteligencia Emocional')
      .single();

    if (courseError || !course) {
      console.error('❌ Error al obtener el curso:', courseError);
      return;
    }

    console.log(`✅ Curso encontrado: ${course.titulo}`);
    
    // Obtener todas las lecciones
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', course.id)
      .order('orden');

    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError);
      return;
    }

    console.log('\n=== VERIFICACIÓN DE MATERIALES PDF ===');
    
    // Mapeo de lecciones a carpetas de materiales
    const lessonFolderMap = {
      'Fundamentos Proceso Terapéutico': '1)FUNDAMENTOS P TERAPEUTICO',
      'Terapia Cognitiva en Drogodependencias': '2) TERAPIA COGNITIVA DROGODEPENDENENCIAS',
      'Familia y Trabajo en Equipo': '3) FAMILIA Y TRABAJO EQUIPO',
      'Recovery Coaching': '4)RECOVERY COACHING',
      'Intervención Familiar y Recovery Mentoring': '6) INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      'Nuevos Modelos Terapéuticos': '7) NUEVOS MODELOS TERAPEUTICOS',
      'Inteligencia Emocional Aplicada': '9) INTELIGENCIA EMOCIONAL'
    };

    const materialsBasePath = './inteligencia_emocional_drive';
    
    for (const lesson of lessons) {
      console.log(`\n${lesson.orden}. ${lesson.titulo}`);
      console.log(`   ID: ${lesson.id}`);
      
      const folderName = lessonFolderMap[lesson.titulo];
      if (folderName) {
        const folderPath = path.join(materialsBasePath, folderName);
        
        if (fs.existsSync(folderPath)) {
          console.log(`   📁 Carpeta de materiales: ${folderName}`);
          
          const files = fs.readdirSync(folderPath);
          const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
          
          if (pdfFiles.length > 0) {
            console.log(`   📄 PDFs disponibles: ${pdfFiles.length}`);
            pdfFiles.forEach(pdf => {
              console.log(`      - ${pdf}`);
            });
          } else {
            console.log(`   ⚠️  No se encontraron PDFs en la carpeta`);
          }
          
          // Verificar otros archivos
          const otherFiles = files.filter(file => !file.toLowerCase().endsWith('.pdf'));
          if (otherFiles.length > 0) {
            console.log(`   📎 Otros materiales: ${otherFiles.length}`);
            otherFiles.forEach(file => {
              console.log(`      - ${file}`);
            });
          }
        } else {
          console.log(`   ❌ Carpeta de materiales no encontrada: ${folderName}`);
        }
      } else {
        console.log(`   ⚠️  No hay mapeo de carpeta definido para esta lección`);
      }
    }
    
    console.log('\n=== RESUMEN DE MATERIALES ===');
    
    // Contar materiales totales
    let totalPDFs = 0;
    let totalOtherFiles = 0;
    let lessonsWithMaterials = 0;
    
    for (const lesson of lessons) {
      const folderName = lessonFolderMap[lesson.titulo];
      if (folderName) {
        const folderPath = path.join(materialsBasePath, folderName);
        if (fs.existsSync(folderPath)) {
          const files = fs.readdirSync(folderPath);
          const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
          const otherFiles = files.filter(file => !file.toLowerCase().endsWith('.pdf'));
          
          if (files.length > 0) {
            lessonsWithMaterials++;
          }
          
          totalPDFs += pdfFiles.length;
          totalOtherFiles += otherFiles.length;
        }
      }
    }
    
    console.log(`Lecciones con materiales: ${lessonsWithMaterials}/${lessons.length}`);
    console.log(`Total de PDFs: ${totalPDFs}`);
    console.log(`Total de otros archivos: ${totalOtherFiles}`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPDFMaterials();