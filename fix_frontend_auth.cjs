require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function fixFrontendAuth() {
  console.log('🔧 SOLUCIONANDO PROBLEMAS DE AUTENTICACIÓN FRONTEND');
  console.log('=' .repeat(60));
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey || !serviceKey) {
    console.log('❌ Variables de entorno faltantes');
    return;
  }
  
  // Cliente con service key para operaciones administrativas
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  
  console.log('\n1. VERIFICANDO TABLA PROFILES:');
  
  // Verificar si existe la tabla profiles
  try {
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (profilesError && profilesError.message.includes('Could not find the table')) {
      console.log('❌ Tabla profiles no existe. Creándola...');
      
      // Crear tabla profiles
      const createProfilesSQL = `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT,
          full_name TEXT,
          avatar_url TEXT,
          role TEXT DEFAULT 'student',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilitar RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Política para que los usuarios puedan ver y editar su propio perfil
        CREATE POLICY "Users can view own profile" ON public.profiles
          FOR SELECT USING (auth.uid() = id);
          
        CREATE POLICY "Users can update own profile" ON public.profiles
          FOR UPDATE USING (auth.uid() = id);
          
        -- Política para insertar perfiles (solo el propio usuario)
        CREATE POLICY "Users can insert own profile" ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
          
        -- Función para crear perfil automáticamente
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, full_name)
          VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Trigger para crear perfil automáticamente
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `;
      
      const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
        sql: createProfilesSQL
      });
      
      if (createError) {
        console.log(`❌ Error creando tabla profiles: ${createError.message}`);
        console.log('\n📝 EJECUTA MANUALMENTE EN SUPABASE SQL EDITOR:');
        console.log(createProfilesSQL);
      } else {
        console.log('✅ Tabla profiles creada exitosamente');
      }
    } else {
      console.log('✅ Tabla profiles existe');
    }
  } catch (err) {
    console.log(`❌ Error verificando profiles: ${err.message}`);
  }
  
  console.log('\n2. VERIFICANDO USUARIO ESPECÍFICO:');
  const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
  
  try {
    // Verificar si el usuario existe en auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authError) {
      console.log(`❌ Usuario no encontrado en auth: ${authError.message}`);
    } else {
      console.log(`✅ Usuario encontrado en auth: ${authUser.user.email}`);
      
      // Verificar si tiene perfil
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.log(`⚠️ Perfil no encontrado, creándolo...`);
        
        // Crear perfil para el usuario
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
      } else {
        console.log(`✅ Perfil existe: ${profile.email}`);
      }
    }
  } catch (err) {
    console.log(`❌ Error verificando usuario: ${err.message}`);
  }
  
  console.log('\n3. PROBANDO AUTENTICACIÓN ANÓNIMA:');
  const supabaseAnon = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Probar obtener sesión actual
    const { data: { session }, error: sessionError } = await supabaseAnon.auth.getSession();
    
    if (sessionError) {
      console.log(`❌ Error obteniendo sesión: ${sessionError.message}`);
    } else if (session) {
      console.log(`✅ Sesión activa: ${session.user.email}`);
    } else {
      console.log('⚠️ No hay sesión activa (modo anónimo)');
    }
    
    // Probar acceso a datos públicos
    const { data: cursos, error: cursosError } = await supabaseAnon
      .from('cursos')
      .select('id, titulo')
      .limit(3);
      
    if (cursosError) {
      console.log(`❌ Error accediendo cursos: ${cursosError.message}`);
    } else {
      console.log(`✅ Acceso a cursos OK: ${cursos.length} encontrados`);
    }
  } catch (err) {
    console.log(`❌ Error en pruebas anónimas: ${err.message}`);
  }
  
  console.log('\n4. RECOMENDACIONES:');
  console.log('📋 Para solucionar los errores ERR_ABORTED:');
  console.log('   1. Asegúrate de que el usuario esté autenticado en el frontend');
  console.log('   2. Verifica que las políticas RLS permitan acceso a los datos');
  console.log('   3. Considera usar signInAnonymously() para usuarios no autenticados');
  console.log('   4. Revisa que las consultas no requieran autenticación innecesaria');
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 DIAGNÓSTICO DE AUTENTICACIÓN COMPLETADO');
}

fixFrontendAuth().catch(console.error);