require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function updateLesson1URL() {
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

        // Actualizar la URL de la Lección 1
        const { data, error } = await supabase
            .from('lecciones')
            .update({ 
                archivo_url: '/lessons/leccion-1-fundamentos-p-terapeutico.html'
            })
            .eq('curso_id', curso.id)
            .eq('orden', 1)
            .select();

        if (error) {
            console.error('Error al actualizar:', error);
            return;
        }

        console.log('✅ URL actualizada para Lección 1:', data);
        
        // Verificar la actualización
        const { data: verificacion } = await supabase
            .from('lecciones')
            .select('titulo, orden, archivo_url')
            .eq('curso_id', curso.id)
            .eq('orden', 1)
            .single();
            
        console.log('📋 Verificación:', verificacion);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

updateLesson1URL();