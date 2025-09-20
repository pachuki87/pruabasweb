const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixIntentosTable() {
  try {
    console.log('🔧 Aplicando migración para agregar columna aprobado...');
    
    // Agregar columna aprobado
    const addColumnQuery = `
      ALTER TABLE public.intentos_cuestionario 
      ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;
    `;
    
    const { error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: addColumnQuery
    });
    
    if (addColumnError) {
      console.error('❌ Error al agregar columna aprobado:', addColumnError);
    } else {
      console.log('✅ Columna aprobado agregada exitosamente');
    }
    
    // Agregar comentario
    const commentQuery = `
      COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';
    `;
    
    const { error: commentError } = await supabase.rpc('exec_sql', {
      sql: commentQuery
    });
    
    if (commentError) {
      console.error('❌ Error al agregar comentario:', commentError);
    } else {
      console.log('✅ Comentario agregado exitosamente');
    }
    
    // Actualizar registros existentes
    const updateQuery = `
      UPDATE public.intentos_cuestionario 
      SET aprobado = CASE 
          WHEN porcentaje >= 70 THEN TRUE 
          ELSE FALSE 
      END
      WHERE aprobado IS NULL;
    `;
    
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: updateQuery
    });
    
    if (updateError) {
      console.error('❌ Error al actualizar registros:', updateError);
    } else {
      console.log('✅ Registros existentes actualizados');
    }
    
    // Verificar que la columna existe ahora
    console.log('\n🔍 Verificando que la migración fue exitosa...');
    const { data, error } = await supabase
      .from('intentos_cuestionario')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error al verificar tabla:', error);
    } else {
      console.log('✅ Tabla verificada exitosamente');
      if (data && data.length > 0) {
        console.log('📋 Columnas disponibles:', Object.keys(data[0]));
      } else {
        console.log('📋 Tabla existe pero no tiene datos');
      }
    }
    
    // Probar inserción con la nueva columna
    console.log('\n🧪 Probando inserción con columna aprobado...');
    const testInsert = {
      user_id: '00000000-0000-0000-0000-000000000000',
      cuestionario_id: '00000000-0000-0000-0000-000000000000',
      curso_id: '00000000-0000-0000-0000-000000000000',
      aprobado: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('intentos_cuestionario')
      .insert(testInsert)
      .select();
    
    if (insertError) {
      console.error('❌ Error en inserción de prueba:', insertError);
    } else {
      console.log('✅ Inserción de prueba exitosa');
      // Eliminar el registro de prueba
      await supabase
        .from('intentos_cuestionario')
        .delete()
        .eq('id', insertData[0].id);
      console.log('🗑️ Registro de prueba eliminado');
    }
    
  } catch (err) {
    console.error('❌ Error general:', err);
  }
  
  process.exit(0);
}

fixIntentosTable();