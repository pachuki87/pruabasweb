require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRealStructure() {
  try {
    console.log('🔍 Verificando estructura real de las tablas\n');
    
    // 1. Obtener un registro real de user_course_progress
    console.log('📋 Estructura real de user_course_progress:');
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(1);
    
    if (progressError) {
      console.log('❌ Error:', progressError.message);
    } else if (progressData.length > 0) {
      console.log('✅ Columnas encontradas:');
      Object.keys(progressData[0]).forEach(col => {
        console.log(`   - ${col}: ${typeof progressData[0][col]} (${progressData[0][col]})`);
      });
    }
    
    // 2. Obtener un registro real de user_course_summary
    console.log('\n📋 Estructura real de user_course_summary:');
    const { data: summaryData, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (summaryError) {
      console.log('❌ Error:', summaryError.message);
    } else if (summaryData.length > 0) {
      console.log('✅ Columnas encontradas:');
      Object.keys(summaryData[0]).forEach(col => {
        console.log(`   - ${col}: ${typeof summaryData[0][col]} (${summaryData[0][col]})`);
      });
    }
    
    // 3. Obtener estructura de user_test_results si existe
    console.log('\n📋 Verificando user_test_results:');
    const { data: testData, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Error o tabla no existe:', testError.message);
    } else {
      console.log('✅ user_test_results existe');
      console.log(`   Registros: ${testData.length}`);
      if (testData.length > 0) {
        console.log('   Columnas encontradas:');
        Object.keys(testData[0]).forEach(col => {
          console.log(`   - ${col}: ${typeof testData[0][col]}`);
        });
      }
    }
    
    // 4. Mostrar todos los registros de user_course_progress para entender la estructura
    console.log('\n📊 Todos los registros de user_course_progress:');
    const { data: allProgress } = await supabase
      .from('user_course_progress')
      .select('*');
    
    if (allProgress && allProgress.length > 0) {
      allProgress.forEach((record, index) => {
        console.log(`\n   Registro ${index + 1}:`);
        Object.entries(record).forEach(([key, value]) => {
          console.log(`     ${key}: ${value}`);
        });
      });
    }
    
    // 5. Generar código TypeScript correcto
    console.log('\n🔧 CÓDIGO TYPESCRIPT CORRECTO:');
    
    if (progressData.length > 0) {
      console.log('\n// Tipos para user_course_progress:');
      console.log('type UserCourseProgress = {');
      Object.keys(progressData[0]).forEach(col => {
        const value = progressData[0][col];
        let type = 'string';
        if (typeof value === 'number') type = 'number';
        if (typeof value === 'boolean') type = 'boolean';
        if (value === null) type = 'string | null';
        console.log(`  ${col}: ${type};`);
      });
      console.log('};');
    }
    
    if (summaryData.length > 0) {
      console.log('\n// Tipos para user_course_summary:');
      console.log('type UserCourseSummary = {');
      Object.keys(summaryData[0]).forEach(col => {
        const value = summaryData[0][col];
        let type = 'string';
        if (typeof value === 'number') type = 'number';
        if (typeof value === 'boolean') type = 'boolean';
        if (value === null) type = 'string | null';
        console.log(`  ${col}: ${type};`);
      });
      console.log('};');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkRealStructure();