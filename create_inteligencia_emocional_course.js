import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createInteligenciaEmocionalCourse() {
  try {
    console.log('Creando curso de Inteligencia Emocional...');
    
    // 1. Crear el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .insert({
        titulo: 'Inteligencia Emocional',
        descripcion: 'Curso especializado en inteligencia emocional aplicada a la prevención y tratamiento de conductas adictivas. Desarrolla habilidades para el manejo emocional, autoconocimiento y regulación emocional.',
        imagen_url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=emotional%20intelligence%20brain%20with%20colorful%20emotions%20modern%20educational%20style&image_size=landscape_16_9'
      })
      .select()
      .single();

    if (cursoError) {
      console.error('Error creando curso:', cursoError);
      return;
    }

    console.log('Curso creado:', curso);
    const cursoId = curso.id;

    // 2. Crear lecciones basadas en el contenido del workshop de inteligencia emocional
    const lecciones = [
      {
        titulo: 'Introducción a la Inteligencia Emocional',
        descripcion: 'Conceptos fundamentales de la inteligencia emocional y su importancia en el tratamiento de adicciones.',
        contenido_html: `
          <h2>Introducción a la Inteligencia Emocional</h2>
          <p>La inteligencia emocional es la capacidad de reconocer, comprender y gestionar nuestras propias emociones, así como las de los demás.</p>
          <h3>Objetivos de la lección:</h3>
          <ul>
            <li>Comprender qué es la inteligencia emocional</li>
            <li>Identificar los componentes principales</li>
            <li>Reconocer su importancia en el tratamiento de adicciones</li>
          </ul>
          <h3>Componentes de la Inteligencia Emocional:</h3>
          <ol>
            <li><strong>Autoconciencia emocional:</strong> Reconocer nuestras emociones</li>
            <li><strong>Autorregulación:</strong> Gestionar nuestras emociones</li>
            <li><strong>Motivación:</strong> Usar las emociones para alcanzar objetivos</li>
            <li><strong>Empatía:</strong> Comprender las emociones de otros</li>
            <li><strong>Habilidades sociales:</strong> Manejar relaciones interpersonales</li>
          </ol>
        `,
        orden: 1,
        duracion_estimada: 60,
        tiene_cuestionario: true
      },
      {
        titulo: 'Autoconocimiento y Conciencia Emocional',
        descripcion: 'Desarrollo de la capacidad de reconocer y comprender nuestras propias emociones.',
        contenido_html: `
          <h2>Autoconocimiento y Conciencia Emocional</h2>
          <p>El autoconocimiento emocional es la base de la inteligencia emocional. Implica ser consciente de nuestras emociones en el momento que las experimentamos.</p>
          <h3>Técnicas para desarrollar autoconciencia:</h3>
          <ul>
            <li><strong>Mindfulness:</strong> Atención plena al momento presente</li>
            <li><strong>Diario emocional:</strong> Registro de emociones y situaciones</li>
            <li><strong>Pausa reflexiva:</strong> Tomarse tiempo antes de reaccionar</li>
            <li><strong>Identificación de triggers:</strong> Reconocer qué desencadena nuestras emociones</li>
          </ul>
          <h3>Ejercicio práctico:</h3>
          <p>Durante los próximos días, lleva un registro de tus emociones cada 2 horas. Anota:</p>
          <ol>
            <li>¿Qué emoción estás sintiendo?</li>
            <li>¿Qué intensidad tiene (1-10)?</li>
            <li>¿Qué situación la provocó?</li>
            <li>¿Cómo reaccionaste?</li>
          </ol>
        `,
        orden: 2,
        duracion_estimada: 75,
        tiene_cuestionario: true
      },
      {
        titulo: 'Regulación Emocional y Manejo del Estrés',
        descripcion: 'Estrategias para gestionar y regular las emociones de manera saludable.',
        contenido_html: `
          <h2>Regulación Emocional y Manejo del Estrés</h2>
          <p>La regulación emocional es la capacidad de influir en qué emociones tenemos, cuándo las tenemos y cómo las experimentamos y expresamos.</p>
          <h3>Estrategias de regulación emocional:</h3>
          <ul>
            <li><strong>Reevaluación cognitiva:</strong> Cambiar la interpretación de la situación</li>
            <li><strong>Técnicas de respiración:</strong> Control del sistema nervioso</li>
            <li><strong>Relajación progresiva:</strong> Reducción de la tensión física</li>
            <li><strong>Distracción saludable:</strong> Redireccionar la atención</li>
            <li><strong>Expresión emocional:</strong> Comunicar de manera asertiva</li>
          </ul>
          <h3>Técnica de respiración 4-7-8:</h3>
          <ol>
            <li>Inhala por la nariz durante 4 segundos</li>
            <li>Mantén la respiración durante 7 segundos</li>
            <li>Exhala por la boca durante 8 segundos</li>
            <li>Repite 4 veces</li>
          </ol>
          <h3>Manejo del estrés en adicciones:</h3>
          <p>El estrés es un factor de riesgo importante para las recaídas. Aprender a manejarlo es crucial para la recuperación.</p>
        `,
        orden: 3,
        duracion_estimada: 90,
        tiene_cuestionario: true
      },
      {
        titulo: 'Empatía y Habilidades Sociales',
        descripcion: 'Desarrollo de la capacidad empática y habilidades para las relaciones interpersonales.',
        contenido_html: `
          <h2>Empatía y Habilidades Sociales</h2>
          <p>La empatía es la capacidad de comprender y compartir los sentimientos de otra persona. Es fundamental para establecer relaciones saludables.</p>
          <h3>Tipos de empatía:</h3>
          <ul>
            <li><strong>Empatía cognitiva:</strong> Comprender intelectualmente las emociones del otro</li>
            <li><strong>Empatía emocional:</strong> Sentir las emociones del otro</li>
            <li><strong>Empatía compasiva:</strong> Actuar para ayudar basándose en la comprensión empática</li>
          </ul>
          <h3>Habilidades sociales clave:</h3>
          <ul>
            <li><strong>Escucha activa:</strong> Prestar atención completa al interlocutor</li>
            <li><strong>Comunicación asertiva:</strong> Expresar necesidades respetando a otros</li>
            <li><strong>Resolución de conflictos:</strong> Manejar desacuerdos constructivamente</li>
            <li><strong>Trabajo en equipo:</strong> Colaborar efectivamente</li>
          </ul>
          <h3>Ejercicio de escucha activa:</h3>
          <p>Practica con un compañero:</p>
          <ol>
            <li>Una persona habla durante 3 minutos sobre un tema personal</li>
            <li>La otra escucha sin interrumpir, manteniendo contacto visual</li>
            <li>El oyente resume lo escuchado y refleja las emociones percibidas</li>
            <li>Intercambien roles</li>
          </ol>
        `,
        orden: 4,
        duracion_estimada: 75,
        tiene_cuestionario: true
      },
      {
        titulo: 'Inteligencia Emocional en el Tratamiento de Adicciones',
        descripcion: 'Aplicación específica de la inteligencia emocional en el contexto del tratamiento de adicciones.',
        contenido_html: `
          <h2>Inteligencia Emocional en el Tratamiento de Adicciones</h2>
          <p>La inteligencia emocional juega un papel crucial en la prevención de recaídas y el mantenimiento de la sobriedad.</p>
          <h3>Emociones y adicción:</h3>
          <ul>
            <li><strong>Emociones como triggers:</strong> Identificar emociones que llevan al consumo</li>
            <li><strong>Regulación emocional:</strong> Alternativas saludables al consumo</li>
            <li><strong>Tolerancia a la frustración:</strong> Manejar emociones difíciles sin consumir</li>
            <li><strong>Autoeficacia:</strong> Confianza en la capacidad de mantenerse sobrio</li>
          </ul>
          <h3>Estrategias específicas:</h3>
          <ul>
            <li><strong>Plan de prevención de recaídas:</strong> Identificar situaciones de riesgo</li>
            <li><strong>Red de apoyo emocional:</strong> Personas que brindan soporte</li>
            <li><strong>Actividades alternativas:</strong> Opciones saludables para manejar emociones</li>
            <li><strong>Mindfulness en recuperación:</strong> Atención plena para prevenir recaídas</li>
          </ul>
          <h3>Caso práctico:</h3>
          <p>Analiza el siguiente caso y propón estrategias de inteligencia emocional:</p>
          <blockquote>
            <p>"María lleva 6 meses sobria. Hoy tuvo una discusión fuerte con su jefe y se siente muy frustrada y enojada. Normalmente, en estas situaciones bebía alcohol para 'calmarse'. ¿Qué estrategias de inteligencia emocional podría usar?"</p>
          </blockquote>
        `,
        orden: 5,
        duracion_estimada: 90,
        tiene_cuestionario: true
      },
      {
        titulo: 'Práctica y Aplicación de Técnicas',
        descripcion: 'Ejercicios prácticos y aplicación de las técnicas de inteligencia emocional aprendidas.',
        contenido_html: `
          <h2>Práctica y Aplicación de Técnicas</h2>
          <p>En esta lección final, integraremos todos los conceptos aprendidos a través de ejercicios prácticos.</p>
          <h3>Plan personal de inteligencia emocional:</h3>
          <ol>
            <li><strong>Autoevaluación:</strong> Identifica tus fortalezas y áreas de mejora</li>
            <li><strong>Objetivos específicos:</strong> Define metas concretas y medibles</li>
            <li><strong>Estrategias personalizadas:</strong> Selecciona técnicas que funcionen para ti</li>
            <li><strong>Sistema de seguimiento:</strong> Cómo vas a monitorear tu progreso</li>
          </ol>
          <h3>Ejercicios de integración:</h3>
          <ul>
            <li><strong>Role-playing:</strong> Practica situaciones desafiantes</li>
            <li><strong>Diario de progreso:</strong> Registra avances diarios</li>
            <li><strong>Feedback de otros:</strong> Solicita retroalimentación sobre tu desarrollo</li>
            <li><strong>Revisión semanal:</strong> Evalúa y ajusta tu plan</li>
          </ul>
          <h3>Recursos para continuar:</h3>
          <ul>
            <li>Libros recomendados sobre inteligencia emocional</li>
            <li>Apps de mindfulness y meditación</li>
            <li>Grupos de apoyo y comunidades</li>
            <li>Profesionales especializados</li>
          </ul>
          <h3>Compromiso personal:</h3>
          <p>Escribe un compromiso personal de cómo vas a aplicar la inteligencia emocional en tu vida diaria y en tu proceso de recuperación.</p>
        `,
        orden: 6,
        duracion_estimada: 90,
        tiene_cuestionario: true
      }
    ];

    // 3. Insertar lecciones
    console.log('Creando lecciones...');
    for (let i = 0; i < lecciones.length; i++) {
      const leccion = lecciones[i];
      const { data: leccionData, error: leccionError } = await supabase
        .from('lecciones')
        .insert({
          curso_id: cursoId,
          titulo: leccion.titulo,
          descripcion: leccion.descripcion,
          contenido_html: leccion.contenido_html,
          orden: leccion.orden,
          duracion_estimada: leccion.duracion_estimada,
          imagen_url: `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=emotional%20intelligence%20lesson%20${leccion.orden}%20educational%20illustration&image_size=landscape_4_3`,
          tiene_cuestionario: leccion.tiene_cuestionario
        })
        .select()
        .single();

      if (leccionError) {
        console.error(`Error creando lección ${leccion.titulo}:`, leccionError);
      } else {
        console.log(`Lección creada: ${leccionData.titulo}`);
        
        // Crear cuestionario básico para cada lección
        if (leccion.tiene_cuestionario) {
          await createBasicQuiz(leccionData.id, leccion.titulo, i + 1);
        }
      }
    }

    // 4. Crear materiales (PDFs)
    console.log('Creando materiales...');
    const materiales = [
      {
        titulo: 'Informe: Educación Emocional para Conductas Adictivas',
        descripcion: 'Documento técnico sobre la aplicación de la educación emocional en el tratamiento de adicciones.',
        tipo_material: 'pdf',
        url_archivo: '/inteligencia_emocional_drive/9) INTELIGENCIA EMOCIONAL/Informe-Educación-emocional-para-las-conductas-adictivas.pdf'
      },
      {
        titulo: 'Presentación: Inteligencia Emocional',
        descripcion: 'Presentación completa sobre los conceptos y técnicas de inteligencia emocional.',
        tipo_material: 'pdf',
        url_archivo: '/inteligencia_emocional_drive/9) INTELIGENCIA EMOCIONAL/PPT INTELIGENCIA EMOCIONAL.pdf'
      }
    ];

    for (const material of materiales) {
      const { data: materialData, error: materialError } = await supabase
        .from('materiales')
        .insert({
          curso_id: cursoId,
          titulo: material.titulo,
          descripcion: material.descripcion,
          tipo_material: material.tipo_material,
          url_archivo: material.url_archivo
        });

      if (materialError) {
        console.error(`Error creando material ${material.titulo}:`, materialError);
      } else {
        console.log(`Material creado: ${material.titulo}`);
      }
    }

    console.log('¡Curso de Inteligencia Emocional creado exitosamente!');
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

async function createBasicQuiz(leccionId, leccionTitulo, leccionNumero) {
  try {
    // Crear cuestionario
    const { data: cuestionario, error: cuestionarioError } = await supabase
      .from('cuestionarios')
      .insert({
        leccion_id: leccionId,
        titulo: `Evaluación: ${leccionTitulo}`
      })
      .select()
      .single();

    if (cuestionarioError) {
      console.error('Error creando cuestionario:', cuestionarioError);
      return;
    }

    // Preguntas básicas según la lección
    const preguntasPorLeccion = {
      1: [
        {
          pregunta: '¿Cuáles son los cinco componentes principales de la inteligencia emocional?',
          opciones: [
            'Autoconciencia, autorregulación, motivación, empatía, habilidades sociales',
            'Inteligencia, emoción, control, comunicación, liderazgo',
            'Pensamiento, sentimiento, acción, reflexión, evaluación',
            'Conocimiento, comprensión, aplicación, análisis, síntesis'
          ],
          respuesta_correcta: 0
        },
        {
          pregunta: '¿Por qué es importante la inteligencia emocional en el tratamiento de adicciones?',
          opciones: [
            'Porque las emociones no influyen en las adicciones',
            'Porque ayuda a reconocer y gestionar emociones que pueden llevar al consumo',
            'Porque es más importante que el tratamiento médico',
            'Porque elimina completamente el deseo de consumir'
          ],
          respuesta_correcta: 1
        }
      ],
      2: [
        {
          pregunta: '¿Qué es la autoconciencia emocional?',
          opciones: [
            'La capacidad de controlar las emociones de otros',
            'La habilidad de suprimir todas las emociones',
            'La capacidad de reconocer y comprender nuestras propias emociones',
            'La técnica para evitar sentir emociones negativas'
          ],
          respuesta_correcta: 2
        },
        {
          pregunta: '¿Cuál es una técnica efectiva para desarrollar autoconciencia?',
          opciones: [
            'Evitar situaciones emocionales',
            'Llevar un diario emocional',
            'Ignorar las emociones negativas',
            'Reaccionar inmediatamente a las emociones'
          ],
          respuesta_correcta: 1
        }
      ],
      3: [
        {
          pregunta: '¿Qué es la regulación emocional?',
          opciones: [
            'Eliminar todas las emociones negativas',
            'La capacidad de influir en qué emociones tenemos y cómo las experimentamos',
            'Controlar las emociones de otras personas',
            'Expresar todas las emociones sin filtro'
          ],
          respuesta_correcta: 1
        },
        {
          pregunta: '¿Cuál es la secuencia correcta de la técnica de respiración 4-7-8?',
          opciones: [
            'Inhalar 7, mantener 4, exhalar 8',
            'Inhalar 4, mantener 7, exhalar 8',
            'Inhalar 8, mantener 4, exhalar 7',
            'Inhalar 4, mantener 8, exhalar 7'
          ],
          respuesta_correcta: 1
        }
      ],
      4: [
        {
          pregunta: '¿Qué es la empatía cognitiva?',
          opciones: [
            'Sentir las mismas emociones que otra persona',
            'Comprender intelectualmente las emociones del otro',
            'Actuar para ayudar basándose en la comprensión empática',
            'Evitar las emociones de otras personas'
          ],
          respuesta_correcta: 1
        },
        {
          pregunta: '¿Cuál es un componente clave de la escucha activa?',
          opciones: [
            'Interrumpir para dar consejos',
            'Pensar en la respuesta mientras el otro habla',
            'Mantener contacto visual y prestar atención completa',
            'Cambiar el tema cuando sea incómodo'
          ],
          respuesta_correcta: 2
        }
      ],
      5: [
        {
          pregunta: '¿Cómo pueden las emociones actuar como triggers en las adicciones?',
          opciones: [
            'Las emociones no tienen relación con las adicciones',
            'Ciertas emociones pueden desencadenar el deseo de consumir',
            'Solo las emociones positivas causan recaídas',
            'Las emociones siempre previenen el consumo'
          ],
          respuesta_correcta: 1
        },
        {
          pregunta: '¿Qué es un plan de prevención de recaídas?',
          opciones: [
            'Un documento legal para evitar el consumo',
            'Una estrategia para identificar situaciones de riesgo y cómo manejarlas',
            'Un medicamento para prevenir recaídas',
            'Una técnica de meditación específica'
          ],
          respuesta_correcta: 1
        }
      ],
      6: [
        {
          pregunta: '¿Qué debe incluir un plan personal de inteligencia emocional?',
          opciones: [
            'Solo objetivos generales',
            'Autoevaluación, objetivos específicos, estrategias y seguimiento',
            'Únicamente técnicas de relajación',
            'Solo feedback de otras personas'
          ],
          respuesta_correcta: 1
        },
        {
          pregunta: '¿Por qué es importante la revisión semanal en el desarrollo de la inteligencia emocional?',
          opciones: [
            'Para cumplir con un requisito académico',
            'Para evaluar y ajustar el plan de desarrollo personal',
            'Para impresionar a otros con el progreso',
            'Para evitar practicar las técnicas aprendidas'
          ],
          respuesta_correcta: 1
        }
      ]
    };

    const preguntas = preguntasPorLeccion[leccionNumero] || [];
    
    for (let i = 0; i < preguntas.length; i++) {
      const preguntaData = preguntas[i];
      
      // Crear pregunta
      const { data: pregunta, error: preguntaError } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: cuestionario.id,
          pregunta: preguntaData.pregunta,
          tipo: 'multiple_choice',
          orden: i + 1
        })
        .select()
        .single();

      if (preguntaError) {
        console.error('Error creando pregunta:', preguntaError);
        continue;
      }

      // Crear opciones de respuesta
      for (let j = 0; j < preguntaData.opciones.length; j++) {
        const { error: opcionError } = await supabase
          .from('opciones_respuesta')
          .insert({
            pregunta_id: pregunta.id,
            opcion: preguntaData.opciones[j],
            es_correcta: j === preguntaData.respuesta_correcta,
            orden: j + 1
          });

        if (opcionError) {
          console.error('Error creando opción:', opcionError);
        }
      }
    }

    console.log(`Cuestionario creado para: ${leccionTitulo}`);
    
  } catch (error) {
    console.error('Error creando cuestionario:', error);
  }
}

// Ejecutar la función
createInteligenciaEmocionalCourse();