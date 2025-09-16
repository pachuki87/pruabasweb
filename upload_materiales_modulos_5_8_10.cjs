require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase - usar service role key para operaciones administrativas
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ID del curso Máster en Adicciones
const CURSO_MASTER_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Configuración de materiales para los módulos 5, 8 y 10
const materialesConfig = {
  modulo5: {
    curso_id: CURSO_MASTER_ID,
    leccion_id: null, // Se asignará después de crear las lecciones
    materiales: [
      {
        archivo: 'master en adicciones/5) PSICOLOGIA ADICCIONES/La entrevista v.pdf',
        titulo: 'La Entrevista en Psicología de las Adicciones',
        descripcion: 'Guía práctica sobre técnicas de entrevista en el contexto de las adicciones',
        tipo_material: 'pdf'
      },
      {
        archivo: 'master en adicciones/5) PSICOLOGIA ADICCIONES/PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf',
        titulo: 'Cuadernillo de Terapia de Aceptación y Compromiso',
        descripcion: 'Material práctico para terapia de aceptación y compromiso individual o grupal',
        tipo_material: 'pdf'
      },
      {
        archivo: 'master en adicciones/5) PSICOLOGIA ADICCIONES/WILSON TERAPIA ACEPTACION Y COMPROMISO.pages',
        titulo: 'Wilson - Terapia de Aceptación y Compromiso',
        descripcion: 'Fundamentos teóricos de la Terapia de Aceptación y Compromiso según Wilson',
        tipo_material: 'documento'
      }
    ]
  },
  modulo8: {
    curso_id: CURSO_MASTER_ID,
    leccion_id: null, // Se asignará después de crear las lecciones
    materiales: [
      {
        archivo: 'master en adicciones/8) GESTIÓN DE LAS ADICCIONES DESDE LA PERSPECTIVA DE GÉNERO/2021_Protocolo_Inclusion_Genero_Prevencion_Adicciones.pdf',
        titulo: 'Protocolo de Inclusión de Género en Prevención de Adicciones',
        descripcion: 'Protocolo oficial para la inclusión de la perspectiva de género en programas de prevención de adicciones',
        tipo_material: 'pdf'
      },
      {
        archivo: 'master en adicciones/8) GESTIÓN DE LAS ADICCIONES DESDE LA PERSPECTIVA DE GÉNERO/IVEncuentroGeneroDrogas_PatriciaMartinezRedondo.pdf',
        titulo: 'IV Encuentro Género y Drogas - Patricia Martínez Redondo',
        descripcion: 'Ponencia sobre género y drogas del IV Encuentro especializado',
        tipo_material: 'pdf'
      }
    ]
  },
  modulo10: {
    curso_id: CURSO_MASTER_ID,
    leccion_id: null, // Se asignará después de crear las lecciones
    materiales: [
      {
        archivo: 'master en adicciones/10) TRABAJO FINAL MASTER/GUIA PRACTICA TFM.pages',
        titulo: 'Guía Práctica del Trabajo Final de Máster',
        descripcion: 'Manual completo con instrucciones, requisitos y criterios para la elaboración del TFM',
        tipo_material: 'documento'
      }
    ]
  }
};

// Función para obtener el tamaño del archivo
function obtenerTamañoArchivo(rutaArchivo) {
  try {
    const stats = fs.statSync(rutaArchivo);
    return stats.size; // Retornar solo el número de bytes
  } catch (error) {
    console.warn(`⚠️ No se pudo obtener el tamaño del archivo: ${rutaArchivo}`);
    return 0;
  }
}

// Función para formatear el tamaño para mostrar
function formatearTamaño(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

// Función para verificar si un archivo existe
function verificarArchivo(rutaArchivo) {
  const rutaCompleta = path.join(__dirname, rutaArchivo);
  return fs.existsSync(rutaCompleta);
}

// Función para subir materiales de un módulo
async function subirMaterialesModulo(nombreModulo, config) {
  console.log(`\n📚 Procesando materiales del ${nombreModulo}...`);
  
  let materialesSubidos = 0;
  let errores = 0;

  for (const material of config.materiales) {
    try {
      const rutaCompleta = path.join(__dirname, material.archivo);
      
      // Verificar si el archivo existe
      if (!verificarArchivo(material.archivo)) {
        console.log(`❌ Archivo no encontrado: ${material.archivo}`);
        errores++;
        continue;
      }

      // Obtener tamaño del archivo
      const tamañoArchivo = obtenerTamañoArchivo(rutaCompleta);
      const tamañoFormateado = formatearTamaño(tamañoArchivo);

      // Preparar datos para insertar
      const materialData = {
        titulo: material.titulo,
        curso_id: config.curso_id,
        url_archivo: material.archivo,
        tipo_material: material.tipo_material,
        descripcion: material.descripcion,
        tamaño_archivo: tamañoArchivo, // Enviar como número
        leccion_id: config.leccion_id, // null por ahora, se actualizará después
        creado_en: new Date().toISOString()
      };

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('materiales')
        .insert([materialData])
        .select();

      if (error) {
        console.error(`❌ Error al subir ${material.titulo}:`, error.message);
        errores++;
      } else {
        console.log(`✅ Material subido: ${material.titulo} (${tamañoFormateado})`);
        materialesSubidos++;
      }

      // Pequeña pausa para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error procesando ${material.titulo}:`, error.message);
      errores++;
    }
  }

  console.log(`\n📊 Resumen ${nombreModulo}:`);
  console.log(`   ✅ Materiales subidos: ${materialesSubidos}`);
  console.log(`   ❌ Errores: ${errores}`);
  
  return { subidos: materialesSubidos, errores };
}

// Función principal
async function main() {
  console.log('🚀 Iniciando subida de materiales para módulos 5, 8 y 10...');
  console.log(`📡 Conectando a Supabase: ${supabaseUrl}`);

  try {
    // Verificar conexión a Supabase
    const { data: testData, error: testError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', CURSO_MASTER_ID)
      .single();

    if (testError) {
      console.error('❌ Error conectando a Supabase:', testError.message);
      return;
    }

    console.log(`✅ Conectado exitosamente. Curso: ${testData.titulo}`);

    let totalSubidos = 0;
    let totalErrores = 0;

    // Subir materiales de cada módulo
    const resultadoModulo5 = await subirMaterialesModulo('Módulo 5 - Psicología Aplicada a las Adicciones', materialesConfig.modulo5);
    totalSubidos += resultadoModulo5.subidos;
    totalErrores += resultadoModulo5.errores;

    const resultadoModulo8 = await subirMaterialesModulo('Módulo 8 - Gestión desde Perspectiva de Género', materialesConfig.modulo8);
    totalSubidos += resultadoModulo8.subidos;
    totalErrores += resultadoModulo8.errores;

    const resultadoModulo10 = await subirMaterialesModulo('Módulo 10 - Trabajo Final de Máster', materialesConfig.modulo10);
    totalSubidos += resultadoModulo10.subidos;
    totalErrores += resultadoModulo10.errores;

    // Resumen final
    console.log('\n🎉 ¡Proceso completado!');
    console.log('=' * 50);
    console.log(`📊 RESUMEN FINAL:`);
    console.log(`   ✅ Total materiales subidos: ${totalSubidos}`);
    console.log(`   ❌ Total errores: ${totalErrores}`);
    console.log(`   📚 Módulos procesados: 3`);

    if (totalErrores === 0) {
      console.log('\n🎊 ¡Todos los materiales se subieron exitosamente!');
    } else {
      console.log(`\n⚠️ Se completó con ${totalErrores} errores. Revisa los archivos faltantes.`);
    }

  } catch (error) {
    console.error('💥 Error fatal:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, materialesConfig };