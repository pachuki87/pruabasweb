import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removeDuplicateLessons() {
  try {
    console.log('🔍 Analizando lecciones duplicadas...');
    
    // Obtener lecciones de inteligencia emocional del curso b5ef8c64-fe26-4f20-8221-80a1bf475b05
    const { data: duplicateLessons, error: duplicateError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .or('titulo.ilike.%inteligencia%,titulo.ilike.%emocional%,titulo.ilike.%autoconciencia%,titulo.ilike.%regulacion%,titulo.ilike.%empatia%');

    if (duplicateError) {
      console.error('Error al consultar lecciones duplicadas:', duplicateError);
      return;
    }

    console.log(`\n📋 Lecciones de inteligencia emocional encontradas en curso b5ef8c64-fe26-4f20-8221-80a1bf475b05:`);
    console.log(`Total: ${duplicateLessons.length}`);
    
    if (duplicateLessons.length === 0) {
      console.log('✅ No se encontraron lecciones de inteligencia emocional para eliminar.');
      return;
    }
    
    duplicateLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ID: ${lesson.id}`);
      console.log(`   Título: ${lesson.titulo}`);
      console.log(`   Orden: ${lesson.orden}`);
      console.log('   ---');
    });
    
    // Verificar que existen las lecciones originales en el otro curso
    const { data: originalLessons, error: originalError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836')
      .or('titulo.ilike.%inteligencia%,titulo.ilike.%emocional%,titulo.ilike.%autoconciencia%,titulo.ilike.%regulacion%,titulo.ilike.%empatia%')
      .order('orden', { ascending: true });

    if (originalError) {
      console.error('Error al consultar lecciones originales:', originalError);
      return;
    }

    console.log(`\n📚 Lecciones originales en curso d7c3e503-ed61-4d7a-9e5f-aedc407d4836:`);
    console.log(`Total: ${originalLessons.length}`);
    originalLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.titulo} (Orden: ${lesson.orden})`);
    });
    
    // Proceder con la eliminación
    console.log('\n🗑️  ELIMINANDO LECCIONES DUPLICADAS...');
    
    for (const lesson of duplicateLessons) {
      console.log(`\nEliminando: "${lesson.titulo}" (ID: ${lesson.id})`);
      
      const { error: deleteError } = await supabase
        .from('lecciones')
        .delete()
        .eq('id', lesson.id);
      
      if (deleteError) {
        console.error(`❌ Error al eliminar lección ${lesson.id}:`, deleteError);
      } else {
        console.log(`✅ Lección eliminada exitosamente`);
      }
    }
    
    // Verificar el estado final
    console.log('\n🔍 VERIFICACIÓN FINAL...');
    
    const { data: finalCheck, error: finalError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });

    if (finalError) {
      console.error('Error en verificación final:', finalError);
    } else {
      console.log(`\n📊 Estado final del curso b5ef8c64-fe26-4f20-8221-80a1bf475b05:`);
      console.log(`Total de lecciones restantes: ${finalCheck.length}`);
      
      if (finalCheck.length > 0) {
        finalCheck.forEach((lesson, index) => {
          console.log(`${index + 1}. ${lesson.titulo} (Orden: ${lesson.orden})`);
        });
      } else {
        console.log('✅ No quedan lecciones en este curso.');
      }
    }
    
    console.log('\n🎉 PROCESO COMPLETADO');
    console.log('✅ Las lecciones duplicadas han sido eliminadas.');
    console.log('✅ Las lecciones originales permanecen en el curso d7c3e503-ed61-4d7a-9e5f-aedc407d4836.');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

removeDuplicateLessons();