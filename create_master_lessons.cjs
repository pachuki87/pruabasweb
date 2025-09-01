require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Usar SERVICE_ROLE_KEY para permisos completos
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MASTER_COURSE_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Las 7 lecciones correctas del máster en adicciones según la imagen del usuario
const leccionesCorrectas = [
  {
    orden: 1,
    titulo: 'FUNDAMENTOS P TERAPEUTICO',
    descripcion: 'Lección 1 del curso Máster en Adicciones',
    archivo_url: '/lessons/master-leccion-1-fundamentos-p-terapeutico.html',
    duracion_estimada: 60
  },
  {
    orden: 2,
    titulo: 'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
    descripcion: 'Lección 2 del curso Máster en Adicciones',
    archivo_url: '/lessons/master-leccion-2-terapia-cognitiva-drogodependenencias.html',
    duracion_estimada: 75
  },
  {
    orden: 3,
    titulo: 'FAMILIA Y TRABAJO EQUIPO',
    descripcion: 'Lección 3 del curso Máster en Adicciones',
    archivo_url: '/lessons/master-leccion-3-familia-y-trabajo-equipo.html',
    duracion_estimada: 65
  },
  {
    orden: 4,
    titulo: 'RECOVERY COACHING',
    descripcion: 'Lección 4 del curso Máster en Adicciones',
    archivo_url: '/lessons/master-leccion-4-recovery-coaching.html',
    duracion_estimada: 80
  },
  {
    orden: 5,
    titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
    descripcion: 'Lección 5 del curso Máster en Adicciones',
    archivo_url: '/lessons/master-leccion-5-intervencion-familiar-y-recovery-mentoring.html',
    duracion_estimada: 70
  },
  {
    orden: 6,
    titulo: 'NUEVOS MODELOS TERAPEUTICOS',
    descripcion: 'Lección 6 del curso Máster en Adicciones',
    archivo_url: '/lessons/master-leccion-6-nuevos-modelos-terapeuticos.html',
    duracion_estimada: 85
  },
  {
    orden: 7,
    titulo: 'INTELIGENCIA EMOCIONAL',
    descripcion: 'Lección 7 del curso Máster en Adicciones',
    archivo_url: '/lessons/master-leccion-7-inteligencia-emocional.html',
    duracion_estimada: 55
  }
];

(async () => {
  try {
    console.log('=== CREANDO LECCIONES DEL MÁSTER EN ADICCIONES ===');
    console.log('');

    // Paso 1: Eliminar todas las lecciones existentes del curso máster
    console.log('1. Eliminando lecciones existentes...');
    const { error: deleteError } = await supabase
      .from('lecciones')
      .delete()
      .eq('curso_id', MASTER_COURSE_ID);

    if (deleteError) {
      console.log('Error al eliminar lecciones:', deleteError);
      return;
    }
    console.log('✓ Lecciones existentes eliminadas');
    console.log('');

    // Paso 2: Insertar las nuevas lecciones correctas
    console.log('2. Insertando las 7 lecciones correctas...');
    
    for (const leccion of leccionesCorrectas) {
      const leccionData = {
        curso_id: MASTER_COURSE_ID,
        titulo: leccion.titulo,
        descripcion: leccion.descripcion,
        orden: leccion.orden,
        archivo_url: leccion.archivo_url,
        duracion_estimada: leccion.duracion_estimada,
        imagen_url: null,
        video_url: null,
        tiene_cuestionario: false
      };

      const { data, error } = await supabase
        .from('lecciones')
        .insert([leccionData])
        .select();

      if (error) {
        console.log(`Error al insertar lección ${leccion.orden}:`, error);
        return;
      }

      console.log(`✓ Lección ${leccion.orden}: ${leccion.titulo}`);
    }

    console.log('');
    console.log('=== VERIFICACIÓN FINAL ===');
    
    // Verificar que las lecciones se insertaron correctamente
    const { data: leccionesVerificacion, error: verifyError } = await supabase
      .from('lecciones')
      .select('orden, titulo, descripcion, archivo_url')
      .eq('curso_id', MASTER_COURSE_ID)
      .order('orden');

    if (verifyError) {
      console.log('Error en verificación:', verifyError);
      return;
    }

    console.log('Lecciones creadas en el Máster en Adicciones:');
    console.log('============================================');
    leccionesVerificacion.forEach(leccion => {
      console.log(`${leccion.orden}. ${leccion.titulo}`);
      console.log(`   Archivo: ${leccion.archivo_url}`);
      console.log('');
    });

    console.log(`✓ Total: ${leccionesVerificacion.length} lecciones creadas correctamente`);
    console.log('');
    console.log('¡PROCESO COMPLETADO! Las lecciones del máster ya están listas.');

  } catch (error) {
    console.error('Error general:', error);
  }
})();