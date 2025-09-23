const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Opciones de respuesta generadas
const opcionesRespuesta = [
  { pregunta_id: 'bbba66ea-2db2-4cf1-bf93-8bcb296400c4', opcion: 'Serotonina', es_correcta: false, orden: 1 },
  { pregunta_id: 'bbba66ea-2db2-4cf1-bf93-8bcb296400c4', opcion: 'Dopamina', es_correcta: false, orden: 2 },
  { pregunta_id: 'bbba66ea-2db2-4cf1-bf93-8bcb296400c4', opcion: 'GABA', es_correcta: false, orden: 3 },
  { pregunta_id: 'bbba66ea-2db2-4cf1-bf93-8bcb296400c4', opcion: 'Acetilcolina', es_correcta: false, orden: 4 },
  { pregunta_id: 'e2152c46-8a47-4e77-9046-b2c56cf5f653', opcion: 'Hipocampo', es_correcta: false, orden: 1 },
  { pregunta_id: 'e2152c46-8a47-4e77-9046-b2c56cf5f653', opcion: 'Amígdala', es_correcta: false, orden: 2 },
  { pregunta_id: 'e2152c46-8a47-4e77-9046-b2c56cf5f653', opcion: 'Núcleo accumbens', es_correcta: false, orden: 3 },
  { pregunta_id: 'e2152c46-8a47-4e77-9046-b2c56cf5f653', opcion: 'Corteza prefrontal', es_correcta: false, orden: 4 },
  { pregunta_id: 'ac08f3f6-72f0-4d9a-be14-120bcb53187c', opcion: 'Apoyo familiar fuerte', es_correcta: false, orden: 1 },
  { pregunta_id: 'ac08f3f6-72f0-4d9a-be14-120bcb53187c', opcion: 'Predisposición genética', es_correcta: false, orden: 2 },
  { pregunta_id: 'ac08f3f6-72f0-4d9a-be14-120bcb53187c', opcion: 'Actividades recreativas saludables', es_correcta: false, orden: 3 },
  { pregunta_id: 'ac08f3f6-72f0-4d9a-be14-120bcb53187c', opcion: 'Red social positiva', es_correcta: false, orden: 4 },
  { pregunta_id: 'ea8b5bb5-4761-4231-94d2-1df0ad6ff6ce', opcion: '20-30%', es_correcta: false, orden: 1 },
  { pregunta_id: 'ea8b5bb5-4761-4231-94d2-1df0ad6ff6ce', opcion: '40-60%', es_correcta: false, orden: 2 },
  { pregunta_id: 'ea8b5bb5-4761-4231-94d2-1df0ad6ff6ce', opcion: '70-80%', es_correcta: false, orden: 3 },
  { pregunta_id: 'ea8b5bb5-4761-4231-94d2-1df0ad6ff6ce', opcion: '90-95%', es_correcta: false, orden: 4 },
  { pregunta_id: '253cb6ea-626d-457a-a37d-5ecca1e6a382', opcion: 'CAGE', es_correcta: false, orden: 1 },
  { pregunta_id: '253cb6ea-626d-457a-a37d-5ecca1e6a382', opcion: 'AUDIT', es_correcta: false, orden: 2 },
  { pregunta_id: '253cb6ea-626d-457a-a37d-5ecca1e6a382', opcion: 'MAST', es_correcta: false, orden: 3 },
  { pregunta_id: '253cb6ea-626d-457a-a37d-5ecca1e6a382', opcion: 'SASSI', es_correcta: false, orden: 4 },
  { pregunta_id: '5725ca4c-7337-4948-a80b-8a6c994819bf', opcion: '1-2 criterios', es_correcta: false, orden: 1 },
  { pregunta_id: '5725ca4c-7337-4948-a80b-8a6c994819bf', opcion: '2-3 criterios', es_correcta: false, orden: 2 },
  { pregunta_id: '5725ca4c-7337-4948-a80b-8a6c994819bf', opcion: '4-5 criterios', es_correcta: false, orden: 3 },
  { pregunta_id: '5725ca4c-7337-4948-a80b-8a6c994819bf', opcion: '6 o más criterios', es_correcta: false, orden: 4 },
  { pregunta_id: '38db4162-748c-48f7-8e51-4a7e2169fcc6', opcion: 'Confrontar la negación del paciente', es_correcta: false, orden: 1 },
  { pregunta_id: '38db4162-748c-48f7-8e51-4a7e2169fcc6', opcion: 'Aumentar la motivación intrínseca para el cambio', es_correcta: false, orden: 2 },
  { pregunta_id: '38db4162-748c-48f7-8e51-4a7e2169fcc6', opcion: 'Proporcionar información sobre los riesgos', es_correcta: false, orden: 3 },
  { pregunta_id: '38db4162-748c-48f7-8e51-4a7e2169fcc6', opcion: 'Establecer metas de abstinencia', es_correcta: false, orden: 4 },
  { pregunta_id: '6a58aa8a-2c71-47c8-8284-cdf399f60de9', opcion: 'Reestructuración cognitiva', es_correcta: false, orden: 1 },
  { pregunta_id: '6a58aa8a-2c71-47c8-8284-cdf399f60de9', opcion: 'Prevención de recaídas', es_correcta: false, orden: 2 },
  { pregunta_id: '6a58aa8a-2c71-47c8-8284-cdf399f60de9', opcion: 'Entrenamiento en habilidades sociales', es_correcta: false, orden: 3 },
  { pregunta_id: '6a58aa8a-2c71-47c8-8284-cdf399f60de9', opcion: 'Todas las anteriores', es_correcta: false, orden: 4 },
  { pregunta_id: '9a1423b1-9fea-442d-9836-a31258d0dca1', opcion: 'Naloxona', es_correcta: false, orden: 1 },
  { pregunta_id: '9a1423b1-9fea-442d-9836-a31258d0dca1', opcion: 'Buprenorfina', es_correcta: false, orden: 2 },
  { pregunta_id: '9a1423b1-9fea-442d-9836-a31258d0dca1', opcion: 'Metadona', es_correcta: false, orden: 3 },
  { pregunta_id: '9a1423b1-9fea-442d-9836-a31258d0dca1', opcion: 'Tanto B como C', es_correcta: false, orden: 4 },
  { pregunta_id: 'ee2feca1-f48b-4a79-8206-e19465852367', opcion: 'Bloquea los receptores de dopamina', es_correcta: false, orden: 1 },
  { pregunta_id: 'ee2feca1-f48b-4a79-8206-e19465852367', opcion: 'Bloquea los receptores opioides', es_correcta: false, orden: 2 },
  { pregunta_id: 'ee2feca1-f48b-4a79-8206-e19465852367', opcion: 'Aumenta la serotonina', es_correcta: false, orden: 3 },
  { pregunta_id: 'ee2feca1-f48b-4a79-8206-e19465852367', opcion: 'Inhibe la acetilcolinesterasa', es_correcta: false, orden: 4 }
];

async function insertOptionsWithRetry() {
  let successCount = 0;
  let errorCount = 0;
  
  console.log('🚀 Iniciando inserción de opciones con reintentos...');
  
  for (const opcion of opcionesRespuesta) {
    try {
      console.log(`📤 Insertando: ${opcion.opcion} para pregunta ${opcion.pregunta_id}`);
      
      // Intentar insertar con reintentos
      let retries = 3;
      let inserted = false;
      
      while (retries > 0 && !inserted) {
        try {
          const { error } = await supabase
            .from('opciones_respuesta')
            .insert([opcion]);
          
          if (error) {
            if (error.code === '42501') {
              console.log(`   ⚠️ Error de permisos, reintentando... (${retries} intentos restantes)`);
              retries--;
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              throw error;
            }
          } else {
            console.log(`   ✅ Opción insertada`);
            successCount++;
            inserted = true;
          }
        } catch (err) {
          console.log(`   ⚠️ Error en intento: ${err.message}`);
          retries--;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!inserted) {
        console.log(`   ❌ No se pudo insertar después de varios intentos`);
        errorCount++;
      }
      
    } catch (error) {
      console.error(`   ❌ Error insertando opción:`, error);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Resumen de inserción:`);
  console.log(`   ✅ Opciones insertadas: ${successCount}`);
  console.log(`   ❌ Opciones con error: ${errorCount}`);
  
  if (errorCount > 0) {
    console.log(`\n💡 Sugerencia: Las opciones se pueden insertar manualmente en la consola de Supabase`);
    console.log(`   o usando el archivo SQL generado: opciones_respuesta_master.sql`);
  }
}

insertOptionsWithRetry();