const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('Aplicando migración: agregando columna aprobado...');
    
    // Agregar la columna aprobado
    const { data: addColumnResult, error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.intentos_cuestionario 
        ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;
        
        COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';
      `
    });
    
    if (addColumnError) {
      console.error('Error agregando columna:', addColumnError);
      // Intentar método alternativo usando SQL directo
      console.log('Intentando método alternativo...');
      
      const { data, error } = await supabase
        .from('intentos_cuestionario')
        .select('*')
        .limit(1);
        
      if (error) {
        console.error('Error verificando tabla:', error);
        return;
      }
      
      console.log('Tabla accesible, pero no se puede modificar esquema desde cliente.');
      console.log('La columna debe agregarse desde el panel de Supabase o usando migraciones.');
      return;
    }
    
    console.log('Columna agregada exitosamente');
    
    // Actualizar registros existentes
    console.log('Actualizando registros existentes...');
    const { data: updateResult, error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE public.intentos_cuestionario 
        SET aprobado = CASE 
            WHEN porcentaje >= 70 THEN TRUE 
            ELSE FALSE 
        END
        WHERE aprobado IS NULL;
      `
    });
    
    if (updateError) {
      console.error('Error actualizando registros:', updateError);
    } else {
      console.log('Registros actualizados exitosamente');
    }
    
    // Verificar que la columna existe
    console.log('Verificando que la columna existe...');
    const { data: testData, error: testError } = await supabase
      .from('intentos_cuestionario')
      .select('id, aprobado')
      .limit(1);
      
    if (testError) {
      console.error('Error verificando columna:', testError);
    } else {
      console.log('✅ Columna aprobado verificada exitosamente');
      console.log('Datos de prueba:', testData);
    }
    
  } catch (error) {
    console.error('Error en migración:', error);
  }
}

applyMigration();