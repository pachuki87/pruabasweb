import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugFrontendCache() {
  try {
    console.log('🔍 Verificando conexión frontend-Supabase...');
    
    // Simular la misma consulta que hace el frontend
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%experto%conductas%adictivas%');
    
    if (cursosError) {
      console.error('❌ Error al buscar curso:', cursosError);
      return;
    }
    
    if (!cursos || cursos.length === 0) {
      console.log('❌ No se encontró el curso');
      return;
    }
    
    const curso = cursos[0];
    console.log('✅ Curso encontrado:', curso.titulo, '(ID:', curso.id + ')');
    
    // Simular la consulta de lecciones que hace el frontend
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .order('orden', { ascending: true });
    
    if (leccionesError) {
      console.error('❌ Error al buscar lecciones:', leccionesError);
      return;
    }
    
    console.log('\n📖 LECCIONES ENCONTRADAS:', lecciones.length);
    
    // Verificar específicamente la lección 1
    const leccion1 = lecciones.find(l => l.orden === 1);
    if (leccion1) {
      console.log('\n🎯 LECCIÓN 1 (la que debería mostrar cambios):');
      console.log('ID:', leccion1.id);
      console.log('Título:', leccion1.titulo);
      console.log('Orden:', leccion1.orden);
      console.log('Archivo URL:', leccion1.archivo_url || 'No definida');
      console.log('Contenido HTML presente:', !!leccion1.contenido_html);
      console.log('Longitud contenido HTML:', leccion1.contenido_html?.length || 0);
      
      // Verificar contenido específico
      const contenido = leccion1.contenido_html || '';
      const tieneDefinicion = contenido.includes('DEFINICIÓN DE SER ADICTO');
      const tieneOrigen = contenido.includes('ORIGEN');
      const tieneDolorEmocional = contenido.includes('DOLOR EMOCIONAL');
      
      console.log('\n🔍 CONTENIDO VERIFICADO:');
      console.log('✓ Contiene "DEFINICIÓN DE SER ADICTO":', tieneDefinicion ? '✅' : '❌');
      console.log('✓ Contiene "ORIGEN":', tieneOrigen ? '✅' : '❌');
      console.log('✓ Contiene "DOLOR EMOCIONAL":', tieneDolorEmocional ? '✅' : '❌');
      
      // Mostrar una muestra del contenido
      console.log('\n📝 MUESTRA DEL CONTENIDO (primeros 500 caracteres):');
      console.log(contenido.substring(0, 500) + '...');
      
      if (tieneDefinicion && tieneOrigen && tieneDolorEmocional) {
        console.log('\n✅ EL CONTENIDO ESTÁ CORRECTO EN SUPABASE');
        console.log('🔧 POSIBLES CAUSAS DEL PROBLEMA:');
        console.log('   1. Caché del navegador');
        console.log('   2. El frontend no está refrescando los datos');
        console.log('   3. Problemas de conexión en tiempo real');
        console.log('   4. El componente LessonViewer no está re-renderizando');
        
        console.log('\n🛠️ SOLUCIONES RECOMENDADAS:');
        console.log('   1. Hacer hard refresh en el navegador (Ctrl+F5)');
        console.log('   2. Limpiar caché del navegador');
        console.log('   3. Verificar que no hay errores en la consola del navegador');
        console.log('   4. Reiniciar el servidor de desarrollo');
      } else {
        console.log('\n❌ EL CONTENIDO NO ESTÁ ACTUALIZADO EN SUPABASE');
        console.log('🔧 Necesitamos actualizar el contenido nuevamente');
      }
    } else {
      console.log('❌ No se encontró la lección 1');
    }
    
    // Verificar timestamp de última actualización
    console.log('\n⏰ TIMESTAMPS DE ACTUALIZACIÓN:');
    lecciones.forEach(leccion => {
      if (leccion.orden <= 3) { // Solo mostrar las primeras 3 lecciones
        console.log(`   Lección ${leccion.orden}: ${leccion.updated_at || 'No disponible'}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugFrontendCache();