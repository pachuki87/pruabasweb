import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Configuración de Supabase con clave de servicio para permisos completos
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ID del curso de Inteligencia Emocional
const CURSO_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Estructura de lecciones basada en las carpetas
const lecciones = [
  {
    titulo: 'Fundamentos Proceso Terapéutico',
    descripcion: 'Introducción a los fundamentos del proceso terapéutico en adicciones',
    orden: 1,
    carpeta: '1)FUNDAMENTOS P TERAPEUTICO'
  },
  {
    titulo: 'Terapia Cognitiva en Drogodependencias',
    descripcion: 'Aplicación de la terapia cognitiva en el tratamiento de drogodependencias',
    orden: 2,
    carpeta: '2) TERAPIA COGNITIVA DROGODEPENDENENCIAS'
  },
  {
    titulo: 'Familia y Trabajo en Equipo',
    descripcion: 'Importancia de la familia y el trabajo en equipo en el proceso de recuperación',
    orden: 3,
    carpeta: '3) FAMILIA Y TRABAJO EQUIPO'
  },
  {
    titulo: 'Recovery Coaching',
    descripcion: 'Metodología y técnicas del Recovery Coaching',
    orden: 4,
    carpeta: '4)RECOVERY COACHING'
  },
  {
    titulo: 'Intervención Familiar y Recovery Mentoring',
    descripcion: 'Estrategias de intervención familiar y mentoring en recuperación',
    orden: 5,
    carpeta: '6) INTERVENCION FAMILIAR Y RECOVERY MENTORING'
  },
  {
    titulo: 'Nuevos Modelos Terapéuticos',
    descripcion: 'Exploración de nuevos enfoques y modelos terapéuticos innovadores',
    orden: 6,
    carpeta: '7) NUEVOS MODELOS TERAPEUTICOS'
  },
  {
    titulo: 'Inteligencia Emocional Aplicada',
    descripcion: 'Aplicación práctica de la inteligencia emocional en el tratamiento de adicciones',
    orden: 7,
    carpeta: '9) INTELIGENCIA EMOCIONAL'
  }
];

async function reorganizarLecciones() {
  console.log('Iniciando reorganización de lecciones...');
  
  try {
    // Primero eliminar todas las lecciones existentes del curso
    console.log('Eliminando lecciones existentes...');
    const { error: deleteError } = await supabase
      .from('lecciones')
      .delete()
      .eq('curso_id', CURSO_ID);
    
    if (deleteError) {
      console.error('Error eliminando lecciones:', deleteError);
      return;
    }
    
    // Crear las nuevas lecciones
    console.log('Creando nuevas lecciones...');
    for (const leccion of lecciones) {
      const { data, error } = await supabase
        .from('lecciones')
        .insert({
          curso_id: CURSO_ID,
          titulo: leccion.titulo,
          descripcion: leccion.descripcion,
          orden: leccion.orden,
          contenido_html: `<h2>${leccion.titulo}</h2><p>${leccion.descripcion}</p><p>Esta lección está basada en los materiales de la carpeta: <strong>${leccion.carpeta}</strong></p>`,
          duracion_estimada: 60, // 60 minutos por defecto
          tiene_cuestionario: true
        })
        .select();
      
      if (error) {
        console.error(`Error creando lección ${leccion.titulo}:`, error);
      } else {
        console.log(`✓ Lección creada: ${leccion.titulo}`);
        
        // Crear materiales para esta lección basados en los archivos de la carpeta
        await crearMaterialesParaLeccion(data[0].id, leccion.carpeta);
      }
    }
    
    console.log('\n¡Reorganización completada exitosamente!');
    
  } catch (error) {
    console.error('Error en la reorganización:', error);
  }
}

async function crearMaterialesParaLeccion(leccionId, carpeta) {
  const carpetaPath = path.join('inteligencia_emocional_drive', carpeta);
  
  try {
    if (fs.existsSync(carpetaPath)) {
      const archivos = fs.readdirSync(carpetaPath, { withFileTypes: true });
      
      for (const archivo of archivos) {
        if (archivo.isFile()) {
          const extension = path.extname(archivo.name).toLowerCase();
          let tipoMaterial = 'documento';
          
          if (extension === '.pdf') tipoMaterial = 'pdf';
          else if (extension === '.mp4') tipoMaterial = 'video';
          else if (['.ppt', '.pptx'].includes(extension)) tipoMaterial = 'presentacion';
          
          const { error } = await supabase
            .from('materiales')
            .insert({
              curso_id: CURSO_ID,
              leccion_id: leccionId,
              titulo: archivo.name,
              tipo_material: tipoMaterial,
              url_archivo: `/${carpetaPath}/${archivo.name}`,
              descripcion: `Material de apoyo: ${archivo.name}`
            });
          
          if (error) {
            console.error(`Error creando material ${archivo.name}:`, error);
          } else {
            console.log(`  ✓ Material agregado: ${archivo.name}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error procesando carpeta ${carpeta}:`, error);
  }
}

// Ejecutar la reorganización
reorganizarLecciones();