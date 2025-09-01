require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMigration() {
  try {
    console.log('🔍 Probando migración paso a paso...');
    
    // Paso 1: Verificar estado actual
    console.log('\n📋 Paso 1: Verificando estado actual de user_course_progress...');
    const { data: currentData, error: currentError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(1);
    
    if (currentError) {
      console.error('❌ Error al verificar estado actual:', currentError);
      return;
    }
    
    console.log('✅ Tabla user_course_progress existe');
    console.log('📊 Registros actuales:', currentData?.length || 0);
    
    // Paso 2: Probar agregar columnas una por una
    console.log('\n📋 Paso 2: Probando agregar columnas...');
    
    const columnsToAdd = [
      {
        name: 'progress_percentage',
        sql: 'ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);'
      },
      {
        name: 'completed_at',
        sql: 'ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;'
      },
      {
        name: 'last_accessed_at',
        sql: 'ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;'
      },
      {
        name: 'time_spent_minutes',
        sql: 'ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS time_spent_minutes INTEGER DEFAULT 0;'
      },
      {
        name: 'is_completed',
        sql: 'ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;'
      },
      {
        name: 'created_at',
        sql: 'ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;'
      },
      {
        name: 'updated_at',
        sql: 'ALTER TABLE public.user_course_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;'
      }
    ];
    
    for (const column of columnsToAdd) {
      try {
        console.log(`🔧 Agregando columna ${column.name}...`);
        const { data, error } = await supabase.rpc('exec_sql', { sql: column.sql });
        
        if (error) {
          console.error(`❌ Error agregando ${column.name}:`, error);
        } else {
          console.log(`✅ Columna ${column.name} agregada exitosamente`);
        }
      } catch (e) {
        console.error(`❌ Excepción agregando ${column.name}:`, e.message);
      }
    }
    
    // Paso 3: Verificar que las columnas se agregaron
    console.log('\n📋 Paso 3: Verificando columnas agregadas...');
    
    try {
      const testUserId = '98c473d9-011e-4a6b-a646-9c41b007d3ae';
      const testCourseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
      const testChapterId = '12345678-1234-1234-1234-123456789012';
      
      const { data: testInsert, error: testError } = await supabase
        .from('user_course_progress')
        .insert({
          user_id: testUserId,
          course_id: testCourseId,
          chapter_id: testChapterId,
          progress_percentage: 50,
          is_completed: true,
          time_spent_minutes: 30
        })
        .select();
      
      if (testError) {
        console.error('❌ Error en inserción de prueba:', testError);
      } else {
        console.log('✅ Inserción de prueba exitosa:', testInsert);
        if (testInsert && testInsert.length > 0) {
          console.log('📋 Columnas disponibles:', Object.keys(testInsert[0]));
        }
      }
    } catch (e) {
      console.error('❌ Excepción en inserción de prueba:', e.message);
    }
    
    // Paso 4: Probar la función calculate_course_progress
    console.log('\n📋 Paso 4: Probando función calculate_course_progress...');
    
    const functionSQL = `
      CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id UUID, p_course_id UUID)
      RETURNS DECIMAL(5,2) AS $$
      DECLARE
          total_chapters INTEGER;
          completed_chapters INTEGER;
          progress_percentage DECIMAL(5,2);
      BEGIN
          SELECT COUNT(*) INTO total_chapters
          FROM public.lecciones
          WHERE curso_id = p_course_id;
          
          SELECT COUNT(*) INTO completed_chapters
          FROM public.user_course_progress
          WHERE user_id = p_user_id 
            AND course_id = p_course_id 
            AND is_completed = true;
          
          IF total_chapters > 0 THEN
              progress_percentage := (completed_chapters::DECIMAL / total_chapters::DECIMAL) * 100;
          ELSE
              progress_percentage := 0;
          END IF;
          
          RETURN progress_percentage;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: functionSQL });
      
      if (error) {
        console.error('❌ Error creando función:', error);
      } else {
        console.log('✅ Función calculate_course_progress creada exitosamente');
      }
    } catch (e) {
      console.error('❌ Excepción creando función:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testMigration();