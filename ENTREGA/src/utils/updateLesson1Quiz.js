import { supabase } from '../lib/supabase';

// Función para actualizar la lección 1 del Máster en Adicciones
export const updateLesson1Quiz = async () => {
  try {
    console.log('🔄 Actualizando lección 1 para habilitar cuestionario...');
    
    const { data, error } = await supabase
      .from('lecciones')
      .update({ 
        tiene_cuestionario: true,
        actualizado_en: new Date().toISOString()
      })
      .eq('id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .select();

    if (error) {
      console.error('❌ Error al actualizar:', error);
      return { success: false, error };
    }

    console.log('✅ Lección actualizada exitosamente:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    return { success: false, error: err };
  }
};

// Función para verificar el estado actual
export const checkLesson1Status = async () => {
  try {
    const { data, error } = await supabase
      .from('lecciones')
      .select('id, titulo, tiene_cuestionario, actualizado_en')
      .eq('id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44');

    if (error) {
      console.error('❌ Error al consultar:', error);
      return { success: false, error };
    }

    console.log('📊 Estado actual de la lección 1:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    return { success: false, error: err };
  }
};

// Ejecutar automáticamente si se llama directamente
if (typeof window !== 'undefined') {
  window.updateLesson1Quiz = updateLesson1Quiz;
  window.checkLesson1Status = checkLesson1Status;
}