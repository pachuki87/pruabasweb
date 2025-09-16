require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ID del curso MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL
const MASTER_CURSO_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Definición de las lecciones para los módulos 5, 8 y 10
const lecciones = [
  {
    titulo: 'PSICOLOGÍA APLICADA A LAS ADICCIONES',
    descripcion: 'Módulo especializado en la aplicación de principios psicológicos en el tratamiento de adicciones, incluyendo técnicas de entrevista y terapias de aceptación y compromiso.',
    orden: 5,
    duracion_estimada: 180, // 3 horas
    imagen_url: null,
    video_url: null,
    tiene_cuestionario: false,
    archivo_url: 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL/PSICOLOGIA APLICADA ADICCIONES/contenido.html',
    leccion_anterior_id: null, // Se actualizará después
    leccion_siguiente_id: null // Se actualizará después
  },
  {
    titulo: 'GESTIÓN DE LAS ADICCIONES DESDE LA PERSPECTIVA DE GÉNERO',
    descripcion: 'Análisis integral de cómo el género influye en el desarrollo, manifestación y tratamiento de las adicciones, con enfoque en protocolos de inclusión y perspectivas específicas.',
    orden: 8,
    duracion_estimada: 150, // 2.5 horas
    imagen_url: null,
    video_url: null,
    tiene_cuestionario: false,
    archivo_url: 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL/GESTION PERSPECTIVA GENERO/contenido.html',
    leccion_anterior_id: null, // Se actualizará después
    leccion_siguiente_id: null // Se actualizará después
  },
  {
    titulo: 'TRABAJO FINAL DE MÁSTER',
    descripcion: 'Proyecto integrador que permite al estudiante aplicar todos los conocimientos adquiridos durante el máster en un trabajo de investigación o intervención práctica en el campo de las adicciones.',
    orden: 10,
    duracion_estimada: 300, // 5 horas
    imagen_url: null,
    video_url: null,
    tiene_cuestionario: false,
    archivo_url: 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL/TRABAJO FINAL MASTER/contenido.html',
    leccion_anterior_id: null, // Se actualizará después
    leccion_siguiente_id: null // Se actualizará después
  }
];

// Función para verificar si una lección ya existe
async function verificarLeccionExiste(titulo, orden) {
  try {
    const { data, error } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', MASTER_CURSO_ID)
      .or(`titulo.eq.${titulo},orden.eq.${orden}`);

    if (error) {
      console.error(`❌ Error al verificar lección ${titulo}:`, error.message);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`❌ Error al verificar lección ${titulo}:`, error.message);
    return null;
  }
}

// Función para insertar una lección
async function insertarLeccion(leccion) {
  try {
    const leccionData = {
      titulo: leccion.titulo,
      descripcion: leccion.descripcion,
      curso_id: MASTER_CURSO_ID,
      orden: leccion.orden,
      duracion_estimada: leccion.duracion_estimada,
      imagen_url: leccion.imagen_url,
      video_url: leccion.video_url,
      tiene_cuestionario: leccion.tiene_cuestionario,
      archivo_url: leccion.archivo_url,
      leccion_anterior_id: leccion.leccion_anterior_id,
      leccion_siguiente_id: leccion.leccion_siguiente_id,
      creado_en: new Date().toISOString(),
      actualizado_en: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('lecciones')
      .insert([leccionData])
      .select();

    if (error) {
      console.error(`❌ Error al insertar lección ${leccion.titulo}:`, error.message);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(`❌ Error al insertar lección ${leccion.titulo}:`, error.message);
    return null;
  }
}

// Función para actualizar una lección existente
async function actualizarLeccion(leccionId, leccion) {
  try {
    const leccionData = {
      descripcion: leccion.descripcion,
      duracion_estimada: leccion.duracion_estimada,
      archivo_url: leccion.archivo_url,
      actualizado_en: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('lecciones')
      .update(leccionData)
      .eq('id', leccionId)
      .select();

    if (error) {
      console.error(`❌ Error al actualizar lección ${leccion.titulo}:`, error.message);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(`❌ Error al actualizar lección ${leccion.titulo}:`, error.message);
    return null;
  }
}

// Función principal
async function crearLecciones() {
  console.log('🚀 Iniciando creación de lecciones para módulos 5, 8 y 10...');
  console.log(`📡 Conectando a Supabase: ${supabaseUrl}`);
  
  let leccionesCreadas = 0;
  let leccionesActualizadas = 0;
  let errores = 0;

  for (const leccion of lecciones) {
    console.log(`\n📚 Procesando lección: ${leccion.titulo} (Orden: ${leccion.orden})`);
    
    // Verificar si la lección ya existe
    const leccionExistente = await verificarLeccionExiste(leccion.titulo, leccion.orden);
    
    if (leccionExistente) {
      console.log(`⚠️ La lección "${leccion.titulo}" ya existe (ID: ${leccionExistente.id})`);
      
      // Actualizar la lección existente
      const leccionActualizada = await actualizarLeccion(leccionExistente.id, leccion);
      
      if (leccionActualizada) {
        console.log(`✅ Lección actualizada: ${leccion.titulo}`);
        leccionesActualizadas++;
      } else {
        console.log(`❌ Error al actualizar lección: ${leccion.titulo}`);
        errores++;
      }
    } else {
      // Crear nueva lección
      const nuevaLeccion = await insertarLeccion(leccion);
      
      if (nuevaLeccion) {
        console.log(`✅ Lección creada: ${leccion.titulo} (ID: ${nuevaLeccion.id})`);
        leccionesCreadas++;
      } else {
        console.log(`❌ Error al crear lección: ${leccion.titulo}`);
        errores++;
      }
    }
  }

  console.log('\n🎉 ¡Proceso completado!');
  console.log('📊 RESUMEN FINAL:');
  console.log(`   ✅ Lecciones creadas: ${leccionesCreadas}`);
  console.log(`   🔄 Lecciones actualizadas: ${leccionesActualizadas}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log(`   📚 Total procesadas: ${lecciones.length}`);

  if (errores === 0) {
    console.log('\n🎯 ¡Todas las lecciones se procesaron exitosamente!');
  } else {
    console.log(`\n⚠️ Se completó con ${errores} errores.`);
  }
}

// Ejecutar el script
crearLecciones().catch(console.error);