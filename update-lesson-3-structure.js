import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLesson3Structure() {
    try {
        console.log('🔄 Iniciando actualización de la estructura de la lección 3...');
        
        // Leer el archivo HTML actualizado
        const htmlFilePath = path.join(process.cwd(), 'public', 'lessons', 'leccion-3-consecuencias-de-las-adicciones.html');
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        
        console.log('📖 Contenido HTML leído correctamente');
        
        // Actualizar en Supabase
        const { data, error } = await supabase
            .from('lecciones')
            .update({ 
                contenido_html: htmlContent,
                updated_at: new Date().toISOString()
            })
            .eq('numero_leccion', 3)
            .select();
        
        if (error) {
            console.error('❌ Error al actualizar la lección 3:', error);
            return;
        }
        
        if (data && data.length > 0) {
            console.log('✅ Lección 3 actualizada exitosamente en Supabase');
            console.log('📊 Datos actualizados:', {
                id: data[0].id,
                titulo: data[0].titulo,
                numero_leccion: data[0].numero_leccion,
                contenido_length: data[0].contenido_html.length
            });
        } else {
            console.log('⚠️ No se encontró la lección 3 en la base de datos');
        }
        
    } catch (error) {
        console.error('💥 Error durante la actualización:', error);
    }
}

// Ejecutar la actualización
updateLesson3Structure();