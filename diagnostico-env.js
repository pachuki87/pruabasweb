// Script para diagnosticar problemas con variables de entorno
console.log('=== DIAGNÓSTICO DE VARIABLES DE ENTORNO ===');

// 1. Verificar import.meta.env
console.log('\n1. Verificando import.meta.env:');
console.log('VITE_SUPABASE_URL disponible:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY disponible:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Valor VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Valor VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '***KEY***' : 'MISSING');

// 2. Verificar process.env (para compatibilidad)
console.log('\n2. Verificando process.env:');
if (typeof process !== 'undefined') {
    console.log('process.env.VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
    console.log('process.env.VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '***KEY***' : 'MISSING');
} else {
    console.log('process no está definido (entorno navegador)');
}

// 3. Listar todas las variables de entorno disponibles
console.log('\n3. Todas las variables de entorno disponibles:');
const envKeys = Object.keys(import.meta.env);
console.log('Total de variables:', envKeys.length);
envKeys.forEach(key => {
    if (key.startsWith('VITE_')) {
        console.log(`  ${key}: ${import.meta.env[key] ? 'SET' : 'MISSING'}`);
    }
});

// 4. Probar crear cliente Supabase
console.log('\n4. Probando crear cliente Supabase:');
try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('URL:', supabaseUrl);
    console.log('Key disponible:', !!supabaseAnonKey);
    
    if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Cliente Supabase creado exitosamente');
        
        // Probar conexión simple
        const { data, error } = await supabase.from('cuestionarios').select('count').single();
        if (error) {
            console.log('❌ Error de conexión:', error.message);
        } else {
            console.log('✅ Conexión a Supabase exitosa');
        }
    } else {
        console.log('❌ No se pueden crear variables requeridas');
    }
} catch (error) {
    console.log('❌ Error al crear cliente:', error.message);
}

console.log('\n=== FIN DEL DIAGNÓSTICO ===');
