import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuizQueries() {
  console.log('🔍 Diagnosticando errores de cuestionarios...');
  
  try {
    // Test 1: Verificar conexión básica
    console.log('\n1. Probando conexión básica...');
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('❌ Error de autenticación:', authError.message);
    } else {
      console.log('✅ Conexión de autenticación OK');
      console.log('Usuario:', authUser.user ? 'Autenticado' : 'No autenticado');
    }

    // Test 2: Probar consulta a cuestionarios
    console.log('\n2. Probando consulta a cuestionarios...');
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('*')
      .limit(5);
    
    if (cuestionariosError) {
      console.error('❌ Error consultando cuestionarios:', cuestionariosError.message);
      console.error('Detalles:', cuestionariosError);
    } else {
      console.log('✅ Consulta a cuestionarios OK');
      console.log(`Encontrados ${cuestionarios?.length || 0} cuestionarios`);
    }

    // Test 3: Probar consulta a preguntas
    console.log('\n3. Probando consulta a preguntas...');
    const { data: preguntas, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*')
      .limit(5);
    
    if (preguntasError) {
      console.error('❌ Error consultando preguntas:', preguntasError.message);
      console.error('Detalles:', preguntasError);
    } else {
      console.log('✅ Consulta a preguntas OK');
      console.log(`Encontradas ${preguntas?.length || 0} preguntas`);
    }

    // Test 4: Probar consulta a opciones de respuesta
    console.log('\n4. Probando consulta a opciones de respuesta...');
    const { data: opciones, error: opcionesError } = await supabase
      .from('opciones_respuesta')
      .select('*')
      .limit(5);
    
    if (opcionesError) {
      console.error('❌ Error consultando opciones:', opcionesError.message);
      console.error('Detalles:', opcionesError);
    } else {
      console.log('✅ Consulta a opciones OK');
      console.log(`Encontradas ${opciones?.length || 0} opciones`);
    }

    // Test 5: Probar consulta compleja (cuestionario con preguntas y opciones)
    console.log('\n5. Probando consulta compleja...');
    const { data: quizCompleto, error: quizError } = await supabase
      .from('cuestionarios')
      .select(`
        *,
        preguntas (
          *,
          opciones_respuesta (*)
        )
      `)
      .limit(1)
      .single();
    
    if (quizError) {
      console.error('❌ Error en consulta compleja:', quizError.message);
      console.error('Detalles:', quizError);
    } else {
      console.log('✅ Consulta compleja OK');
      console.log('Cuestionario:', quizCompleto?.titulo || 'Sin título');
      console.log('Preguntas:', quizCompleto?.preguntas?.length || 0);
    }

    // Test 6: Verificar permisos específicos
    console.log('\n6. Verificando permisos...');
    const { data: permisosTest, error: permisosError } = await supabase
      .rpc('check_table_permissions', { table_name: 'cuestionarios' })
      .single();
    
    if (permisosError) {
      console.log('⚠️  No se pudo verificar permisos (función no existe):', permisosError.message);
    } else {
      console.log('✅ Permisos verificados:', permisosTest);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar diagnóstico
testQuizQueries().then(() => {
  console.log('\n🏁 Diagnóstico completado');
}).catch(error => {
  console.error('💥 Error ejecutando diagnóstico:', error);
});