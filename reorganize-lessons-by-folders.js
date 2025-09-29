import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeo de números de carpeta a títulos de lecciones
const folderToLessonMapping = {
  1: 'FUNDAMENTOS P TERAPEUTICO',
  2: 'TERAPIA COGNITIVA DROGODEPENDENCIAS', 
  3: 'FAMILIA Y TRABAJO EQUIPO',
  4: 'RECOVERY COACHING',
  6: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
  7: 'NUEVOS MODELOS TERAPEUTICOS',
  9: 'INTELIGENCIA EMOCIONAL'
};

async function reorganizeLessons() {
  try {
    console.log('🔍 Obteniendo curso MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL...');
    
    // Obtener el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (cursoError || !curso) {
      throw new Error('No se encontró el curso');
    }
    
    console.log(`✅ Curso encontrado con ID: ${curso.id}`);
    
    // Obtener todas las lecciones actuales
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      throw new Error(`Error obteniendo lecciones: ${leccionesError.message}`);
    }
    
    console.log(`📚 Lecciones actuales encontradas: ${lecciones.length}`);
    lecciones.forEach(leccion => {
      console.log(`  - Lección ${leccion.orden}: ${leccion.titulo}`);
    });
    
    // Crear backup de lecciones actuales
    const backup = {
      timestamp: new Date().toISOString(),
      curso_id: curso.id,
      lecciones_originales: lecciones
    };
    
    fs.writeFileSync('lessons-reorganize-backup.json', JSON.stringify(backup, null, 2));
    console.log('💾 Backup creado: lessons-reorganize-backup.json');
    
    // Eliminar todas las lecciones actuales
    console.log('🗑️ Eliminando lecciones actuales...');
    const { error: deleteError } = await supabase
      .from('lecciones')
      .delete()
      .eq('curso_id', curso.id);
    
    if (deleteError) {
      throw new Error(`Error eliminando lecciones: ${deleteError.message}`);
    }
    
    // Crear nuevas lecciones con los números correctos
    console.log('📝 Creando lecciones con numeración correcta...');
    
    const nuevasLecciones = [];
    
    for (const [numeroStr, titulo] of Object.entries(folderToLessonMapping)) {
      const numero = parseInt(numeroStr);
      
      // Buscar contenido existente que coincida con este título
      const leccionExistente = lecciones.find(l => 
        l.titulo.toLowerCase().includes(titulo.toLowerCase().substring(0, 10)) ||
        titulo.toLowerCase().includes(l.titulo.toLowerCase().substring(0, 10))
      );
      
      const nuevaLeccion = {
        curso_id: curso.id,
        titulo: titulo,
        descripcion: `Lección ${numero}: ${titulo}`,
        contenido_html: leccionExistente ? leccionExistente.contenido_html : '<p>Contenido pendiente de asignar</p>',
        duracion_estimada: leccionExistente ? leccionExistente.duracion_estimada : 60,
        imagen_url: leccionExistente ? leccionExistente.imagen_url : 'https://placehold.co/400x300/1e40af/white?text=Lección+' + numero,
        orden: numero,
        tiene_cuestionario: leccionExistente ? leccionExistente.tiene_cuestionario : false
      };
      
      nuevasLecciones.push(nuevaLeccion);
    }
    
    // Insertar las nuevas lecciones
    const { data: leccionesCreadas, error: insertError } = await supabase
      .from('lecciones')
      .insert(nuevasLecciones)
      .select();
    
    if (insertError) {
      throw new Error(`Error creando lecciones: ${insertError.message}`);
    }
    
    console.log('✅ Lecciones reorganizadas exitosamente:');
    leccionesCreadas.forEach(leccion => {
      console.log(`  - Lección ${leccion.orden}: ${leccion.titulo}`);
    });
    
    // Generar reporte
    const reporte = {
      timestamp: new Date().toISOString(),
      curso_id: curso.id,
      lecciones_eliminadas: lecciones.length,
      lecciones_creadas: leccionesCreadas.length,
      mapeo_carpetas: folderToLessonMapping,
      lecciones_finales: leccionesCreadas.map(l => ({
        numero: l.orden,
        titulo: l.titulo,
        tiene_contenido: l.contenido_html !== '<p>Contenido pendiente de asignar</p>'
      }))
    };
    
    fs.writeFileSync('lessons-reorganize-report.json', JSON.stringify(reporte, null, 2));
    console.log('📊 Reporte generado: lessons-reorganize-report.json');
    
    console.log('\n🎉 Reorganización completada exitosamente!');
    console.log('Las lecciones ahora coinciden exactamente con los números de las carpetas:');
    Object.entries(folderToLessonMapping).forEach(([num, titulo]) => {
      console.log(`  ${num}) ${titulo}`);
    });
    
  } catch (error) {
    console.error('❌ Error durante la reorganización:', error.message);
    process.exit(1);
  }
}

reorganizeLessons();