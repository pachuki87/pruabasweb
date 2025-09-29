import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const exactContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lección 1 - Definición y Origen de las Adicciones</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .lesson-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .section-title {
            color: #2563eb;
            font-size: 24px;
            font-weight: bold;
            margin: 30px 0 20px 0;
            padding-bottom: 10px;
        }
        .definition-section {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        .definition-text {
            font-size: 16px;
            line-height: 1.8;
            color: #374151;
        }
        .origin-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
            border-radius: 12px;
            border: 2px solid #2563eb;
        }
        .origin-concept {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 0;
            padding: 15px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .pill-icon {
            display: flex;
            justify-content: center;
            margin: 30px 0;
        }
        .pill-svg {
            width: 120px;
            height: 120px;
            fill: #2563eb;
        }
    </style>
</head>
<body>
    <div class="lesson-container">
        <h1 class="section-title">1. DEFINICIÓN DE SER ADICTO:</h1>
        
        <div class="definition-section">
            <div class="definition-text">
                Se puede definir como aquel <strong>comportamiento de búsqueda, obtención y consumo de drogas</strong> o <strong>realización de la conducta problema</strong> (juego, sexo, compras, móvil...) en la que esta cobra más protagonismo que otras situaciones que anteriormente eran importantes para la persona, haciendo que estas pasen a un segundo plano o le parezcan innecesarias.
            </div>
        </div>

        <h2 class="section-title">2. ORIGEN</h2>
        
        <div class="pill-icon">
            <svg class="pill-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.22 11.29l2.93-2.93C8.78 6.73 10.8 6 12.93 6c2.13 0 4.15.73 5.78 2.36C20.34 9.99 21.07 12.01 21.07 14.14s-.73 4.15-2.36 5.78c-1.63 1.63-3.65 2.36-5.78 2.36s-4.15-.73-5.78-2.36L4.22 16.99c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.93 2.93c1.17 1.17 2.73 1.81 4.37 1.81s3.2-.64 4.37-1.81c1.17-1.17 1.81-2.73 1.81-4.37s-.64-3.2-1.81-4.37c-1.17-1.17-2.73-1.81-4.37-1.81s-3.2.64-4.37 1.81L5.63 12.7c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41z"/>
                <circle cx="9" cy="9" r="2"/>
                <circle cx="15" cy="15" r="2"/>
            </svg>
        </div>
        
        <div class="origin-section">
            <div class="origin-concept">
                TODA CONDUCTA ADICTIVA SE ORIGINA POR UN DOLOR EMOCIONAL
            </div>
        </div>
    </div>
</body>
</html>
`;

async function updateLesson1() {
  try {
    // Actualizar la lección 1 con el contenido exacto
    const { data, error } = await supabase
      .from('lecciones')
      .update({ 
        contenido_html: exactContent,
        actualizado_en: new Date().toISOString()
      })
      .eq('orden', 1)
      .select();

    if (error) {
      console.error('Error al actualizar la lección:', error);
      return;
    }

    console.log('✅ Lección 1 actualizada exitosamente con el contenido exacto de la imagen');
    console.log('Datos actualizados:', data);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

updateLesson1();