import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'No encontrada');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Configurada' : 'No encontrada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLesson1() {
  try {
    console.log('🔍 Verificando contenido de la lección 1...');
    
    // Primero, buscar el curso
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .ilike('titulo', '%experto%conductas%adictivas%');
    
    if (cursosError) {
      console.error('❌ Error al buscar curso:', cursosError);
      return;
    }
    
    if (!cursos || cursos.length === 0) {
      console.log('❌ No se encontró el curso "Experto en Conductas Adictivas"');
      return;
    }
    
    const curso = cursos[0];
    console.log('✅ Curso encontrado:', curso.titulo, '(ID:', curso.id + ')');
    
    // Buscar la lección 1
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html, orden')
      .eq('curso_id', curso.id)
      .eq('orden', 1);
    
    if (leccionesError) {
      console.error('❌ Error al buscar lección 1:', leccionesError);
      return;
    }
    
    if (!lecciones || lecciones.length === 0) {
      console.log('❌ No se encontró la lección 1 para este curso');
      return;
    }
    
    const leccion1 = lecciones[0];
    console.log('\n📖 LECCIÓN 1 ENCONTRADA:');
    console.log('ID:', leccion1.id);
    console.log('Título:', leccion1.titulo);
    console.log('Orden:', leccion1.orden);
    console.log('\n📝 CONTENIDO HTML ACTUAL:');
    console.log('Longitud del contenido:', leccion1.contenido_html?.length || 0, 'caracteres');
    console.log('\n--- INICIO DEL CONTENIDO ---');
    console.log(leccion1.contenido_html || 'Sin contenido');
    console.log('--- FIN DEL CONTENIDO ---\n');
    
    // Verificar si contiene el contenido esperado
    const contenido = leccion1.contenido_html || '';
    const tieneDefinicion = contenido.includes('DEFINICIÓN DE SER ADICTO');
    const tieneOrigen = contenido.includes('ORIGEN');
    const tieneDolorEmocional = contenido.includes('DOLOR EMOCIONAL');
    const tieneIcono = contenido.includes('pill') || contenido.includes('medicine');
    
    console.log('🔍 VERIFICACIÓN DE CONTENIDO ESPERADO:');
    console.log('✓ Contiene "DEFINICIÓN DE SER ADICTO":', tieneDefinicion ? '✅' : '❌');
    console.log('✓ Contiene "ORIGEN":', tieneOrigen ? '✅' : '❌');
    console.log('✓ Contiene "DOLOR EMOCIONAL":', tieneDolorEmocional ? '✅' : '❌');
    console.log('✓ Contiene icono (pill/medicine):', tieneIcono ? '✅' : '❌');
    
    if (tieneDefinicion && tieneOrigen && tieneDolorEmocional) {
      console.log('\n✅ El contenido parece estar actualizado correctamente en Supabase');
    } else {
      console.log('\n❌ El contenido NO tiene el formato esperado');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyLesson1();