import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Usar service role key para operaciones administrativas
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ID del curso MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL
const MASTER_COURSE_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Lecciones basadas en la estructura del directorio inteligencia_emocional_drive
const lecciones = [
  {
    titulo: 'Fundamentos del Proceso Terapéutico',
    descripcion: 'Introducción a los fundamentos del proceso terapéutico en el tratamiento de adicciones. Incluye conceptos básicos y metodologías terapéuticas.',
    orden: 13,
    duracion_estimada: 120,
    tiene_cuestionario: true
  },
  {
    titulo: 'Terapia Cognitiva en Drogodependencias',
    descripcion: 'Aplicación de la terapia cognitiva en el tratamiento de drogodependencias. Técnicas y estrategias cognitivo-conductuales.',
    orden: 14,
    duracion_estimada: 150,
    tiene_cuestionario: true
  },
  {
    titulo: 'Familia y Trabajo en Equipo',
    descripcion: 'La importancia del trabajo familiar y en equipo en el proceso de recuperación. Estrategias de intervención familiar.',
    orden: 15,
    duracion_estimada: 135,
    tiene_cuestionario: true
  },
  {
    titulo: 'Recovery Coaching',
    descripcion: 'Metodología del Recovery Coaching. Técnicas de acompañamiento y mentoring en procesos de recuperación.',
    orden: 16,
    duracion_estimada: 140,
    tiene_cuestionario: true
  },
  {
    titulo: 'Intervención Familiar y Recovery Mentoring',
    descripcion: 'Técnicas avanzadas de intervención familiar y mentoring en recovery. Guías especializadas y técnicas comunicativas.',
    orden: 17,
    duracion_estimada: 160,
    tiene_cuestionario: true
  },
  {
    titulo: 'Nuevos Modelos Terapéuticos',
    descripcion: 'Exploración de nuevos modelos terapéuticos incluyendo terapias de tercera generación, psicología positiva y manejo del estrés.',
    orden: 18,
    duracion_estimada: 180,
    tiene_cuestionario: true
  },
  {
    titulo: 'Inteligencia Emocional Aplicada',
    descripcion: 'Aplicación de la inteligencia emocional en la prevención y tratamiento de conductas adictivas. Desarrollo de habilidades emocionales.',
    orden: 19,
    duracion_estimada: 145,
    tiene_cuestionario: true
  }
];

async function insertarLecciones() {
  console.log('🚀 Iniciando inserción de lecciones de inteligencia emocional...');
  console.log(`📚 Curso destino: MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL (${MASTER_COURSE_ID})`);
  console.log(`📝 Lecciones a insertar: ${lecciones.length}`);
  console.log('');

  try {
    // Verificar que el curso existe
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', MASTER_COURSE_ID)
      .single();

    if (cursoError || !curso) {
      console.error('❌ Error: No se encontró el curso especificado');
      return;
    }

    console.log(`✅ Curso encontrado: ${curso.titulo}`);
    console.log('');

    // Insertar cada lección
    for (const leccion of lecciones) {
      const leccionData = {
        ...leccion,
        curso_id: MASTER_COURSE_ID,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('lecciones')
        .insert([leccionData])
        .select();

      if (error) {
        console.error(`❌ Error insertando lección "${leccion.titulo}":`, error.message);
      } else {
        console.log(`✅ Lección insertada: "${leccion.titulo}" (Orden: ${leccion.orden})`);
      }
    }

    console.log('');
    console.log('🎉 Proceso completado!');
    
    // Verificar el total de lecciones del curso
    const { data: totalLecciones, error: countError } = await supabase
      .from('lecciones')
      .select('id', { count: 'exact' })
      .eq('curso_id', MASTER_COURSE_ID);

    if (!countError) {
      console.log(`📊 Total de lecciones en el curso: ${totalLecciones.length}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar la función
insertarLecciones();