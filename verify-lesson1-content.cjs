const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLesson1Content() {
    console.log('🔍 Verificando contenido de la lección 1...');
    
    try {
        // Consultar la lección 1
        const { data: lesson, error } = await supabase
            .from('lecciones')
            .select('*')
            .eq('id', '172b9f29-17dd-4c7f-8a98-8c3989e296d8')
            .single();
            
        if (error) {
            console.error('❌ Error al consultar la lección:', error);
            return;
        }
        
        console.log('📊 Información de la lección:');
        console.log('   - ID:', lesson.id);
        console.log('   - Título:', lesson.titulo);
        console.log('   - Número:', lesson.numero);
        console.log('   - Archivo URL:', lesson.archivo_url);
        console.log('   - Contenido HTML presente:', lesson.contenido_html ? 'SÍ' : 'NO');
        console.log('   - Longitud del contenido:', lesson.contenido_html ? lesson.contenido_html.length : 0);
        console.log('   - Activa:', lesson.activa);
        
        if (lesson.contenido_html) {
            console.log('\n✅ La lección tiene contenido HTML');
            console.log('📝 Primeros 200 caracteres del contenido:');
            console.log(lesson.contenido_html.substring(0, 200) + '...');
        } else {
            console.log('\n❌ La lección NO tiene contenido HTML');
            
            // Intentar cargar el contenido desde el archivo local
            const localPath = path.join(__dirname, 'curso_extraido', 'Módulo 1', '01_¿Qué significa ser adicto_', 'contenido.html');
            console.log('\n🔄 Intentando cargar contenido desde:', localPath);
            
            if (fs.existsSync(localPath)) {
                const content = fs.readFileSync(localPath, 'utf8');
                console.log('✅ Archivo local encontrado, longitud:', content.length);
                
                // Actualizar la lección con el contenido
                const { error: updateError } = await supabase
                    .from('lecciones')
                    .update({ 
                        contenido_html: content,
                        archivo_url: null
                    })
                    .eq('id', '172b9f29-17dd-4c7f-8a98-8c3989e296d8');
                    
                if (updateError) {
                    console.error('❌ Error al actualizar:', updateError);
                } else {
                    console.log('✅ Contenido actualizado exitosamente');
                }
            } else {
                console.log('❌ Archivo local no encontrado');
            }
        }
        
    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

verifyLesson1Content();