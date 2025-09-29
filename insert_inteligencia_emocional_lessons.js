import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Lecciones de inteligencia emocional a insertar
const leccionesInteligenciaEmocional = [
  {
    titulo: 'Introducción a la Inteligencia Emocional',
    descripcion: 'Conceptos básicos y fundamentos de la inteligencia emocional en el contexto de las adicciones',
    orden: 13,
    archivo_url: '/lessons/leccion-1-introduccion-inteligencia-emocional.html'
  },
  {
    titulo: 'Autoconciencia Emocional',
    descripcion: 'Desarrollo de la capacidad de reconocer y comprender las propias emociones',
    orden: 14,
    archivo_url: '/lessons/leccion-2-autoconciencia-emocional.html'
  },
  {
    titulo: 'Autorregulación Emocional',
    descripcion: 'Técnicas y estrategias para el manejo y control de las emociones',
    orden: 15,
    archivo_url: '/lessons/leccion-3-autorregulacion-emocional.html'
  },
  {
    titulo: 'Empatía y Habilidades Sociales',
    descripcion: 'Desarrollo de la capacidad empática y habilidades para las relaciones interpersonales',
    orden: 16,
    archivo_url: '/lessons/leccion-4-empatia-habilidades-sociales.html'
  },
  {
    titulo: 'Inteligencia Emocional en Adicciones',
    descripcion: 'Aplicación específica de la inteligencia emocional en el tratamiento de conductas adictivas',
    orden: 17,
    archivo_url: '/lessons/leccion-5-inteligencia-emocional-adicciones.html'
  },
  {
    titulo: 'Plan Personal de Inteligencia Emocional',
    descripcion: 'Desarrollo de un plan personalizado para mejorar la inteligencia emocional',
    orden: 18,
    archivo_url: '/lessons/leccion-6-plan-personal-inteligencia-emocional.html'
  },
  {
    titulo: 'Evaluación y Seguimiento Emocional',
    descripcion: 'Herramientas y técnicas para evaluar y dar seguimiento al desarrollo emocional',
    orden: 19,
    archivo_url: '/lessons/leccion-7-evaluacion-seguimiento-emocional.html'
  }
];

async function insertInteligenciaEmocionalLessons() {
  try {
    console.log('🔍 Buscando el curso "Experto en Conductas Adictivas"...');
    
    // Buscar el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (cursoError || !curso) {
      console.error('❌ Error: No se encontró el curso "Experto en Conductas Adictivas"');
      return;
    }
    
    console.log(`✅ Curso encontrado: ${curso.titulo} (ID: ${curso.id})`);
    
    // Verificar si ya existen lecciones de inteligencia emocional
    console.log('\n🔍 Verificando lecciones existentes de inteligencia emocional...');
    
    const { data: leccionesExistentes, error: leccionesError } = await supabase
      .from('lecciones')
      .select('titulo, orden')
      .eq('curso_id', curso.id)
      .ilike('titulo', '%inteligencia emocional%');
    
    if (leccionesError) {
      console.error('❌ Error consultando lecciones existentes:', leccionesError);
      return;
    }
    
    if (leccionesExistentes && leccionesExistentes.length > 0) {
      console.log('⚠️  Se encontraron lecciones existentes de inteligencia emocional:');
      leccionesExistentes.forEach(leccion => {
        console.log(`   - ${leccion.titulo} (Orden: ${leccion.orden})`);
      });
      console.log('\n❓ ¿Desea continuar e insertar las nuevas lecciones? (Esto podría crear duplicados)');
    }
    
    // Preparar lecciones para insertar
    const leccionesParaInsertar = leccionesInteligenciaEmocional.map(leccion => ({
      ...leccion,
      curso_id: curso.id,
      creado_en: new Date().toISOString(),
      actualizado_en: new Date().toISOString()
    }));
    
    console.log('\n📝 Insertando lecciones de inteligencia emocional...');
    
    // Insertar lecciones
    const { data: leccionesInsertadas, error: insertError } = await supabase
      .from('lecciones')
      .insert(leccionesParaInsertar)
      .select('id, titulo, orden');
    
    if (insertError) {
      console.error('❌ Error insertando lecciones:', insertError);
      return;
    }
    
    console.log('\n✅ Lecciones de inteligencia emocional insertadas exitosamente:');
    leccionesInsertadas.forEach(leccion => {
      console.log(`   ✓ ${leccion.titulo} (ID: ${leccion.id}, Orden: ${leccion.orden})`);
    });
    
    // Verificar el estado final
    console.log('\n📊 Verificando estado final del curso...');
    const { data: todasLasLecciones, error: verificacionError } = await supabase
      .from('lecciones')
      .select('titulo, orden')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (verificacionError) {
      console.error('❌ Error en verificación final:', verificacionError);
      return;
    }
    
    console.log(`\n📚 Total de lecciones en el curso: ${todasLasLecciones.length}`);
    console.log('\n📋 Lista completa de lecciones:');
    todasLasLecciones.forEach(leccion => {
      const esInteligenciaEmocional = leccion.titulo.toLowerCase().includes('inteligencia emocional') ||
                                     leccion.titulo.toLowerCase().includes('autoconciencia') ||
                                     leccion.titulo.toLowerCase().includes('autorregulación') ||
                                     leccion.titulo.toLowerCase().includes('empatía');
      const marca = esInteligenciaEmocional ? '🧠' : '📖';
      console.log(`   ${marca} ${leccion.orden}. ${leccion.titulo}`);
    });
    
    console.log('\n🎉 Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el script
insertInteligenciaEmocionalLessons();