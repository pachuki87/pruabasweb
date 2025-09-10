require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function inspectTableStructure() {
  console.log('🔍 Inspeccionando estructura real de las tablas...');
  
  try {
    // Obtener información de las tablas desde information_schema
    const tables = ['user_course_progress', 'user_test_results', 'user_course_summary'];
    
    for (const tableName of tables) {
      console.log(`\n📋 Tabla: ${tableName}`);
      console.log('=' .repeat(50));
      
      // Consultar las columnas de la tabla
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: tableName })
        .select();
      
      if (columnsError) {
        console.log(`❌ Error obteniendo columnas con RPC: ${columnsError.message}`);
        
        // Método alternativo: intentar hacer una consulta vacía para ver el error
        console.log('🔄 Intentando método alternativo...');
        
        const { data: emptyResult, error: emptyError } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);
        
        if (emptyError) {
          console.log(`❌ Error en consulta vacía: ${emptyError.message}`);
        } else {
          console.log('✅ Tabla existe pero está vacía');
        }
        
        // Intentar obtener un registro para ver la estructura
        const { data: sampleData, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (sampleError) {
          console.log(`❌ Error obteniendo muestra: ${sampleError.message}`);
        } else if (sampleData && sampleData.length > 0) {
          console.log('✅ Estructura de la muestra:');
          console.log('Columnas encontradas:', Object.keys(sampleData[0]));
          console.log('Datos de muestra:', sampleData[0]);
        } else {
          console.log('⚠️ Tabla vacía, no se puede determinar estructura');
        }
      } else {
        console.log('✅ Columnas obtenidas:', columns);
      }
    }
    
    // Intentar obtener información directamente de PostgreSQL
    console.log('\n🗄️ Intentando consulta directa a information_schema...');
    
    for (const tableName of tables) {
      console.log(`\n📋 Consultando ${tableName} en information_schema...`);
      
      // Usar una consulta SQL directa si es posible
      const { data: schemaInfo, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', tableName)
        .eq('table_schema', 'public');
      
      if (schemaError) {
        console.log(`❌ Error consultando information_schema: ${schemaError.message}`);
      } else if (schemaInfo && schemaInfo.length > 0) {
        console.log('✅ Columnas desde information_schema:');
        schemaInfo.forEach(col => {
          console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
      } else {
        console.log('⚠️ No se encontraron columnas en information_schema');
      }
    }
    
    // Método final: intentar insertar datos con diferentes nombres de columnas
    console.log('\n🧪 Probando inserción con diferentes nombres de columnas...');
    
    // Obtener un usuario para las pruebas
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1);
    
    if (usuariosError || !usuarios || usuarios.length === 0) {
      console.log('❌ No se pudo obtener un usuario para las pruebas');
      return;
    }
    
    const userId = usuarios[0].id;
    console.log(`👤 Usando usuario ID: ${userId}`);
    
    // Obtener un curso para las pruebas
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id')
      .limit(1);
    
    if (cursosError || !cursos || cursos.length === 0) {
      console.log('❌ No se pudo obtener un curso para las pruebas');
      return;
    }
    
    const courseId = cursos[0].id;
    console.log(`📚 Usando curso ID: ${courseId}`);
    
    // Probar diferentes combinaciones para user_course_progress
    console.log('\n🧪 Probando user_course_progress...');
    const progressVariations = [
      { user_id: userId, curso_id: courseId, leccion_id: 'test', progreso: 50 },
      { user_id: userId, course_id: courseId, lesson_id: 'test', progress: 50 },
      { user_id: userId, curso_id: courseId, lesson_id: 'test', progress_percentage: 50 },
      { user_id: userId, course_id: courseId, leccion_id: 'test', progreso_porcentaje: 50 },
      { user_id: userId, curso_id: courseId, leccion_id: 'test', porcentaje_progreso: 50 }
    ];
    
    for (let i = 0; i < progressVariations.length; i++) {
      console.log(`   Probando variación ${i + 1}:`, Object.keys(progressVariations[i]));
      
      const { data: result, error } = await supabase
        .from('user_course_progress')
        .insert(progressVariations[i])
        .select();
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Éxito con variación ${i + 1}:`, result);
        
        // Limpiar el registro de prueba
        await supabase
          .from('user_course_progress')
          .delete()
          .eq('user_id', userId)
          .eq('leccion_id', 'test')
          .eq('lesson_id', 'test');
        
        break;
      }
    }
    
    // Probar diferentes combinaciones para user_course_summary
    console.log('\n🧪 Probando user_course_summary...');
    const summaryVariations = [
      { user_id: userId, curso_id: courseId, progreso: 50 },
      { user_id: userId, course_id: courseId, progress: 50 },
      { user_id: userId, curso_id: courseId, progreso_general: 50 },
      { user_id: userId, course_id: courseId, overall_progress: 50 },
      { user_id: userId, curso_id: courseId }
    ];
    
    for (let i = 0; i < summaryVariations.length; i++) {
      console.log(`   Probando variación ${i + 1}:`, Object.keys(summaryVariations[i]));
      
      const { data: result, error } = await supabase
        .from('user_course_summary')
        .insert(summaryVariations[i])
        .select();
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Éxito con variación ${i + 1}:`, result);
        
        // Limpiar el registro de prueba
        await supabase
          .from('user_course_summary')
          .delete()
          .eq('user_id', userId);
        
        break;
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

inspectTableStructure();