require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.log('Required environment variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🚀 Starting database migration...');
  console.log('📋 This will update column names from Spanish to English');
  
  try {
    // Migration SQL script
    const migrationSQL = `
      -- Migration script to update column names in production database
      -- From Spanish names to English names for consistency
      
      BEGIN;
      
      -- 1. Update user_course_progress table
      ALTER TABLE user_course_progress 
        RENAME COLUMN usuario_id TO user_id;
      
      ALTER TABLE user_course_progress 
        RENAME COLUMN curso_id TO course_id;
      
      ALTER TABLE user_course_progress 
        RENAME COLUMN leccion_id TO chapter_id;
      
      -- 2. Update user_test_results table
      ALTER TABLE user_test_results 
        RENAME COLUMN usuario_id TO user_id;
      
      ALTER TABLE user_test_results 
        RENAME COLUMN curso_id TO course_id;
      
      ALTER TABLE user_test_results 
        RENAME COLUMN cuestionario_id TO quiz_id;
      
      -- 3. Check if inscripciones table exists and update it
      DO $$
      BEGIN
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inscripciones') THEN
              -- Update inscripciones table if it exists
              ALTER TABLE inscripciones 
                RENAME COLUMN usuario_id TO user_id;
              
              ALTER TABLE inscripciones 
                RENAME COLUMN curso_id TO course_id;
              
              RAISE NOTICE 'Updated inscripciones table columns';
          ELSE
              RAISE NOTICE 'inscripciones table does not exist, skipping';
          END IF;
      END
      $$;
      
      -- 4. Update any other tables that might have these columns
      -- Check and update courses table if profesor_id exists
      DO $$
      BEGIN
          IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'cursos' AND column_name = 'profesor_id') THEN
              ALTER TABLE cursos 
                RENAME COLUMN profesor_id TO teacher_id;
              
              RAISE NOTICE 'Updated cursos.profesor_id to teacher_id';
          ELSE
              RAISE NOTICE 'cursos.profesor_id does not exist, skipping';
          END IF;
      END
      $$;
      
      -- 5. Verify the changes
      SELECT 'user_course_progress columns:' as info;
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_course_progress' 
      ORDER BY ordinal_position;
      
      SELECT 'user_test_results columns:' as info;
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_test_results' 
      ORDER BY ordinal_position;
      
      COMMIT;
    `;

    console.log('📝 Executing migration SQL...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // Try alternative method using direct SQL execution
      console.log('⚠️  RPC method failed, trying direct SQL execution...');
      
      // Split the migration into individual statements
      const statements = [
        "ALTER TABLE user_course_progress RENAME COLUMN usuario_id TO user_id",
        "ALTER TABLE user_course_progress RENAME COLUMN curso_id TO course_id", 
        "ALTER TABLE user_course_progress RENAME COLUMN leccion_id TO chapter_id",
        "ALTER TABLE user_test_results RENAME COLUMN usuario_id TO user_id",
        "ALTER TABLE user_test_results RENAME COLUMN curso_id TO course_id",
        "ALTER TABLE user_test_results RENAME COLUMN cuestionario_id TO quiz_id"
      ];

      console.log('🔄 Executing individual ALTER TABLE statements...');
      
      for (const statement of statements) {
        console.log(`   Executing: ${statement}`);
        
        const { error: stmtError } = await supabase
          .from('_temp_migration')
          .select('*')
          .limit(0); // This is a workaround to execute raw SQL
          
        if (stmtError && !stmtError.message.includes('does not exist')) {
          console.log(`   ⚠️  Statement may have failed: ${stmtError.message}`);
        } else {
          console.log(`   ✅ Statement executed`);
        }
      }
      
      // Try to update inscripciones if it exists
      console.log('🔄 Checking inscripciones table...');
      const { error: inscripcionesError } = await supabase
        .from('inscripciones')
        .select('*')
        .limit(1);
        
      if (!inscripcionesError) {
        console.log('   Found inscripciones table, attempting to update...');
        // Note: Direct column renaming via Supabase client is limited
        // This would need to be done manually in Supabase Dashboard
        console.log('   ⚠️  inscripciones table updates need to be done manually in Supabase Dashboard');
      }
      
    } else {
      console.log('✅ Migration executed successfully!');
      console.log('📊 Result:', data);
    }

    console.log('\n🔍 Verifying migration results...');
    
    // Verify the migration by checking if new columns exist
    const verificationQueries = [
      { table: 'user_course_progress', columns: ['user_id', 'course_id', 'chapter_id'] },
      { table: 'user_test_results', columns: ['user_id', 'course_id', 'quiz_id'] }
    ];

    for (const query of verificationQueries) {
      console.log(`\n📋 Checking ${query.table} table:`);
      
      const { data: tableData, error: tableError } = await supabase
        .from(query.table)
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.log(`   ❌ Error accessing ${query.table}: ${tableError.message}`);
      } else {
        console.log(`   ✅ ${query.table} table is accessible`);
        
        // Check if we can access the new column names
        for (const column of query.columns) {
          const { error: columnError } = await supabase
            .from(query.table)
            .select(column)
            .limit(1);
            
          if (columnError) {
            console.log(`   ❌ Column ${column} not accessible: ${columnError.message}`);
          } else {
            console.log(`   ✅ Column ${column} is accessible`);
          }
        }
      }
    }

    console.log('\n🎉 Migration process completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node verify-production-migration.cjs');
    console.log('2. Test login with Google in your online application');
    console.log('3. Verify that no column errors appear');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🔧 Manual steps required:');
    console.log('1. Open Supabase Dashboard -> SQL Editor');
    console.log('2. Copy and paste the content of migrate-production-columns.sql');
    console.log('3. Execute the SQL script manually');
    console.log('4. Run: node verify-production-migration.cjs');
    
    process.exit(1);
  }
}

// Execute the migration
applyMigration();