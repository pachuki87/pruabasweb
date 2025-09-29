const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  try {
    console.log('🔍 Verifying production database migration...');
    
    // Test new column names in user_course_progress
    console.log('\n1. Testing user_course_progress new column names...');
    const expectedProgressColumns = ['user_id', 'course_id', 'chapter_id'];
    
    for (const col of expectedProgressColumns) {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select(col)
        .limit(1);
      
      if (error) {
        console.log(`❌ user_course_progress.${col}: ${error.message}`);
      } else {
        console.log(`✅ user_course_progress.${col}: exists and accessible`);
      }
    }
    
    // Test old column names should not exist
    console.log('\n2. Verifying old column names are gone...');
    const oldProgressColumns = ['usuario_id', 'curso_id', 'leccion_id'];
    
    for (const col of oldProgressColumns) {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select(col)
        .limit(1);
      
      if (error && error.code === '42703') {
        console.log(`✅ user_course_progress.${col}: correctly removed`);
      } else {
        console.log(`❌ user_course_progress.${col}: still exists (should be removed)`);
      }
    }
    
    // Test new column names in user_test_results
    console.log('\n3. Testing user_test_results new column names...');
    const expectedTestColumns = ['user_id', 'course_id', 'quiz_id'];
    
    for (const col of expectedTestColumns) {
      const { data, error } = await supabase
        .from('user_test_results')
        .select(col)
        .limit(1);
      
      if (error) {
        console.log(`❌ user_test_results.${col}: ${error.message}`);
      } else {
        console.log(`✅ user_test_results.${col}: exists and accessible`);
      }
    }
    
    // Test old column names should not exist in user_test_results
    console.log('\n4. Verifying old test result column names are gone...');
    const oldTestColumns = ['usuario_id', 'curso_id', 'cuestionario_id'];
    
    for (const col of oldTestColumns) {
      const { data, error } = await supabase
        .from('user_test_results')
        .select(col)
        .limit(1);
      
      if (error && error.code === '42703') {
        console.log(`✅ user_test_results.${col}: correctly removed`);
      } else {
        console.log(`❌ user_test_results.${col}: still exists (should be removed)`);
      }
    }
    
    // Test foreign key relationships
    console.log('\n5. Testing foreign key relationships...');
    
    // Test join with usuarios table using new column name
    const { data: userJoin, error: userJoinError } = await supabase
      .from('user_course_progress')
      .select(`
        *,
        usuarios!user_id(*)
      `)
      .limit(1);
    
    if (userJoinError) {
      console.log(`❌ Join user_course_progress -> usuarios: ${userJoinError.message}`);
    } else {
      console.log('✅ Join user_course_progress -> usuarios: working');
    }
    
    // Test join with cursos table using new column name
    const { data: courseJoin, error: courseJoinError } = await supabase
      .from('user_course_progress')
      .select(`
        *,
        cursos!course_id(*)
      `)
      .limit(1);
    
    if (courseJoinError) {
      console.log(`❌ Join user_course_progress -> cursos: ${courseJoinError.message}`);
    } else {
      console.log('✅ Join user_course_progress -> cursos: working');
    }
    
    // Test a complete query that the app would make
    console.log('\n6. Testing complete application query...');
    
    const { data: appQuery, error: appQueryError } = await supabase
      .from('user_course_progress')
      .select(`
        user_id,
        course_id,
        chapter_id,
        progress_percentage,
        is_completed,
        created_at,
        updated_at
      `)
      .limit(1);
    
    if (appQueryError) {
      console.log(`❌ Application query test: ${appQueryError.message}`);
    } else {
      console.log('✅ Application query test: successful');
      console.log('📊 Sample data structure:', Object.keys(appQuery[0] || {}));
    }
    
    // Check inscripciones table if it exists
    console.log('\n7. Testing inscripciones table (if exists)...');
    const { data: inscripcionesTest, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('user_id, course_id')
      .limit(1);
    
    if (inscripcionesError) {
      if (inscripcionesError.code === '42P01') {
        console.log('ℹ️  inscripciones table does not exist');
      } else {
        console.log(`❌ inscripciones table error: ${inscripcionesError.message}`);
      }
    } else {
      console.log('✅ inscripciones table: new column names working');
    }
    
    console.log('\n🎉 Migration verification completed!');
    console.log('\n📋 Summary:');
    console.log('- Check all ✅ items above');
    console.log('- If any ❌ items exist, the migration may need adjustments');
    console.log('- Test the application thoroughly after migration');
    
  } catch (error) {
    console.error('💥 Unexpected error during verification:', error);
  }
}

verifyMigration();