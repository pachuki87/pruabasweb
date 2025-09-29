/**
 * Test script to verify send-corrections Netlify function
 * This script simulates the data that would be sent from the frontend form
 */

const testData = {
    type: 'quiz-responses',
    timestamp: new Date().toISOString(),
    source: 'instituto-lidera-elearning',
    studentInfo: {
        name: 'Pablo Cardona Feliu',
        email: 'pablocardonafeliu@gmail.com', // Email del usuario
        userId: null,
        quizId: 'evaluacion-adicciones',
        submittedAt: new Date().toISOString()
    },
    quizInfo: {
        title: 'Evaluación de Adicciones',
        lessonId: null,
        courseId: null,
        totalQuestions: 4,
        score: 8.5,
        maxScore: 10,
        percentage: 85,
        passed: true,
        timeSpent: 0,
        attemptNumber: 1
    },
    responses: [
        {
            questionNumber: 1,
            questionId: 'pregunta1',
            question: '¿Qué significa para usted ser adicto y cuáles considera que son las principales características de una conducta adictiva?',
            answer: 'Ser adicto significa tener una dependencia física y psicológica de una sustancia o conducta. Las características principales incluyen la pérdida de control, tolerancia, abstinencia y continuación del uso a pesar de las consecuencias negativas.',
            answerType: 'open',
            timeSpent: 0,
            submittedAt: new Date().toISOString()
        },
        {
            questionNumber: 2,
            questionId: 'pregunta2',
            question: 'Describa las principales consecuencias que las adicciones pueden tener en la vida de una persona y su entorno familiar.',
            answer: 'Las consecuencias incluyen problemas de salud, deterioro de relaciones personales, pérdida de empleo, dificultades económicas y problemas legales. En la familia, genera estrés, conflictos y codependencia.',
            answerType: 'open',
            timeSpent: 0,
            submittedAt: new Date().toISOString()
        },
        {
            questionNumber: 3,
            questionId: 'pregunta3',
            question: '¿Qué role considera que juega la familia en el proceso de recuperación de una persona con adicciones?',
            answer: 'La familia juega un rol fundamental en el apoyo emocional, la creación de un ambiente estable, la participación en terapia familiar y el establecimiento de límites saludables.',
            answerType: 'open',
            timeSpent: 0,
            submittedAt: new Date().toISOString()
        },
        {
            questionNumber: 4,
            questionId: 'pregunta4',
            question: 'Explique cómo el mindfulness puede ser una herramienta útil en el tratamiento de conductas adictivas.',
            answer: 'El mindfulness ayuda a desarrollar conciencia del presente, reducir el estrés, manejar cravings y mejorar la regulación emocional, técnicas clave en la recuperación de adicciones.',
            answerType: 'open',
            timeSpent: 0,
            submittedAt: new Date().toISOString()
        }
    ],
    rawData: {
        nombre: 'Pablo Cardona Feliu',
        email: 'pablocardonafeliu@gmail.com',
        pregunta1: 'Ser adicto significa tener una dependencia física y psicológica de una sustancia o conducta. Las características principales incluyen la pérdida de control, tolerancia, abstinencia y continuación del uso a pesar de las consecuencias negativas.',
        pregunta2: 'Las consecuencias incluyen problemas de salud, deterioro de relaciones personales, pérdida de empleo, dificultades económicas y problemas legales. En la familia, genera estrés, conflictos y codependencia.',
        pregunta3: 'La familia juega un rol fundamental en el apoyo emocional, la creación de un ambiente estable, la participación en terapia familiar y el establecimiento de límites saludables.',
        pregunta4: 'El mindfulness ayuda a desarrollar conciencia del presente, reducir el estrés, manejar cravings y mejorar la regulación emocional, técnicas clave en la recuperación de adicciones.'
    }
};

console.log('=== TEST DE send-corrections FUNCTION ===');
console.log('Test Data:');
console.log(JSON.stringify(testData, null, 2));
console.log('\nPayload size:', JSON.stringify(testData).length, 'bytes');
console.log('Email to be sent:', testData.studentInfo.email);
console.log('User name:', testData.studentInfo.name);

// Instructions to test:
console.log('\n=== INSTRUCCIONES PARA PROBAR ===');
console.log('1. Inicia el servidor de desarrollo con: npm run dev');
console.log('2. Abre http://localhost:5175 en el navegador');
console.log('3. Abre las herramientas de desarrollador (F12)');
console.log('4. Ve a la pestaña Console');
console.log('5. Copia y pega el siguiente código para probar la función:');
console.log(`
fetch('/.netlify/functions/send-corrections', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(${JSON.stringify(testData, null, 2)})
})
.then(response => response.json())
.then(data => {
    console.log('✅ Success:', data);
})
.catch(error => {
    console.error('❌ Error:', error);
});
`);

console.log('\n=== ESPERADO ===');
console.log('Si la función funciona correctamente, deberías ver:');
console.log('- ✅ Success en la consola');
console.log('- Un objeto de respuesta con success: true');
console.log('- El webhook de n8n debería recibir los datos incluyendo el email: pablocardonafeliu@gmail.com');

console.log('\n=== PARA VERIFICAR EN n8n ===');
console.log('1. Ve a tu instancia de n8n');
console.log('2. Busca el webhook con URL: https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e');
console.log('3. Deberías ver una nueva ejecución con los datos del test');
console.log('4. Verifica que el campo studentInfo.email contenga: pablocardonafeliu@gmail.com');