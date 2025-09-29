import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapeo de carpetas a lecciones (del script original)
const folderToLessonMap = {
  '1)FUNDAMENTOS P TERAPEUTICO': 1,
  '2) TERAPIA COGNITIVA DROGODEPENDENCIAS': 2,
  '3) FAMILIA Y TRABAJO EQUIPO': 3,
  '4) TERAPIA FAMILIAR SISTEMICA': 4,
  '6) PREVENCION RECAIDAS': 6,
  '7) TERAPIA GRUPAL': 7
};

async function verifyLessons() {
  try {
    console.log('🔍 Verificando contenido de lecciones del curso...');
    
    // Obtener el curso
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (courseError) {
      console.error('❌ Error al obtener el curso:', courseError);
      return;
    }
    
    console.log(`📚 Curso encontrado: ${course.titulo} (ID: ${course.id})`);
    console.log('\n' + '='.repeat(80));
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('orden, titulo, contenido_html')
      .eq('curso_id', course.id)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error al obtener las lecciones:', lessonsError);
      return;
    }
    
    console.log(`📖 Total de lecciones encontradas: ${lessons.length}\n`);
    
    // Mostrar información de cada lección
    lessons.forEach(lesson => {
      const hasContent = lesson.contenido_html && lesson.contenido_html.trim().length > 0;
      const contentLength = hasContent ? lesson.contenido_html.length : 0;
      const preview = hasContent ? 
        lesson.contenido_html.substring(0, 100).replace(/\n/g, ' ') + '...' : 
        'SIN CONTENIDO';
      
      const status = hasContent ? '✅' : '❌';
      const mappedFolder = Object.keys(folderToLessonMap).find(folder => 
        folderToLessonMap[folder] === lesson.orden
      );
      
      console.log(`${status} Lección ${lesson.orden}: ${lesson.titulo}`);
      console.log(`   📏 Longitud del contenido: ${contentLength} caracteres`);
      console.log(`   📁 Carpeta mapeada: ${mappedFolder || 'NINGUNA - ⚠️  FALTA MAPEAR'}`);  
      console.log(`   👀 Preview: ${preview}`);
      console.log('');
    });
    
    // Análisis específico de lecciones faltantes
    console.log('\n' + '='.repeat(80));
    console.log('📊 ANÁLISIS DE LECCIONES FALTANTES:');
    console.log('='.repeat(80));
    
    const emptyLessons = lessons.filter(lesson => 
      !lesson.contenido_html || lesson.contenido_html.trim().length === 0
    );
    
    if (emptyLessons.length > 0) {
      console.log(`❌ Lecciones sin contenido: ${emptyLessons.map(l => l.orden).join(', ')}`);
      
      emptyLessons.forEach(lesson => {
        console.log(`   • Lección ${lesson.orden}: ${lesson.titulo}`);
      });
    } else {
      console.log('✅ Todas las lecciones tienen contenido');
    }
    
    // Mostrar carpetas no mapeadas
    console.log('\n📁 CARPETAS DISPONIBLES EN EL MAPEO:');
    Object.keys(folderToLessonMap).forEach(folder => {
      console.log(`   • ${folder} → Lección ${folderToLessonMap[folder]}`);
    });
    
    // Identificar lecciones que necesitan mapeo
    const unmappedLessons = lessons.filter(lesson => 
      !Object.values(folderToLessonMap).includes(lesson.orden)
    );
    
    if (unmappedLessons.length > 0) {
      console.log('\n⚠️  LECCIONES SIN MAPEAR A CARPETAS:');
      unmappedLessons.forEach(lesson => {
        console.log(`   • Lección ${lesson.orden}: ${lesson.titulo}`);
      });
      
      console.log('\n💡 SUGERENCIAS:');
      console.log('   - Revisar si existen carpetas adicionales en inteligencia_emocional_drive');
      console.log('   - Verificar si las lecciones 5 y 8 corresponden a carpetas específicas');
      console.log('   - Considerar si algunas lecciones deben tener contenido manual');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la verificación
verifyLessons();