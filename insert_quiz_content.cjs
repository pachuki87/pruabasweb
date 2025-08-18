const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (usando service_role_key para inserción de datos)
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cuestionarios educativos para el curso "Experto en Conductas Adictivas"
const quizData = [
  {
    lesson_title: "¿Qué es una adicción?",
    lesson_number: 2,
    quiz_title: "Cuestionario: Conceptos básicos de adicción",
    questions: [
      {
        pregunta: "¿Cuál es la principal característica que define una adicción?",
        opciones: [
          "Uso ocasional de sustancias",
          "Pérdida de control sobre el comportamiento",
          "Experimentación temporal",
          "Interés casual en actividades"
        ],
        correcta: 1,
        explicacion: "La pérdida de control es la característica fundamental de cualquier adicción, ya sea a sustancias o comportamientos."
      },
      {
        pregunta: "¿Qué diferencia una adicción de un hábito?",
        opciones: [
          "La frecuencia de uso",
          "El tipo de sustancia",
          "La interferencia significativa en la vida diaria",
          "La edad de inicio"
        ],
        correcta: 2,
        explicacion: "Una adicción se caracteriza por interferir significativamente con el funcionamiento normal de la persona en diferentes áreas de su vida."
      }
    ]
  },
  {
    lesson_title: "Criterios para diagnosticar una conducta adictiva según DSM 5",
    lesson_number: 4,
    quiz_title: "Cuestionario: Criterios diagnósticos DSM-5",
    questions: [
      {
        pregunta: "¿Cuántos criterios del DSM-5 se requieren mínimo para diagnosticar un trastorno por uso de sustancias leve?",
        opciones: [
          "1 criterio",
          "2-3 criterios",
          "4-5 criterios",
          "6 o más criterios"
        ],
        correcta: 1,
        explicacion: "Según el DSM-5, se requieren 2-3 criterios para un trastorno leve, 4-5 para moderado y 6 o más para severo."
      },
      {
        pregunta: "¿Cuál de los siguientes NO es un criterio del DSM-5 para trastornos por uso de sustancias?",
        opciones: [
          "Tolerancia",
          "Síndrome de abstinencia",
          "Edad de inicio",
          "Craving o deseo intenso"
        ],
        correcta: 2,
        explicacion: "La edad de inicio no es uno de los 11 criterios establecidos por el DSM-5 para el diagnóstico de trastornos por uso de sustancias."
      }
    ]
  },
  {
    lesson_title: "Adicciones Comportamentales",
    lesson_number: 6,
    quiz_title: "Cuestionario: Adicciones sin sustancias",
    questions: [
      {
        pregunta: "¿Cuál es la principal diferencia entre las adicciones comportamentales y las adicciones a sustancias?",
        opciones: [
          "No existe diferencia",
          "Las comportamentales no causan daño",
          "No involucran sustancias químicas externas",
          "Son menos graves"
        ],
        correcta: 2,
        explicacion: "Las adicciones comportamentales involucran comportamientos compulsivos sin el uso de sustancias químicas externas."
      },
      {
        pregunta: "¿Cuál de las siguientes es considerada una adicción comportamental reconocida?",
        opciones: [
          "Adicción al trabajo",
          "Ludopatía (juego patológico)",
          "Adicción a las redes sociales",
          "Adicción al ejercicio"
        ],
        correcta: 1,
        explicacion: "La ludopatía es la única adicción comportamental oficialmente reconocida en el DSM-5 como trastorno del juego."
      }
    ]
  },
  {
    lesson_title: "Terapia integral de pareja",
    lesson_number: 10,
    quiz_title: "Cuestionario: Terapia de pareja en adicciones",
    questions: [
      {
        pregunta: "¿Por qué es importante incluir a la pareja en el tratamiento de adicciones?",
        opciones: [
          "Para tener más control sobre el paciente",
          "Porque las adicciones afectan las dinámicas relacionales",
          "Es un requisito legal",
          "Para reducir costos del tratamiento"
        ],
        correcta: 1,
        explicacion: "Las adicciones impactan significativamente las dinámicas de pareja, y la terapia integral ayuda a abordar estos aspectos relacionales."
      }
    ]
  },
  {
    lesson_title: "Psicología positiva",
    lesson_number: 11,
    quiz_title: "Cuestionario: Enfoque de psicología positiva",
    questions: [
      {
        pregunta: "¿Cuál es el enfoque principal de la psicología positiva en el tratamiento de adicciones?",
        opciones: [
          "Eliminar completamente los pensamientos negativos",
          "Fortalecer recursos y fortalezas personales",
          "Ignorar los problemas existentes",
          "Usar solo técnicas de relajación"
        ],
        correcta: 1,
        explicacion: "La psicología positiva se enfoca en identificar y fortalecer los recursos, fortalezas y aspectos positivos de la persona para la recuperación."
      }
    ]
  },
  {
    lesson_title: "Mindfulness aplicado a la Conducta Adictiva",
    lesson_number: 12,
    quiz_title: "Cuestionario: Mindfulness en adicciones",
    questions: [
      {
        pregunta: "¿Cómo ayuda el mindfulness en el tratamiento de adicciones?",
        opciones: [
          "Eliminando completamente los deseos",
          "Desarrollando conciencia y aceptación del momento presente",
          "Evitando todas las emociones difíciles",
          "Proporcionando distracción constante"
        ],
        correcta: 1,
        explicacion: "El mindfulness ayuda a desarrollar conciencia plena del momento presente, permitiendo observar deseos y emociones sin reaccionar automáticamente."
      }
    ]
  }
];

async function insertQuizzes() {
  try {
    console.log('🚀 Iniciando inserción de cuestionarios...');
    
    // Primero, obtener el ID del curso "Experto en Conductas Adictivas"
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (cursoError || !curso) {
      throw new Error('No se encontró el curso "Experto en Conductas Adictivas"');
    }
    
    console.log(`✅ Curso encontrado: ${curso.id}`);
    
    // Obtener todas las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      throw new Error('Error al obtener lecciones: ' + leccionesError.message);
    }
    
    console.log(`📚 Encontradas ${lecciones.length} lecciones`);
    
    // Insertar cuestionarios para cada lección que tenga quiz definido
    for (const quizInfo of quizData) {
      // Buscar la lección correspondiente por título
      const leccion = lecciones.find(l => 
        l.titulo.toLowerCase().includes(quizInfo.lesson_title.toLowerCase()) ||
        quizInfo.lesson_title.toLowerCase().includes(l.titulo.toLowerCase())
      );
      
      if (!leccion) {
        console.log(`⚠️  No se encontró lección para: ${quizInfo.lesson_title}`);
        continue;
      }
      
      console.log(`📝 Procesando cuestionario para: ${leccion.titulo}`);
      
      // Insertar cuestionario
      const { data: cuestionario, error: cuestionarioError } = await supabase
        .from('cuestionarios')
        .insert({
          titulo: quizInfo.quiz_title,
          curso_id: curso.id,
          leccion_id: leccion.id
        })
        .select()
        .single();
      
      if (cuestionarioError) {
        console.error(`❌ Error al insertar cuestionario para ${leccion.titulo}:`, cuestionarioError);
        continue;
      }
      
      console.log(`✅ Cuestionario creado: ${cuestionario.id}`);
      
      // Insertar preguntas
      for (let i = 0; i < quizInfo.questions.length; i++) {
        const questionData = quizInfo.questions[i];
        
        const { data: pregunta, error: preguntaError } = await supabase
          .from('preguntas')
          .insert({
            cuestionario_id: cuestionario.id,
            pregunta: questionData.pregunta,
            tipo: 'multiple_choice',
            orden: i + 1,
            explicacion: questionData.explicacion
          })
          .select()
          .single();
        
        if (preguntaError) {
          console.error(`❌ Error al insertar pregunta:`, preguntaError);
          continue;
        }
        
        // Insertar opciones de respuesta
        for (let j = 0; j < questionData.opciones.length; j++) {
          const { error: opcionError } = await supabase
            .from('opciones_respuesta')
            .insert({
              pregunta_id: pregunta.id,
              opcion: questionData.opciones[j],
              es_correcta: j === questionData.correcta,
              orden: j + 1
            });
          
          if (opcionError) {
            console.error(`❌ Error al insertar opción:`, opcionError);
          }
        }
        
        console.log(`  ✅ Pregunta ${i + 1} insertada con ${questionData.opciones.length} opciones`);
      }
      
      // Actualizar la lección para marcar que tiene cuestionario
      await supabase
        .from('lecciones')
        .update({ tiene_cuestionario: true })
        .eq('id', leccion.id);
    }
    
    console.log('🎉 ¡Inserción de cuestionarios completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar el script
insertQuizzes();