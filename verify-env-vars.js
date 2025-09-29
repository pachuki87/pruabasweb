#!/usr/bin/env node

/**
 * Script de verificación de variables de entorno para Netlify
 * Verifica que todas las variables VITE_ requeridas estén configuradas
 */

console.log('🔍 Verificando variables de entorno...');
console.log('=' .repeat(50));

// Variables requeridas para el proyecto
const requiredVars = {
  'VITE_SUPABASE_URL': 'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc'
};

// Variables opcionales
const optionalVars = {
  'VITE_APP_URL': 'URL de la aplicación (ej: https://tu-sitio.netlify.app)',
  'NODE_ENV': 'production'
};

let allGood = true;
let missingVars = [];

console.log('📋 VARIABLES REQUERIDAS:');
console.log('-'.repeat(30));

// Verificar variables requeridas
for (const [varName, expectedValue] of Object.entries(requiredVars)) {
  const currentValue = process.env[varName];
  
  if (!currentValue) {
    console.log(`❌ ${varName}: FALTANTE`);
    console.log(`   Valor esperado: ${expectedValue.substring(0, 50)}...`);
    missingVars.push({
      name: varName,
      value: expectedValue,
      required: true
    });
    allGood = false;
  } else if (currentValue === expectedValue) {
    console.log(`✅ ${varName}: CORRECTO`);
  } else {
    console.log(`⚠️  ${varName}: VALOR INCORRECTO`);
    console.log(`   Actual: ${currentValue.substring(0, 50)}...`);
    console.log(`   Esperado: ${expectedValue.substring(0, 50)}...`);
    allGood = false;
  }
}

console.log('\n📋 VARIABLES OPCIONALES:');
console.log('-'.repeat(30));

// Verificar variables opcionales
for (const [varName, description] of Object.entries(optionalVars)) {
  const currentValue = process.env[varName];
  
  if (!currentValue) {
    console.log(`⚪ ${varName}: NO CONFIGURADA (${description})`);
  } else {
    console.log(`✅ ${varName}: ${currentValue}`);
  }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 ¡Todas las variables requeridas están configuradas correctamente!');
  process.exit(0);
} else {
  console.log('❌ FALTAN VARIABLES DE ENTORNO');
  console.log('\n📝 INSTRUCCIONES PARA NETLIFY:');
  console.log('-'.repeat(40));
  
  missingVars.forEach((variable, index) => {
    console.log(`\n${index + 1}. Agregar variable: ${variable.name}`);
    console.log(`   Key: ${variable.name}`);
    console.log(`   Value: ${variable.value}`);
    if (variable.required) {
      console.log(`   ⚠️  REQUERIDA - La aplicación no funcionará sin esta variable`);
    }
  });
  
  console.log('\n🔗 Pasos para configurar en Netlify:');
  console.log('1. Ve a tu dashboard de Netlify');
  console.log('2. Selecciona tu sitio');
  console.log('3. Ve a Site settings > Environment variables');
  console.log('4. Haz clic en "Add variable" para cada variable faltante');
  console.log('5. Redesplega el sitio después de agregar las variables');
  
  console.log('\n📖 Consulta NETLIFY_SETUP.md para instrucciones detalladas');
  
  process.exit(1);
}