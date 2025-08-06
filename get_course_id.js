import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener credenciales de Supabase
async function getCourseId() {
    try {
        
        // Leer el archivo .env si existe
        let supabaseUrl = '';
        let supabaseKey = '';
        
        try {
            const envPath = path.join(__dirname, '.env');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
                const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
                
                if (urlMatch) supabaseUrl = urlMatch[1].trim();
                if (keyMatch) supabaseKey = keyMatch[1].trim();
            }
        } catch (err) {
            console.log('No se pudo leer el archivo .env, usando valores por defecto');
        }
        
        if (!supabaseUrl || !supabaseKey) {
            console.log('❌ No se encontraron las credenciales de Supabase');
            console.log('Por favor, verifica que el archivo .env contenga:');
            console.log('VITE_SUPABASE_URL=tu_url_de_supabase');
            console.log('VITE_SUPABASE_ANON_KEY=tu_clave_anonima');
            return;
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('🔍 Buscando el curso "Experto en Conductas Adictivas"...');
        
        const { data, error } = await supabase
            .from('cursos')
            .select('id, titulo, descripcion')
            .eq('titulo', 'Experto en Conductas Adictivas')
            .single();
        
        if (error) {
            console.error('❌ Error al buscar el curso:', error);
            return;
        }
        
        if (data) {
            console.log('✅ Curso encontrado:');
            console.log('📚 Título:', data.titulo);
            console.log('🆔 ID del curso:', data.id);
            console.log('📝 Descripción:', data.descripcion?.substring(0, 100) + '...');
            console.log('');
            console.log('🔗 URL para acceder al curso:');
            console.log(`http://localhost:5173/student/courses/${data.id}`);
        } else {
            console.log('❌ No se encontró el curso "Experto en Conductas Adictivas"');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

getCourseId();