const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  try {
    console.log('🔧 Aplicando migración directamente con SQL...');
    
    // Usar el método sql() para ejecutar SQL raw
    const { data, error } = await supabase
      .from('intentos_cuestionario')
      .select('*')
      .limit(0); // Solo para obtener la estructura
    
    if (error) {
      console.error('❌ Error al conectar con la tabla:', error);
      return;
    }
    
    console.log('✅ Conexión exitosa con la tabla intentos_cuestionario');
    
    // Intentar agregar la columna usando una consulta directa
    // Primero verificamos si la columna ya existe
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'intentos_cuestionario' })
      .single();
    
    if (columnsError) {
      console.log('⚠️ No se pudo verificar columnas existentes, continuando...');
    }
    
    // Como no podemos usar exec_sql, vamos a intentar una inserción de prueba
    // para ver si la columna existe
    console.log('🧪 Verificando si la columna aprobado existe...');
    
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000',
      cuestionario_id: '00000000-0000-0000-0000-000000000000', 
      curso_id: '00000000-0000-0000-0000-000000000000',
      aprobado: true
    };
    
    const { data: insertTest, error: insertError } = await supabase
      .from('intentos_cuestionario')
      .insert(testData)
      .select();
    
    if (insertError) {
      if (insertError.message.includes("'aprobado' column")) {
        console.log('❌ La columna aprobado NO existe. Necesita ser agregada manualmente.');
        console.log('\n📋 SQL para ejecutar manualmente en Supabase Dashboard:');
        console.log('---------------------------------------------------');
        console.log('ALTER TABLE public.intentos_cuestionario');
        console.log('ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;');
        console.log('');
        console.log("COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';");
        console.log('');
        console.log('UPDATE public.intentos_cuestionario');
        console.log('SET aprobado = CASE');
        console.log('    WHEN porcentaje >= 70 THEN TRUE');
        console.log('    ELSE FALSE');
        console.log('END');
        console.log('WHERE aprobado IS NULL;');
        console.log('---------------------------------------------------');
        console.log('\n🔗 Ve a: https://supabase.com/dashboard/project/lyojcqiiixkqqtpoejdo/sql');
        console.log('📝 Copia y pega el SQL de arriba en el editor SQL');
        console.log('▶️ Ejecuta la consulta');
      } else {
        console.error('❌ Error diferente en inserción:', insertError);
      }
    } else {
      console.log('✅ La columna aprobado YA existe!');
      // Eliminar el registro de prueba
      await supabase
        .from('intentos_cuestionario')
        .delete()
        .eq('id', insertTest[0].id);
      console.log('🗑️ Registro de prueba eliminado');
    }
    
  } catch (err) {
    console.error('❌ Error general:', err);
  }
  
  process.exit(0);
}

applyMigration();