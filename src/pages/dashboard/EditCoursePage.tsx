import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CourseForm from '../../components/courses/CourseForm';
import { supabase } from '../../lib/supabase';

const EditCoursePage: React.FC = () => {
<<<<<<< HEAD
  const { courseId } = useParams<{ courseId: string }>();
=======
  const { id } = useParams<{ id: string }>();
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
<<<<<<< HEAD
    if (!courseId) return;
=======
    if (!id) return;
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
    
    setIsSubmitting(true);
    
    try {
      // The file upload logic is now handled within CourseForm's handleSubmit.
      // This handleSubmit in EditCoursePage is primarily for other course data (title, description, etc.)
      // If CourseForm's onSubmit is called, it means the file upload (if any) has been initiated.
      // We can add logic here to update other course fields in the database if needed.
      
      // For now, we'll just show a success toast and navigate back to the course details page
      // after the CourseForm's internal submission (including file upload) is complete.
      
      // Example of updating other course fields (uncomment and implement if needed):
      // const { error: updateError } = await supabase
      //   .from('cursos')
      //   .update({
      //     titulo: formData.get('title'),
      //     descripcion: formData.get('description'),
      //     // ... other fields
      //   })
      //   .eq('id', id);
      
      // if (updateError) throw updateError;

      setIsSubmitting(false);
      toast.success('Curso actualizado exitosamente!');
<<<<<<< HEAD
      navigate(`/teacher/courses/${courseId}`); // Navigate back to the course details page
=======
      navigate(`/teacher/courses/${id}`); // Navigate back to the course details page
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
    } catch (error: any) {
      console.error('Error al actualizar el curso:', error);
      setIsSubmitting(false);
      toast.error(`Fallo al actualizar el curso: ${error.message}`);
    }
  };

<<<<<<< HEAD
  if (!courseId) {
=======
  if (!id) {
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
    return <div>Course ID is required</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      
      <CourseForm
<<<<<<< HEAD
        courseId={courseId}
=======
        courseId={id}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
        teacherId="teacher-id" // In a real app, this would be the logged-in teacher's ID
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditCoursePage;
