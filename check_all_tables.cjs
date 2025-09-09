require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllTables() {
  try {
    console.log('🔄 Conectando a Supabase...');
    console.log('🔍 Verificando todas las tablas relevantes...\n');
    
    // Lista de tablas a verificar
    const tables = [
      'cursos',
      'lecciones', 
      'inscripciones',
      'user_course_progress',
      'user_course_summary',
      'materiales',
      'cuestionarios'
    ];
    
    for (const table of tables) {
      console.log(`📊 Tabla: ${table}`);
      
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
        } else {
          console.log(`   ✅ Registros: ${count || 0}`);
          
          // Si hay datos, mostrar una muestra
          if (count > 0) {
            const { data: sampleData, error: sampleError } = await supabase
              .from(table)
              .select('*')
              .limit(3);
            
            if (!sampleError && sampleData && sampleData.length > 0) {
              console.log(`   📝 Columnas: ${Object.keys(sampleData[0]).join(', ')}`);
            }
          }
        }
      } catch (err) {
        console.log(`   ❌ Error de conexión: ${err.message}`);
      }
      
      console.log('');
    }
    
    // Verificar inscripciones específicamente
    console.log('🎯 Verificando inscripciones con detalles...');
    try {
      const { data: inscripciones, error } = await supabase
        .from('inscripciones')
        .select(`
          *,
          cursos(id, titulo),
          profiles(id, email)
        `)
        .limit(5);
      
      if (error) {
        console.log(`❌ Error en inscripciones: ${error.message}`);
      } else {
        console.log(`✅ Inscripciones con relaciones: ${inscripciones?.length || 0}`);
        if (inscripciones && inscripciones.length > 0) {
          console.log('📝 Muestra:', JSON.stringify(inscripciones[0], null, 2));
        }
      }
    } catch (err) {
      console.log(`❌ Error verificando inscripciones: ${err.message}`);
    }
    
    console.log('\n🏁 Verificación completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkAllTables();