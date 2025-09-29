
// Corrected JavaScript for quiz extraction
// Run this in browser console on each lesson page

function extractQuizData() {
    const targetLessons = [
        "¿Qué es una adicción?",
        "Criterios para diagnosticar una conducta adictiva según DSM 5", 
        "Material Complementario y Ejercicios",
        "Adicciones Comportamentales",
        "Terapia integral de pareja",
        "Psicología positiva",
        "Mindfulness aplicado a la Conducta Adictiva",
        "Material complementario Mindfulness y ejercicio"
    ];
    
    const results = {
        pageTitle: document.title,
        url: window.location.href,
        quizzes: []
    };
    
    // Look for quiz questions on current page
    const questionElements = document.querySelectorAll('[class*="question"], [id*="question"], .quiz-question, .pregunta');
    
    questionElements.forEach((elem, index) => {
        const questionText = elem.textContent.trim();
        
        if (questionText && questionText.includes('?')) {
            // Look for answer options near this question
            const options = [];
            const optionElements = elem.querySelectorAll('input[type="radio"], input[type="checkbox"], option') || 
                                 elem.parentElement.querySelectorAll('input[type="radio"], input[type="checkbox"], option');
            
            optionElements.forEach(opt => {
                const label = opt.nextElementSibling || opt.parentElement;
                if (label && label.textContent) {
                    options.push(label.textContent.trim());
                }
            });
            
            results.quizzes.push({
                question: questionText,
                type: optionElements[0]?.type === 'checkbox' ? 'multiple_select' : 'multiple_choice',
                options: options,
                correct: null,
                explanation: null
            });
        }
    });
    
    return results;
}

// Usage: Run extractQuizData() on each lesson page after clicking "Expandir"
console.log('Quiz extraction function loaded. Run extractQuizData() on each lesson page.');
