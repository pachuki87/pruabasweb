const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usar el service role key para operaciones administrativas
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function addPreguntasColumns() {
  try {
    console.log('🔧 Añadiendo columnas a la tabla preguntas...');
    
    // Primero verificar la estructura actual
    const { data: currentStructure, error: structureError } = await supabase
      .from('preguntas')
      .select('*')
      .limit(1);

    if (structureError) {
      console.error('❌ Error al verificar estructura:', structureError);
      return;
    }

    console.log('📋 Estructura actual detectada:', Object.keys(currentStructure[0] || {}));

    // Crear las columnas usando SQL directo a través de RPC
    console.log('\n🔨 Ejecutando ALTER TABLE para añadir columnas...');
    
    const alterQueries = [
      'ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_a TEXT;',
      'ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_b TEXT;',
      'ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_c TEXT;',
      'ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_d TEXT;',
      'ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS respuesta_correcta VARCHAR(1);'
    ];

    for (const query of alterQueries) {
      console.log(`Ejecutando: ${query}`);
      
      const { data, error } = await supabase.rpc('exec', {
        sql: query
      });

      if (error) {
        console.log(`⚠️  Error con query '${query}':`, error.message);
        // Intentar método alternativo usando fetch directo
        try {
          const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
            },
            body: JSON.stringify({ sql: query })
          });
          
          if (!response.ok) {
            console.log(`❌ Fetch también falló para: ${query}`);
          } else {
            console.log(`✅ Fetch exitoso para: ${query}`);
          }
        } catch (fetchError) {
          console.log(`❌ Error de fetch:`, fetchError.message);
        }
      } else {
        console.log(`✅ Query exitosa: ${query}`);
      }
    }

    // Verificar estructura final
    console.log('\n🔍 Verificando estructura final...');
    const { data: finalStructure, error: finalError } = await supabase
      .from('preguntas')
      .select('*')
      .limit(1);

    if (finalError) {
      console.error('❌ Error al verificar estructura final:', finalError);
    } else {
      console.log('📋 Estructura final:', Object.keys(finalStructure[0] || {}));
    }

    console.log('\n💡 Si las columnas no se añadieron automáticamente, ejecuta manualmente en Supabase SQL Editor:');
    alterQueries.forEach((query, index) => {
      console.log(`${index + 1}. ${query}`);
    });
    console.log('\n🔗 URL: https://supabase.com/dashboard/project/lyojcqiiixkqqtpoejdo/sql');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

addPreguntasColumns();