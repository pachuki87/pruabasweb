import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function verifyLesson() {
    try {
        // Buscar la lección 1 por título
        const { data: lecciones, error } = await supabase
            .from('lecciones')
            .select('*')
            .ilike('titulo', '%adicto%');
        
        if (error) {
            console.log('Error:', error);
            return;
        }
        
        if (lecciones && lecciones.length > 0) {
            const leccion1 = lecciones[0];
            console.log('ID de la lección 1:', leccion1.id);
            console.log('Título:', leccion1.titulo);
            console.log('Contenido HTML (primeros 300 caracteres):');
            console.log(leccion1.contenido_html?.substring(0, 300) + '...');
        } else {
            console.log('No se encontró la lección 1');
        }
    } catch (err) {
        console.log('Error de conexión:', err);
    }
}

verifyLesson();