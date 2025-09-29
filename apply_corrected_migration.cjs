require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyCorrectedMigration() {
  console.log('🔧 Aplicando migración corregida para agregar columna aprobado...');
  
  try {
    // 1. Agregar la columna aprobado
    console.log('📝 Agregando columna aprobado...');
    const { data: addColumn, error: addError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.intentos_cuestionario ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;`
    });
    
    if (addError) {
      console.log('⚠️  Error con exec_sql, intentando con query directo...');
      // Intentar con query directo
      const { error: directError } = await supabase
        .from('intentos_cuestionario')
        .select('aprobado')
        .limit(1);
      
      if (directError && directError.message.includes("Could not find the 'aprobado' column")) {
        console.log('❌ La columna aprobado no existe. Necesitas ejecutar este SQL manualmente en el dashboard de Supabase:');
        console.log('\n--- SQL PARA EJECUTAR MANUALMENTE ---');
        console.log('ALTER TABLE public.intentos_cuestionario ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;');
        console.log('COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS \'Indica si el intento fue aprobatorio (generalmente >= 70%)\';');
        console.log('UPDATE public.intentos_cuestionario SET aprobado = CASE WHEN puntuacion_maxima > 0 AND (puntuacion::FLOAT / puntuacion_maxima::FLOAT) >= 0.7 THEN TRUE ELSE FALSE END WHERE aprobado IS NULL;');
        console.log('--- FIN DEL SQL ---\n');
        return;
      }
    }
    
    // 2. Agregar comentario
    console.log('📝 Agregando comentario...');
    await supabase.rpc('exec_sql', {
      sql: `COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';`
    });
    
    // 3. Actualizar registros existentes usando las columnas correctas
    console.log('📝 Actualizando registros existentes...');
    const { data: updateData, error: updateError } = await supabase.rpc('exec_sql', {
      sql: `UPDATE public.intentos_cuestionario 
            SET aprobado = CASE 
                WHEN puntuacion_maxima > 0 AND (puntuacion::FLOAT / puntuacion_maxima::FLOAT) >= 0.7 THEN TRUE 
                ELSE FALSE 
            END
            WHERE aprobado IS NULL;`
    });
    
    if (updateError) {
      console.log('❌ Error al actualizar registros:', updateError);
    } else {
      console.log('✅ Registros actualizados exitosamente');
    }
    
    // 4. Verificar que la migración fue exitosa
    console.log('\n🔍 Verificando que la migración fue exitosa...');
    const { data: testData, error: testError } = await supabase
      .from('intentos_cuestionario')
      .select('id, aprobado, puntuacion, puntuacion_maxima')
      .limit(5);
    
    if (testError) {
      console.log('❌ Error al verificar:', testError);
    } else {
      console.log('✅ Migración exitosa! Datos de prueba:');
      console.log(testData);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

applyCorrectedMigration();