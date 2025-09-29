import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeo de lecciones por número de orden a título
const lessonMapping = {
  2: '¿Qué es una adicción?',
  4: 'Criterios para diagnosticar una conducta adictiva según DSM 5',
  5: 'Material Complementario y Ejercicios',
  6: 'Adicciones Comportamentales',
  10: 'Terapia integral de pareja',
  11: 'Psicología positiva',
  12: 'Mindfulness aplicado a la Conducta Adictiva',
  13: 'Material complementario Mindfulness y ejercicio'
};

// Función para obtener el ID de una lección por su título
async function getLessonId(lessonTitle) {
  const { data, error } = await supabase
    .from('lecciones')
    .select('id')
    .ilike('titulo', `%${lessonTitle}%`)
    .single();
  
  if (error) {
    console.error(`Error buscando lección "${lessonTitle}":`, error);
    return null;
  }
  
  return data?.id;
}

// Función para insertar un cuestionario
async function insertQuiz(quizData, lessonId) {
  try {
    // Insertar cuestionario
    const { data: quiz, error: quizError } = await supabase
      .from('cuestionarios')
      .insert({
        titulo: quizData.quiz_title,
        leccion_id: lessonId
      })
      .select()
      .single();
    
    if (quizError) {
      console.error('Error insertando cuestionario:', quizError);
      return false;
    }
    
    console.log(`✅ Cuestionario creado: ${quiz.titulo}`);
    
    // Insertar preguntas
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      
      // Insertar pregunta
      const { data: pregunta, error: preguntaError } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: quiz.id,
          pregunta: question.question,
          tipo: question.type || 'multiple_choice',
          orden: i + 1,
          explicacion: question.explanation
        })
        .select()
        .single();
      
      if (preguntaError) {
        console.error('Error insertando pregunta:', preguntaError);
        continue;
      }
      
      // Insertar opciones de respuesta
      if (question.options && question.options.length > 0) {
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j];
          
          const { error: opcionError } = await supabase
            .from('opciones_respuesta')
            .insert({
              pregunta_id: pregunta.id,
              opcion: option,
              es_correcta: j === question.correct, // Asumiendo que correct es el índice
              orden: j + 1
            });
          
          if (opcionError) {
            console.error('Error insertando opción:', opcionError);
          }
        }
      }
    }
    
    // Actualizar lección para marcar que tiene cuestionario
    await supabase
      .from('lecciones')
      .update({ tiene_cuestionario: true })
      .eq('id', lessonId);
    
    return true;
  } catch (error) {
    console.error('Error general insertando cuestionario:', error);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando inserción de cuestionarios...');
  
  const extractedDir = './extracted_content/curso_experto_conductas_adictivas';
  const jsonFiles = fs.readdirSync(extractedDir).filter(file => file.endsWith('.json'));
  
  for (const file of jsonFiles) {
    if (file === 'extraction-script.js') continue;
    
    console.log(`\n📄 Procesando archivo: ${file}`);
    
    try {
      const filePath = path.join(extractedDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const quizData = JSON.parse(fileContent);
      
      // Buscar la lección correspondiente
      const lessonTitle = lessonMapping[quizData.lesson_number];
      if (!lessonTitle) {
        console.log(`⚠️  No se encontró mapeo para lección ${quizData.lesson_number}`);
        continue;
      }
      
      const lessonId = await getLessonId(lessonTitle);
      if (!lessonId) {
        console.log(`⚠️  No se encontró lección: ${lessonTitle}`);
        continue;
      }
      
      // Insertar cada cuestionario
      for (const quiz of quizData.quizzes) {
        const success = await insertQuiz(quiz, lessonId);
        if (success) {
          console.log(`✅ Cuestionario insertado para lección: ${lessonTitle}`);
        } else {
          console.log(`❌ Error insertando cuestionario para lección: ${lessonTitle}`);
        }
      }
      
    } catch (error) {
      console.error(`Error procesando archivo ${file}:`, error);
    }
  }
  
  console.log('\n🎉 Proceso completado!');
}

// Ejecutar script
main().catch(console.error);