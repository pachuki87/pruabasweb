import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson1() {
  try {
    // Buscar la lección 1 del curso "Experto en Conductas Adictivas"
    const { data: lesson, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 1)
      .single();

    if (error) {
      console.error('Error al obtener la lección:', error);
      return;
    }

    console.log('Contenido actual de la lección 1:');
    console.log('ID:', lesson.id);
    console.log('Título:', lesson.titulo);
    console.log('Número de lección:', lesson.numero_leccion);
    console.log('Contenido HTML (primeros 500 caracteres):');
    console.log(lesson.contenido_html.substring(0, 500));
    console.log('\n--- Contenido HTML completo ---');
    console.log(lesson.contenido_html);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkLesson1();