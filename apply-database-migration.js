// Importar módulos
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configurada' : '❌ Faltante');
  process.exit(1);
}

// Crear cliente de Supabase con service key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para ejecutar SQL usando una función PostgreSQL
async function executeSQL(description, sql) {
  console.log(`🔄 ${description}`);
  
  try {
    // Usar función PostgreSQL simple que ejecuta SQL dinámico
    const { data, error } = await supabase.rpc('execute_sql', { sql_text: sql });
    
    if (error) {
      console.error(`❌ Error en ${description}:`, error.message);
      throw error;
    }
    
    console.log(`✅ ${description} - Completado`);
    return data;
  } catch (err) {
    console.error(`❌ Error ejecutando ${description}:`, err.message);
    throw err;
  }
}

// Función principal
async function applyMigration() {
  try {
    console.log('🚀 Iniciando migración de base de datos...');
    console.log('📋 IMPORTANTE: Asegúrate de haber ejecutado create-execute-sql-function.sql en el Dashboard de Supabase primero.');
    
    // Verificar que la función execute_sql existe
    console.log('\n🔍 Verificando función execute_sql...');
    try {
      const { data, error } = await supabase.rpc('execute_sql', { sql_text: 'SELECT 1;' });
      if (error) {
        throw new Error(`La función execute_sql no existe. Por favor ejecuta create-execute-sql-function.sql en el Dashboard de Supabase primero.`);
      }
      console.log('✅ Función execute_sql disponible');
    } catch (err) {
      console.error('❌ Error:', err.message);
      console.log('\n📝 SOLUCIÓN:');
      console.log('1. Ve al Dashboard de Supabase');
      console.log('2. Abre SQL Editor');
      console.log('3. Ejecuta el contenido de create-execute-sql-function.sql');
      console.log('4. Vuelve a ejecutar este script');
      return;
    }
    
    // Paso 1: Agregar columnas a user_course_progress
    await executeSQL('Agregando columnas a user_course_progress', `
      ALTER TABLE public.user_course_progress 
      ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS completion_percentage DECIMAL(5,2) DEFAULT 0.00;
    `);

    // Paso 2: Agregar constraint
    await executeSQL('Agregando constraint de completion_percentage', `
      ALTER TABLE public.user_course_progress 
      ADD CONSTRAINT IF NOT EXISTS check_completion_percentage 
      CHECK (completion_percentage >= 0 AND completion_percentage <= 100);
    `);
    
    // Paso 3: Crear tabla user_test_results
    await executeSQL('Creando tabla user_test_results', `
      CREATE TABLE IF NOT EXISTS public.user_test_results (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        course_id UUID NOT NULL,
        chapter_id UUID,
        score DECIMAL(5,2) NOT NULL,
        max_score DECIMAL(5,2) NOT NULL,
        passed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Paso 4: Configurar RLS
    await executeSQL('Habilitando RLS en user_test_results', 'ALTER TABLE public.user_test_results ENABLE ROW LEVEL SECURITY;');
    await executeSQL('Habilitando RLS en user_course_progress', 'ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;');
    
    // Paso 5: Crear políticas RLS
    const policies = [
      { description: 'Eliminando política de visualización de test results', sql: 'DROP POLICY IF EXISTS "Users can view own test results" ON public.user_test_results;' },
      { description: 'Creando política de visualización de test results', sql: 'CREATE POLICY "Users can view own test results" ON public.user_test_results FOR SELECT USING (auth.uid() = user_id);' },
      { description: 'Eliminando política de inserción de test results', sql: 'DROP POLICY IF EXISTS "Users can insert own test results" ON public.user_test_results;' },
      { description: 'Creando política de inserción de test results', sql: 'CREATE POLICY "Users can insert own test results" ON public.user_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);' },
      { description: 'Eliminando política de visualización de progreso', sql: 'DROP POLICY IF EXISTS "Users can view own progress" ON public.user_course_progress;' },
      { description: 'Creando política de visualización de progreso', sql: 'CREATE POLICY "Users can view own progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);' },
      { description: 'Eliminando política de actualización de progreso', sql: 'DROP POLICY IF EXISTS "Users can update own progress" ON public.user_course_progress;' },
      { description: 'Creando política de actualización de progreso', sql: 'CREATE POLICY "Users can update own progress" ON public.user_course_progress FOR UPDATE USING (auth.uid() = user_id);' },
      { description: 'Eliminando política de inserción de progreso', sql: 'DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_course_progress;' },
      { description: 'Creando política de inserción de progreso', sql: 'CREATE POLICY "Users can insert own progress" ON public.user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);' }
    ];
    
    for (const policy of policies) {
      await executeSQL(policy.description, policy.sql);
    }
    
    // Paso 6: Crear función calculate_course_progress
    await executeSQL('Creando función calculate_course_progress', `
      CREATE OR REPLACE FUNCTION public.calculate_course_progress(p_user_id UUID, p_course_id UUID)
      RETURNS DECIMAL(5,2) AS $func$
      DECLARE
        total_chapters INTEGER;
        completed_chapters INTEGER;
        progress_percentage DECIMAL(5,2);
      BEGIN
        -- Contar total de capítulos del curso
        SELECT COUNT(*) INTO total_chapters
        FROM public.chapters
        WHERE course_id = p_course_id;
        
        -- Contar capítulos completados por el usuario
        SELECT COUNT(*) INTO completed_chapters
        FROM public.user_course_progress ucp
        JOIN public.chapters c ON ucp.chapter_id = c.id
        WHERE ucp.user_id = p_user_id 
          AND c.course_id = p_course_id 
          AND ucp.is_completed = true;
        
        -- Calcular porcentaje
        IF total_chapters > 0 THEN
          progress_percentage := (completed_chapters::DECIMAL / total_chapters::DECIMAL) * 100;
        ELSE
          progress_percentage := 0;
        END IF;
        
        RETURN ROUND(progress_percentage, 2);
      END;
      $func$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    
    // Paso 7: Crear vista user_course_summary
    await executeSQL('Eliminando vista user_course_summary existente', 'DROP VIEW IF EXISTS public.user_course_summary;');
    await executeSQL('Creando vista user_course_summary', `
      CREATE VIEW public.user_course_summary AS
      SELECT 
        c.id as course_id,
        c.title,
        c.description,
        c.image_url,
        c.teacher_id,
        t.name as teacher_name,
        c.created_at,
        c.updated_at,
        COALESCE(ucp.user_id, NULL) as user_id,
        COALESCE(ucp.is_completed, false) as is_completed,
        COALESCE(ucp.completion_percentage, 0) as completion_percentage,
        COALESCE(ucp.last_accessed_at, NULL) as last_accessed_at,
        COALESCE(AVG(utr.score), 0) as average_test_score,
        COUNT(utr.id) as total_tests_taken
      FROM public.courses c
      LEFT JOIN public.teachers t ON c.teacher_id = t.id
      LEFT JOIN public.user_course_progress ucp ON c.id = ucp.course_id
      LEFT JOIN public.user_test_results utr ON c.id = utr.course_id AND ucp.user_id = utr.user_id
      GROUP BY c.id, c.title, c.description, c.image_url, c.teacher_id, t.name, c.created_at, c.updated_at, 
               ucp.user_id, ucp.is_completed, ucp.completion_percentage, ucp.last_accessed_at;
    `);
    
    // Paso 8: Otorgar permisos
    await executeSQL('Otorgando permisos SELECT en user_course_summary', 'GRANT SELECT ON public.user_course_summary TO authenticated;');
    await executeSQL('Otorgando permisos en user_test_results', 'GRANT SELECT, INSERT, UPDATE ON public.user_test_results TO authenticated;');
    await executeSQL('Otorgando permisos en user_course_progress', 'GRANT SELECT, INSERT, UPDATE ON public.user_course_progress TO authenticated;');
    await executeSQL('Otorgando permisos EXECUTE en función calculate_course_progress', 'GRANT EXECUTE ON FUNCTION public.calculate_course_progress(UUID, UUID) TO authenticated;');
    
    console.log('✅ Migración completada exitosamente');
    
    // Verificaciones finales
    console.log('\n🔍 Verificaciones finales:');
    
    const { data: courses, error: coursesError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(5);
    
    if (coursesError) {
      console.error('❌ Error verificando vista user_course_summary:', coursesError);
    } else {
      console.log(`✅ Vista user_course_summary funciona correctamente (${courses?.length || 0} registros encontrados)`);
    }
    
    const { data: testResults, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error verificando tabla user_test_results:', testError);
    } else {
      console.log(`✅ Tabla user_test_results accesible (${testResults?.length || 0} registros encontrados)`);
    }
    
    console.log('\n🎉 ¡Migración completada! El problema de "0 curso(s)" debería estar resuelto.');
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar migración
applyMigration();