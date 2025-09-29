import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Datos del cuestionario para lección 2 basado en insert_quiz_content.cjs
const lesson2QuizData = {
  leccionTitulo: "¿Qué es una adicción 1 Cuestionario",
  leccionNumero: 2,
  quizTitulo: "Cuestionario: Conceptos básicos de adicción",
  preguntas: [
    {
      pregunta: "¿Cuál es la característica principal de una adicción según el DSM-5?",
      opciones: [
        "El uso ocasional de sustancias",
        "La pérdida de control y uso compulsivo",
        "El uso social de sustancias",
        "La experimentación con drogas"
      ],
      correcta: 1,
      explicacion: "La adicción se caracteriza principalmente por la pérdida de control sobre el uso y el comportamiento compulsivo a pesar de las consecuencias negativas."
    },
    {
      pregunta: "¿Qué diferencia hay entre dependencia física y psicológica?",
      opciones: [
        "No hay diferencia",
        "La física involucra síntomas de abstinencia, la psicológica involucra deseo compulsivo",
        "Solo la física es real",
        "Solo la psicológica es peligrosa"
      ],
      correcta: 1,
      explicacion: "La dependencia física se manifiesta con síntomas de abstinencia cuando se suspende el uso, mientras que la psicológica se caracteriza por el deseo compulsivo y la preocupación mental por la sustancia."
    }
  ]
};

async function createLesson2Quiz() {
  try {
    console.log('🚀 Creando cuestionario para lección 2...');
    
    // Obtener el curso
    const { data: course } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }
    
    console.log(`✅ Curso encontrado: ${course.id}`);
    
    // Obtener la lección 2
    const { data: lesson } = await supabase
      .from('lecciones')
      .select('id')
      .eq('curso_id', course.id)
      .eq('orden', 2)
      .single();
    
    if (!lesson) {
      console.log('❌ Lección 2 no encontrada');
      return;
    }
    
    console.log(`✅ Lección 2 encontrada: ${lesson.id}`);
    
    // Crear el cuestionario
    const { data: quiz, error: quizError } = await supabase
      .from('cuestionarios')
      .insert({
        titulo: lesson2QuizData.quizTitulo,
        leccion_id: lesson.id,
        curso_id: course.id
      })
      .select()
      .single();
    
    if (quizError) {
      console.error('❌ Error al crear cuestionario:', quizError);
      return;
    }
    
    console.log(`✅ Cuestionario creado: ${quiz.titulo} (ID: ${quiz.id})`);
    
    // Insertar preguntas
    for (let i = 0; i < lesson2QuizData.preguntas.length; i++) {
      const questionData = lesson2QuizData.preguntas[i];
      
      console.log(`📋 Insertando pregunta ${i + 1}: ${questionData.pregunta.substring(0, 50)}...`);
      
      const { data: pregunta, error: preguntaError } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: quiz.id,
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
      
      console.log(`✅ Pregunta insertada con ${questionData.opciones.length} opciones`);
    }
    
    // Actualizar la lección para marcar que tiene cuestionario
    const { error: updateError } = await supabase
      .from('lecciones')
      .update({ tiene_cuestionario: true })
      .eq('id', lesson.id);
    
    if (updateError) {
      console.error('⚠️  Error al actualizar lección:', updateError);
    } else {
      console.log('✅ Lección actualizada con tiene_cuestionario = true');
    }
    
    console.log(`\n🎉 ¡Cuestionario para lección 2 creado exitosamente!`);
    console.log(`📊 Cuestionario: ${quiz.titulo}`);
    console.log(`📝 Preguntas insertadas: ${lesson2QuizData.preguntas.length}`);
    console.log(`🔗 ID del cuestionario: ${quiz.id}`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createLesson2Quiz();