const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkLesson1Content() {
  try {
    const { data, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44')
      .single();
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('=== LECCIÓN 1 - FUNDAMENTOS P TERAPEUTICO ===');
    console.log('Columnas disponibles:', Object.keys(data));
    console.log('ID:', data.id);
    console.log('Título:', data.titulo);
    console.log('archivo_url:', data.archivo_url);
    
    // Verificar si hay alguna columna de contenido
    const contentColumns = Object.keys(data).filter(key => 
      key.toLowerCase().includes('content') || 
      key.toLowerCase().includes('contenido') ||
      key.toLowerCase().includes('html')
    );
    
    console.log('Columnas de contenido encontradas:', contentColumns);
    
    contentColumns.forEach(col => {
      const value = data[col];
      if (value) {
        console.log(`${col} existe:`, !!value);
        console.log(`${col} longitud:`, value.length);
        console.log(`Primeros 200 caracteres de ${col}:`);
        console.log(value.substring(0, 200) + '...');
      }
    });
    
    // Verificar todas las columnas que podrían contener contenido
    console.log('\n=== TODAS LAS COLUMNAS ===');
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (typeof value === 'string' && value.length > 100) {
        console.log(`${key}: ${value.length} caracteres`);
        console.log(`Primeros 100 caracteres: ${value.substring(0, 100)}...`);
        console.log('---');
      }
    });
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

checkLesson1Content();