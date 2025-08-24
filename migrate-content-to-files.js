import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Función para crear un nombre de archivo seguro
function createSafeFileName(titulo, orden) {
  const safeTitle = titulo
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return `leccion-${orden}-${safeTitle}.html`;
}

// Función para crear archivo HTML
async function createLessonFile(leccion, cursoNombre, lessonsDir) {
  const fileName = createSafeFileName(leccion.titulo, leccion.orden);
  const filePath = path.join(lessonsDir, fileName);
  
  // Crear contenido HTML completo
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${leccion.titulo} - ${cursoNombre}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        .lesson-header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .lesson-content { max-width: 800px; }
    </style>
</head>
<body>
    <div class="lesson-header">
        <h1>${leccion.titulo}</h1>
        <p><strong>Curso:</strong> ${cursoNombre}</p>
        <p><strong>Lección:</strong> ${leccion.orden}</p>
    </div>
    <div class="lesson-content">
        ${leccion.contenido_html}
    </div>
</body>
</html>`;
  
  // Escribir archivo
  fs.writeFileSync(filePath, htmlContent, 'utf8');
  
  return {
    fileName,
    filePath,
    url: `/lessons/${fileName}`,
    size: htmlContent.length
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  console.log('Asegúrate de que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas en .env');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarCursosYLecciones() {
  console.log('🔍 Verificando cursos existentes en la base de datos...');
  
  try {
    // Obtener todos los cursos
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('*')
      .order('id');
    
    if (cursosError) {
      throw cursosError;
    }
    
    console.log(`\n📚 Cursos encontrados: ${cursos.length}`);
    
    for (const curso of cursos) {
      console.log(`\n--- CURSO: ${curso.titulo} (ID: ${curso.id}) ---`);
      console.log(`Descripción: ${curso.descripcion?.substring(0, 100)}...`);
      
      // Obtener lecciones del curso
      const { data: lecciones, error: leccionesError } = await supabase
        .from('lecciones')
        .select('*')
        .eq('curso_id', curso.id)
        .order('orden');
      
      if (leccionesError) {
        console.error(`❌ Error obteniendo lecciones del curso ${curso.id}:`, leccionesError);
        continue;
      }
      
      console.log(`📖 Lecciones: ${lecciones.length}`);
      
      for (const leccion of lecciones) {
        const contenidoLength = leccion.contenido_html ? leccion.contenido_html.length : 0;
        const tieneContenido = contenidoLength > 0 ? '✅' : '❌';
        
        console.log(`  ${tieneContenido} Lección ${leccion.orden}: ${leccion.titulo}`);
        console.log(`     Contenido: ${contenidoLength} caracteres`);
        
        if (contenidoLength > 0) {
          const preview = leccion.contenido_html.substring(0, 150).replace(/\n/g, ' ');
          console.log(`     Preview: ${preview}...`);
        }
      }
    }
    
    return { cursos, totalLecciones: cursos.reduce((acc, curso) => acc + (curso.lecciones?.length || 0), 0) };
    
  } catch (error) {
    console.error('❌ Error verificando cursos y lecciones:', error);
    throw error;
  }
}

async function crearEstructuraCarpetas() {
  console.log('\n📁 Creando estructura de carpetas...');
  
  const lessonsDir = path.join(__dirname, 'public', 'lessons');
  
  try {
    // Crear carpeta public si no existe
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('✅ Carpeta public/ creada');
    }
    
    // Crear carpeta lessons si no existe
    if (!fs.existsSync(lessonsDir)) {
      fs.mkdirSync(lessonsDir, { recursive: true });
      console.log('✅ Carpeta public/lessons/ creada');
    } else {
      console.log('ℹ️  Carpeta public/lessons/ ya existe');
    }
    
    return lessonsDir;
    
  } catch (error) {
    console.error('❌ Error creando estructura de carpetas:', error);
    throw error;
  }
}

async function main() {
  console.log('🔍 Iniciando migración de contenido...');
  
  // Obtener todos los cursos
  const { data: cursos, error: cursosError } = await supabase
    .from('cursos')
    .select('*');
  
  if (cursosError) {
    console.error('❌ Error al obtener cursos:', cursosError);
    return;
  }
  
  console.log(`📚 Encontrados ${cursos.length} cursos`);
  
  // Crear estructura de carpetas
  const lessonsDir = path.join(process.cwd(), 'public', 'lessons');
  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
    console.log(`✅ Carpeta creada: ${lessonsDir}`);
  }
  
  const migrationReport = {
    timestamp: new Date().toISOString(),
    cursosProcessed: 0,
    leccionesProcessed: 0,
    filesCreated: [],
    errors: []
  };
  
  for (const curso of cursos) {
     console.log(`\n📖 Procesando curso: ${curso.nombre}`);
    
    // Obtener lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      console.error(`   ❌ Error al obtener lecciones: ${leccionesError.message}`);
       migrationReport.errors.push(`Curso ${curso.nombre}: ${leccionesError.message}`);
      continue;
    }
    
    console.log(`   📝 Procesando ${lecciones.length} lecciones...`);
    
    for (const leccion of lecciones) {
      if (!leccion.contenido_html || leccion.contenido_html.length === 0) {
        console.log(`   ⚠️  Saltando lección ${leccion.orden}: sin contenido`);
        continue;
      }
      
      try {
        // Crear archivo HTML
         const fileInfo = await createLessonFile(leccion, curso.nombre, lessonsDir);
        console.log(`   ✅ Creado: ${fileInfo.fileName} (${Math.round(fileInfo.size/1024)}KB)`);
        
        // Actualizar base de datos con URL del archivo
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ 
            archivo_url: fileInfo.url,
            contenido_html: null // Limpiar contenido HTML de la BD
          })
          .eq('id', leccion.id);
        
        if (updateError) {
          console.error(`   ❌ Error actualizando BD para lección ${leccion.orden}: ${updateError.message}`);
          migrationReport.errors.push(`Lección ${leccion.orden}: ${updateError.message}`);
        } else {
          migrationReport.filesCreated.push({
             curso: curso.nombre,
            leccion: leccion.orden,
            titulo: leccion.titulo,
            fileName: fileInfo.fileName,
            url: fileInfo.url,
            size: fileInfo.size
          });
          migrationReport.leccionesProcessed++;
        }
        
      } catch (error) {
        console.error(`   ❌ Error procesando lección ${leccion.orden}: ${error.message}`);
        migrationReport.errors.push(`Lección ${leccion.orden}: ${error.message}`);
      }
    }
    
    migrationReport.cursosProcessed++;
  }
  
  // Generar reporte de migración
  const reportPath = path.join(process.cwd(), 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(migrationReport, null, 2), 'utf8');
  
  console.log('\n📊 Migración completada');
  console.log(`   - Cursos procesados: ${migrationReport.cursosProcessed}`);
  console.log(`   - Lecciones migradas: ${migrationReport.leccionesProcessed}`);
  console.log(`   - Archivos creados: ${migrationReport.filesCreated.length}`);
  console.log(`   - Errores: ${migrationReport.errors.length}`);
  console.log(`   - Reporte guardado en: ${reportPath}`);
  
  if (migrationReport.errors.length > 0) {
    console.log('\n⚠️  Errores encontrados:');
    migrationReport.errors.forEach(error => console.log(`   - ${error}`));
  }
}

// Ejecutar directamente
main().catch(console.error);

export { verificarCursosYLecciones, crearEstructuraCarpetas };