const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backupProductionDB() {
  try {
    console.log('💾 Creating backup of production database...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, 'backups', `backup-${timestamp}`);
    
    // Create backup directory
    if (!fs.existsSync(path.join(__dirname, 'backups'))) {
      fs.mkdirSync(path.join(__dirname, 'backups'));
    }
    fs.mkdirSync(backupDir);
    
    console.log(`📁 Backup directory: ${backupDir}`);
    
    // Tables to backup
    const tablesToBackup = [
      'user_course_progress',
      'user_test_results',
      'usuarios',
      'cursos',
      'lecciones'
    ];
    
    // Check if inscripciones exists and add it
    const { data: inscripcionesCheck, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .limit(1);
    
    if (!inscripcionesError) {
      tablesToBackup.push('inscripciones');
      console.log('✅ Found inscripciones table, adding to backup');
    }
    
    // Backup each table
    for (const tableName of tablesToBackup) {
      console.log(`\n📋 Backing up table: ${tableName}`);
      
      try {
        // Get all data from table
        const { data, error } = await supabase
          .from(tableName)
          .select('*');
        
        if (error) {
          console.error(`❌ Error backing up ${tableName}:`, error.message);
          continue;
        }
        
        // Save to JSON file
        const backupFile = path.join(backupDir, `${tableName}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
        
        console.log(`✅ ${tableName}: ${data.length} records backed up`);
        
        // Also create a CSV backup for easy viewing
        if (data.length > 0) {
          const csvFile = path.join(backupDir, `${tableName}.csv`);
          const headers = Object.keys(data[0]);
          const csvContent = [
            headers.join(','),
            ...data.map(row => 
              headers.map(header => {
                const value = row[header];
                // Escape commas and quotes in CSV
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
              }).join(',')
            )
          ].join('\n');
          
          fs.writeFileSync(csvFile, csvContent);
          console.log(`📊 ${tableName}: CSV backup created`);
        }
        
      } catch (tableError) {
        console.error(`❌ Error processing table ${tableName}:`, tableError.message);
      }
    }
    
    // Create a backup info file
    const backupInfo = {
      timestamp: new Date().toISOString(),
      supabaseUrl: supabaseUrl,
      tablesBackedUp: tablesToBackup,
      purpose: 'Pre-migration backup before column name changes',
      migrationScript: 'migrate-production-columns.sql',
      notes: [
        'This backup was created before applying column name migrations',
        'Original column names: usuario_id, curso_id, leccion_id, profesor_id, cuestionario_id',
        'New column names: user_id, course_id, chapter_id, teacher_id, quiz_id',
        'Use this backup to restore if migration fails'
      ]
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'backup-info.json'),
      JSON.stringify(backupInfo, null, 2)
    );
    
    // Create a restore script
    const restoreScript = `-- Restore script for backup ${timestamp}
-- WARNING: This will overwrite current data!
-- Only use if migration failed and you need to restore

-- To restore, you would need to:
-- 1. Drop the modified tables
-- 2. Recreate them with original structure
-- 3. Import the JSON data

-- This is a manual process that requires careful execution
-- Contact your database administrator if restoration is needed

-- Backup location: ${backupDir}
-- Tables backed up: ${tablesToBackup.join(', ')}
`;
    
    fs.writeFileSync(
      path.join(backupDir, 'restore-instructions.sql'),
      restoreScript
    );
    
    console.log('\n🎉 Backup completed successfully!');
    console.log(`📁 Backup location: ${backupDir}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the backup files');
    console.log('2. Run the migration script: migrate-production-columns.sql');
    console.log('3. Verify with: node verify-production-migration.cjs');
    console.log('4. Test the application thoroughly');
    
    return backupDir;
    
  } catch (error) {
    console.error('💥 Backup failed:', error);
    throw error;
  }
}

if (require.main === module) {
  backupProductionDB();
}

module.exports = { backupProductionDB };