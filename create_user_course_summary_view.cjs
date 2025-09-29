require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('Creando vista user_course_summary...');
    
    // SQL para crear la vista
    const createViewSQL = `
      CREATE OR REPLACE VIEW user_course_summary AS
      SELECT 
        i.user_id,
        i.curso_id,
        c.titulo as curso_titulo,
        c.descripcion as curso_descripcion,
        c.imagen_url as curso_imagen,
        COUNT(l.id) as total_lecciones,
        COUNT(CASE WHEN ucp.leccion_id IS NOT NULL THEN 1 END) as lecciones_completadas,
        ROUND(
          (COUNT(CASE WHEN ucp.leccion_id IS NOT NULL THEN 1 END)::float / 
           NULLIF(COUNT(l.id), 0)) * 100, 2
        ) as progreso_porcentaje,
        MAX(ucp.completado_en) as ultima_actividad
      FROM inscripciones i
      JOIN cursos c ON i.curso_id = c.id
      LEFT JOIN lecciones l ON c.id = l.curso_id
      LEFT JOIN user_course_progress ucp ON (
        ucp.user_id = i.user_id AND 
        ucp.curso_id = i.curso_id AND 
        ucp.leccion_id = l.id AND 
        ucp.completado = true
      )
      GROUP BY 
        i.user_id, 
        i.curso_id, 
        c.titulo, 
        c.descripcion, 
        c.imagen_url;
    `;
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createViewSQL
    });
    
    if (error) {
      console.log('Error al crear la vista:', error);
      
      // Intentar con una consulta directa
      console.log('\nIntentando crear la vista directamente...');
      const { data: directData, error: directError } = await supabase
        .from('pg_stat_user_tables')
        .select('*')
        .limit(1);
        
      if (directError) {
        console.log('No se puede ejecutar SQL directamente:', directError.message);
        console.log('\nLa vista debe crearse manualmente en Supabase Dashboard con el siguiente SQL:');
        console.log(createViewSQL);
      }
    } else {
      console.log('Vista creada exitosamente!');
      
      // Verificar que la vista funciona
      const { data: testData, error: testError } = await supabase
        .from('user_course_summary')
        .select('*')
        .limit(1);
        
      if (testError) {
        console.log('Error al probar la vista:', testError.message);
      } else {
        console.log('Vista funcionando correctamente!');
        if (testData.length > 0) {
          console.log('Ejemplo de datos:', testData[0]);
        }
      }
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
})();