require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualSchema() {
  try {
    console.log('🔍 Verificando esquema real de las tablas...');
    
    // Verificar user_course_progress con diferentes combinaciones de columnas
    const possibleColumns = [
      'id',
      'user_id', 'usuario_id',
      'course_id', 'curso_id', 
      'chapter_id', 'leccion_id',
      'progress_percentage', 'progreso',
      'is_completed', 'completed', 'completado',
      'last_accessed_at', 'ultimo_acceso',
      'time_spent_minutes', 'tiempo_minutos',
      'created_at', 'updated_at'
    ];
    
    console.log('\n📋 Probando columnas básicas...');
    
    // Probar columnas una por una
    for (const col of possibleColumns) {
      try {
        const { data, error } = await supabase
          .from('user_course_progress')
          .select(col)
          .limit(1);
        
        if (!error) {
          console.log(`✅ Columna '${col}' existe`);
        }
      } catch (e) {
        // Columna no existe
      }
    }
    
    console.log('\n🔍 Intentando insertar con columnas básicas...');
    
    // Intentar insertar solo con id
    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .insert({})
        .select();
      
      if (error) {
        console.log('❌ Error al insertar vacío:', error.message);
        
        // El error nos puede dar pistas sobre qué columnas son requeridas
        if (error.message.includes('null value in column')) {
          console.log('💡 Columnas requeridas detectadas en el error');
        }
      } else {
        console.log('✅ Inserción vacía exitosa:', data);
      }
    } catch (e) {
      console.log('❌ Error en inserción:', e.message);
    }
    
    console.log('\n🔍 Verificando otras tablas relacionadas...');
    
    // Verificar user_test_results
    const { data: testResults, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ user_test_results error:', testError.message);
    } else {
      console.log('✅ user_test_results existe:', testResults?.length || 0, 'registros');
      if (testResults && testResults.length > 0) {
        console.log('📋 Columnas user_test_results:', Object.keys(testResults[0]));
      }
    }
    
    // Verificar si existe alguna tabla de progreso con otro nombre
    const alternativeNames = [
      'progreso_usuario',
      'user_progress', 
      'student_progress',
      'course_progress',
      'progreso_curso'
    ];
    
    console.log('\n🔍 Buscando tablas alternativas...');
    for (const tableName of alternativeNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          console.log(`✅ Tabla '${tableName}' encontrada con ${data?.length || 0} registros`);
          if (data && data.length > 0) {
            console.log(`📋 Columnas de ${tableName}:`, Object.keys(data[0]));
          }
        }
      } catch (e) {
        // Tabla no existe
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkActualSchema();