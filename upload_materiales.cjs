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

// IDs de los cursos
const CURSO_EXPERTO_ID = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
const CURSO_MASTER_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Mapeo de PDFs a cursos y sus títulos descriptivos
const materialesConfig = {
  // Materiales para Experto en Conductas Adictivas
  experto: {
    curso_id: CURSO_EXPERTO_ID,
    materiales: [
      {
        archivo: 'seminario-enero-manejo-del-estres-y-ansiedad.pdf',
        titulo: 'Seminario: Manejo del Estrés y Ansiedad',
        descripcion: 'Material complementario sobre técnicas de manejo del estrés y ansiedad en el contexto de las adicciones'
      },
      {
        archivo: 'La ventana de johari.pdf',
        titulo: 'La Ventana de Johari',
        descripcion: 'Herramienta de autoconocimiento y comunicación interpersonal'
      },
      {
        archivo: 'NIÑO INTERIOR .pdf',
        titulo: 'El Niño Interior',
        descripcion: 'Trabajo terapéutico con el niño interior en procesos de recuperación'
      },
      {
        archivo: 'PSICOTERAPIA PPT.pdf',
        titulo: 'Presentación: Psicoterapia',
        descripcion: 'Material didáctico sobre fundamentos de psicoterapia'
      },
      {
        archivo: 'TECNICAS COMUNICATIVAS DEF.pdf',
        titulo: 'Técnicas Comunicativas',
        descripcion: 'Guía de técnicas de comunicación efectiva en terapia'
      }
    ]
  },
  // Materiales para Máster en Adicciones
  master: {
    curso_id: CURSO_MASTER_ID,
    materiales: [
      {
        archivo: 'master-adicciones/Bloque-1-Tecnico-en-Adicciones.pdf',
        titulo: 'Bloque 1: Técnico en Adicciones',
        descripcion: 'Material fundamental sobre técnicas básicas en el tratamiento de adicciones'
      },
      {
        archivo: 'master-adicciones/BLOQUE 2 TÉCNICO EN ADICCIONES.pdf',
        titulo: 'Bloque 2: Técnico en Adicciones',
        descripcion: 'Continuación del material técnico sobre tratamiento de adicciones'
      },
      {
        archivo: 'master-adicciones/bloque-2-tecnico-adicciones.pdf',
        titulo: 'Bloque 2: Técnico en Adicciones (Versión Alternativa)',
        descripcion: 'Material complementario del bloque 2 de técnico en adicciones'
      },
      {
        archivo: 'master-adicciones/BLOQUE III - FAMILIA Y TRABAJO EN EQUIPO.pdf',
        titulo: 'Bloque 3: Familia y Trabajo en Equipo',
        descripcion: 'Material sobre intervención familiar y trabajo interdisciplinario'
      },
      {
        archivo: 'master-adicciones/Recovery Coach reinservida.pdf',
        titulo: 'Recovery Coach',
        descripcion: 'Guía completa sobre el rol del Recovery Coach en el proceso de recuperación'
      },
      {
        archivo: 'master-adicciones/intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf',
        titulo: 'Intervención Familiar en Adicciones y Recovery Mentoring',
        descripcion: 'Manual especializado en intervención familiar y mentoring en recuperación'
      },
      {
        archivo: 'master-adicciones/Manual-MATRIX-para-Terapeutas.pdf',
        titulo: 'Manual MATRIX para Terapeutas',
        descripcion: 'Guía del modelo MATRIX para el tratamiento de adicciones'
      },
      {
        archivo: 'master-adicciones/TERAPIAS TERCERA GENERACIÓN MASTER DEFINITIVO.pdf',
        titulo: 'Terapias de Tercera Generación',
        descripcion: 'Material avanzado sobre terapias de tercera generación aplicadas a adicciones'
      },
      {
        archivo: 'master-adicciones/Cuaderno-de-ejercicios-de-inteligencia-emocional.pdf',
        titulo: 'Cuaderno de Ejercicios: Inteligencia Emocional',
        descripcion: 'Ejercicios prácticos para el desarrollo de la inteligencia emocional'
      },
      {
        archivo: 'master-adicciones/PPT INTELIGENCIA EMOCIONAL.pdf',
        titulo: 'Presentación: Inteligencia Emocional',
        descripcion: 'Material didáctico sobre inteligencia emocional en el contexto de las adicciones'
      }
    ]
  },
  // Materiales compartidos (disponibles para ambos cursos)
  compartidos: [
    {
      archivo: '2-Guia-IF-Especializados-2014.pdf',
      titulo: 'Guía de Intervención Familiar Especializada',
      descripcion: 'Guía especializada para intervención familiar en contextos de adicción'
    },
    {
      archivo: 'BLOQUE 1 TECNICO EN ADICIONES.pdf',
      titulo: 'Bloque 1: Técnico en Adicciones (General)',
      descripcion: 'Material base sobre fundamentos técnicos en adicciones'
    },
    {
      archivo: 'BLOQUE 2 TÉCNICO EN ADICCIONES.pdf',
      titulo: 'Bloque 2: Técnico en Adicciones (General)',
      descripcion: 'Material avanzado sobre técnicas en adicciones'
    },
    {
      archivo: 'BLOQUE III - FAMILIA Y TRABAJO EN EQUIPO.pdf',
      titulo: 'Bloque 3: Familia y Trabajo en Equipo (General)',
      descripcion: 'Material sobre trabajo familiar y en equipo'
    },
    {
      archivo: 'BLOQUE-1-TECNICO-EN-ADICCIONES.pdf',
      titulo: 'Bloque 1: Técnico en Adicciones (Versión 2)',
      descripcion: 'Versión alternativa del material técnico básico'
    },
    {
      archivo: 'Cuaderno-de-ejercicios-de-inteligencia-emocional.pdf',
      titulo: 'Cuaderno de Ejercicios: Inteligencia Emocional (General)',
      descripcion: 'Ejercicios de inteligencia emocional aplicables a ambos cursos'
    },
    {
      archivo: 'Informe-Educación-emocional-para-las-conductas-adictivas.pdf',
      titulo: 'Informe: Educación Emocional para Conductas Adictivas',
      descripcion: 'Informe especializado sobre educación emocional en adicciones'
    },
    {
      archivo: 'intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf',
      titulo: 'Intervención Familiar y Recovery Mentoring (General)',
      descripcion: 'Material sobre intervención familiar y mentoring'
    },
    {
      archivo: 'MATRIX-manual_terapeuta.pdf',
      titulo: 'Manual MATRIX para Terapeutas (General)',
      descripcion: 'Manual del modelo MATRIX para terapeutas'
    },
    {
      archivo: 'PPT INTELIGENCIA EMOCIONAL.pdf',
      titulo: 'Presentación: Inteligencia Emocional (General)',
      descripcion: 'Presentación sobre inteligencia emocional'
    },
    {
      archivo: 'Recovery Coach reinservida.pdf',
      titulo: 'Recovery Coach (General)',
      descripcion: 'Material sobre Recovery Coaching'
    },
    {
      archivo: 'TERAPIAS TERCERA GENERACIÓN MASTER DEFINITIVO.pdf',
      titulo: 'Terapias de Tercera Generación (General)',
      descripcion: 'Material sobre terapias de tercera generación'
    }
  ]
};

async function uploadMateriales() {
  try {
    console.log('📚 Iniciando carga de materiales...');
    
    // Verificar materiales existentes
    const { data: existingMaterials, error: fetchError } = await supabase
      .from('materiales')
      .select('titulo, url_archivo');
    
    if (fetchError) {
      console.error('❌ Error al obtener materiales existentes:', fetchError);
      return;
    }
    
    const existingTitles = new Set(existingMaterials.map(m => m.titulo));
    const existingUrls = new Set(existingMaterials.map(m => m.url_archivo));
    
    let uploadedCount = 0;
    let skippedCount = 0;
    
    // Función para subir material
    async function uploadMaterial(material, cursoId) {
      const url = `/pdfs/${material.archivo}`;
      
      // Verificar si ya existe
      if (existingTitles.has(material.titulo) || existingUrls.has(url)) {
        console.log(`⏭️  Saltando (ya existe): ${material.titulo}`);
        skippedCount++;
        return;
      }
      
      // Verificar que el archivo existe
      const filePath = path.join(__dirname, 'public', 'pdfs', material.archivo);
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${material.archivo}`);
        return;
      }
      
      const { data, error } = await supabase
        .from('materiales')
        .insert({
          titulo: material.titulo,
          curso_id: cursoId,
          url_archivo: url,
          tipo_material: 'pdf',
          descripcion: material.descripcion
        });
      
      if (error) {
        console.error(`❌ Error al subir ${material.titulo}:`, error);
      } else {
        console.log(`✅ Subido: ${material.titulo}`);
        uploadedCount++;
      }
    }
    
    // Subir materiales del Experto
    console.log('\n🎓 Subiendo materiales para Experto en Conductas Adictivas...');
    for (const material of materialesConfig.experto.materiales) {
      await uploadMaterial(material, CURSO_EXPERTO_ID);
    }
    
    // Subir materiales del Máster
    console.log('\n🎓 Subiendo materiales para Máster en Adicciones...');
    for (const material of materialesConfig.master.materiales) {
      await uploadMaterial(material, CURSO_MASTER_ID);
    }
    
    // Subir materiales compartidos para ambos cursos
    console.log('\n📚 Subiendo materiales compartidos...');
    for (const material of materialesConfig.compartidos) {
      // Subir para Experto
      await uploadMaterial({
        ...material,
        titulo: `${material.titulo} (Experto)`
      }, CURSO_EXPERTO_ID);
      
      // Subir para Máster
      await uploadMaterial({
        ...material,
        titulo: `${material.titulo} (Máster)`
      }, CURSO_MASTER_ID);
    }
    
    console.log('\n📊 RESUMEN:');
    console.log(`✅ Materiales subidos: ${uploadedCount}`);
    console.log(`⏭️  Materiales saltados (ya existían): ${skippedCount}`);
    console.log('\n🎉 ¡Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

uploadMateriales();