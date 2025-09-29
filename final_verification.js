import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalVerification() {
  try {
    console.log('🔍 VERIFICACIÓN FINAL - Estado de los cursos después de la limpieza');
    console.log('=' .repeat(70));
    
    // Verificar curso b5ef8c64-fe26-4f20-8221-80a1bf475b05
    console.log('\n📚 CURSO: MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL');
    console.log('ID: b5ef8c64-fe26-4f20-8221-80a1bf475b05');
    
    const { data: masterLessons, error: masterError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });

    if (masterError) {
      console.error('❌ Error al consultar lecciones del máster:', masterError);
    } else {
      console.log(`Total de lecciones: ${masterLessons.length}`);
      masterLessons.forEach((lesson, index) => {
        console.log(`${index + 1}. [${lesson.orden}] ${lesson.titulo}`);
      });
      
      // Verificar si hay lecciones de inteligencia emocional
      const emotionalInMaster = masterLessons.filter(lesson => {
        const title = lesson.titulo.toLowerCase();
        return title.includes('inteligencia') || title.includes('emocional');
      });
      
      if (emotionalInMaster.length > 0) {
        console.log(`\n⚠️  Aún hay ${emotionalInMaster.length} lecciones de inteligencia emocional:`);
        emotionalInMaster.forEach(lesson => {
          console.log(`   - ${lesson.titulo}`);
        });
      } else {
        console.log('\n✅ No hay lecciones de inteligencia emocional (correcto)');
      }
    }
    
    // Verificar curso d7c3e503-ed61-4d7a-9e5f-aedc407d4836
    console.log('\n📚 CURSO: Experto en Conductas Adictivas');
    console.log('ID: d7c3e503-ed61-4d7a-9e5f-aedc407d4836');
    
    const { data: expertLessons, error: expertError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836')
      .order('orden', { ascending: true });

    if (expertError) {
      console.error('❌ Error al consultar lecciones del experto:', expertError);
    } else {
      console.log(`Total de lecciones: ${expertLessons.length}`);
      
      // Mostrar solo las lecciones de inteligencia emocional
      const emotionalInExpert = expertLessons.filter(lesson => {
        const title = lesson.titulo.toLowerCase();
        return title.includes('inteligencia') || title.includes('emocional') || 
               title.includes('autoconciencia') || title.includes('regulacion') || 
               title.includes('empatia') || title.includes('evaluacion');
      });
      
      console.log(`\nLecciones de Inteligencia Emocional (${emotionalInExpert.length}):`);
      emotionalInExpert.forEach((lesson, index) => {
        console.log(`${index + 1}. [${lesson.orden}] ${lesson.titulo}`);
      });
    }
    
    // Resumen final
    console.log('\n' + '=' .repeat(70));
    console.log('📊 RESUMEN FINAL:');
    console.log(`✅ Curso MÁSTER: ${masterLessons ? masterLessons.length : 'Error'} lecciones`);
    console.log(`✅ Curso EXPERTO: ${expertLessons ? expertLessons.length : 'Error'} lecciones`);
    
    const totalEmotionalMaster = masterLessons ? masterLessons.filter(l => 
      l.titulo.toLowerCase().includes('inteligencia') || l.titulo.toLowerCase().includes('emocional')
    ).length : 0;
    
    const totalEmotionalExpert = expertLessons ? expertLessons.filter(l => {
      const title = l.titulo.toLowerCase();
      return title.includes('inteligencia') || title.includes('emocional') || 
             title.includes('autoconciencia') || title.includes('regulacion') || 
             title.includes('empatia') || title.includes('evaluacion');
    }).length : 0;
    
    console.log(`✅ Lecciones emocionales en MÁSTER: ${totalEmotionalMaster}`);
    console.log(`✅ Lecciones emocionales en EXPERTO: ${totalEmotionalExpert}`);
    
    if (totalEmotionalMaster === 0 && totalEmotionalExpert > 0) {
      console.log('\n🎉 ¡PROBLEMA RESUELTO!');
      console.log('✅ Se eliminaron exitosamente los duplicados del curso MÁSTER');
      console.log('✅ Las lecciones de inteligencia emocional permanecen solo en el curso EXPERTO');
    } else if (totalEmotionalMaster > 0) {
      console.log('\n⚠️  Aún hay lecciones emocionales en el curso MÁSTER que requieren atención');
    }

  } catch (error) {
    console.error('❌ Error en verificación final:', error);
  }
}

finalVerification();