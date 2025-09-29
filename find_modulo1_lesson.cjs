require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ No encontrada');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configurada' : '❌ No encontrada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findModulo1Lesson() {
  try {
    console.log('🔍 Buscando lecciones del Máster en Adicciones...');
    
    const { data: lecciones, error } = await supabase
      .from('lecciones')
      .select('id, titulo, descripcion, orden')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden');
    
    if (error) {
      console.error('❌ Error al buscar lecciones:', error);
      return;
    }
    
    console.log('📚 Lecciones encontradas:');
    lecciones.forEach(leccion => {
      console.log(`- ID: ${leccion.id}`);
      console.log(`  Título: ${leccion.titulo}`);
      console.log(`  Orden: ${leccion.orden}`);
      console.log(`  Descripción: ${leccion.descripcion || 'Sin descripción'}`);
      console.log('---');
    });
    
    // Buscar específicamente la lección del MÓDULO 1
    const modulo1 = lecciones.find(l => 
      l.titulo.toLowerCase().includes('fundamentos') || 
      l.titulo.toLowerCase().includes('terapeutico') ||
      l.orden === 1
    );
    
    if (modulo1) {
      console.log('🎯 MÓDULO 1 encontrado:');
      console.log(`ID: ${modulo1.id}`);
      console.log(`Título: ${modulo1.titulo}`);
    } else {
      console.log('❌ No se encontró la lección del MÓDULO 1');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findModulo1Lesson();