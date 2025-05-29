import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CourseForm from '../../components/courses/CourseForm';
import { supabase } from '../../lib/supabase';

const EditCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    
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
      navigate(`/teacher/courses/${id}`); // Navigate back to the course details page
    } catch (error: any) {
      console.error('Error al actualizar el curso:', error);
      setIsSubmitting(false);
      toast.error(`Fallo al actualizar el curso: ${error.message}`);
    }
  };

  if (!id) {
    return <div>Course ID is required</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      
      <CourseForm
        courseId={id}
        teacherId="teacher-id" // In a real app, this would be the logged-in teacher's ID
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditCoursePage;
