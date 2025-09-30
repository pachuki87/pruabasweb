require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
// Función simple para generar UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('=== SIMULANDO REPETICIÓN DE TESTS ===\n');

    // 1. Obtener usuario Pablo y curso
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'pablocardonafeliu@gmail.com')
      .single();

    const { data: curso } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%MÁSTER EN ADICCIONES%')
      .single();

    console.log(`Usuario: ${usuario.nombre}`);
    console.log(`Curso: ${curso.titulo}`);
    console.log(`Lección 1 ID: 5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44 (FUNDAMENTOS P TERAPEUTICO)\n`);

    // 2. Crear múltiples resultados para la misma lección (lección 1)
    console.log('2. Creando resultados múltiples para la lección 1...');

    const resultados = [
      { puntuacion: 8, fecha: '2025-09-28T10:00:00Z' },
      { puntuacion: 6, fecha: '2025-09-28T14:30:00Z' },
      { puntuacion: 9, fecha: '2025-09-29T09:15:00Z' },
      { puntuacion: 7, fecha: '2025-09-29T16:45:00Z' },
      { puntuacion: 10, fecha: '2025-09-30T11:20:00Z' }
    ];

    for (let i = 0; i < resultados.length; i++) {
      const resultado = resultados[i];

      const { data: nuevoResultado, error } = await supabase
        .from('user_test_results')
        .insert({
          id: generateUUID(),
          user_id: usuario.id,
          curso_id: curso.id,
          leccion_id: '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44', // Siempre la misma lección
          cuestionario_id: generateUUID(),
          puntuacion: resultado.puntuacion,
          puntuacion_maxima: 10,
          fecha_completado: resultado.fecha
        })
        .select()
        .single();

      if (error) {
        console.log(`❌ Error creando resultado ${i + 1}:`, error.message);
      } else {
        console.log(`✅ Resultado ${i + 1}: ${resultado.puntuacion}/10 - ${nuevoResultado.aprobado ? 'APROBADO' : 'REPROBADO'}`);
      }
    }

    console.log('\n3. Verificando resultados creados...');

    const { data: tests, error: testsError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', usuario.id)
      .eq('curso_id', curso.id)
      .order('fecha_completado', { ascending: true });

    if (testsError) {
      console.log('Error al obtener tests:', testsError);
    } else {
      console.log(`Total de tests: ${tests.length}`);

      const leccionesUnicas = new Set();
      const leccionesAprobadas = new Set();

      tests.forEach((test, i) => {
        leccionesUnicas.add(test.leccion_id);
        if (test.aprobado) {
          leccionesAprobadas.add(test.leccion_id);
        }
        console.log(`${i + 1}. Lección ${test.leccion_id}: ${test.puntuacion}/10 - ${test.aprobado ? 'APROBADO' : 'REPROBADO'} - ${test.fecha_completado}`);
      });

      console.log(`\n📊 RESUMEN:`);
      console.log(`Total de tests realizados: ${tests.length}`);
      console.log(`Lecciones únicas con tests: ${leccionesUnicas.size}`);
      console.log(`Lecciones aprobadas: ${leccionesAprobadas.size}`);

      // 4. Calcular progreso correcto
      const totalLeccionesCurso = 10; // Sabemos por el diagnóstico anterior
      const progresoCorrecto = Math.round((leccionesAprobadas.size / totalLeccionesCurso) * 100);

      console.log(`\n🎯 CÁLCULO DE PROGRESO:`);
      console.log(`Lecciones aprobadas: ${leccionesAprobadas.size}`);
      console.log(`Total lecciones curso: ${totalLeccionesCurso}`);
      console.log(`Progreso correcto: ${progresoCorrecto}%`);

      if (tests.length > leccionesUnicas.size) {
        console.log(`\n⚠️  ATENCIÓN: El usuario realizó ${tests.length} tests pero solo para ${leccionesUnicas.size} lecciones distintas`);
        console.log(`   Esto demuestra que la repetición de tests no aumenta el porcentaje`);
      }
    }

    console.log('\n=== SIMULACIÓN COMPLETADA ===');

  } catch (error) {
    console.error('Error general:', error);
  }
})();