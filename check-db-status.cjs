require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkDatabaseStatus() {
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

        // Obtener todas las lecciones
        const { data: lecciones, error: leccionesError } = await supabase
            .from('lecciones')
            .select('id, titulo, orden, archivo_url, contenido_html')
            .eq('curso_id', curso.id)
            .order('orden');

        if (leccionesError) {
            console.error('Error al obtener lecciones:', leccionesError);
            return;
        }

        console.log('\n📚 Estado actual de las lecciones:');
        console.log('='.repeat(60));
        
        lecciones.forEach(leccion => {
            const tieneUrl = leccion.archivo_url ? '✅' : '❌';
            const tieneContenido = leccion.contenido_html ? '✅' : '❌';
            
            console.log(`Lección ${leccion.orden}: ${leccion.titulo}`);
            console.log(`  - Archivo URL: ${tieneUrl} ${leccion.archivo_url || 'SIN URL'}`);
            console.log(`  - Contenido HTML: ${tieneContenido}`);
            console.log('');
        });

        console.log(`Total de lecciones: ${lecciones.length}`);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDatabaseStatus();