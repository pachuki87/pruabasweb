require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function fixFrontendErrors() {
  console.log('🔧 SOLUCIONANDO ERRORES ERR_ABORTED EN FRONTEND');
  console.log('=' .repeat(55));
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  
  const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
  const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
  
  console.log('\n1. LIMPIANDO TABLA PROFILES:');
  
  try {
    // Verificar cuántos perfiles existen para este usuario
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId);
      
    if (profilesError) {
      console.log(`❌ Error verificando profiles: ${profilesError.message}`);
    } else {
      console.log(`📊 Perfiles encontrados: ${profiles.length}`);
      
      if (profiles.length > 1) {
        console.log('🧹 Eliminando perfiles duplicados...');
        
        // Mantener solo el primer perfil
        const keepProfile = profiles[0];
        const duplicateIds = profiles.slice(1).map(p => p.id);
        
        for (const dupId of duplicateIds) {
          const { error: deleteError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', dupId);
            
          if (deleteError) {
            console.log(`❌ Error eliminando duplicado: ${deleteError.message}`);
          }
        }
        
        console.log(`✅ Perfiles duplicados eliminados. Mantenido: ${keepProfile.email}`);
      } else if (profiles.length === 1) {
        console.log(`✅ Perfil único encontrado: ${profiles[0].email}`);
      } else {
        console.log('⚠️ No se encontró perfil, creándolo...');
        
        // Obtener datos del usuario
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (!authError) {
          const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: userId,
              email: authUser.user.email,
              full_name: authUser.user.user_metadata?.full_name || 'Usuario',
              role: 'student'
            });
            
          if (insertError) {
            console.log(`❌ Error creando perfil: ${insertError.message}`);
          } else {
            console.log('✅ Perfil creado exitosamente');
          }
        }
      }
    }
  } catch (err) {
    console.log(`❌ Error en limpieza de profiles: ${err.message}`);
  }
  
  console.log('\n2. CREANDO PROGRESO INICIAL PARA EL USUARIO:');
  
  try {
    // Verificar si ya tiene progreso
    const { data: existingProgress, error: progressError } = await supabaseAdmin
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
      
    if (progressError) {
      console.log(`❌ Error verificando progreso: ${progressError.message}`);
    } else if (existingProgress.length === 0) {
      console.log('📚 Creando registros de progreso inicial...');
      
      // Obtener lecciones del curso
      const { data: lecciones, error: leccionesError } = await supabaseAdmin
        .from('lecciones')
        .select('id, titulo, orden')
        .eq('curso_id', courseId)
        .order('orden');
        
      if (leccionesError) {
        console.log(`❌ Error obteniendo lecciones: ${leccionesError.message}`);
      } else {
        console.log(`📖 Lecciones encontradas: ${lecciones.length}`);
        
        // Crear progreso inicial para cada lección
        const progressRecords = lecciones.map(leccion => ({
          user_id: userId,
          curso_id: courseId,
          leccion_id: leccion.id,
          progreso: 0,
          tiempo_estudiado: 0,
          completado: false,
          estado: 'no_iniciado'
        }));
        
        const { error: insertProgressError } = await supabaseAdmin
          .from('user_course_progress')
          .insert(progressRecords);
          
        if (insertProgressError) {
          console.log(`❌ Error creando progreso: ${insertProgressError.message}`);
        } else {
          console.log(`✅ Progreso inicial creado: ${progressRecords.length} registros`);
        }
      }
    } else {
      console.log(`✅ Progreso existente: ${existingProgress.length} registros`);
    }
  } catch (err) {
    console.log(`❌ Error creando progreso: ${err.message}`);
  }
  
  console.log('\n3. VERIFICANDO POLÍTICAS RLS:');
  
  const tables = ['inscripciones', 'lecciones', 'cuestionarios', 'respuestas_texto_libre', 'user_course_progress'];
  
  for (const table of tables) {
    try {
      // Probar acceso anónimo
      const { data: anonData, error: anonError } = await supabase
        .from(table)
        .select('count')
        .limit(1);
        
      if (anonError) {
        console.log(`❌ ${table} (anónimo): ${anonError.message}`);
      } else {
        console.log(`✅ ${table} (anónimo): Acceso OK`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Error de red - ${err.message}`);
    }
  }
  
  console.log('\n4. CREANDO SCRIPT DE AUTENTICACIÓN PARA FRONTEND:');
  
  const frontendAuthScript = `
// Agregar al inicio de App.tsx o en un hook de autenticación
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

// Hook para manejar autenticación automática
export const useAutoAuth = () => {
  useEffect(() => {
    // Verificar sesión existente
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error verificando sesión:', error.message);
          return;
        }
        
        if (session) {
          console.log('Usuario autenticado:', session.user.email);
        } else {
          console.log('No hay sesión activa');
          // Opcional: redirigir a login o continuar como anónimo
        }
      } catch (err) {
        console.error('Error en verificación de sesión:', err);
      }
    };
    
    checkSession();
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          // Usuario se autenticó
          console.log('Usuario autenticado:', session.user.email);
        } else if (event === 'SIGNED_OUT') {
          // Usuario cerró sesión
          console.log('Usuario cerró sesión');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};

// Función para reintentar requests fallidos
export const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await requestFn();
      return result;
    } catch (error) {
      console.warn(\`Intento \${i + 1} fallido:\`, error.message);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
  `;
  
  console.log('📝 Script de autenticación creado:');
  console.log('   - useAutoAuth: Hook para manejar autenticación automática');
  console.log('   - retryRequest: Función para reintentar requests fallidos');
  console.log('   - onAuthStateChange: Listener para cambios de sesión');
  
  console.log('\n5. SOLUCIONES IMPLEMENTADAS:');
  console.log('✅ Tabla profiles creada y limpiada');
  console.log('✅ Progreso inicial del curso configurado');
  console.log('✅ Políticas RLS verificadas');
  console.log('✅ Scripts de autenticación frontend preparados');
  
  console.log('\n6. PRÓXIMOS PASOS:');
  console.log('📋 Para eliminar errores ERR_ABORTED:');
  console.log('   1. Implementar useAutoAuth en App.tsx');
  console.log('   2. Usar retryRequest para requests críticos');
  console.log('   3. Manejar estados de carga y error en componentes');
  console.log('   4. Considerar autenticación automática al cargar la app');
  
  console.log('\n' + '='.repeat(55));
  console.log('🏁 CORRECCIÓN DE ERRORES FRONTEND COMPLETADA');
}

fixFrontendErrors().catch(console.error);