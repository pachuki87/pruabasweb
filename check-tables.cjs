const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 Verificando qué tablas existen en la base de datos...');
  
  try {
    // Intentar acceder directamente a las tablas que sabemos que deberían existir
    const tablesToCheck = ['inscripciones', 'lecciones', 'materiales', 'cuestionarios', 'cursos', 'usuarios'];
    
    for (const table of tablesToCheck) {
      console.log(`\n📊 Verificando tabla: ${table}`);
      
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Error accediendo a ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table} existe y es accesible`);
          if (data && data.length > 0) {
            console.log(`   📋 Columnas encontradas: ${Object.keys(data[0]).join(', ')}`);
            
            // Verificar específicamente course_id y curso_id
            const columns = Object.keys(data[0]);
            const hasCourseId = columns.includes('course_id');
            const hasCursoId = columns.includes('curso_id');
            
            if (hasCourseId || hasCursoId) {
              console.log(`   🎯 Columnas relevantes: course_id=${hasCourseId ? '✅' : '❌'}, curso_id=${hasCursoId ? '✅' : '❌'}`);
            }
          } else {
            console.log(`   📝 ${table} existe pero está vacía`);
          }
        }
      } catch (err) {
        console.log(`   ❌ Error: ${err.message}`);
      }
    }
    
    console.log('\n🔍 Intentando listar todas las tablas disponibles...');
    
    // Intentar obtener lista de todas las tablas
    try {
      const { data: allTables, error: tablesError } = await supabase
        .rpc('get_schema_tables');
      
      if (tablesError) {
        console.log(`   ❌ No se pudo obtener lista de tablas: ${tablesError.message}`);
      } else {
        console.log(`   ✅ Tablas encontradas: ${allTables}`);
      }
    } catch (err) {
      console.log(`   ❌ Error obteniendo lista de tablas: ${err.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
checkTables();