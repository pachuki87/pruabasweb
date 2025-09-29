import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function countCourses() {
  try {
    console.log('Consultando la cantidad de cursos en la base de datos...');
    
    // Contar todos los cursos
    const { count, error } = await supabase
      .from('cursos')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error al consultar los cursos:', error);
      return;
    }
    
    console.log(`\n📊 RESULTADO:`);
    console.log(`Total de cursos en la base de datos: ${count}`);
    
    // También obtener información detallada de los cursos
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('id, titulo, descripcion, creado_en');
    
    if (coursesError) {
      console.error('Error al obtener detalles de los cursos:', coursesError);
      return;
    }
    
    if (courses && courses.length > 0) {
      console.log('\n📚 CURSOS ENCONTRADOS:');
      courses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.titulo}`);
        console.log(`   ID: ${course.id}`);
        console.log(`   Descripción: ${course.descripcion || 'Sin descripción'}`);
        console.log(`   Creado: ${new Date(course.creado_en).toLocaleDateString('es-ES')}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

// Ejecutar la función
countCourses();