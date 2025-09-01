import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkPabloInscriptions() {
  try {
    console.log('=== VERIFICANDO INSCRIPCIONES DE PABLO ===\n');
    
    // Buscar usuario Pablo
    const { data: pablo, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre, email')
      .ilike('nombre', '%pablo%')
      .single();
    
    if (userError) {
      console.log('Error buscando usuario Pablo:', userError);
      return;
    }
    
    console.log('✅ Usuario encontrado:');
    console.log('   ID:', pablo.id);
    console.log('   Nombre:', pablo.nombre);
    console.log('   Email:', pablo.email);
    
    // Consultar inscripciones con información de cursos
    const { data: inscripciones, error: inscError } = await supabase
      .from('inscripciones')
      .select(`
        curso_id,
        cursos (
          titulo,
          descripcion
        )
      `)
      .eq('usuario_id', pablo.id);
    
    if (inscError) {
      console.log('Error consultando inscripciones:', inscError);
      return;
    }
    
    console.log('\n📚 Cursos inscritos:');
    console.log('   Total:', inscripciones.length);
    
    if (inscripciones.length === 0) {
      console.log('   ❌ Pablo no tiene cursos asignados');
    } else {
      inscripciones.forEach((insc, index) => {
        console.log(`   ${index + 1}. ${insc.cursos.titulo}`);
        console.log(`      ID del curso: ${insc.curso_id}`);
        console.log(`      Descripción: ${insc.cursos.descripcion?.substring(0, 100)}...`);
        console.log('');
      });
    }
    
    // Verificar si tiene exactamente 2 cursos
    if (inscripciones.length === 2) {
      console.log('✅ CONFIRMADO: Pablo tiene exactamente 2 cursos asignados');
    } else {
      console.log(`⚠️ Pablo tiene ${inscripciones.length} cursos (se esperaban 2)`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPabloInscriptions();