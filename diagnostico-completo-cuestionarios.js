import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con diferentes claves para probar
const configs = [
  {
    name: 'Anónima (Frontend)',
    url: 'https://lyojcqiiixkqqtpoejdo.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc'
  },
  {
    name: 'Servicio (Backend)',
    url: 'https://lyojcqiiixkqqtpoejdo.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
  }
];

async function diagnosticarCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA DE CUESTIONARIOS');
  console.log('================================================\n');

  for (const config of configs) {
    console.log(`📡 Probando configuración: ${config.name}`);
    console.log('----------------------------------------');
    
    const supabase = createClient(config.url, config.key);
    
    try {
      // 1. Probar conexión básica
      console.log('1. Conexión básica...');
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.log(`   ❌ Error de autenticación: ${authError.message}`);
      } else {
        console.log(`   ✅ Autenticación: ${authData.user ? 'Usuario autenticado' : 'Sin usuario'}`);
      }

      // 2. Probar tablas principales
      console.log('\n2. Verificando tablas principales...');
      
      const tablas = [
        { nombre: 'cuestionarios', descripcion: 'Cuestionarios principales' },
        { nombre: 'preguntas_cuestionario', descripcion: 'Preguntas de cuestionarios' },
        { nombre: 'opciones_respuesta', descripcion: 'Opciones de respuesta' },
        { nombre: 'lecciones', descripcion: 'Lecciones del curso' },
        { nombre: 'cursos', descripcion: 'Cursos disponibles' },
        { nombre: 'user_test_results', descripcion: 'Resultados de tests de usuarios' },
        { nombre: 'user_progress', descripcion: 'Progreso de usuarios' }
      ];

      for (const tabla of tablas) {
        try {
          const { data, error } = await supabase
            .from(tabla.nombre)
            .select('*')
            .limit(1);
          
          if (error) {
            console.log(`   ❌ ${tabla.nombre} (${tabla.descripcion}): ${error.message}`);
          } else {
            console.log(`   ✅ ${tabla.nombre} (${tabla.descripcion}): Accessible`);
          }
        } catch (err) {
          console.log(`   💥 ${tabla.nombre} (${tabla.descripcion}): Error crítico - ${err.message}`);
        }
      }

      // 3. Probar consulta compleja de cuestionarios
      console.log('\n3. Probando consulta compleja de cuestionarios...');
      try {
        const { data: quizCompleto, error: quizError } = await supabase
          .from('cuestionarios')
          .select(`
            *,
            preguntas_cuestionario (
              *,
              opciones_respuesta (*)
            )
          `)
          .limit(1);

        if (quizError) {
          console.log(`   ❌ Consulta compleja fallida: ${quizError.message}`);
        } else {
          console.log(`   ✅ Consulta compleja exitosa`);
          if (quizCompleto && quizCompleto.length > 0) {
            const quiz = quizCompleto[0];
            console.log(`   📊 Cuestionario: ${quiz.titulo}`);
            console.log(`   📝 Preguntas: ${quiz.preguntas_cuestionario?.length || 0}`);
          }
        }
      } catch (err) {
        console.log(`   💥 Error en consulta compleja: ${err.message}`);
      }

      // 4. Probar inserción de prueba (solo con clave de servicio)
      if (config.name === 'Servicio (Backend)') {
        console.log('\n4. Probando inserción de datos...');
        try {
          const testResult = {
            user_id: 'test-user-id',
            leccion_id: 'test-leccion-id',
            cuestionario_id: 'test-quiz-id',
            puntuacion: 85,
            aprobado: true,
            tiempo_empleado: 120000,
            respuestas_correctas: 8,
            total_preguntas: 10,
            fecha_completado: new Date().toISOString()
          };

          const { data: insertData, error: insertError } = await supabase
            .from('user_test_results')
            .insert([testResult])
            .select();

          if (insertError) {
            console.log(`   ❌ Inserción fallida: ${insertError.message}`);
          } else {
            console.log(`   ✅ Inserción exitosa`);
            // Limpiar datos de prueba
            if (insertData && insertData[0]) {
              await supabase
                .from('user_test_results')
                .delete()
                .eq('id', insertData[0].id);
            }
          }
        } catch (err) {
          console.log(`   💥 Error en inserción: ${err.message}`);
        }
      }

      // 5. Verificar RLS (Row Level Security)
      console.log('\n5. Verificando políticas RLS...');
      try {
        // Intentar consultar sin autenticación
        const { data: rlsData, error: rlsError } = await supabase
          .from('cuestionarios')
          .select('count')
          .single();

        if (rlsError) {
          console.log(`   ⚠️ Posible restricción RLS: ${rlsError.message}`);
        } else {
          console.log(`   ✅ Acceso RLS parece correcto`);
        }
      } catch (err) {
        console.log(`   💥 Error verificando RLS: ${err.message}`);
      }

      // 6. Probar consulta específica como en el componente
      console.log('\n6. Simulando consulta del componente QuizComponent...');
      try {
        const leccionIdTest = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44'; // ID de lección real
        const courseIdTest = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // ID de curso real

        // Consulta 1: Cuestionario específico de lección
        const { data: quizData, error: quizDataError } = await supabase
          .from('cuestionarios')
          .select('*')
          .eq('leccion_id', leccionIdTest)
          .single();

        if (quizDataError && quizDataError.code !== 'PGRST116') {
          console.log(`   ❌ Error consultando cuestionario específico: ${quizDataError.message}`);
        } else if (quizData) {
          console.log(`   ✅ Cuestionario específico encontrado: ${quizData.titulo}`);
          
          // Consultar preguntas del cuestionario
          const { data: preguntas, error: preguntasError } = await supabase
            .from('preguntas_cuestionario')
            .select('*')
            .eq('cuestionario_id', quizData.id);

          if (preguntasError) {
            console.log(`   ❌ Error consultando preguntas: ${preguntasError.message}`);
          } else {
            console.log(`   ✅ Preguntas encontradas: ${preguntas?.length || 0}`);
          }
        } else {
          console.log(`   ℹ️ No hay cuestionario específico para esta lección`);
          
          // Consulta 2: Cuestionarios generales del curso
          const { data: generalQuizzes, error: generalError } = await supabase
            .from('cuestionarios')
            .select('*')
            .eq('curso_id', courseIdTest);

          if (generalError) {
            console.log(`   ❌ Error consultando cuestionarios generales: ${generalError.message}`);
          } else {
            console.log(`   ✅ Cuestionarios generales encontrados: ${generalQuizzes?.length || 0}`);
          }
        }
      } catch (err) {
        console.log(`   💥 Error en simulación de componente: ${err.message}`);
      }

    } catch (error) {
      console.log(`💥 Error general con configuración ${config.name}: ${error.message}`);
    }
    
    console.log('\n========================================\n');
  }

  // 7. Análisis final y recomendaciones
  console.log('📋 ANÁLISIS FINAL Y RECOMENDACIONES');
  console.log('========================================\n');
  
  console.log('PROBLEMAS IDENTIFICADOS:');
  console.log('1. Error de autenticación en frontend - "Auth session missing!"');
  console.log('2. Posibles problemas con políticas RLS en Supabase');
  console.log('3. Inconsistencia en el estado de lecciones (todas inactivas)');
  console.log('4. El componente QuizComponent intenta obtener usuario sin autenticación previa');
  console.log('5. MCP de Supabase no configurado correctamente (falta token de acceso)');
  
  console.log('\nSOLUCIONES PROPUESTAS:');
  console.log('1. Implementar autenticación previa a cargar cuestionarios');
  console.log('2. Revisar y ajustar políticas RLS en Supabase');
  console.log('3. Activar lecciones en la base de datos');
  console.log('4. Agregar manejo de errores robusto en QuizComponent');
  console.log('5. Configurar correctamente el token de acceso para MCP de Supabase');
  console.log('6. Implementar fallback para cuando no hay autenticación');
  
  console.log('\nACCIONES INMEDIATAS:');
  console.log('1. Verificar variables de entorno de Supabase');
  console.log('2. Probar autenticación manualmente');
  console.log('3. Revisar políticas RLS en la consola de Supabase');
  console.log('4. Activar lecciones necesarias');
  console.log('5. Implementar manejo de errores mejorado');
}

// Ejecutar diagnóstico
diagnosticarCompleto().then(() => {
  console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
}).catch(error => {
  console.error('💥 ERROR EJECUTANDO DIAGNÓSTICO:', error);
});
