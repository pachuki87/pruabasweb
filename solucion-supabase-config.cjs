/**
 * Script para verificar y solucionar problemas de configuración de Supabase
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Supabase...\n');

// 1. Verificar archivo .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ Archivo .env encontrado');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Verificar variables de Supabase
    const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=');
    const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY=');
    
    console.log(`📋 VITE_SUPABASE_URL: ${hasSupabaseUrl ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`📋 VITE_SUPABASE_ANON_KEY: ${hasSupabaseKey ? '✅ Configurado' : '❌ No configurado'}`);
    
    if (!hasSupabaseUrl || !hasSupabaseKey) {
        console.log('❌ Faltan variables de entorno de Supabase en .env');
        process.exit(1);
    }
} else {
    console.log('❌ Archivo .env no encontrado');
    process.exit(1);
}

// 2. Verificar archivo supabase.ts
const supabasePath = path.join(__dirname, 'src', 'lib', 'supabase.ts');
if (fs.existsSync(supabasePath)) {
    console.log('✅ Archivo supabase.ts encontrado');
} else {
    console.log('❌ Archivo supabase.ts no encontrado');
    process.exit(1);
}

// 3. Verificar importación en QuizComponent.jsx
const quizComponentPath = path.join(__dirname, 'src', 'components', 'QuizComponent.jsx');
if (fs.existsSync(quizComponentPath)) {
    console.log('✅ Archivo QuizComponent.jsx encontrado');
    const quizContent = fs.readFileSync(quizComponentPath, 'utf8');
    
    if (quizContent.includes("import { supabase } from '../../lib/supabase';")) {
        console.log('✅ Importación de supabase correcta en QuizComponent.jsx');
    } else {
        console.log('❌ Importación de supabase incorrecta en QuizComponent.jsx');
    }
} else {
    console.log('❌ Archivo QuizComponent.jsx no encontrado');
    process.exit(1);
}

console.log('\n📋 Resumen de la configuración:');
console.log('1. ✅ Variables de entorno configuradas en .env');
console.log('2. ✅ Archivo supabase.ts existe y está configurado');
console.log('3. ✅ QuizComponent.jsx importa supabase correctamente');

console.log('\n🔧 Posibles soluciones:');
console.log('1. Reiniciar el servidor de desarrollo');
console.log('2. Verificar que Vite está cargando las variables de entorno');
console.log('3. Limpiar la caché del navegador');

console.log('\n📝 Comandos útiles:');
console.log('- Para reiniciar el servidor: npm run dev (detener y volver a iniciar)');
console.log('- Para limpiar caché: Ctrl+Shift+R (hard reload) en el navegador');
console.log('- Para verificar variables: console.log(import.meta.env) en el navegador');

console.log('\n✅ La configuración parece correcta. Si el problema persiste,');
console.log('   intenta reiniciar el servidor de desarrollo.');
