import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan las variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCursos() {
  try {
    console.log('Consultando cursos existentes...');
    
    // Obtener todos los cursos
    const { data: cursos, error } = await supabase
      .from('cursos')
      .select('id, titulo, descripcion, creado_en')
      .order('titulo');
    
    if (error) {
      console.error('Error al consultar cursos:', error);
      return;
    }
    
    console.log('\n=== CURSOS EXISTENTES ===');
    cursos.forEach((curso, index) => {
      console.log(`${index + 1}. ${curso.titulo}`);
      console.log(`   ID: ${curso.id}`);
      console.log(`   Descripción: ${curso.descripcion?.substring(0, 100)}...`);
      console.log(`   Creado: ${curso.creado_en}`);
      console.log('');
    });
    
    // Identificar duplicados
    const titulos = {};
    cursos.forEach(curso => {
      if (titulos[curso.titulo]) {
        titulos[curso.titulo].push(curso);
      } else {
        titulos[curso.titulo] = [curso];
      }
    });
    
    console.log('\n=== CURSOS DUPLICADOS ===');
    Object.keys(titulos).forEach(titulo => {
      if (titulos[titulo].length > 1) {
        console.log(`\n${titulo} (${titulos[titulo].length} duplicados):`);
        titulos[titulo].forEach((curso, index) => {
          console.log(`  ${index + 1}. ID: ${curso.id} - Creado: ${curso.creado_en}`);
        });
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCursos();