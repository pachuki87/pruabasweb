require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Usar service key si está disponible, sino anon key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixQuizPermissions() {
  try {
    console.log('🔧 Aplicando permisos para tablas de cuestionarios...');
    
    // Crear políticas que permitan INSERT para usuarios autenticados
    const policies = [
      {
        name: 'Enable insert for authenticated users on preguntas',
        sql: `
          DROP POLICY IF EXISTS "Enable insert for authenticated users" ON preguntas;
          CREATE POLICY "Enable insert for authenticated users" ON preguntas
            FOR INSERT TO authenticated WITH CHECK (true);
        `
      },
      {
        name: 'Enable insert for authenticated users on opciones_respuesta',
        sql: `
          DROP POLICY IF EXISTS "Enable insert for authenticated users" ON opciones_respuesta;
          CREATE POLICY "Enable insert for authenticated users" ON opciones_respuesta
            FOR INSERT TO authenticated WITH CHECK (true);
        `
      },
      {
        name: 'Enable insert for authenticated users on cuestionarios',
        sql: `
          DROP POLICY IF EXISTS "Enable insert for authenticated users" ON cuestionarios;
          CREATE POLICY "Enable insert for authenticated users" ON cuestionarios
            FOR INSERT TO authenticated WITH CHECK (true);
        `
      }
    ];
    
    for (const policy of policies) {
      console.log(`\n📝 Aplicando: ${policy.name}`);
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: policy.sql
      });
      
      if (error) {
        console.log(`❌ Error en ${policy.name}:`, error.message);
      } else {
        console.log(`✅ ${policy.name} aplicada correctamente`);
      }
    }
    
    // Probar inserción
    console.log('\n🧪 Probando inserción de pregunta de prueba...');
    const { data: testQuestion, error: testError } = await supabase
      .from('preguntas')
      .insert({
        cuestionario_id: '7a52daad-db71-4cb5-8701-967fffbb6966',
        pregunta: 'Pregunta de prueba',
        tipo: 'multiple_choice',
        orden: 999
      })
      .select('id')
      .single();
    
    if (testError) {
      console.log('❌ Error en prueba de inserción:', testError.message);
    } else {
      console.log('✅ Prueba de inserción exitosa, ID:', testQuestion.id);
      
      // Limpiar pregunta de prueba
      await supabase.from('preguntas').delete().eq('id', testQuestion.id);
      console.log('🧹 Pregunta de prueba eliminada');
    }
    
  } catch (error) {
    console.log('💥 Error general:', error.message);
  }
}

// Ejecutar
fixQuizPermissions().then(() => {
  console.log('\n🎉 Proceso de permisos completado');
  process.exit(0);
});