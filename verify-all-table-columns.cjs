require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAllTableColumns() {
  console.log('🔍 Verificando estructura de todas las tablas...');
  
  const tables = ['cursos', 'lecciones', 'preguntas', 'cuestionarios', 'user_course_progress', 'inscripciones', 'materiales'];
  
  for (const table of tables) {
    console.log(`\n📋 Tabla: ${table}`);
    
    try {
      // Obtener una muestra de datos para ver las columnas reales
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Error en tabla ${table}:`, error.message);
        continue;
      }
      
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`✅ Columnas encontradas: ${columns.join(', ')}`);
        
        // Verificar si hay referencias problemáticas
        const problematicColumns = columns.filter(col => 
          col.includes('chapter') || col.includes('quiz_id') || col.includes('order_index')
        );
        
        if (problematicColumns.length > 0) {
          console.log(`⚠️  Columnas problemáticas: ${problematicColumns.join(', ')}`);
        }
      } else {
        console.log('📝 Tabla vacía, obteniendo estructura desde información del esquema...');
        
        // Intentar obtener estructura de otra manera
        const { data: schemaData, error: schemaError } = await supabase
          .from(table)
          .select('*')
          .limit(0);
          
        if (schemaError) {
          console.error(`❌ No se pudo acceder a la estructura de ${table}`);
        }
      }
    } catch (err) {
      console.error(`❌ Error procesando tabla ${table}:`, err.message);
    }
  }
  
  // Verificar específicamente preguntas para entender los tipos
  console.log('\n🔍 Verificando tipos de preguntas...');
  try {
    const { data: preguntas, error } = await supabase
      .from('preguntas')
      .select('tipo, pregunta, cuestionario_id')
      .limit(10);
      
    if (error) {
      console.error('❌ Error obteniendo preguntas:', error.message);
    } else if (preguntas) {
      const tipos = [...new Set(preguntas.map(p => p.tipo))];
      console.log(`📝 Tipos de preguntas encontrados: ${tipos.join(', ')}`);
      
      preguntas.forEach((p, i) => {
        console.log(`${i + 1}. Tipo: ${p.tipo} | Cuestionario: ${p.cuestionario_id} | Pregunta: ${p.pregunta?.substring(0, 50)}...`);
      });
    }
  } catch (err) {
    console.error('❌ Error verificando tipos de preguntas:', err.message);
  }
}

verifyAllTableColumns().catch(console.error);