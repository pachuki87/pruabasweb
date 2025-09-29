const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno de Supabase no configuradas');
    console.log('Asegúrate de configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function configureNavigation() {
    try {
        console.log('🔧 Configurando navegación entre lecciones...');
        
        // 1. Obtener el curso "Experto en Conductas Adictivas"
        const { data: curso, error: cursoError } = await supabase
            .from('cursos')
            .select('id')
            .eq('titulo', 'Experto en Conductas Adictivas')
            .single();
            
        if (cursoError || !curso) {
            throw new Error('No se encontró el curso');
        }
        
        console.log(`📚 Curso encontrado: ${curso.id}`);
        
        // 2. Obtener todas las lecciones ordenadas
        const { data: lecciones, error: leccionesError } = await supabase
            .from('lecciones')
            .select('id, titulo, orden')
            .eq('curso_id', curso.id)
            .order('orden');
            
        if (leccionesError) {
            throw new Error(`Error al obtener lecciones: ${leccionesError.message}`);
        }
        
        console.log(`📖 Encontradas ${lecciones.length} lecciones`);
        
        // 3. Configurar navegación
        const updates = [];
        
        for (let i = 0; i < lecciones.length; i++) {
            const leccion = lecciones[i];
            const anterior = i > 0 ? lecciones[i - 1].id : null;
            const siguiente = i < lecciones.length - 1 ? lecciones[i + 1].id : null;
            
            // Preparar actualización
            const updateData = {
                leccion_anterior_id: anterior,
                leccion_siguiente_id: siguiente
            };
            
            updates.push({
                id: leccion.id,
                titulo: leccion.titulo,
                orden: leccion.orden,
                ...updateData
            });
            
            console.log(`🔗 Lección ${leccion.orden}: "${leccion.titulo}"`);
            console.log(`   ⬅️  Anterior: ${anterior ? `Lección ${i}` : 'Ninguna'}`);
            console.log(`   ➡️  Siguiente: ${siguiente ? `Lección ${i + 2}` : 'Ninguna'}`);
        }
        
        // 4. Aplicar actualizaciones
        console.log('\n💾 Aplicando actualizaciones...');
        
        for (const update of updates) {
            const { error: updateError } = await supabase
                .from('lecciones')
                .update({
                    leccion_anterior_id: update.leccion_anterior_id,
                    leccion_siguiente_id: update.leccion_siguiente_id
                })
                .eq('id', update.id);
                
            if (updateError) {
                console.error(`❌ Error actualizando lección ${update.titulo}:`, updateError.message);
            } else {
                console.log(`✅ Navegación configurada para: ${update.titulo}`);
            }
        }
        
        // 5. Verificar configuración
        console.log('\n🔍 Verificando configuración...');
        
        const { data: leccionesVerificacion, error: verificacionError } = await supabase
            .from('lecciones')
            .select(`
                id,
                titulo,
                orden,
                leccion_anterior_id,
                leccion_siguiente_id
            `)
            .eq('curso_id', curso.id)
            .order('orden');
            
        if (verificacionError) {
            throw new Error(`Error en verificación: ${verificacionError.message}`);
        }
        
        console.log('\n📋 NAVEGACIÓN CONFIGURADA:');
        leccionesVerificacion.forEach((leccion, index) => {
            console.log(`${index + 1}. ${leccion.titulo}`);
            console.log(`   🆔 ID: ${leccion.id}`);
            console.log(`   ⬅️  Anterior: ${leccion.leccion_anterior_id || 'Ninguna'}`);
            console.log(`   ➡️  Siguiente: ${leccion.leccion_siguiente_id || 'Ninguna'}`);
            console.log('');
        });
        
        console.log('🎉 ¡Navegación configurada exitosamente!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar configuración
configureNavigation();