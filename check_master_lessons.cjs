require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMasterLessons() {
  try {
    console.log('🔍 Revisando lecciones del Máster en Adicciones...');
    
    // ID del curso Máster en Adicciones
    const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
    
    // Verificar que el curso existe
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', masterCourseId)
      .single();
    
    if (courseError) {
      console.error('❌ Error al buscar el curso:', courseError);
      return;
    }
    
    console.log('✅ Curso encontrado:', course.titulo);
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', masterCourseId)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError);
      return;
    }
    
    console.log(`\n📚 Total de lecciones encontradas: ${lessons.length}`);
    
    if (lessons.length === 0) {
      console.log('⚠️  No hay lecciones en la base de datos para este curso');
      console.log('\n🔧 Creando lecciones del Máster...');
      await createMasterLessons(masterCourseId);
      return;
    }
    
    // Revisar cada lección
    lessons.forEach((lesson, index) => {
      console.log(`\n--- Lección ${index + 1} ---`);
      console.log(`ID: ${lesson.id}`);
      console.log(`Título: ${lesson.titulo}`);
      console.log(`Orden: ${lesson.orden}`);
      console.log(`Archivo URL: ${lesson.archivo_url || 'NO DEFINIDO'}`);
      console.log(`Descripción: ${lesson.descripcion || 'Sin descripción'}`);
      
      if (!lesson.archivo_url) {
        console.log('⚠️  Esta lección NO tiene archivo_url definido');
      }
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

async function createMasterLessons(courseId) {
  const masterLessons = [
    {
      titulo: 'FUNDAMENTOS P TERAPEUTICO',
      descripcion: 'Fundamentos del proceso terapéutico en adicciones',
      orden: 1,
      archivo_url: '/master-content/FUNDAMENTOS P TERAPEUTICO/contenido.html',
      duracion_estimada: 120
    },
    {
      titulo: 'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
      descripcion: 'Terapia cognitiva aplicada a drogodependencias',
      orden: 2,
      archivo_url: '/master-content/TERAPIA COGNITIVA DROGODEPENDENENCIAS/contenido.html',
      duracion_estimada: 150
    },
    {
      titulo: 'FAMILIA Y TRABAJO EQUIPO',
      descripcion: 'Trabajo familiar y en equipo en el tratamiento de adicciones',
      orden: 3,
      archivo_url: '/master-content/FAMILIA Y TRABAJO EQUIPO/contenido.html',
      duracion_estimada: 135
    },
    {
      titulo: 'RECOVERY COACHING',
      descripcion: 'Técnicas de coaching en procesos de recuperación',
      orden: 4,
      archivo_url: '/master-content/RECOVERY COACHING/contenido.html',
      duracion_estimada: 140
    },
    {
      titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      descripcion: 'Intervención familiar y mentoring en recuperación',
      orden: 5,
      archivo_url: '/master-content/INTERVENCION FAMILIAR Y RECOVERY MENTORING/contenido.html',
      duracion_estimada: 160
    },
    {
      titulo: 'NUEVOS MODELOS TERAPEUTICOS',
      descripcion: 'Modelos terapéuticos innovadores en adicciones',
      orden: 6,
      archivo_url: '/master-content/NUEVOS MODELOS TERAPEUTICOS/contenido.html',
      duracion_estimada: 145
    },
    {
      titulo: 'INTELIGENCIA EMOCIONAL',
      descripcion: 'Inteligencia emocional en el tratamiento de adicciones',
      orden: 7,
      archivo_url: '/master-content/INTELIGENCIA EMOCIONAL/contenido.html',
      duracion_estimada: 130
    }
  ];
  
  for (const lesson of masterLessons) {
    const { data, error } = await supabase
      .from('lecciones')
      .insert({
        ...lesson,
        curso_id: courseId
      })
      .select();
    
    if (error) {
      console.error(`❌ Error al crear lección "${lesson.titulo}":`, error);
    } else {
      console.log(`✅ Lección creada: "${lesson.titulo}"`);
    }
  }
}

async function updateLessonUrls() {
  console.log('\n🔧 Actualizando URLs de lecciones existentes...');
  
  const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
  
  const updates = [
    {
      titulo: 'FUNDAMENTOS P TERAPEUTICO',
      archivo_url: '/master-content/FUNDAMENTOS P TERAPEUTICO/contenido.html'
    },
    {
      titulo: 'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
      archivo_url: '/master-content/TERAPIA COGNITIVA DROGODEPENDENENCIAS/contenido.html'
    },
    {
      titulo: 'FAMILIA Y TRABAJO EQUIPO',
      archivo_url: '/master-content/FAMILIA Y TRABAJO EQUIPO/contenido.html'
    },
    {
      titulo: 'RECOVERY COACHING',
      archivo_url: '/master-content/RECOVERY COACHING/contenido.html'
    },
    {
      titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      archivo_url: '/master-content/INTERVENCION FAMILIAR Y RECOVERY MENTORING/contenido.html'
    },
    {
      titulo: 'NUEVOS MODELOS TERAPEUTICOS',
      archivo_url: '/master-content/NUEVOS MODELOS TERAPEUTICOS/contenido.html'
    },
    {
      titulo: 'INTELIGENCIA EMOCIONAL',
      archivo_url: '/master-content/INTELIGENCIA EMOCIONAL/contenido.html'
    }
  ];
  
  for (const update of updates) {
    const { data, error } = await supabase
      .from('lecciones')
      .update({ archivo_url: update.archivo_url })
      .eq('curso_id', masterCourseId)
      .eq('titulo', update.titulo)
      .select();
    
    if (error) {
      console.error(`❌ Error al actualizar "${update.titulo}":`, error);
    } else if (data && data.length > 0) {
      console.log(`✅ URL actualizada para: "${update.titulo}"`);
    } else {
      console.log(`⚠️  No se encontró lección: "${update.titulo}"`);
    }
  }
}

// Ejecutar funciones
checkMasterLessons().then(() => {
  // console.log('\n🔄 Actualizando URLs...');
  // return updateLessonUrls();
  console.log('\n✅ Proceso completado');
}).catch(error => {
  console.error('❌ Error en el proceso:', error);
});