-- Migration script to update column names in production database
-- From Spanish names to English names for consistency

-- IMPORTANT: Run this script in Supabase SQL Editor
-- Make sure to backup your database before running this migration

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

-- 5. Update foreign key constraints if they exist
-- Note: This might need to be adjusted based on actual constraint names
-- You can check constraint names with:
-- SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'user_course_progress';

-- Update RLS policies that reference old column names
-- This is a template - actual policy names may vary
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies that might reference old column names
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname, cmd, qual, with_check
        FROM pg_policies 
        WHERE tablename IN ('user_course_progress', 'user_test_results', 'inscripciones')
    LOOP
        -- Log the policy for manual review
        RAISE NOTICE 'Policy found: %.% - %', policy_record.tablename, policy_record.policyname, policy_record.qual;
    END LOOP;
END
$$;

-- 6. Verify the changes
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

-- After running this migration:
-- 1. Update any RLS policies manually if they reference old column names
-- 2. Test the application thoroughly
-- 3. Update any remaining database functions or triggers