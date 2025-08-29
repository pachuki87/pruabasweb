import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixjlxvfhkqvtqpkqzjzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4amx4dmZoa3F2dHFwa3F6anptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTU2NzE5MSwiZXhwIjoyMDUxMTQzMTkxfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson4() {
  try {
    console.log('Checking lesson 4...');
    
    // Get lesson 4 data
    const { data: lessonData, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, tiene_cuestionario')
      .eq('orden', 4)
      .single();
    
    if (lessonError) {
      console.error('Error fetching lesson:', lessonError);
      return;
    }
    
    console.log('Lesson 4 data:', JSON.stringify(lessonData, null, 2));
    
    // Check if there's a questionnaire for this lesson
    const { data: quizData, error: quizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, leccion_id')
      .eq('leccion_id', lessonData.id);
    
    if (quizError) {
      console.error('Error fetching quiz:', quizError);
      return;
    }
    
    console.log('Quiz data for lesson 4:', JSON.stringify(quizData, null, 2));
    
    // Check if tiene_cuestionario needs to be updated
    if (quizData && quizData.length > 0 && !lessonData.tiene_cuestionario) {
      console.log('⚠️ Lesson 4 has a quiz but tiene_cuestionario is false. Updating...');
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ tiene_cuestionario: true })
        .eq('id', lessonData.id);
      
      if (updateError) {
        console.error('Error updating lesson:', updateError);
      } else {
        console.log('✅ Successfully updated lesson 4 tiene_cuestionario to true');
      }
    } else if (lessonData.tiene_cuestionario) {
      console.log('✅ Lesson 4 already has tiene_cuestionario set to true');
    } else {
      console.log('❌ No quiz found for lesson 4');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkLesson4();