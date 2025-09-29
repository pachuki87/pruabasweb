import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

const cursoId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Lecciones correctas del máster en adicciones con los números especificados
const leccionesCorrectas = [
  {
    titulo: 'FUNDAMENTOS P TERAPEUTICO',
    descripcion: 'Fundamentos del proceso terapéutico en el tratamiento de adicciones',
    orden: 1,
    archivo_url: 'lessons/leccion-1-fundamentos-p-terapeutico.html',
    duracion_estimada: 120
  },
  {
    titulo: 'TERAPIA COGNITIVA DROGODEPENDENCIAS',
    descripcion: 'Principios y técnicas de la terapia cognitiva aplicada a drogodependencias',
    orden: 2,
    archivo_url: 'lessons/leccion-2-terapia-cognitiva-drogodependencias.html',
    duracion_estimada: 135
  },
  {
    titulo: 'FAMILIA Y TRABAJO EQUIPO',
    descripcion: 'La importancia del trabajo familiar y en equipo en el proceso de recuperación',
    orden: 3,
    archivo_url: 'lessons/leccion-3-familia-y-trabajo-equipo.html',
    duracion_estimada: 130
  },
  {
    titulo: 'RECOVERY COACHING',
    descripcion: 'Metodología del Recovery Coaching y técnicas de acompañamiento',
    orden: 4,
    archivo_url: 'lessons/leccion-4-recovery-coaching.html',
    duracion_estimada: 140
  },
  {
    titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
    descripcion: 'Estrategias de intervención familiar y mentoring en procesos de recuperación',
    orden: 6,
    archivo_url: 'lessons/leccion-6-intervencion-familiar-y-recovery-mentoring.html',
    duracion_estimada: 145
  },
  {
    titulo: 'NUEVOS MODELOS TERAPEUTICOS',
    descripcion: 'Exploración de nuevos enfoques y modelos terapéuticos innovadores',
    orden: 7,
    archivo_url: 'lessons/leccion-7-nuevos-modelos-terapeuticos.html',
    duracion_estimada: 125
  },
  {
    titulo: 'INTELIGENCIA EMOCIONAL',
    descripcion: 'Aplicación de la inteligencia emocional en el contexto de las adicciones',
    orden: 9,
    archivo_url: 'lessons/leccion-9-inteligencia-emocional.html',
    duracion_estimada: 115
  }
];

async function fixMasterLessons() {
  console.log('🔧 Corrigiendo las lecciones del máster en adicciones...');
  
  try {
    // 1. Primero, eliminar todas las lecciones incorrectas
    console.log('\n🗑️ Eliminando lecciones incorrectas...');
    const { error: deleteError } = await supabase
      .from('lecciones')
      .delete()
      .eq('curso_id', cursoId);

    if (deleteError) {
      console.error('❌ Error al eliminar lecciones:', deleteError);
      return;
    }
    
    console.log('✅ Lecciones incorrectas eliminadas');
    
    // 2. Crear las lecciones correctas
    console.log('\n📚 Creando lecciones correctas del máster en adicciones...');
    
    for (const leccion of leccionesCorrectas) {
      const { data, error } = await supabase
        .from('lecciones')
        .insert({
          curso_id: cursoId,
          titulo: leccion.titulo,
          descripcion: leccion.descripcion,
          orden: leccion.orden,
          archivo_url: leccion.archivo_url,
          duracion_estimada: leccion.duracion_estimada,
          tiene_cuestionario: true
        })
        .select();
        
      if (error) {
        console.error(`❌ Error al crear lección "${leccion.titulo}":`, error);
      } else {
        console.log(`✅ Creada: ${leccion.orden}) ${leccion.titulo}`);
      }
    }
    
    // 3. Verificar el resultado final
    console.log('\n🔍 Verificando resultado final...');
    const { data: leccionesFinales, error: verifyError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .order('orden', { ascending: true });

    if (verifyError) {
      console.error('❌ Error al verificar:', verifyError);
      return;
    }

    console.log('\n=== LECCIONES FINALES ===');
    leccionesFinales.forEach(leccion => {
      console.log(`${leccion.orden}) ${leccion.titulo}`);
    });
    
    console.log('\n🎉 ¡Lecciones del máster en adicciones corregidas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixMasterLessons();