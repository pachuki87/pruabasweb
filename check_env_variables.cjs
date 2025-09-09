require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de variables de entorno...');
console.log('=' .repeat(60));

// Verificar si existe el archivo .env
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

console.log(`📁 Archivo .env: ${envExists ? '✅ Existe' : '❌ No encontrado'}`);

if (!envExists) {
  console.log('\n⚠️  PROBLEMA DETECTADO:');
  console.log('   El archivo .env no existe en el directorio del proyecto.');
  console.log('\n📋 SOLUCIÓN:');
  console.log('   1. Copia el archivo .env.example a .env');
  console.log('   2. Configura las variables de Supabase en el archivo .env');
  console.log('\n💡 Comando sugerido:');
  console.log('   cp .env.example .env');
  process.exit(1);
}

// Verificar variables críticas
const requiredVars = {
  'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL,
  'VITE_SUPABASE_ANON_KEY': process.env.VITE_SUPABASE_ANON_KEY
};

const optionalVars = {
  'VITE_SUPABASE_SERVICE_KEY': process.env.VITE_SUPABASE_SERVICE_KEY
};

console.log('\n🔑 Variables de entorno críticas:');
let allRequiredPresent = true;

for (const [varName, value] of Object.entries(requiredVars)) {
  const isPresent = value && value.trim() !== '';
  console.log(`   ${varName}: ${isPresent ? '✅ Configurada' : '❌ Faltante'}`);
  if (!isPresent) allRequiredPresent = false;
}

console.log('\n🔧 Variables opcionales:');
for (const [varName, value] of Object.entries(optionalVars)) {
  const isPresent = value && value.trim() !== '';
  console.log(`   ${varName}: ${isPresent ? '✅ Configurada' : '⚪ No configurada'}`);
}

if (!allRequiredPresent) {
  console.log('\n⚠️  PROBLEMA DETECTADO:');
  console.log('   Faltan variables de entorno críticas.');
  console.log('\n📋 SOLUCIÓN:');
  console.log('   Configura las variables faltantes en el archivo .env');
  process.exit(1);
}

// Probar conexión a Supabase
console.log('\n🌐 Probando conexión a Supabase...');

try {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  // Probar una consulta simple
  supabase.from('usuarios').select('count', { count: 'exact', head: true })
    .then(({ data, error, count }) => {
      if (error) {
        console.log('❌ Error de conexión:', error.message);
        console.log('\n🔍 Posibles causas:');
        console.log('   - URL de Supabase incorrecta');
        console.log('   - Clave ANON incorrecta');
        console.log('   - Problemas de red');
        console.log('   - Proyecto de Supabase pausado o eliminado');
      } else {
        console.log('✅ Conexión exitosa a Supabase');
        console.log(`📊 Tabla usuarios encontrada (${count || 0} registros)`);
        
        // Verificar otras tablas críticas
        const tablesToCheck = ['cursos', 'cuestionarios', 'inscripciones'];
        
        Promise.all(
          tablesToCheck.map(table => 
            supabase.from(table).select('count', { count: 'exact', head: true })
          )
        ).then(results => {
          console.log('\n📋 Estado de tablas críticas:');
          results.forEach((result, index) => {
            const tableName = tablesToCheck[index];
            if (result.error) {
              console.log(`   ${tableName}: ❌ Error - ${result.error.message}`);
            } else {
              console.log(`   ${tableName}: ✅ OK (${result.count || 0} registros)`);
            }
          });
          
          console.log('\n🎉 RESUMEN:');
          console.log('   ✅ Variables de entorno configuradas');
          console.log('   ✅ Conexión a Supabase exitosa');
          console.log('   ✅ Tablas principales accesibles');
          console.log('\n💡 Si sigues teniendo errores, revisa:');
          console.log('   - Permisos RLS en las tablas');
          console.log('   - Políticas de seguridad');
          console.log('   - Logs del navegador para errores específicos');
        });
      }
    })
    .catch(err => {
      console.log('❌ Error inesperado:', err.message);
    });

} catch (err) {
  console.log('❌ Error al crear cliente de Supabase:', err.message);
  console.log('\n🔍 Verifica que las variables de entorno tengan el formato correcto.');
}