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

async function addJoseLuisToMasterCourse() {
    try {
        console.log('👤 Añadiendo al alumno José Luis al sistema...');

        // 1. Crear el usuario en la tabla usuarios
        console.log('📝 Creando registro de usuario...');
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .upsert({
                email: 'joseluis@drconstructores.com',
                nombre: 'José Luis',
                name: 'José Luis',
                rol: 'student',
                creado_en: new Date().toISOString()
            })
            .select()
            .single();

        if (userError) {
            console.error('❌ Error creando usuario:', userError);
            return;
        }

        console.log('✅ Usuario creado/actualizado:');
        console.log(`   ID: ${userData.id}`);
        console.log(`   Nombre: ${userData.nombre}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Rol: ${userData.rol}`);

        // 2. Inscribir al usuario en el curso de Máster en Adicciones
        console.log('\n📚 Incribiendo en el curso de Máster en Adicciones...');
        const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

        const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('user_courses')
            .upsert({
                user_id: userData.id,
                course_id: masterCourseId,
                status: 'active',
                enrolled_at: new Date().toISOString(),
                progress_percentage: 0
            })
            .select()
            .single();

        if (enrollmentError) {
            console.error('❌ Error inscribiendo usuario en el curso:', enrollmentError);
            return;
        }

        console.log('✅ Usuario inscrito exitosamente en el curso');
        console.log(`   ID de Inscripción: ${enrollmentData.id}`);
        console.log(`   ID de Usuario: ${enrollmentData.user_id}`);
        console.log(`   ID de Curso: ${enrollmentData.course_id}`);
        console.log(`   Estado: ${enrollmentData.status}`);
        console.log(`   Fecha de Inscripción: ${enrollmentData.enrolled_at}`);

        // 3. Verificar la inscripción
        console.log('\n🔍 Verificando inscripción...');
        const { data: verificationData, error: verificationError } = await supabase
            .from('user_courses')
            .select(`
                *,
                usuarios!user_courses_user_id_fkey (nombre, email),
                courses!user_courses_course_id_fkey (titulo)
            `)
            .eq('user_id', userData.id)
            .eq('course_id', masterCourseId)
            .single();

        if (verificationError) {
            console.error('❌ Error verificando inscripción:', verificationError);
            return;
        }

        console.log('✅ Verificación exitosa:');
        console.log(`   Alumno: ${verificationData.users.nombre} (${verificationData.users.email})`);
        console.log(`   Curso: ${verificationData.courses.titulo}`);
        console.log(`   Estado de Inscripción: ${verificationData.status}`);

        console.log('\n🎉 ¡Proceso completado con éxito!');

        console.log('\n📋 RESUMEN FINAL:');
        console.log(`   👤 Alumno: ${userData.nombre}`);
        console.log(`   📧 Email: ${userData.email}`);
        console.log(`   🆔 ID Usuario: ${userData.id}`);
        console.log(`   📚 Curso: Máster en Adicciones e Intervención Psicosocial`);
        console.log(`   🆔 ID Curso: ${masterCourseId}`);
        console.log(`   ✅ Estado: Activo`);
        console.log(`   📅 Fecha de Inscripción: ${new Date().toLocaleString('es-ES')}`);

    } catch (error) {
        console.error('❌ Error inesperado:', error);
        process.exit(1);
    }
}

// Ejecutar la función
addJoseLuisToMasterCourse();