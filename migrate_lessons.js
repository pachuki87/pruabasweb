import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);
const CURSO_ID = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';

async function migrateLessons() {
  try {
    // Leer el archivo de metadatos
    const metadataPath = path.join(process.cwd(), 'public', 'lessons', 'lessons-metadata.json');
    const metadataFile = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const metadata = metadataFile.lessons;
    
    console.log(`Encontradas ${metadata.length} lecciones para migrar`);
    
    // Procesar cada lección
    for (let i = 0; i < metadata.length; i++) {
      const lesson = metadata[i];
      const htmlPath = path.join(process.cwd(), 'public', 'lessons', lesson.filename);
      
      if (!fs.existsSync(htmlPath)) {
        console.log(`Archivo no encontrado: ${lesson.filename}`);
        continue;
      }
      
      // Leer contenido HTML
      let htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Actualizar rutas de imágenes para que apunten a la carpeta pública
      const imageFolder = lesson.filename.replace('.html', '').replace('-', '');
      htmlContent = htmlContent.replace(
        /src="([^"]*\.(jpg|jpeg|png|gif|webp))"/gi,
        `src="/lessons/images-${imageFolder}/$1"`
      );
      
      // Extraer título del HTML (buscar en h1 o usar el título del metadata)
      const titleMatch = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/);
      const titulo = titleMatch ? titleMatch[1].trim() : lesson.title;
      
      // Preparar datos para insertar
      const lessonData = {
        curso_id: CURSO_ID,
        titulo: titulo,
        descripcion: `Lección ${i + 1} del curso Experto en Conductas Adictivas`,
        contenido_html: htmlContent,
        orden: i + 1,
        duracion_estimada: Math.max(10, Math.floor(lesson.contentLength / 100)), // Estimación basada en contenido
        imagen_url: lesson.hasImages ? `/lessons/images-${imageFolder}/` : null,
        video_url: null,
        tiene_cuestionario: lesson.title.toLowerCase().includes('cuestionario'),
        archivo_url: `/lessons/${lesson.filename}`
      };
      
      // Insertar en la base de datos
      const { data, error } = await supabase
        .from('lecciones')
        .insert(lessonData)
        .select()
        .single();
      
      if (error) {
        console.error(`Error insertando lección ${lesson.filename}:`, error);
      } else {
        console.log(`✓ Lección insertada: ${titulo} (ID: ${data.id})`);
      }
    }
    
    // Actualizar relaciones de lecciones anterior/siguiente
    await updateLessonRelations();
    
    console.log('\n¡Migración completada!');
    
  } catch (error) {
    console.error('Error en la migración:', error);
  }
}

async function updateLessonRelations() {
  try {
    console.log('\nActualizando relaciones entre lecciones...');
    
    // Obtener todas las lecciones del curso ordenadas
    const { data: lecciones, error } = await supabase
      .from('lecciones')
      .select('id, orden')
      .eq('curso_id', CURSO_ID)
      .order('orden');
    
    if (error) {
      console.error('Error obteniendo lecciones:', error);
      return;
    }
    
    // Actualizar relaciones
    for (let i = 0; i < lecciones.length; i++) {
      const updates = {};
      
      if (i > 0) {
        updates.leccion_anterior_id = lecciones[i - 1].id;
      }
      
      if (i < lecciones.length - 1) {
        updates.leccion_siguiente_id = lecciones[i + 1].id;
      }
      
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('lecciones')
          .update(updates)
          .eq('id', lecciones[i].id);
        
        if (updateError) {
          console.error(`Error actualizando relaciones para lección ${lecciones[i].id}:`, updateError);
        }
      }
    }
    
    console.log('✓ Relaciones entre lecciones actualizadas');
    
  } catch (error) {
    console.error('Error actualizando relaciones:', error);
  }
}

migrateLessons();