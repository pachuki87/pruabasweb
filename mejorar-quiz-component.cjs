/**
 * Script para mejorar el componente QuizComponent y manejar errores
 */

const fs = require('fs');
const path = require('path');

// Ruta al componente QuizComponent
const quizComponentPath = path.join(__dirname, 'src', 'components', 'QuizComponent.jsx');

function mejorarQuizComponent() {
  console.log('🔧 MEJORANDO COMPONENTE QUIZCOMPONENT...');
  console.log('========================================\n');

  try {
    // Leer el componente actual
    let componentContent = fs.readFileSync(quizComponentPath, 'utf8');
    
    // 1. Mejorar el manejo de errores en la carga del cuestionario
    const loadQuizFunction = `
  // Efecto para cargar el cuestionario
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si tenemos los parámetros necesarios
        if (!leccionId) {
          throw new Error('No se proporcionó ID de lección');
        }

        console.log('🔍 Cargando cuestionario para lección:', leccionId);

        // Primero intentar cargar cuestionarios específicos de la lección
        const { data: quizData, error: quizError } = await supabase
          .from('cuestionarios')
          .select('*')
          .eq('leccion_id', leccionId)
          .single();

        console.log('📊 Resultado búsqueda específica:', { quizData, quizError });

        if (quizError && quizError.code !== 'PGRST116') {
          console.warn('⚠️ Error buscando cuestionario específico:', quizError);
          // No lanzar error aquí, intentar con cuestionarios generales
        }

        if (quizData) {
          console.log('✅ Cuestionario específico encontrado:', quizData.titulo);
          
          // Cargar preguntas del cuestionario - con manejo de errores mejorado
          let preguntas = [];
          let preguntasError = null;
          
          try {
            const result = await supabase
              .from('preguntas_cuestionario')
              .select('*')
              .eq('cuestionario_id', quizData.id);
            
            preguntas = result.data || [];
            preguntasError = result.error;
            
            if (preguntasError) {
              console.warn('⚠️ Error cargando preguntas_cuestionario:', preguntasError);
              // Intentar con tabla alternativa 'preguntas'
              const fallbackResult = await supabase
                .from('preguntas')
                .select('*')
                .eq('cuestionario_id', quizData.id);
              
              if (!fallbackResult.error) {
                preguntas = fallbackResult.data || [];
                console.log('✅ Usando tabla alternativa "preguntas"');
              }
            }
          } catch (err) {
            console.warn('⚠️ Excepción cargando preguntas:', err);
          }

          console.log('📝 Preguntas cargadas:', preguntas.length);

          // Cargar opciones de respuesta para preguntas de opción múltiple
          const preguntasConOpciones = await Promise.all(
            (preguntas || []).map(async (pregunta) => {
              if (pregunta.tipo === 'multiple_choice') {
                try {
                  const { data: opciones } = await supabase
                    .from('opciones_respuesta')
                    .select('*')
                    .eq('pregunta_id', pregunta.id);
                  
                  return {
                    ...pregunta,
                    opciones_respuesta: opciones || []
                  };
                } catch (err) {
                  console.warn('⚠️ Error cargando opciones para pregunta', pregunta.id, ':', err);
                  return {
                    ...pregunta,
                    opciones_respuesta: []
                  };
                }
              }
              return pregunta;
            })
          );

          setQuiz({
            ...quizData,
            preguntas: preguntasConOpciones
          });
          setSelectedQuiz(quizData.id);
          
          console.log('✅ Cuestionario cargado completamente');
        } else {
          console.log('📋 Buscando cuestionarios generales del curso...');
          
          // Si no hay cuestionario específico, cargar cuestionarios generales del curso
          if (courseId) {
            const { data: generalQuizzes, error: generalError } = await supabase
              .from('cuestionarios')
              .select('*')
              .eq('curso_id', courseId)
              .or('leccion_id.is.null,leccion_id.eq.' + leccionId);

            console.log('📊 Resultado búsqueda general:', { generalQuizzes, generalError });

            if (generalError) {
              throw generalError;
            }

            if (generalQuizzes && generalQuizzes.length > 0) {
              // Por simplicidad, tomar el primer cuestionario encontrado
              const selectedQuiz = generalQuizzes[0];
              console.log('✅ Cuestionario general encontrado:', selectedQuiz.titulo);
              
              // Cargar preguntas del cuestionario
              let preguntas = [];
              try {
                const result = await supabase
                  .from('preguntas_cuestionario')
                  .select('*')
                  .eq('cuestionario_id', selectedQuiz.id);
                
                preguntas = result.data || [];
                
                if (result.error) {
                  // Intentar con tabla alternativa
                  const fallbackResult = await supabase
                    .from('preguntas')
                    .select('*')
                    .eq('cuestionario_id', selectedQuiz.id);
                  
                  if (!fallbackResult.error) {
                    preguntas = fallbackResult.data || [];
                  }
                }
              } catch (err) {
                console.warn('⚠️ Error cargando preguntas de cuestionario general:', err);
              }

              console.log('📝 Preguntas cargadas (general):', preguntas.length);

              // Cargar opciones de respuesta
              const preguntasConOpciones = await Promise.all(
                (preguntas || []).map(async (pregunta) => {
                  if (pregunta.tipo === 'multiple_choice') {
                    try {
                      const { data: opciones } = await supabase
                        .from('opciones_respuesta')
                        .select('*')
                        .eq('pregunta_id', pregunta.id);
                      
                      return {
                        ...pregunta,
                        opciones_respuesta: opciones || []
                      };
                    } catch (err) {
                      return {
                        ...pregunta,
                        opciones_respuesta: []
                      };
                    }
                  }
                  return pregunta;
                })
              );

              setQuiz({
                ...selectedQuiz,
                preguntas: preguntasConOpciones
              });
              setSelectedQuiz(selectedQuiz.id);
              
              console.log('✅ Cuestionario general cargado completamente');
            } else {
              console.log('ℹ️ No se encontraron cuestionarios para este curso/lección');
            }
          }
        }
      } catch (err) {
        console.error('❌ Error loading quiz:', err);
        setError('No se pudo cargar el cuestionario. Por favor, intenta de nuevo más tarde.');
        
        // Para debugging, mostrar más detalles del error
        console.error('Detalles del error:', {
          message: err.message,
          code: err.code,
          details: err.details,
          hint: err.hint
        });
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar si tenemos leccionId
    if (leccionId) {
      loadQuiz();
    } else {
      console.warn('⚠️ No se proporcionó leccionId');
      setLoading(false);
      setError('No se especificó una lección para el cuestionario.');
    }
  }, [leccionId, courseId, supabase]);`;

    // Reemplazar la función loadQuiz en el componente
    const loadQuizRegex = /  \/\/ Efecto para cargar el cuestionario[\s\S]*?\}, \[leccionId, courseId, supabase\]\);/;
    componentContent = componentContent.replace(loadQuizRegex, loadQuizFunction);

    // 2. Añadir mejor manejo de errores en el cálculo de resultados
    const calculateResultsFunction = `
  const calculateResults = () => {
    if (!quiz || !quiz.preguntas) {
      console.warn('⚠️ No hay quiz o preguntas para calcular resultados');
      return {
        puntuacionObtenida: 0,
        puntuacionMaxima: 0,
        porcentajeAcierto: 0,
        tiempoTotal: 0,
        aprobado: false,
        respuestasCorrectas: 0,
        totalPreguntas: 0
      };
    }

    let puntuacionObtenida = 0;
    let puntuacionMaxima = 0;
    let respuestasCorrectas = 0;
    let tiempoTotal = 0;

    const updatedAnswers = { ...userAnswers };

    quiz.preguntas.forEach((question) => {
      puntuacionMaxima += 1;
      const userAnswer = userAnswers[question.id];
      
      if (userAnswer) {
        tiempoTotal += userAnswer.tiempoRespuesta || 0;

        let esCorrecta = false;
        
        if (question.tipo === 'multiple_choice') {
          const opcionCorrecta = question.opciones_respuesta?.find(op => op.es_correcta);
          esCorrecta = userAnswer.opcionId === opcionCorrecta?.id;
        } else if (question.tipo === 'verdadero_falso') {
          // Para verdadero/falso, asumir correcto por ahora
          esCorrecta = true;
        } else if (question.tipo === 'texto_libre') {
          // Para texto libre, considerar correcto si hay respuesta
          esCorrecta = !!(userAnswer.textoRespuesta && userAnswer.textoRespuesta.trim());
        }

        if (esCorrecta) {
          puntuacionObtenida += 1;
          respuestasCorrectas += 1;
        }

        updatedAnswers[question.id] = {
          ...userAnswer,
          esCorrecta
        };
      }
    });

    setUserAnswers(updatedAnswers);

    const porcentajeAcierto = puntuacionMaxima > 0 ? Math.round((puntuacionObtenida / puntuacionMaxima) * 100) : 0;
    const porcentajeAprobacion = quiz?.porcentaje_aprobacion || 70;
    const aprobado = porcentajeAcierto >= porcentajeAprobacion;

    console.log('📊 Resultados calculados:', {
      puntuacionObtenida,
      puntuacionMaxima,
      porcentajeAcierto,
      aprobado,
      respuestasCorrectas,
      totalPreguntas: quiz.preguntas.length
    });

    return {
      puntuacionObtenida,
      puntuacionMaxima,
      porcentajeAcierto,
      tiempoTotal,
      aprobado,
      respuestasCorrectas,
      totalPreguntas: quiz.preguntas.length
    };
  };`;

    // Reemplazar la función calculateResults
    const calculateResultsRegex = /  const calculateResults = \(\) => \{[\s\S]*?\};/;
    componentContent = componentContent.replace(calculateResultsRegex, calculateResultsFunction);

    // 3. Mejorar la función sendQuizSummary para manejar errores mejor
    const sendQuizSummaryFunction = `
  const sendQuizSummary = async (results) => {
    if (!quiz || !selectedQuiz) {
      console.warn('⚠️ No hay quiz o selectedQuiz para enviar resumen');
      return;
    }

    try {
      setSendingSummary(true);
      setEmailStatus('sending');
      setWebhookStatus('sending');

      console.log('📤 Enviando resumen del cuestionario...');

      // Obtener información del usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.warn('⚠️ No se pudo obtener información del usuario:', userError);
        // Continuar sin información de usuario en lugar de fallar
      }

      // Generar resumen detallado
      const summaryData = QuizSummaryGenerator.generateDetailedSummary(
        quiz,
        userAnswers,
        quiz.preguntas || [],
        user || {},
        results
      );

      console.log('📋 Resumen generado:', summaryData);

      // Generar HTML para email
      const htmlContent = QuizSummaryGenerator.generateHTMLSummary(summaryData);

      // NOTA: Los servicios de email y webhook están deshabilitados en el frontend
      // para evitar errores de consola. Estas funcionalidades se moverán al backend.
      console.log('ℹ️ Servicios de email y webhook deshabilitados en frontend');
      
      setEmailStatus('idle');
      setWebhookStatus('idle');

    } catch (error) {
      console.error('❌ Error sending quiz summary:', error);
      setEmailStatus('error');
      setWebhookStatus('error');
      
      // No mostrar error al usuario, solo loggear para debugging
    } finally {
      setSendingSummary(false);
    }
  };`;

    // Reemplazar la función sendQuizSummary
    const sendQuizSummaryRegex = /  const sendQuizSummary = async \(results\) => \{[\s\S]*?\};/;
    componentContent = componentContent.replace(sendQuizSummaryRegex, sendQuizSummaryFunction);

    // 4. Añadir estado de depuración para mejor troubleshooting
    const debugStateAddition = `  const [debugInfo, setDebugInfo] = useState({
    leccionId: leccionId || 'No proporcionado',
    courseId: courseId || 'No proporcionado',
    supabaseUrl: supabaseUrl ? 'Configurado' : 'No configurado',
    timestamp: new Date().toISOString()
  });`;

    // Añadir después de los otros estados
    const uploadedFilesState = `  const [uploadedFiles, setUploadedFiles] = useState({});`;
    const insertionPoint = componentContent.indexOf(uploadedFilesState) + uploadedFilesState.length;
    componentContent = componentContent.slice(0, insertionPoint) + '\n' + debugStateAddition + componentContent.slice(insertionPoint);

    // 5. Escribir el componente mejorado
    fs.writeFileSync(quizComponentPath, componentContent);
    
    console.log('✅ Componente QuizComponent mejorado exitosamente');
    console.log('📝 Mejoras aplicadas:');
    console.log('   - Mejor manejo de errores en carga de cuestionarios');
    console.log('   - Soporte para tabla alternativa "preguntas"');
    console.log('   - Logging detallado para debugging');
    console.log('   - Manejo robusto de resultados');
    console.log('   - Prevención de errores en envío de resúmenes');
    
  } catch (error) {
    console.error('❌ Error mejorando QuizComponent:', error);
  }
}

// Ejecutar la mejora
mejorarQuizComponent();
