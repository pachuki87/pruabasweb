require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Usar service role para leer datos

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno de Supabase no encontradas');
    console.log('Asegúrate de tener VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY configuradas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
    try {
        console.log('🔍 Verificando datos del curso "Experto en Conductas Adictivas"...\n');
        
        // 1. Verificar curso principal
        const { data: curso, error: cursoError } = await supabase
            .from('cursos')
            .select('*')
            .eq('titulo', 'Experto en Conductas Adictivas')
            .single();
        
        if (cursoError || !curso) {
            console.error('❌ Error al obtener el curso:', cursoError);
            return;
        }
        
        console.log('✅ CURSO PRINCIPAL:');
        console.log(`   📚 Título: ${curso.titulo}`);
        console.log(`   📝 Descripción: ${curso.descripcion.substring(0, 100)}...`);
        console.log(`   🆔 ID: ${curso.id}`);
        console.log(`   📅 Creado: ${new Date(curso.creado_en).toLocaleDateString()}\n`);
        
        // 2. Verificar lecciones
        const { data: lecciones, error: leccionesError } = await supabase
            .from('lecciones')
            .select('*')
            .eq('curso_id', curso.id)
            .order('orden');
        
        if (leccionesError) {
            console.error('❌ Error al obtener lecciones:', leccionesError);
            return;
        }
        
        console.log(`✅ LECCIONES (${lecciones.length} total):`);
        lecciones.forEach((leccion, index) => {
            console.log(`   ${leccion.orden}. ${leccion.titulo}`);
            console.log(`      ⏱️  Duración estimada: ${leccion.duracion_estimada} min`);
            console.log(`      ❓ Tiene cuestionario: ${leccion.tiene_cuestionario ? 'Sí' : 'No'}`);
            if (index < lecciones.length - 1) console.log('');
        });
        
        // 3. Verificar materiales
        const { data: materiales, error: materialesError } = await supabase
            .from('materiales')
            .select(`
                *,
                lecciones!inner(titulo, orden)
            `)
            .eq('curso_id', curso.id);
        
        if (materialesError) {
            console.error('❌ Error al obtener materiales:', materialesError);
            return;
        }
        
        console.log(`\n✅ MATERIALES COMPLEMENTARIOS (${materiales.length} total):`);
        materiales.forEach(material => {
            console.log(`   📄 ${material.titulo}`);
            console.log(`      📂 Tipo: ${material.tipo_material}`);
            console.log(`      🔗 Archivo: ${material.url_archivo}`);
            console.log(`      📚 Lección: ${material.lecciones.orden}. ${material.lecciones.titulo}`);
            console.log('');
        });
        
        // 4. Estadísticas generales
        const leccionesConCuestionario = lecciones.filter(l => l.tiene_cuestionario).length;
        const duracionTotal = lecciones.reduce((sum, l) => sum + (l.duracion_estimada || 0), 0);
        
        console.log('📊 ESTADÍSTICAS GENERALES:');
        console.log(`   📚 Total de lecciones: ${lecciones.length}`);
        console.log(`   ❓ Lecciones con cuestionario: ${leccionesConCuestionario}`);
        console.log(`   📄 Total de materiales PDF: ${materiales.length}`);
        console.log(`   ⏱️  Duración total estimada: ${Math.floor(duracionTotal / 60)}h ${duracionTotal % 60}min`);
        
        // 5. Verificar integridad de datos
        console.log('\n🔍 VERIFICACIÓN DE INTEGRIDAD:');
        
        // Verificar orden secuencial de lecciones
        const ordenesEsperados = Array.from({length: lecciones.length}, (_, i) => i + 1);
        const ordenesActuales = lecciones.map(l => l.orden).sort((a, b) => a - b);
        const ordenCorrecto = JSON.stringify(ordenesEsperados) === JSON.stringify(ordenesActuales);
        
        console.log(`   📋 Orden de lecciones: ${ordenCorrecto ? '✅ Correcto' : '❌ Incorrecto'}`);
        
        // Verificar que todas las lecciones tienen contenido
        const leccionesSinContenido = lecciones.filter(l => !l.contenido_html || l.contenido_html.trim() === '');
        console.log(`   📝 Contenido HTML: ${leccionesSinContenido.length === 0 ? '✅ Todas las lecciones tienen contenido' : `❌ ${leccionesSinContenido.length} lecciones sin contenido`}`);
        
        // Verificar materiales vinculados
        const materialesSinLeccion = materiales.filter(m => !m.leccion_id);
        console.log(`   🔗 Vinculación de materiales: ${materialesSinLeccion.length === 0 ? '✅ Todos los materiales están vinculados' : `❌ ${materialesSinLeccion.length} materiales sin vincular`}`);
        
        console.log('\n🎉 ¡Verificación completada!');
        
        if (ordenCorrecto && leccionesSinContenido.length === 0 && materialesSinLeccion.length === 0) {
            console.log('✅ Todos los datos están correctos y completos.');
            return true;
        } else {
            console.log('⚠️  Se encontraron algunos problemas que requieren atención.');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error durante la verificación:', error);
        return false;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    verifyData();
}

module.exports = { verifyData };