const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usar la clave de servicio para evitar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkConstraintDefinition() {
  console.log('🔍 Obteniendo definición del constraint preguntas_respuesta_correcta_check...');

  try {
    // Consulta SQL para obtener la definición del constraint
    const { data, error } = await supabase
      .rpc('sql', {
        query: `
          SELECT 
            conname as constraint_name,
            pg_get_constraintdef(c.oid) as constraint_definition
          FROM pg_constraint c
          JOIN pg_class t ON c.conrelid = t.oid
          JOIN pg_namespace n ON t.relnamespace = n.oid
          WHERE t.relname = 'preguntas' 
          AND n.nspname = 'public'
          AND conname LIKE '%respuesta_correcta%';
        `
      });

    if (error) {
      console.error('Error obteniendo constraint:', error);
      
      // Método alternativo usando información del esquema
      console.log('\n🔄 Intentando método alternativo...');
      
      const { data: constraints, error: error2 } = await supabase
        .rpc('sql', {
          query: `
            SELECT 
              tc.constraint_name,
              tc.constraint_type,
              cc.check_clause
            FROM information_schema.table_constraints tc
            LEFT JOIN information_schema.check_constraints cc 
              ON tc.constraint_name = cc.constraint_name
            WHERE tc.table_name = 'preguntas'
            AND tc.constraint_name LIKE '%respuesta_correcta%';
          `
        });

      if (error2) {
        console.error('Error con método alternativo:', error2);
      } else {
        console.log('Constraints encontrados:', constraints);
      }
    } else {
      console.log('Definición del constraint:', data);
    }

    // También verificar todas las preguntas existentes para ver qué valores tienen
    console.log('\n📊 Analizando valores existentes de respuesta_correcta...');
    
    const { data: preguntas, error: errorPreguntas } = await supabase
      .from('preguntas')
      .select('respuesta_correcta, tipo')
      .not('respuesta_correcta', 'is', null);

    if (errorPreguntas) {
      console.error('Error obteniendo preguntas:', errorPreguntas);
    } else {
      console.log(`Preguntas con respuesta_correcta no nula: ${preguntas.length}`);
      
      // Agrupar por valor de respuesta_correcta
      const valores = {};
      preguntas.forEach(p => {
        const valor = p.respuesta_correcta;
        if (!valores[valor]) {
          valores[valor] = { count: 0, tipos: new Set() };
        }
        valores[valor].count++;
        valores[valor].tipos.add(p.tipo);
      });

      console.log('\nValores únicos encontrados:');
      Object.entries(valores).forEach(([valor, info]) => {
        console.log(`- "${valor}" (${info.count} veces, tipos: ${Array.from(info.tipos).join(', ')})`);
      });
    }

    // Verificar si hay algún patrón en las preguntas que funcionan
    console.log('\n🔍 Verificando preguntas que funcionan...');
    
    const { data: preguntasFuncionan, error: errorFuncionan } = await supabase
      .from('preguntas')
      .select('*')
      .eq('tipo', 'multiple_choice')
      .limit(5);

    if (errorFuncionan) {
      console.error('Error:', errorFuncionan);
    } else {
      console.log('Ejemplos de preguntas multiple_choice que funcionan:');
      preguntasFuncionan.forEach((p, i) => {
        console.log(`${i + 1}. Respuesta correcta: "${p.respuesta_correcta}" (${typeof p.respuesta_correcta})`);
      });
    }

  } catch (error) {
    console.error('Error general:', error);
  }
}

checkConstraintDefinition();