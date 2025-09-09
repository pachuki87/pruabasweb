const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function addAprobadoColumn() {
  try {
    console.log('🔧 Agregando columna aprobado a intentos_cuestionario...');
    
    // Agregar la columna aprobado
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.intentos_cuestionario 
        ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;
        
        -- Agregar comentario para documentar la columna
        COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';
      `
    });
    
    if (error) {
      console.error('❌ Error al agregar columna aprobado:', error);
    } else {
      console.log('✅ Columna aprobado agregada exitosamente');
      
      // Verificar que la columna se agregó correctamente
      console.log('🔍 Verificando que la columna se agregó...');
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
        console.log('❌ Aún hay errores:', insertError.message);
      } else {
        console.log('✅ Columna aprobado funciona correctamente');
        // Eliminar el registro de prueba
        await supabase
          .from('intentos_cuestionario')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Registro de prueba eliminado');
      }
    }
    
  } catch (err) {
    console.error('❌ Error general:', err);
  }
  
  process.exit(0);
}

addAprobadoColumn();