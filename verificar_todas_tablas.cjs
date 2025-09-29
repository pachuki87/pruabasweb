require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verificarTodasLasTablas() {
  console.log('🔍 VERIFICANDO TODAS LAS TABLAS DE LA BASE DE DATOS\n');
  
  // Tablas que deberían existir según los tipos TypeScript
  const tablasEsperadas = [
    'usuarios',
    'courses', // ❌ Debería ser 'cursos'
    'chapters', // ❌ Debería ser 'lecciones'
    'quizzes', // ❌ Debería ser 'cuestionarios'
    'inscripciones',
    'study_materials', // ❌ Debería ser 'materiales'
    'user_course_progress',
    'user_test_results'
  ];
  
  // Tablas que realmente existen
  const tablasReales = [
    'usuarios',
    'cursos',
    'lecciones', 
    'cuestionarios',
    'inscripciones',
    'materiales',
    'user_course_progress',
    'user_test_results',
    'preguntas' // Esta tabla existe pero no está en los tipos
  ];
  
  console.log('📋 COMPARACIÓN DE TABLAS:');
  console.log('========================\n');
  
  // Verificar tablas esperadas vs reales
  for (const tabla of tablasEsperadas) {
    const existe = tablasReales.includes(tabla);
    console.log(`${existe ? '✅' : '❌'} ${tabla} ${existe ? '(existe)' : '(NO EXISTE)'}`);
    
    if (!existe) {
      // Buscar tabla equivalente
      const equivalentes = {
        'courses': 'cursos',
        'chapters': 'lecciones',
        'quizzes': 'cuestionarios',
        'study_materials': 'materiales'
      };
      
      if (equivalentes[tabla]) {
        console.log(`   → Debería ser: ${equivalentes[tabla]}`);
      }
    }
  }
  
  console.log('\n📋 TABLAS REALES QUE EXISTEN:');
  console.log('=============================\n');
  
  for (const tabla of tablasReales) {
    console.log(`\n🔍 Verificando tabla: ${tabla}`);
    
    try {
      const { data, error } = await supabase
        .from(tabla)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        continue;
      }
      
      if (data && data.length > 0) {
        const columnas = Object.keys(data[0]);
        console.log(`✅ Columnas (${columnas.length}): ${columnas.join(', ')}`);
      } else {
        console.log('📝 Tabla vacía - obteniendo estructura...');
        
        // Intentar obtener estructura de tabla vacía
        const { error: schemaError } = await supabase
          .from(tabla)
          .select('*')
          .limit(0);
          
        if (schemaError) {
          console.log(`❌ No se pudo obtener estructura: ${schemaError.message}`);
        } else {
          console.log('✅ Tabla existe pero está vacía');
        }
      }
    } catch (err) {
      console.log(`❌ Error procesando: ${err.message}`);
    }
  }
  
  console.log('\n🚨 PROBLEMAS IDENTIFICADOS:');
  console.log('============================\n');
  
  console.log('1. ❌ NOMBRES DE TABLAS INCORRECTOS EN TYPESCRIPT:');
  console.log('   - courses → debería ser cursos');
  console.log('   - chapters → debería ser lecciones');
  console.log('   - quizzes → debería ser cuestionarios');
  console.log('   - study_materials → debería ser materiales\n');
  
  console.log('2. ❌ TABLA FALTANTE EN TYPESCRIPT:');
  console.log('   - preguntas (existe en BD pero no en tipos)\n');
  
  console.log('3. ⚠️  VERIFICAR COLUMNAS ESPECÍFICAS:');
  console.log('   - materiales: url_archivo vs archivo_url');
  console.log('   - lecciones: archivo_url (verificar consistencia)');
  console.log('   - user_test_results: course_id vs curso_id\n');
}

verificarTodasLasTablas().catch(console.error);