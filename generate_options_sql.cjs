const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function generateOptionsSQL() {
  try {
    console.log('🔍 Buscando preguntas con opciones en columnas...');
    
    // Buscar el curso "Máster de Adicciones"
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .ilike('titulo', '%máster%adicciones%')
      .single();
    
    if (cursoError) {
      console.error('❌ Error buscando curso:', cursoError);
      return;
    }
    
    console.log('✅ Curso encontrado:', curso);
    
    // Buscar cuestionarios de este curso
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('id, titulo')
      .eq('curso_id', curso.id);
    
    if (cuestionariosError) {
      console.error('❌ Error buscando cuestionarios:', cuestionariosError);
      return;
    }
    
    console.log(`\n📋 Cuestionarios encontrados: ${cuestionarios.length}`);
    
    let totalOptions = 0;
    let sqlStatements = [];
    
    for (const cuestionario of cuestionarios) {
      console.log(`\n🎯 Procesando cuestionario: ${cuestionario.titulo}`);
      
      // Buscar preguntas con opciones en columnas
      const { data: preguntas, error: preguntasError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('cuestionario_id', cuestionario.id)
        .not('opcion_a', 'is', null);
      
      if (preguntasError) {
        console.error('❌ Error buscando preguntas:', preguntasError);
        continue;
      }
      
      console.log(`   📝 Preguntas con opciones en columnas: ${preguntas?.length || 0}`);
      
      if (preguntas && preguntas.length > 0) {
        for (const pregunta of preguntas) {
          console.log(`\n   📄 Procesando pregunta: ${pregunta.pregunta}`);
          
          // Verificar si ya tiene opciones en la tabla opciones_respuesta
          const { data: existingOptions, error: checkError } = await supabase
            .from('opciones_respuesta')
            .select('id')
            .eq('pregunta_id', pregunta.id);
          
          if (checkError) {
            console.error('❌ Error verificando opciones existentes:', checkError);
            continue;
          }
          
          if (existingOptions && existingOptions.length > 0) {
            console.log(`   ℹ️ Ya tiene ${existingOptions.length} opciones en tabla, saltando...`);
            continue;
          }
          
          // Convertir opciones de columnas a array
          const opciones = [];
          const letras = ['a', 'b', 'c', 'd', 'e'];
          
          letras.forEach((letra, index) => {
            const opcionText = pregunta[`opcion_${letra}`];
            if (opcionText && opcionText.trim() !== '') {
              const esCorrecta = pregunta.respuesta_correcta === letra.toUpperCase();
              opciones.push({
                pregunta_id: pregunta.id,
                opcion: opcionText.trim(),
                es_correcta: esCorrecta,
                orden: index + 1
              });
            }
          });
          
          console.log(`   📊 Opciones encontradas: ${opciones.length}`);
          
          if (opciones.length > 0) {
            // Generar instrucciones SQL
            opciones.forEach(opcion => {
              const sql = `INSERT INTO opciones_respuesta (pregunta_id, opcion, es_correcta, orden) VALUES (${opcion.pregunta_id}, '${opcion.opcion.replace(/'/g, "''")}', ${opcion.es_correcta}, ${opcion.orden});`;
              sqlStatements.push(sql);
              totalOptions++;
            });
            
            console.log(`   ✅ ${opciones.length} opciones generadas`);
          }
        }
      }
    }
    
    // Guardar SQL en archivo
    if (sqlStatements.length > 0) {
      const fs = require('fs');
      const sqlContent = `-- SQL para insertar opciones de respuesta en cuestionarios del Máster en Adicciones
-- Total de opciones a insertar: ${totalOptions}

${sqlStatements.join('\n')}`;
      
      fs.writeFileSync('opciones_respuesta_master.sql', sqlContent);
      console.log(`\n🎉 Archivo SQL generado: opciones_respuesta_master.sql`);
      console.log(`📊 Total de instrucciones SQL: ${sqlStatements.length}`);
      console.log(`📋 Total de opciones a insertar: ${totalOptions}`);
    } else {
      console.log('\nℹ️ No se encontraron opciones para generar');
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

generateOptionsSQL();