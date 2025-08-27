-- Actualizar lección 1 para reemplazar SVG con imagen real
UPDATE lecciones 
SET contenido_html = '
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lección 1: ¿Qué significa ser adicto?</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .blue-title {
            color: #2563eb;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0 15px 0;
        }
        .definition-text {
            margin: 15px 0;
            text-align: justify;
            line-height: 1.8;
        }
        .centered-concept {
            background-color: #dbeafe;
            border: 2px solid #2563eb;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            color: #1e40af;
        }
        .pill-image {
            display: block;
            margin: 20px auto;
            width: 120px;
            height: auto;
        }
        .origin-text {
            margin: 20px 0;
            text-align: justify;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="blue-title">1. DEFINICIÓN DE SER ADICTO:</div>
        <div class="definition-text">
            Ser adicto significa tener una dependencia física, psicológica o emocional hacia una sustancia, comportamiento o actividad específica, que interfiere significativamente con la vida diaria, las relaciones interpersonales, el trabajo o la salud de la persona.
        </div>
        <div class="definition-text">
            La adicción se caracteriza por la pérdida de control sobre el consumo o la práctica de dicha actividad, la necesidad compulsiva de repetir el comportamiento a pesar de las consecuencias negativas, y la presencia de síntomas de abstinencia cuando se intenta dejar o reducir su uso.
        </div>
        
        <img src="/lessons/images-leccion-1/que-es-adiccion.jpg" alt="Imagen sobre adicción" class="pill-image">
        
        <div class="centered-concept">
            TODA CONDUCTA ADICTIVA SE ORIGINA POR UN DOLOR EMOCIONAL
        </div>
        
        <div class="blue-title">2. ORIGEN:</div>
        <div class="origin-text">
            El dolor emocional es la raíz fundamental de todas las conductas adictivas. Cuando una persona experimenta sufrimiento emocional profundo - ya sea por trauma, pérdida, rechazo, abandono, o cualquier otra experiencia dolorosa - busca formas de aliviar ese malestar.
        </div>
        <div class="origin-text">
            Las sustancias o comportamientos adictivos actúan como un mecanismo de escape temporal, proporcionando alivio momentáneo del dolor emocional. Sin embargo, este alivio es superficial y temporal, creando un ciclo donde la persona necesita recurrir cada vez más a la sustancia o comportamiento para mantener ese estado de "bienestar" artificial.
        </div>
        <div class="origin-text">
            Comprender este origen emocional es fundamental para el proceso de recuperación, ya que permite abordar la causa raíz del problema en lugar de solo tratar los síntomas superficiales de la adicción.
        </div>
    </div>
</body>
</html>'
WHERE titulo = '¿Qué significa ser adicto?' AND orden = 1;