import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

const contenidoHTML = `
<div class="lesson-content">
    <div class="content-section">
        <h2 class="section-title">1. DEFINICIÓN DE SER ADICTO:</h2>
        <div class="definition-box">
            <p>Se puede definir como aquel comportamiento de búsqueda, obtención y consumo de drogas o realización de la conducta problema (juego, sexo, compras, móvil…) en la que esta cobra más protagonismo que otras situaciones que anteriormente eran importantes para la persona, haciendo que estas pasen a un segundo plano o le parezcan innecesarias.</p>
        </div>
    </div>

    <div class="content-section">
        <h2 class="section-title">2. ORIGEN</h2>
        
        <div class="origin-section">
            <div class="image-container">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="20" width="60" height="40" rx="20" fill="#007bff" stroke="#0056b3" stroke-width="2"/>
                    <circle cx="30" cy="40" r="3" fill="white"/>
                    <circle cx="50" cy="40" r="3" fill="white"/>
                    <rect x="35" y="35" width="10" height="10" fill="white"/>
                </svg>
            </div>
            
            <div class="origin-flow">
                <div class="origin-item">TODA CONDUCTA ADICTIVA</div>
                <div class="arrow-down"></div>
                <div class="origin-item">SE ORIGINA POR</div>
                <div class="arrow-down"></div>
                <div class="origin-item">UN DOLOR EMOCIONAL</div>
            </div>
        </div>
        
        <div class="highlight-text">
            La adicción es una respuesta a un sufrimiento emocional no resuelto
        </div>
    </div>
</div>

<style>
.lesson-content {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.content-section {
    margin-bottom: 30px;
}

.section-title {
    color: #007bff;
    font-size: 1.5em;
    margin-bottom: 20px;
    font-weight: bold;
}

.definition-box {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

.origin-section {
    text-align: center;
    margin: 30px 0;
}

.image-container {
    margin: 20px 0;
}

.origin-flow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin: 30px 0;
}

.origin-item {
    background-color: #007bff;
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 1.1em;
    text-align: center;
    max-width: 300px;
}

.arrow-down {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 20px solid #007bff;
}

.highlight-text {
    background-color: #e3f2fd;
    color: #1565c0;
    padding: 20px;
    border-radius: 8px;
    font-style: italic;
    font-size: 1.1em;
    margin-top: 30px;
    text-align: center;
}
</style>
`;

async function updateLesson() {
    try {
        const { data, error } = await supabase
            .from('lecciones')
            .update({ contenido_html: contenidoHTML })
            .eq('id', 'd44cb089-75f9-4d7f-8603-2de303c01a74');
        
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Actualización exitosa:', data);
        }
    } catch (err) {
        console.log('Error de conexión:', err);
    }
}

updateLesson();