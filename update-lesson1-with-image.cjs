const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¿Qué significa ser adicto?</title>
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
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .lesson-header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .lesson-title {
            font-size: 2.2em;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .lesson-subtitle {
            font-size: 1.1em;
            margin-top: 10px;
            opacity: 0.9;
        }
        .lesson-content {
            padding: 40px;
        }
        .content-section {
            margin-bottom: 40px;
        }
        .section-title {
            color: #2563eb;
            font-size: 1.5em;
            font-weight: 600;
            margin-bottom: 20px;
            padding-left: 15px;
            border-left: 4px solid #2563eb;
        }
        .definition-container {
            background: #f8faff;
            border: 2px solid #e5edff;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
        }
        .definition-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .definition-icon {
            margin-right: 15px;
            flex-shrink: 0;
        }
        .definition-text {
            font-size: 1.1em;
            line-height: 1.7;
        }
        .origin-section {
            text-align: center;
            margin: 30px 0;
        }
        .origin-flow {
            display: inline-block;
            background: #f0f7ff;
            border: 2px solid #2563eb;
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
        }
        .origin-item {
            font-size: 1.2em;
            font-weight: 600;
            color: #2563eb;
            margin: 10px 0;
            padding: 10px;
        }
        .arrow-down {
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 20px solid #2563eb;
            margin: 10px auto;
        }
        .highlight-text {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            font-size: 1.2em;
            font-weight: 500;
            margin: 25px 0;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .pill-icon {
            width: 120px;
            height: 120px;
            margin: 20px 0;
        }
        .center-image {
            text-align: center;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="lesson-container">
        <div class="lesson-header">
            <h1 class="lesson-title">¿Qué significa ser adicto</h1>
            <p class="lesson-subtitle">Lección 1 de 12</p>
        </div>
        
        <div class="lesson-content">
            <div class="content-section">
                <h2 class="section-title">1. DEFINICIÓN DE SER ADICTO:</h2>
                
                <div class="definition-container">
                    <div class="definition-header">
                        <div class="definition-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#2563eb"/>
                            </svg>
                        </div>
                    </div>
                    <div class="definition-text">
                        Se puede definir como aquel <strong>comportamiento de búsqueda, obtención y consumo de drogas</strong> o <strong>realización de la conducta problema</strong> (juego, sexo, compras, móvil...) en la que esta cobra más protagonismo que otras situaciones que anteriormente eran importantes para la persona, haciendo que estas pasen a un segundo plano o le parezcan innecesarias.
                    </div>
                </div>
            </div>

            <div class="content-section">
                <h2 class="section-title">2. ORIGEN</h2>

                <div class="center-image">
                    <svg class="pill-icon" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <!-- Pastilla principal -->
                        <rect x="40" y="60" width="120" height="80" rx="40" ry="40" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
                        
                        <!-- Separación central -->
                        <rect x="95" y="60" width="10" height="80" fill="#1d4ed8"/>
                        
                        <!-- Detalles de la pastilla izquierda -->
                        <rect x="55" y="85" width="25" height="8" rx="4" fill="#ffffff" opacity="0.8"/>
                        <rect x="55" y="100" width="20" height="6" rx="3" fill="#ffffff" opacity="0.6"/>
                        <rect x="55" y="112" width="15" height="6" rx="3" fill="#ffffff" opacity="0.4"/>
                        
                        <!-- Detalles de la pastilla derecha -->
                        <circle cx="130" cy="90" r="8" fill="#ffffff" opacity="0.7"/>
                        <circle cx="145" cy="105" r="6" fill="#ffffff" opacity="0.5"/>
                        <circle cx="125" cy="115" r="4" fill="#ffffff" opacity="0.4"/>
                        
                        <!-- Sombra -->
                        <ellipse cx="100" cy="165" rx="50" ry="8" fill="#000000" opacity="0.1"/>
                    </svg>
                </div>

                <div class="origin-section">
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
    </div>
</body>
</html>`;

async function updateLesson1WithImage() {
  try {
    console.log('🔄 Actualizando lección 1 con imagen del icono de pastilla...');
    
    const { data, error } = await supabase
      .from('lecciones')
      .update({
        contenido_html: htmlContent,
        actualizado_en: new Date().toISOString()
      })
      .eq('orden', 1)
      .select();
    
    if (error) {
      console.error('❌ Error al actualizar la lección:', error);
      return;
    }
    
    console.log('✅ Lección 1 actualizada exitosamente!');
    console.log('📋 Datos actualizados:', data);
    console.log('\n🎨 Cambios realizados:');
    console.log('- ✅ Agregada imagen SVG del icono de pastilla azul');
    console.log('- ✅ Mantenido el formato visual con títulos numerados en azul');
    console.log('- ✅ Conservado el concepto centrado sobre dolor emocional');
    console.log('- ✅ Aplicados estilos CSS consistentes');
    
  } catch (err) {
    console.error('💥 Error inesperado:', err);
  }
}

updateLesson1WithImage();