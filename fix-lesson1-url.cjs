require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixLesson1URL() {
    try {
        // Buscar el curso
        const { data: curso, error: cursoError } = await supabase
            .from('cursos')
            .select('id')
            .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
            .single();

        if (cursoError) {
            console.error('Error al buscar curso:', cursoError);
            return;
        }

        console.log('✅ Curso encontrado:', curso.id);

        // Buscar la lección 1 específicamente
        const { data: leccion1, error: leccionError } = await supabase
            .from('lecciones')
            .select('id, titulo, orden, archivo_url')
            .eq('curso_id', curso.id)
            .eq('orden', 1)
            .single();

        if (leccionError) {
            console.error('Error al buscar lección 1:', leccionError);
            return;
        }

        console.log('📚 Lección 1 encontrada:', leccion1);

        // Actualizar usando el ID específico
        const { data, error } = await supabase
            .from('lecciones')
            .update({ 
                archivo_url: '/lessons/leccion-1-fundamentos-p-terapeutico.html'
            })
            .eq('id', leccion1.id)
            .select();

        if (error) {
            console.error('Error al actualizar:', error);
            return;
        }

        console.log('✅ Actualización exitosa:', data);
        
        // Verificar la actualización final
        const { data: verificacion } = await supabase
            .from('lecciones')
            .select('titulo, orden, archivo_url')
            .eq('id', leccion1.id)
            .single();
            
        console.log('📋 Verificación final:', verificacion);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

fixLesson1URL();