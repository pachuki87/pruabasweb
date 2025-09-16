const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingQuestions() {
  console.log('🔍 Verificando preguntas existentes en toda la base de datos...');
  
  // Buscar CUALQUIER pregunta existente para ver el formato
  const { data: allQuestions, error } = await supabase
    .from('preguntas')
    .select('*')
    .limit(5);
    
  if (error) {
    console.error('❌ Error consultando preguntas:', error);
    return;
  }
  
  console.log(`\n📋 Encontradas ${allQuestions?.length || 0} preguntas en total:`);
  
  if (allQuestions && allQuestions.length > 0) {
    allQuestions.forEach((q, i) => {
      console.log(`\n${i + 1}. ID: ${q.id}`);
      console.log(`   Cuestionario: ${q.cuestionario_id}`);
      console.log(`   Lección: ${q.leccion_id}`);
      console.log(`   Pregunta: ${q.pregunta || 'undefined'}`);
      console.log(`   Tipo: ${q.tipo}`);
      console.log(`   Orden: ${q.orden}`);
      console.log(`   Creado: ${q.creado_en}`);
      console.log(`   Todas las columnas:`, Object.keys(q));
    });
  } else {
    console.log('❌ No hay preguntas en la base de datos');
  }
  
  // Verificar también cuestionarios
  console.log('\n🎯 Verificando cuestionarios...');
  const { data: quizzes } = await supabase
    .from('cuestionarios')
    .select('*')
    .limit(3);
    
  console.log(`\n📝 Cuestionarios encontrados: ${quizzes?.length || 0}`);
  quizzes?.forEach((q, i) => {
    console.log(`${i + 1}. ${q.titulo} (ID: ${q.id})`);
    console.log(`   Curso: ${q.curso_id}`);
    console.log(`   Lección: ${q.leccion_id}`);
  });
}

checkExistingQuestions().catch(console.error);