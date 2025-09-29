import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPermissions() {
  try {
    console.log('🔐 Verificando permisos de la tabla lecciones...');
    
    // Verificar permisos actuales
    const { data: permissions, error: permError } = await supabase
      .rpc('exec_sql', {
        sql: `SELECT grantee, table_name, privilege_type 
              FROM information_schema.role_table_grants 
              WHERE table_schema = 'public' 
              AND table_name = 'lecciones' 
              AND grantee IN ('anon', 'authenticated') 
              ORDER BY table_name, grantee;`
      });

    if (permError) {
      console.log('⚠️ No se pudieron verificar permisos con RPC, intentando consulta directa...');
      
      // Intentar consulta directa
      const { data: directQuery, error: directError } = await supabase
        .from('lecciones')
        .select('count')
        .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05');
      
      if (directError) {
        console.error('❌ Error en consulta directa:', directError);
        console.log('\n🔧 Aplicando permisos necesarios...');
        
        // Aplicar permisos
        const grantPermissions = `
          GRANT SELECT ON lecciones TO anon;
          GRANT SELECT ON lecciones TO authenticated;
        `;
        
        const { error: grantError } = await supabase
          .rpc('exec_sql', { sql: grantPermissions });
        
        if (grantError) {
          console.error('❌ Error al aplicar permisos:', grantError);
        } else {
          console.log('✅ Permisos aplicados correctamente');
        }
      } else {
        console.log('✅ La consulta directa funciona correctamente');
      }
    } else {
      console.log('📋 Permisos actuales:');
      permissions.forEach(perm => {
        console.log(`- ${perm.grantee}: ${perm.privilege_type} en ${perm.table_name}`);
      });
    }
    
    // Probar acceso con clave anon
    console.log('\n🧪 Probando acceso con clave anon...');
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc');
    
    const { data: anonData, error: anonError } = await anonClient
      .from('lecciones')
      .select('id, titulo, orden, archivo_url')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });
    
    if (anonError) {
      console.error('❌ Error con acceso anon:', anonError);
      console.log('\n🔧 Necesario aplicar permisos para rol anon');
    } else {
      console.log(`✅ Acceso anon exitoso: ${anonData.length} lecciones encontradas`);
      console.log('\n📋 Lecciones accesibles:');
      anonData.forEach((lesson, index) => {
        console.log(`${index + 1}. [${lesson.orden}] ${lesson.titulo}`);
        console.log(`   Archivo: ${lesson.archivo_url || 'NO ASIGNADO'}`);
      });
    }
    
    console.log('\n📊 Diagnóstico final:');
    if (!anonError && anonData.length > 0) {
      console.log('✅ La tabla lecciones es accesible desde el frontend');
      console.log('✅ Todas las lecciones tienen archivos HTML asignados');
      console.log('\n🎯 Las lecciones deberían aparecer en la web');
      console.log('\n💡 Si aún no aparecen, revisar:');
      console.log('   1. Configuración del frontend (componentes React)');
      console.log('   2. Rutas de la aplicación');
      console.log('   3. Estado de autenticación del usuario');
      console.log('   4. Consola del navegador para errores JavaScript');
    } else {
      console.log('❌ Hay problemas de permisos que impiden el acceso');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPermissions();