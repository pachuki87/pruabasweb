const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkPreguntasStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla preguntas...');
    
    // Obtener algunas preguntas para ver la estructura
    const { data: preguntas, error } = await supabase
      .from('preguntas')
      .select('*')
      .limit(3);
    
    if (error) {
      console.error('❌ Error al consultar preguntas:', error);
      return;
    }
    
    if (preguntas && preguntas.length > 0) {
      console.log('✅ Estructura de la tabla preguntas:');
      console.log('Columnas encontradas:', Object.keys(preguntas[0]));
      console.log('\n📝 Ejemplo de pregunta:');
      console.log(JSON.stringify(preguntas[0], null, 2));
    } else {
      console.log('❌ No se encontraron preguntas');
    }
    
    // Verificar preguntas específicas del Máster
    console.log('\n🔍 Buscando preguntas del Máster en Adicciones...');
    const { data: preguntasMaster, error: masterError } = await supabase
      .from('preguntas')
      .select('*')
      .in('cuestionario_id', ['7a52daad-db71-4cb5-8701-967fffbb6966', '73571904-d8e5-41ee-9485-60d4996819a8']);
    
    if (masterError) {
      console.error('❌ Error al buscar preguntas del Máster:', masterError);
      return;
    }
    
    console.log(`📊 Preguntas encontradas para el Máster: ${preguntasMaster?.length || 0}`);
    
    if (preguntasMaster && preguntasMaster.length > 0) {
      preguntasMaster.forEach((pregunta, index) => {
        console.log(`\n${index + 1}. ${pregunta.pregunta ? pregunta.pregunta.substring(0, 80) + '...' : 'Sin pregunta'}`);
        console.log(`   - ID: ${pregunta.id}`);
        console.log(`   - Cuestionario ID: ${pregunta.cuestionario_id}`);
        console.log(`   - Tipo: ${pregunta.tipo || 'Sin tipo'}`);
        
        // Mostrar todas las columnas disponibles
        Object.keys(pregunta).forEach(key => {
          if (!['id', 'cuestionario_id', 'pregunta', 'tipo'].includes(key)) {
            console.log(`   - ${key}: ${pregunta[key]}`);
          }
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPreguntasStructure();