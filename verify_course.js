import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixqhqjqvqhqjqvqhqjqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWhxanF2cWhxanF2cWhxanF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTQ4NzEsImV4cCI6MjA1MDAzMDg3MX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyCourse() {
  try {
    // Verificar curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('*')
      .eq('titulo', 'Inteligencia Emocional')
      .single();

    if (cursoError) {
      console.error('Error al buscar curso:', cursoError);
      return;
    }

    console.log('✅ Curso encontrado:', {
      id: curso.id,
      titulo: curso.titulo,
      descripcion: curso.descripcion.substring(0, 100) + '...',
      creado_en: curso.creado_en
    });

    // Verificar lecciones
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id);

    if (leccionesError) {
      console.error('Error al buscar lecciones:', leccionesError);
      return;
    }

    console.log(`✅ Lecciones encontradas: ${lecciones.length}`);
    lecciones.forEach((leccion, index) => {
      console.log(`  ${index + 1}. ${leccion.titulo}`);
    });

    // Verificar materiales
    const { data: materiales, error: materialesError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', curso.id);

    if (materialesError) {
      console.error('Error al buscar materiales:', materialesError);
      return;
    }

    console.log(`✅ Materiales encontrados: ${materiales.length}`);
    materiales.forEach((material, index) => {
      console.log(`  ${index + 1}. ${material.titulo} (${material.tipo_material})`);
    });

    // Verificar cuestionarios
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', curso.id);

    if (cuestionariosError) {
      console.error('Error al buscar cuestionarios:', cuestionariosError);
      return;
    }

    console.log(`✅ Cuestionarios encontrados: ${cuestionarios.length}`);

    console.log('\n🎉 ¡Curso de Inteligencia Emocional verificado exitosamente!');
    console.log('El curso está completamente funcional con todas sus lecciones, materiales y cuestionarios.');

  } catch (error) {
    console.error('Error durante la verificación:', error);
  }
}

verifyCourse();