const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson1() {
    try {
        console.log('🔧 Corrigiendo URL de la lección 1...');

        const { error } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-1-fundamentos-terapeuticos.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%FUNDAMENTOS P TERAPEUTICO%')
            .eq('orden', 1);

        if (error) {
            console.error('❌ Error actualizando lección 1:', error);
        } else {
            console.log('✅ Lección 1 corregida correctamente');
        }

        // Verificar la actualización
        console.log('\n🔍 Verificando corrección...');
        const { data: lesson, error: verifyError } = await supabase
            .from('lecciones')
            .select('id, titulo, orden, archivo_url, actualizado_en')
            .like('titulo', '%FUNDAMENTOS P TERAPEUTICO%')
            .eq('orden', 1)
            .single();

        if (verifyError) {
            console.error('❌ Error verificando corrección:', verifyError);
        } else {
            console.log('✅ Lección 1 verificada:');
            console.log(`   Título: ${lesson.titulo}`);
            console.log(`   URL: ${lesson.archivo_url}`);
            console.log(`   Actualizado: ${lesson.actualizado_en}`);
        }

        console.log('🎉 ¡Corrección completada!');

    } catch (error) {
        console.error('❌ Error inesperado:', error);
        process.exit(1);
    }
}

// Ejecutar la corrección
fixLesson1();
