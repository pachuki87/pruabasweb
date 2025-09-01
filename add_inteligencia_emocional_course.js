const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Faltan las variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addInteligenciaEmocionalCourse() {
  try {
    console.log('Conectando a Supabase...');
    
    // Crear el curso de Inteligencia Emocional
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .insert({
        titulo: 'Inteligencia Emocional',
        descripcion: 'Curso completo de Inteligencia Emocional con enfoque en técnicas terapéuticas y recovery coaching'
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error al crear el curso:', courseError);
      return;
    }

    console.log('Curso creado exitosamente:', courseData);
    const cursoId = courseData.id;

    // Definir las lecciones basadas en la estructura de directorios
    const lecciones = [
      {
        titulo: 'Bloque 1: Fundamentos Proceso Terapéutico',
        descripcion: 'Técnico en Adicciones - Fundamentos del proceso terapéutico y manual MATRIX',
        orden: 1,
        duracion_estimada: 120,
        tiene_cuestionario: true
      },
      {
        titulo: 'Bloque 2: Terapia Cognitiva en Drogodependencias',
        descripcion: 'Técnico en Adicciones - Enfoques cognitivos para el tratamiento de drogodependencias',
        orden: 2,
        duracion_estimada: 120,
        tiene_cuestionario: true
      },
      {
        titulo: 'Bloque 3: Familia y Trabajo en Equipo',
        descripcion: 'Intervención familiar y metodologías de trabajo en equipo',
        orden: 3,
        duracion_estimada: 90,
        tiene_cuestionario: true
      },
      {
        titulo: 'Bloque 4: Recovery Coaching',
        descripcion: 'Técnicas y metodologías de Recovery Coaching',
        orden: 4,
        duracion_estimada: 100,
        tiene_cuestionario: true
      },
      {
        titulo: 'Bloque 5: Intervención Familiar y Recovery Mentoring',
        descripcion: 'Guías especializadas en intervención familiar y técnicas comunicativas',
        orden: 5,
        duracion_estimada: 150,
        tiene_cuestionario: true
      },
      {
        titulo: 'Bloque 6: Nuevos Modelos Terapéuticos',
        descripcion: 'Terapias de tercera generación, psicología positiva y manejo del estrés',
        orden: 6,
        duracion_estimada: 180,
        tiene_cuestionario: true
      },
      {
        titulo: 'Bloque 7: Inteligencia Emocional',
        descripcion: 'Educación emocional aplicada a conductas adictivas',
        orden: 7,
        duracion_estimada: 120,
        tiene_cuestionario: true
      }
    ];

    // Insertar todas las lecciones
    for (const leccion of lecciones) {
      const { data: leccionData, error: leccionError } = await supabase
        .from('lecciones')
        .insert({
          ...leccion,
          curso