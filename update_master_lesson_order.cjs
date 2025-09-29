require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // MÁSTER EN ADICCIONES

    const lessonUpdates = [
      { title: 'INTELIGENCIA EMOCIONAL', order: 9 },
      { title: 'NUEVOS MODELOS TERAPEUTICOS', order: 7 },
      { title: 'RECOVERY COACHING', order: 4 },
      { title: 'TERAPIA COGNITIVA DROGODEPENDENCIAS', order: 2 },
      { title: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING', order: 6 },
      { title: 'FAMILIA Y TRABAJO EQUIPO', order: 3 },
      { title: 'FUNDAMENTOS P TERAPEUTICO', order: 1 }
    ];

    console.log('Actualizando el orden de las lecciones para el curso: MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL');
    console.log('====================================================================================================');

    for (const update of lessonUpdates) {
      const { data, error } = await supabase
        .from('lecciones')
        .update({ orden: update.order })
        .eq('curso_id', masterCourseId)
        .eq('titulo', update.title);

      if (error) {
        console.error(`Error al actualizar la lección '${update.title}':`, error);
      } else if (data && data.length > 0) {
        console.log(`✅ Lección '${update.title}' actualizada a orden ${update.order}`);
      } else {
        console.warn(`⚠️ No se encontró la lección '${update.title}' para actualizar.`);
      }
    }

    console.log('\nProceso de actualización de orden de lecciones completado.');

  } catch (error) {
    console.error('Error general:', error);
  }
})();