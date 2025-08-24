import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyMasterLessons() {
  try {
    console.log('🔍 Verificando estado de lecciones del curso MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL...');
    
    // Obtener todos los cursos para encontrar el correcto
    const { data: todosCursos, error: todosCursosError } = await supabase
      .from('cursos')
      .select('*');
    
    if (todosCursosError) {
      console.error('❌ Error al obtener todos los cursos:', todosCursosError);
      return;
    }
    
    console.log('\n📚 Cursos disponibles:');
    todosCursos.forEach(curso => {
      console.log(`  - ID: ${curso.id}, Título: ${curso.titulo}`);
    });
    
    // Buscar el curso por título
    const curso = todosCursos.find(c => 
      c.titulo && c.titulo.includes('MÁSTER EN ADICCIONES')
    );
    
    if (!curso) {
      console.error('❌ No se encontró el curso MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL');
      return;
    }
    
    console.log('\n✅ Curso encontrado:', curso.titulo);
    console.log('📋 ID del curso:', curso.id);
    
    // Obtener todas las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      console.error('❌ Error al obtener lecciones:', leccionesError);
      return;
    }
    
    console.log(`\n📚 Total de lecciones encontradas: ${lecciones.length}`);
    
    // Verificar estado de cada lección
    const leccionesVacias = [];
    const leccionesConContenido = [];
    
    for (const leccion of lecciones) {
      console.log(`\n--- Lección ${leccion.orden}: ${leccion.titulo} ---`);
      console.log('ID:', leccion.id);
      
      // Verificar si tiene contenido
      const tieneContenido = leccion.contenido_html && leccion.contenido_html.trim().length > 0;
      const tieneArchivoUrl = leccion.archivo_url && leccion.archivo_url.trim().length > 0;
      
      console.log('Tiene contenido en BD:', tieneContenido ? '✅ Sí' : '❌ No');
      console.log('Tiene archivo_url:', tieneArchivoUrl ? '✅ Sí' : '❌ No');
      
      if (tieneContenido) {
        console.log('Longitud del contenido:', leccion.contenido_html.length, 'caracteres');
        console.log('Vista previa:', leccion.contenido_html.substring(0, 100) + '...');
      }
      
      if (tieneArchivoUrl) {
        console.log('URL del archivo:', leccion.archivo_url);
        
        // Verificar si el archivo existe
        const fs = await import('fs');
        const path = await import('path');
        
        // Extraer la ruta del archivo desde la URL
        const archivoPath = leccion.archivo_url.replace('/lessons/', 'public/lessons/');
        const archivoExiste = fs.existsSync(archivoPath);
        console.log('Archivo existe:', archivoExiste ? '✅ Sí' : '❌ No');
        
        if (archivoExiste) {
          const stats = fs.statSync(archivoPath);
          console.log('Tamaño del archivo:', stats.size, 'bytes');
          
          if (stats.size > 0) {
            const contenidoArchivo = fs.readFileSync(archivoPath, 'utf8');
            console.log('Vista previa del archivo:', contenidoArchivo.substring(0, 100) + '...');
          }
        }
      }
      
      // Clasificar lección
      if (!tieneContenido && !tieneArchivoUrl) {
        leccionesVacias.push(leccion);
        console.log('🔴 Estado: VACÍA (sin contenido ni archivo)');
      } else if (tieneContenido && !tieneArchivoUrl) {
        leccionesConContenido.push(leccion);
        console.log('🟡 Estado: CONTENIDO EN BD (falta migrar a archivo)');
      } else if (!tieneContenido && tieneArchivoUrl) {
        const fs = await import('fs');
        const archivoPath = leccion.archivo_url.replace('/lessons/', 'public/lessons/');
        const archivoExiste = fs.existsSync(archivoPath);
        
        if (archivoExiste) {
          const stats = fs.statSync(archivoPath);
          if (stats.size > 0) {
            leccionesConContenido.push(leccion);
            console.log('🟢 Estado: MIGRADA (contenido en archivo)');
          } else {
            leccionesVacias.push(leccion);
            console.log('🔴 Estado: ARCHIVO VACÍO');
          }
        } else {
          leccionesVacias.push(leccion);
          console.log('🔴 Estado: ARCHIVO NO EXISTE');
        }
      } else {
        leccionesConContenido.push(leccion);
        console.log('🔵 Estado: DUPLICADA (contenido en BD y archivo)');
      }
    }
    
    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DEL ESTADO DE LECCIONES');
    console.log('='.repeat(60));
    console.log(`Total de lecciones: ${lecciones.length}`);
    console.log(`Lecciones vacías: ${leccionesVacias.length}`);
    console.log(`Lecciones con contenido: ${leccionesConContenido.length}`);
    
    if (leccionesVacias.length > 0) {
      console.log('\n🔴 LECCIONES VACÍAS:');
      leccionesVacias.forEach(leccion => {
        console.log(`  - Lección ${leccion.orden}: ${leccion.titulo}`);
      });
    }
    
    if (leccionesConContenido.length > 0) {
      console.log('\n🟢 LECCIONES CON CONTENIDO:');
      leccionesConContenido.forEach(leccion => {
        console.log(`  - Lección ${leccion.orden}: ${leccion.titulo}`);
      });
    }
    
    // Verificar carpetas de PDFs disponibles
    console.log('\n' + '='.repeat(60));
    console.log('📁 VERIFICANDO CARPETAS DE PDFs DISPONIBLES');
    console.log('='.repeat(60));
    
    const fs = await import('fs');
    const path = await import('path');
    
    const pdfDir = 'inteligencia_emocional_drive';
    
    if (fs.existsSync(pdfDir)) {
      const carpetas = fs.readdirSync(pdfDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });
      
      console.log(`Carpetas encontradas: ${carpetas.length}`);
      carpetas.forEach(carpeta => {
        const numeroLeccion = parseInt(carpeta.match(/\d+/)?.[0] || '0');
        const leccionExiste = lecciones.find(l => l.orden === numeroLeccion);
        console.log(`  - ${carpeta} ${leccionExiste ? '✅' : '❌'} (Lección ${numeroLeccion})`);
      });
    } else {
      console.log('❌ Carpeta de PDFs no encontrada:', pdfDir);
    }
    
    return {
      curso,
      lecciones,
      leccionesVacias,
      leccionesConContenido,
      totalLecciones: lecciones.length,
      leccionesVaciasCount: leccionesVacias.length
    };
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

// Ejecutar verificación
verifyMasterLessons().then(resultado => {
  if (resultado) {
    console.log('\n✅ Verificación completada');
    if (resultado.leccionesVaciasCount > 0) {
      console.log(`⚠️  Se encontraron ${resultado.leccionesVaciasCount} lecciones vacías que necesitan contenido`);
    } else {
      console.log('🎉 Todas las lecciones tienen contenido');
    }
  }
}).catch(error => {
  console.error('❌ Error fatal:', error);
});