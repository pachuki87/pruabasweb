// Script para agregar las preguntas del MÓDULO 1 al QuizComponent
// Este contenido se debe agregar al QuizComponent.jsx

const modulo1Questions = [
  {
    id: 'm1q1',
    pregunta: 'El uso de fármacos interdictores se emplea para facilitar la abstinencia.',
    tipo: 'verdadero_falso',
    orden: 1,
    opciones_respuesta: [
      { id: 'm1q1a', opcion: 'Verdadero', es_correcta: true },
      { id: 'm1q1b', opcion: 'Falso', es_correcta: false }
    ]
  },
  {
    id: 'm1q2',
    pregunta: 'El paciente no debe tener autonomía en entornos no supervisados.',
    tipo: 'verdadero_falso',
    orden: 2,
    opciones_respuesta: [
      { id: 'm1q2a', opcion: 'Verdadero', es_correcta: false },
      { id: 'm1q2b', opcion: 'Falso', es_correcta: true }
    ]
  },
  {
    id: 'm1q3',
    pregunta: 'El entorno juega un papel fundamental en la recuperación del paciente.',
    tipo: 'verdadero_falso',
    orden: 3,
    opciones_respuesta: [
      { id: 'm1q3a', opcion: 'Verdadero', es_correcta: true },
      { id: 'm1q3b', opcion: 'Falso', es_correcta: false }
    ]
  },
  {
    id: 'm1q4',
    pregunta: 'La autonomía del paciente no es relevante en la recuperación.',
    tipo: 'verdadero_falso',
    orden: 4,
    opciones_respuesta: [
      { id: 'm1q4a', opcion: 'Verdadero', es_correcta: false },
      { id: 'm1q4b', opcion: 'Falso', es_correcta: true }
    ]
  },
  {
    id: 'm1q5',
    pregunta: 'Los fármacos interdictores se usan como parte de la farmacoterapia en adicciones.',
    tipo: 'verdadero_falso',
    orden: 5,
    opciones_respuesta: [
      { id: 'm1q5a', opcion: 'Verdadero', es_correcta: true },
      { id: 'm1q5b', opcion: 'Falso', es_correcta: false }
    ]
  },
  {
    id: 'm1q6',
    pregunta: 'Explica la importancia de la autonomía del paciente en entornos no supervisados.',
    tipo: 'texto_libre',
    orden: 6
  },
  {
    id: 'm1q7',
    pregunta: '¿Cómo afecta la farmacoterapia en el proceso de recuperación?',
    tipo: 'texto_libre',
    orden: 7
  },
  {
    id: 'm1q8',
    pregunta: 'Describe un caso en el que el entorno haya sido determinante en la recaída o recuperación del paciente.',
    tipo: 'texto_libre',
    orden: 8
  },
  {
    id: 'm1q9',
    pregunta: '¿Cuáles son las fases principales de un programa terapéutico en adicciones?',
    tipo: 'texto_libre',
    orden: 9
  },
  {
    id: 'm1q10',
    pregunta: '¿Qué papel cumple el entorno en el proceso de recuperación del paciente?',
    tipo: 'texto_libre',
    orden: 10
  },
  {
    id: 'm1q11',
    pregunta: 'Menciona ejemplos de fármacos utilizados en la farmacoterapia de apoyo.',
    tipo: 'texto_libre',
    orden: 11
  }
];

console.log('Preguntas del MÓDULO 1 - Fundamentos del programa terapéutico en adicciones:');
console.log(JSON.stringify(modulo1Questions, null, 2));

// Instrucciones:
// 1. Copiar estas preguntas
// 2. Agregarlas al QuizComponent.jsx en la sección de preguntas hardcodeadas
// 3. Crear un nuevo cuestionario para el MÓDULO 1 si es necesario