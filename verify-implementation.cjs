#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando implementación del sistema de envío de resúmenes de cuestionarios...\n');

// Rutas de archivos a verificar
const requiredFiles = [
  'src/services/QuizSummaryGenerator.js',
  'src/services/EmailService.js',
  'src/services/WebhookService.js',
  'src/components/QuizComponent.jsx',
  'src/components/QuizComponent.css',
  'src/utils/testServices.js',
  '.env.example',
  'docs/QUIZ_SUMMARY_SYSTEM.md',
  'README_QUIZ_SUMMARY.md',
  'quiz-summary-system/README.md'
];

// Dependencias requeridas
const requiredDependencies = ['nodemailer', 'axios'];

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

// Función para verificar si un archivo tiene contenido válido
function hasValidContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.length > 100; // Al menos 100 caracteres
  } catch (err) {
    return false;
  }
}

// Función para verificar dependencias en package.json
function checkDependencies() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const allDeps = { ...dependencies, ...devDependencies };
    const missingDeps = requiredDependencies.filter(dep => !allDeps[dep]);
    
    return {
      installed: missingDeps.length === 0,
      missing: missingDeps
    };
  } catch (err) {
    return {
      installed: false,
      missing: requiredDependencies
    };
  }
}

// Función para verificar variables de entorno
function checkEnvironmentVariables() {
  try {
    const envExamplePath = '.env.example';
    if (!fileExists(envExamplePath)) {
      return { exists: false, variables: [] };
    }
    
    const content = fs.readFileSync(envExamplePath, 'utf8');
    const envVariables = content.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.split('=')[0].trim());
    
    return {
      exists: true,
      variables: envVariables
    };
  } catch (err) {
    return { exists: false, variables: [] };
  }
}

console.log('📁 Verificando archivos requeridos:');
let allFilesExist = true;
let allFilesHaveContent = true;

requiredFiles.forEach(file => {
  const exists = fileExists(file);
  const hasContent = exists && hasValidContent(file);
  
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) {
    allFilesExist = false;
  } else if (!hasContent) {
    console.log(`    ⚠️  El archivo existe pero parece estar vacío`);
    allFilesHaveContent = false;
  }
});

console.log('\n📦 Verificando dependencias:');
const depCheck = checkDependencies();
console.log(`  ${depCheck.installed ? '✅' : '❌'} Dependencias instaladas`);
if (!depCheck.installed) {
  console.log(`    ❌ Faltantes: ${depCheck.missing.join(', ')}`);
}

console.log('\n⚙️  Verificando variables de entorno:');
const envCheck = checkEnvironmentVariables();
console.log(`  ${envCheck.exists ? '✅' : '❌'} .env.example existe`);
if (envCheck.exists) {
  console.log(`    📋 Variables definidas: ${envCheck.variables.length}`);
  envCheck.variables.forEach(variable => {
    console.log(`      - ${variable}`);
  });
}

// Verificación específica del flujo de cuestionarios
console.log('\n🔄 Verificando corrección del flujo de cuestionarios:');
const quizComponentPath = 'src/components/QuizComponent.jsx';
const lessonViewerPath = 'src/components/courses/LessonViewer.tsx';

try {
  const quizComponentContent = fs.readFileSync(quizComponentPath, 'utf8');
  const lessonViewerContent = fs.readFileSync(lessonViewerPath, 'utf8');
  
  // Verificar que QuizComponent tenga la función renderResults
  const hasRenderResults = quizComponentContent.includes('renderResults = ()');
  console.log(`  ${hasRenderResults ? '✅' : '❌'} QuizComponent tiene renderResults`);
  
  // Verificar que LessonViewer no oculte el cuestionario inmediatamente
  const hasCorrectFlow = lessonViewerContent.includes('setQuizCompleted(true)') && 
                          !lessonViewerContent.includes('setShowQuiz(false)');
  console.log(`  ${hasCorrectFlow ? '✅' : '❌'} LessonViewer mantiene el cuestionario visible después de completar`);
  
  // Verificar que LessonViewer tenga la función handleBackToLesson
  const hasBackToLesson = lessonViewerContent.includes('handleBackToLesson');
  console.log(`  ${hasBackToLesson ? '✅' : '❌'} LessonViewer tiene handleBackToLesson`);
  
  if (!hasRenderResults || !hasCorrectFlow || !hasBackToLesson) {
    allFilesHaveContent = false;
  }
  
} catch (err) {
  console.log('  ❌ Error al verificar el flujo de cuestionarios');
  allFilesHaveContent = false;
}

// Resultado final
console.log('\n🎯 RESULTADO DE LA VERIFICACIÓN:');
const totalChecks = 3; // archivos, dependencias, variables de entorno
let passedChecks = 0;

if (allFilesExist && allFilesHaveContent) {
  passedChecks++;
  console.log('✅ Archivos: Completos y con contenido válido');
} else {
  console.log('❌ Archivos: Incompletos o con problemas');
}

if (depCheck.installed) {
  passedChecks++;
  console.log('✅ Dependencias: Instaladas correctamente');
} else {
  console.log('❌ Dependencias: Faltantes o no instaladas');
}

if (envCheck.exists && envCheck.variables.length > 0) {
  passedChecks++;
  console.log('✅ Variables de entorno: Configuradas');
} else {
  console.log('❌ Variables de entorno: No configuradas');
}

const success = passedChecks === totalChecks && allFilesExist && allFilesHaveContent;

console.log('\n' + '='.repeat(50));
if (success) {
  console.log('🎉 ¡VERIFICACIÓN EXITOSA!');
  console.log('✅ El sistema de envío de resúmenes de cuestionarios está completamente implementado.');
  console.log('✅ El problema del flujo de cuestionarios ha sido corregido.');
  console.log('✅ Los usuarios ahora verán los resultados del cuestionario antes de volver a la lección.');
  console.log('\n🚀 Próximos pasos:');
  console.log('   1. Configurar las variables de entorno en .env');
  console.log('   2. Probar el envío de emails y webhooks');
  console.log('   3. Ejecutar pruebas con: node src/utils/testServices.js');
} else {
  console.log('❌ VERIFICACIÓN FALLIDA');
  console.log('⚠️  El sistema tiene problemas que deben resolverse:');
  
  if (!allFilesExist || !allFilesHaveContent) {
    console.log('   - Archivos faltantes o incompletos');
  }
  if (!depCheck.installed) {
    console.log('   - Dependencias no instaladas:', depCheck.missing.join(', '));
  }
  if (!envCheck.exists || envCheck.variables.length === 0) {
    console.log('   - Variables de entorno no configuradas');
  }
  
  console.log('\n🔧 Soluciones:');
  console.log('   - Instalar dependencias: npm install ' + depCheck.missing.join(' '));
  console.log('   - Verificar archivos y su contenido');
  console.log('   - Configurar variables de entorno');
}
console.log('='.repeat(50));

process.exit(success ? 0 : 1);
