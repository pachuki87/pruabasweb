import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseAnonKey = 'sbp_f829d744cd1b8043fe787e3d5f6609d5782f30fd'; // Token proporcionado por el usuario con permisos de escritura

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteOtherCourses() {
  const coursesToDelete = [
    'PHP Course Laravel',
    'PHP Course for Beginners',
    'Flask',
    'Python Course'
  ];

  console.log('Attempting to delete courses:', coursesToDelete);

  // Assuming the table name is 'courses' or 'course'. Let's try 'courses' first.
  const tableName = 'courses'; 

  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .in('title', coursesToDelete); // Assuming 'title' is the column name for the course title

    if (error) {
      console.error(`Error deleting courses from ${tableName}:`, error.message);
      // If 'courses' failed, try 'course'
      if (error.message.includes('table "courses" does not exist')) {
        console.log('Table "courses" not found, trying "course"...');
        const { data: data2, error: error2 } = await supabase
          .from('course')
          .delete()
          .in('title', coursesToDelete);

        if (error2) {
          console.error('Error deleting courses from "course":', error2.message);
        } else {
          console.log('Successfully deleted courses from "course":', data2);
        }
      }
    } else {
      console.log('Successfully deleted courses from "courses":', data);
    }
  } catch (error) {
    console.error('Unexpected error during deletion:', error);
  }
}

deleteOtherCourses();
