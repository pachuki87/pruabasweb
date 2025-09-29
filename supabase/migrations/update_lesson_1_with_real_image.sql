-- Actualizar lección 1 con imagen real de la píldora
UPDATE lecciones 
SET contenido_html = '
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Qué significa ser adicto?</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .blue-title {
            color: #2563eb;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0 15px 0;
        }
        .definition-text {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 20px;
            text-align: justify;
        }
        .central-concept {
            background-color: #dbeafe;
            border: 2px solid #2563eb;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            font-weight: bold;
            font-size: 18px;
            color: #1e40af;
        }
        .pill-image {
            display: block;
            margin: 20px auto;
            max-width: 200px;
            height: auto;
            border-radius: 10px;
        }
        .explanation-text {
            font-size: 16px;
            line-height: 1.8;
            margin-top: 20px;
            text-align: justify;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="blue-title">1. DEFINICIÓN DE SER ADICTO:</h1>
        
        <p class="definition-text">
            Ser adicto significa tener una dependencia física, psicológica o emocional hacia una sustancia, comportamiento o actividad específica, que interfiere significativamente con la vida diaria, las relaciones interpersonales, el trabajo o la salud de la persona.
        </p>
        
        <p class="definition-text">
            La adicción se caracteriza por la pérdida de control sobre el consumo o la realización de la actividad adictiva, la presencia de tolerancia (necesidad de aumentar la cantidad para obtener el mismo efecto), síndrome de abstinencia cuando se interrumpe, y la continuación del comportamiento a pesar de las consecuencias negativas evidentes.
        </p>
        
        <div class="central-concept">
            TODA CONDUCTA ADICTIVA SE ORIGINA POR UN DOLOR EMOCIONAL
        </div>
        
        <img src="/lessons/images-leccion-1/que-es-adiccion.jpg" alt="Imagen sobre qué es la adicción" class="pill-image">
        
        <h2 class="blue-title">2. ORIGEN:</h2>
        
        <p class="explanation-text">
            El dolor emocional es el factor desencadenante principal de las conductas adictivas. Este dolor puede manifestarse como ansiedad, depresión, trauma, baja autoestima, soledad, estrés crónico, o cualquier forma de sufrimiento psicológico no resuelto.
        </p>
        
        <p class="explanation-text">
            Las personas recurren a sustancias o comportamientos adictivos como una forma de automedicación para aliviar temporalmente este dolor emocional. Sin embargo, esta solución aparente se convierte en un ciclo destructivo que perpetúa y amplifica el sufrimiento original.
        </p>
        
        <p class="explanation-text">
            Comprender este origen emocional es fundamental para el tratamiento efectivo de las adicciones, ya que permite abordar las causas raíz del problema en lugar de solo tratar los síntomas superficiales.
        </p>
    </div>
</body>
</html>'
WHERE titulo = '¿Qué significa ser adicto?' AND orden = 1;