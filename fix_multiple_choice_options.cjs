const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixMultipleChoiceOptions() {
  const preguntaId = '790a4532-79e8-4e6e-ac5c-9269e02384c4';

  // First, delete existing options
  const { error: deleteError } = await supabase
    .from('opciones_respuesta')
    .delete()
    .eq('pregunta_id', preguntaId);

  if (deleteError) {
    console.error('Error deleting existing options:', deleteError);
    return;
  }

  console.log('Deleted existing options');

  // Create new options with correct answers marked
  const opciones = [
    { opcion: 'Violencia doméstica', es_correcta: true, orden: 1 },
    { opcion: 'Redes de apoyo sólidas', es_correcta: false, orden: 2 },
    { opcion: 'Estigmatización social', es_correcta: true, orden: 3 },
    { opcion: 'Acceso a tratamiento especializado', es_correcta: true, orden: 4 }
  ];

  const { data, error } = await supabase
    .from('opciones_respuesta')
    .insert(opciones.map(opt => ({
      pregunta_id: preguntaId,
      opcion: opt.opcion,
      es_correcta: opt.es_correcta,
      orden: opt.orden
    })))
    .select();

  if (error) {
    console.error('Error inserting new options:', error);
    return;
  }

  console.log('✅ Successfully updated multiple choice options:');
  data.forEach(opt => {
    console.log(`  ${opt.orden}. ${opt.opcion} ${opt.es_correcta ? '(CORRECT)' : ''}`);
  });
}

fixMultipleChoiceOptions();