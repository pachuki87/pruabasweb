require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    const tablas = ['preguntas', 'respuestas', 'respuestas_texto_libre', 'user_quiz_attempts'];
    
    for (const tabla of tablas) {
      console.log(`\nVerificando tabla ${tabla}...`);
      
      const { data, error } = await supabase
        .from(tabla)
        .select()
        .limit(1);
      
      if (error) {
        console.log(`Error: ${error.message}`);
      } else {
        console.log(`Columnas en tabla ${tabla}:`);
        if (data && data.length > 0) {
          Object.keys(data[0]).forEach(col => console.log(`- ${col}`));
        } else {
          console.log('- Tabla vacía pero existe');
        }
      }
    }
  } catch (error) {
    console.error('Error general:', error);
  }
})();