const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson1ArchivoUrl() {
    try {
        console.log('🔧 Eliminando archivo_url de la lección 1 para usar contenido de base de datos...');
        
        // Buscar la lección 1 del curso "Experto en Conductas Adictivas"
        const { data: course } = await supabase
            .from('cursos')
            .select('id')
            .eq('titulo', 'Experto en Conductas Adictivas')
            .single();
            
        if (!course) {
            console.error('❌ Curso no encontrado');
            return;
        }
        
        console.log('📚 Curso encontrado:', course.id);
        
        // Buscar la lección 1 (orden = 1)
        const { data: lesson } = await supabase
            .from('lecciones')
            .select('id, titulo, archivo_url')
            .eq('curso_id', course.id)
            .eq('orden', 1)
            .single();
            
        if (!lesson) {
            console.error('❌ Lección 1 no encontrada');
            return;
        }
        
        console.log('📝 Lección 1 encontrada:');
        console.log('   ID:', lesson.id);
        console.log('   Título:', lesson.titulo);
        console.log('   archivo_url actual:', lesson.archivo_url);
        
        // Eliminar el archivo_url (establecerlo como null)
        const { data, error } = await supabase
            .from('lecciones')
            .update({ archivo_url: null })
            .eq('id', lesson.id)
            .select();
            
        if (error) {
            console.error('❌ Error actualizando lección:', error);
            return;
        }
        
        console.log('✅ archivo_url eliminado exitosamente');
        console.log('📄 Ahora la lección usará el contenido_html de la base de datos');
        
        // Verificar el cambio
        const { data: updatedLesson } = await supabase
            .from('lecciones')
            .select('archivo_url, contenido_html')
            .eq('id', lesson.id)
            .single();
            
        console.log('\n🔍 Verificación:');
        console.log('   archivo_url:', updatedLesson.archivo_url);
        console.log('   contenido_html length:', updatedLesson.contenido_html?.length || 0);
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

fixLesson1ArchivoUrl();