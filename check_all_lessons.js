import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

const cursoId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function checkAllLessons() {
  console.log('🔍 Verificando TODAS las lecciones en la base de datos...');
  
  try {
    // Obtener todas las lecciones del curso
    const { data: lecciones, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .order('orden', { ascending: true });

    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }

    console.log(`\n📚 Encontradas ${lecciones.length} lecciones en total:\n`);
    
    console.log('=== TODAS LAS LECCIONES ===');
    lecciones.forEach((leccion, index) => {
      console.log(`${index + 1}. ID: ${leccion.id}`);
      console.log(`   Título: "${leccion.titulo}"`);
      console.log(`   Orden: ${leccion.orden}`);
      console.log(`   Descripción: ${leccion.descripcion || 'Sin descripción'}`);
      console.log(`   Archivo URL: ${leccion.archivo_url || 'Sin archivo'}`);
      console.log('');
    });
    
    console.log('=== LECCIONES QUE DEBERÍAN ESTAR SEGÚN EL PROYECTO ===');
    const leccionesEsperadas = [
      '1) FUNDAMENTOS P TERAPEUTICO',
      '2) TERAPIA COGNITIVA DROGODEPENDENCIAS', 
      '3) FAMILIA Y TRABAJO EQUIPO',
      '4) RECOVERY COACHING',
      '6) INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      '7) NUEVOS MODELOS TERAPEUTICOS',
      '9) INTELIGENCIA EMOCIONAL'
    ];
    
    leccionesEsperadas.forEach(leccion => {
      console.log(`- ${leccion}`);
    });
    
    console.log('\n=== ANÁLISIS ===');
    const titulosActuales = lecciones.map(l => l.titulo.toUpperCase());
    const problemasEncontrados = [];
    
    // Verificar si las lecciones actuales coinciden con las esperadas
    const leccionesCorrectas = [
      'FUNDAMENTOS P TERAPEUTICO',
      'TERAPIA COGNITIVA DROGODEPENDENCIAS',
      'FAMILIA Y TRABAJO EQUIPO', 
      'RECOVERY COACHING',
      'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      'NUEVOS MODELOS TERAPEUTICOS',
      'INTELIGENCIA EMOCIONAL'
    ];
    
    leccionesCorrectas.forEach(leccionCorrecta => {
      const encontrada = titulosActuales.some(titulo => 
        titulo.includes(leccionCorrecta) || leccionCorrecta.includes(titulo)
      );
      if (!encontrada) {
        problemasEncontrados.push(`❌ Falta: ${leccionCorrecta}`);
      } else {
        console.log(`✅ Encontrada: ${leccionCorrecta}`);
      }
    });
    
    if (problemasEncontrados.length > 0) {
      console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
      problemasEncontrados.forEach(problema => console.log(problema));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllLessons();