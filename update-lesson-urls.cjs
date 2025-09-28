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

async function updateLessonUrls() {
    try {
        console.log('🔄 Actualizando URLs de archivos HTML para las lecciones...');

        // Actualizar lección 1: Fundamentos Terapéuticos
        console.log('📚 Actualizando lección 1: Fundamentos Terapéuticos...');
        const { error: error1 } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-1-fundamentos-terapeuticos.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%FUNDAMENTOS P TERAPEUTICO%')
            .eq('orden', 1);

        if (error1) {
            console.error('❌ Error actualizando lección 1:', error1);
        } else {
            console.log('✅ Lección 1 actualizada correctamente');
        }

        // Actualizar lección 2: Terapia Cognitiva
        console.log('📚 Actualizando lección 2: Terapia Cognitiva...');
        const { error: error2 } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-2-terapia-cognitiva.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%TERAPIA COGNITIVA DROGODEPENDENENCIAS%')
            .eq('orden', 2);

        if (error2) {
            console.error('❌ Error actualizando lección 2:', error2);
        } else {
            console.log('✅ Lección 2 actualizada correctamente');
        }

        // Actualizar lección 3: Familia y Trabajo en Equipo
        console.log('📚 Actualizando lección 3: Familia y Trabajo en Equipo...');
        const { error: error3 } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-3-familia-trabajo-equipo.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%FAMILIA Y TRABAJO EQUIPO%')
            .eq('orden', 3);

        if (error3) {
            console.error('❌ Error actualizando lección 3:', error3);
        } else {
            console.log('✅ Lección 3 actualizada correctamente');
        }

        // Actualizar lección 4: Recovery Coaching
        console.log('📚 Actualizando lección 4: Recovery Coaching...');
        const { error: error4 } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-4-recovery-coaching.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%RECOVERY COACHING%')
            .eq('orden', 4);

        if (error4) {
            console.error('❌ Error actualizando lección 4:', error4);
        } else {
            console.log('✅ Lección 4 actualizada correctamente');
        }

        // Actualizar lección 5: Psicología de las Adicciones
        console.log('📚 Actualizando lección 5: Psicología de las Adicciones...');
        const { error: error5 } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-5-psicologia-adicciones.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%PSICOLOGIA APLICADA ADICCIONES%')
            .eq('orden', 5);

        if (error5) {
            console.error('❌ Error actualizando lección 5:', error5);
        } else {
            console.log('✅ Lección 5 actualizada correctamente');
        }

        // Actualizar lección 6: Gestión desde Perspectiva de Género
        console.log('📚 Actualizando lección 6: Gestión desde Perspectiva de Género...');
        const { error: error6 } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-6-gestion-perspectiva-genero.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%GESTION PERSPECTIVA GENERO%')
            .eq('orden', 6);

        if (error6) {
            console.error('❌ Error actualizando lección 6:', error6);
        } else {
            console.log('✅ Lección 6 actualizada correctamente');
        }

        // Actualizar lección 7: Nuevos Modelos Terapéuticos
        console.log('📚 Actualizando lección 7: Nuevos Modelos Terapéuticos...');
        const { error: error7 } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-7-nuevos-modelos-terapeuticos.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%NUEVOS MODELOS TERAPEUTICOS%')
            .eq('orden', 7);

        if (error7) {
            console.error('❌ Error actualizando lección 7:', error7);
        } else {
            console.log('✅ Lección 7 actualizada correctamente');
        }

        // Actualizar lección 8: Eliminar esta entrada (ya no existe lección 8 en nuestro sistema actual)
        // Saltamos la lección 8 ya que solo tenemos 7 lecciones principales en el máster

        // Actualizar lección 7: Inteligencia Emocional
        console.log('📚 Actualizando lección 7: Inteligencia Emocional...');
        const { error: error7Inteligencia } = await supabase
            .from('lecciones')
            .update({
                archivo_url: '/lessons/leccion-9-inteligencia-emocional.html',
                actualizado_en: new Date().toISOString()
            })
            .like('titulo', '%INTELIGENCIA EMOCIONAL%')
            .eq('orden', 7);

        if (error7Inteligencia) {
            console.error('❌ Error actualizando lección 7:', error7Inteligencia);
        } else {
            console.log('✅ Lección 7 actualizada correctamente');
        }

        // Verificar las actualizaciones
        console.log('\n🔍 Verificando actualizaciones...');
        const { data: lessons, error: verifyError } = await supabase
            .from('lecciones')
            .select('id, titulo, orden, archivo_url, actualizado_en')
            .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
            .order('orden');

        if (verifyError) {
            console.error('❌ Error verificando actualizaciones:', verifyError);
        } else {
            console.log('✅ Lecciones actualizadas:');
            lessons.forEach(lesson => {
                console.log(`  ${lesson.orden}. ${lesson.titulo}`);
                console.log(`     URL: ${lesson.archivo_url || 'NULL'}`);
                console.log(`     Actualizado: ${lesson.actualizado_en}`);
                console.log('');
            });
        }

        console.log('🎉 ¡Actualización completada!');

    } catch (error) {
        console.error('❌ Error inesperado:', error);
        process.exit(1);
    }
}

// Ejecutar la actualización
updateLessonUrls();