const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductionDB() {
  try {
    console.log('🔍 Checking production database structure...');
    
    // Try to query the user_course_progress table directly
    console.log('\n1. Testing user_course_progress table access...');
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(1);
    
    if (progressError) {
      console.error('❌ Error querying user_course_progress:', progressError);
    } else {
      console.log('✅ Successfully queried user_course_progress table');
      console.log('📊 Sample data:', progressData);
    }
    
    // Check what columns actually exist by trying different column names
    console.log('\n1.5. Testing user_course_progress column names...');
    const progressColumns = ['user_id', 'usuario_id', 'course_id', 'curso_id', 'chapter_id', 'leccion_id', 'progress_percentage', 'is_completed', 'created_at', 'updated_at'];
    
    for (const col of progressColumns) {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select(col)
        .limit(1);
      
      if (error) {
        console.log(`❌ user_course_progress.${col}: does not exist`);
      } else {
        console.log(`✅ user_course_progress.${col}: exists`);
      }
    }
    
    // Check user_test_results table
    console.log('\n1.6. Testing user_test_results table access...');
    const { data: testData, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error querying user_test_results:', testError);
    } else {
      console.log('✅ Successfully queried user_test_results table');
      console.log('📊 Sample data:', testData);
    }
    
    // Check user_test_results columns
    console.log('\n1.7. Testing user_test_results column names...');
    const testColumns = ['user_id', 'usuario_id', 'course_id', 'curso_id', 'quiz_id', 'cuestionario_id', 'score', 'created_at'];
    
    for (const col of testColumns) {
      const { data, error } = await supabase
        .from('user_test_results')
        .select(col)
        .limit(1);
      
      if (error) {
        console.log(`❌ user_test_results.${col}: does not exist`);
      } else {
        console.log(`✅ user_test_results.${col}: exists`);
      }
    }
    
    // Test a query that would use user_id column
    console.log('\n2. Testing user_id column access...');
    const { data: userIdTest, error: userIdError } = await supabase
      .from('user_course_progress')
      .select('user_id')
      .limit(1);
    
    if (userIdError) {
      console.error('❌ Error accessing user_id column:', userIdError);
    } else {
      console.log('✅ user_id column accessible');
    }
    
    // Test foreign key relationship with usuarios table
    console.log('\n3. Testing join with usuarios table...');
    const { data: joinTest, error: joinError } = await supabase
      .from('user_course_progress')
      .select(`
        *,
        usuarios!user_id(*)
      `)
      .limit(1);
    
    if (joinError) {
      console.error('❌ Error joining with usuarios:', joinError);
    } else {
      console.log('✅ Join with usuarios table works');
    }
    
    // Check if the tables exist
    console.log('\n4. Testing table existence...');
    const tables = ['usuarios', 'cursos', 'lecciones', 'user_course_progress'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table ${table}:`, error.message);
      } else {
        console.log(`✅ Table ${table}: accessible`);
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkProductionDB();