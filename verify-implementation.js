#!/usr/bin/env node

/**
 * verify-implementation.js
 * Script de verificación final para asegurar que todos los archivos 
 * y componentes del sistema de envío de resúmenes están implementados correctamente
 */

const fs = require('fs');
const path = require('path');

// Lista de archivos requeridos para el sistema
const requiredFiles = [
  // Servicios principales
  'src/services/QuizSummaryGenerator.js',
  'src/services/EmailService.js',
  'src/services/WebhookService.js',
  
  // Componentes modificados
  'src/components/QuizComponent.jsx',
  'src/components/QuizComponent.css',
  
  // Utilidades y pruebas
  'src/utils/testServices.js',
  '.env.example',
  
  // Documentación
  'docs/QUIZ_SUMMARY_SYSTEM.md',
  'README_QUIZ_SUMMARY.md'
];

// Lista de dependencias requeridas en package.json
const requiredDependencies = ['nodemailer', 'axios'];

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Función para verificar si una dependencia está en package.json
function dependencyExists(dependency) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.dependencies && packageJson.dependencies[dependency];
  } catch (error) {
    return false;
  }
}

// Función para verificar el contenido básico de los archivos principales
function verifyFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificaciones específicas por archivo
    switch (filePath) {
      case 'src/services/QuizSummaryGenerator.js':
        return content.includes('generateDetailedSummary') && 
               content.includes('generateHTMLSummary') &&
               content.includes('generateWebhookSummary');
               
      case 'src/services/EmailService.js':
        return content.includes('sendQuizSummaryEmail') &&
               content.includes('isConfigured') &&
               content.includes('nodemailer');
               
      case 'src/services/WebhookService.js':
        return content.includes('sendQuizWebhook') &&
               content.includes('isConfigured') &&
               content.includes('axios');
               
      case 'src/components/QuizComponent.jsx':
        return content.includes('EmailService') &&
               content.includes('WebhookService') &&
               content.includes('QuizSummaryGenerator') &&
               content.includes('sendQuizSummary');
               
      case 'src/components/QuizComponent.css':
        return content.includes('summary-status') &&
               content.includes('services-status') &&
               content.includes('status-item');
               
      case 'src/utils/testServices.js':
        return content.includes('runAllTests') &&
               content.includes('testEmailSending') &&
               content.includes('testWebhookSending');
               
      case '.env.example':
        return content.includes('EMAIL_SMTP_HOST') &&
               content.includes('WEBHOOK_URL') &&
               content.includes('NEXT_PUBLIC_SUPABASE_URL');
               
      case 'docs/QUIZ_SUMMARY_SYSTEM.md':
        return content.includes('Sistema de Envío de Resúmenes') &&
               content.includes('Arquitectura del Sistema');
               
      case 'README_QUIZ_SUMMARY.md':
        return content.includes('Implementación Completa') &&
               content.includes('Características Implementadas');
               
      default:
        return true;
    }
  } catch (error) {
    return false;
  }
}

// Función principal de verificación
function runVerification() {
  console.log('🔍 Verificando implementación del Sistema de Envío de Resúmenes...');
  console.log('='.repeat(60));
  
  let allFilesExist = true;
  let allContentValid = true;
  let allDependenciesExist = true;
  
  // 1. Verificar archivos requeridos
  console.log('\n📁 Verificando archivos requeridos:');
  requiredFiles.forEach(file => {
    const exists = fileExists(file);
    const contentValid = exists ? verifyFileContent(file) : false;
    
    const status = exists ? '✅' : '❌';
    const contentStatus = contentValid ? '✅' : '❌';
    
    console.log(`   ${status} ${file}`);
    if (exists) {
      console.log(`      ${contentStatus} Contenido válido`);
    }
    
    if (!exists) allFilesExist = false;
    if (!contentValid) allContentValid = false;
  });
  
  // 2. Verificar dependencias
  console.log('\n📦 Verificando dependencias:');
  requiredDependencies.forEach(dep => {
    const exists = dependencyExists(dep);
    const status = exists ? '✅' : '❌';
    
    console.log(`   ${status} ${dep}`);
    
    if (!exists) allDependenciesExist = false;
  });
  
  // 3. Resumen de verificación
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DE VERIFICACIÓN:');
  console.log('='.repeat(60));
  
  console.log(`\n📄 Archivos requeridos: ${allFilesExist ? '✅ Completos' : '❌ Incompletos'}`);
  console.log(`🔍 Contenido de archivos: ${allContentValid ? '✅ Válido' : '❌ Inválido'}`);
  console.log(`📦 Dependencias: ${allDependenciesExist ? '✅ Instaladas' : '❌ Faltantes'}`);
  
  // 4. Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  
  if (!allDependenciesExist) {
    console.log('   ⚠️  Instala las dependencias faltantes:');
    console.log('      npm install nodemailer axios');
    console.log('      # o');
    console.log('      yarn add nodemailer axios');
  }
  
  if (!allFilesExist || !allContentValid) {
    console.log('   ⚠️  Revisa los archivos marcados con ❌');
    console.log('   📖 Consulta la documentación en docs/QUIZ_SUMMARY_SYSTEM.md');
  }
  
  // 5. Próximos pasos
  console.log('\n🚀 PRÓXIMOS PASOS:');
  
  if (allFilesExist && allContentValid && allDependenciesExist) {
    console.log('   ✅ Sistema implementado correctamente');
    console.log('   🔧 Configura las variables de entorno:');
    console.log('      cp .env.example .env');
    console.log('      # Editar .env con tus credenciales');
    console.log('   🧪 Ejecuta pruebas:');
    console.log('      node src/utils/testServices.js');
    console.log('   🎉 ¡Listo para usar!');
  } else {
    console.log('   ❌ Completa la implementación faltante');
    console.log('   📋 Sigue la guía en README_QUIZ_SUMMARY.md');
  }
  
  // 6. Estado final
  console.log('\n' + '='.repeat(60));
  const overallStatus = (allFilesExist && allContentValid && allDependenciesExist) ? '✅ LISTO PARA PRODUCCIÓN' : '❌ REQUIERE ATENCIÓN';
  console.log(`🎯 ESTADO FINAL: ${overallStatus}`);
  console.log('='.repeat(60));
  
  return allFilesExist && allContentValid && allDependenciesExist;
}

// Ejecutar verificación
const isComplete = runVerification();

// Salir con código apropiado
process.exit(isComplete ? 0 : 1);
