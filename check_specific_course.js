import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificCourse() {
  const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
  
  console.log(`Verificando si el curso con ID ${courseId} existe...`);
  
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error('Error al buscar el curso:', error);
      return;
    }
    
    if (data) {
      console.log('✅ Curso encontrado:');
      console.log('ID:', data.id);
      console.log('Título:', data.titulo);
      console.log('Descripción:', data.descripcion || 'No tiene descripción');
      console.log('Imagen URL:', data.imagen_url || 'No tiene imagen');
      console.log('Precio:', data.precio || 'No tiene precio');
      console.log('Estado:', data.estado || 'No tiene estado');
    } else {
      console.log('❌ Curso no encontrado en la base de datos');
    }
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

// También verificar todos los cursos para tener contexto
async function checkAllCourses() {
  console.log('\n--- Listado de todos los cursos ---');
  
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select('id, titulo');
    
    if (error) {
      console.error('Error al obtener cursos:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log(`Total de cursos encontrados: ${data.length}`);
      data.forEach(curso => {
        console.log(`- ${curso.id}: ${curso.titulo}`);
      });
    } else {
      console.log('No se encontraron cursos en la base de datos');
    }
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

async function main() {
  await checkSpecificCourse();
  await checkAllCourses();
}

main();
