const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkColumnExists(tableName, columnName) {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_name', tableName)
    .eq('column_name', columnName)
    .single();
  
  return !error && data;
}

async function checkTableExists(tableName) {
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_name', tableName)
    .single();
  
  return !error && data;
}

async function executeSQL(description, sql) {
  console.log(`🔄 ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
      return false;
    } else {
      console.log(`✅ ${description} - Completado`);
      return true;
    }
  } catch (err) {
    console.log(`❌ Error ejecutando SQL: ${err.message}`);
    return false;
  }
}

async function fixColumnConsistency() {
  console.log('🚀 Iniciando corrección de inconsistencias de columnas...');
  console.log('📋 Objetivo: Estandarizar todas las tablas para usar course_id\n');

  try {
    // 1. Verificar estructura actual
    console.log('🔍 Verificando estructura actual de las tablas...');
    
    const tables = ['inscripciones', 'lecciones', 'materiales', 'cuestionarios'];
    const columnStatus = {};
    
    for (const table of tables) {
      const tableExists = await checkTableExists(table);
      if (tableExists) {
        const hasCourseId = await checkColumnExists(table, 'course_id');
        const hasCursoId = await checkColumnExists(table, 'curso_id');
        
        columnStatus[table] = {
          exists: true,
          hasCourseId: !!hasCourseId,
          hasCursoId: !!hasCursoId
        };
        
        console.log(`   📊 ${table}: course_id=${hasCourseId ? '✅' : '❌'}, curso_id=${hasCursoId ? '✅' : '❌'}`);
      } else {
        columnStatus[table] = { exists: false };
        console.log(`   📊 ${table}: ❌ No existe`);
      }
    }
    
    console.log('');
    
    // 2. Aplicar correcciones necesarias
    for (const [table, status] of Object.entries(columnStatus)) {
      if (!status.exists) {
        console.log(`⏭️  Omitiendo ${table} (no existe)`);
        continue;
      }
      
      if (status.hasCursoId && !status.hasCourseId) {
        console.log(`🔧 Corrigiendo ${table}: curso_id -> course_id`);
        
        // Usar consultas directas de Supabase en lugar de SQL raw
        try {
          // Para lecciones, necesitamos verificar si podemos hacer la actualización
          if (table === 'lecciones') {
            // Verificar si hay datos en la tabla
            const { data: sampleData, error: sampleError } = await supabase
              .from('lecciones')
              .select('id, curso_id')
              .limit(1);
            
            if (!sampleError && sampleData && sampleData.length > 0) {
              console.log(`   📝 Tabla ${table} tiene datos, necesita migración manual en Supabase Dashboard`);
              console.log(`   🔗 Ve a: https://supabase.com/dashboard/project/lyojcqiiixkqqtpoejdo/editor`);
              console.log(`   📋 Ejecuta: ALTER TABLE ${table} RENAME COLUMN curso_id TO course_id;`);
            } else {
              console.log(`   ✅ Tabla ${table} está vacía o no accesible`);
            }
          }
          
          // Para otras tablas, intentar verificar acceso
          else {
            const { data: testData, error: testError } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            if (!testError) {
              console.log(`   📝 Tabla ${table} accesible, necesita migración manual`);
              console.log(`   📋 Ejecuta en Supabase: ALTER TABLE ${table} RENAME COLUMN curso_id TO course_id;`);
            } else {
              console.log(`   ⚠️  No se puede acceder a ${table}: ${testError.message}`);
            }
          }
          
        } catch (err) {
          console.log(`   ❌ Error verificando ${table}: ${err.message}`);
        }
        
      } else if (status.hasCourseId && !status.hasCursoId) {
        console.log(`✅ ${table} ya usa course_id correctamente`);
      } else if (status.hasCourseId && status.hasCursoId) {
        console.log(`⚠️  ${table} tiene ambas columnas (course_id y curso_id) - requiere limpieza manual`);
      } else {
        console.log(`❓ ${table} no tiene ninguna de las columnas esperadas`);
      }
    }
    
    console.log('\n📋 RESUMEN DE ACCIONES NECESARIAS:');
    console.log('1. Ve al Dashboard de Supabase: https://supabase.com/dashboard/project/lyojcqiiixkqqtpoejdo/editor');
    console.log('2. En el SQL Editor, ejecuta estos comandos uno por uno:');
    console.log('');
    
    // Generar comandos SQL específicos basados en lo encontrado
    for (const [table, status] of Object.entries(columnStatus)) {
      if (status.exists && status.hasCursoId && !status.hasCourseId) {
        console.log(`   ALTER TABLE ${table} RENAME COLUMN curso_id TO course_id;`);
      }
    }
    
    console.log('');
    console.log('3. Después de ejecutar los comandos SQL, ejecuta este script nuevamente para verificar');
    console.log('');
    console.log('✅ Análisis completado');
    
  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  }
}

// Ejecutar el script
fixColumnConsistency();