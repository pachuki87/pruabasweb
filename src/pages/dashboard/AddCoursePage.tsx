import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CourseForm from '../../components/courses/CourseForm';
import { supabase } from '../../lib/supabase';

const AddCoursePage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Extraer los datos del formulario
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const technologies = formData.get('technologies') as string;
      const imageFile = formData.get('image') as File | null; // Renamed to avoid conflict with 'image' in courseData
      
      // Obtener el ID del profesor autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not authenticated. Please log in.');
      }
      const teacherId = user.id;
      
      // Generar un UUID para el curso
      const courseId = crypto.randomUUID();

      let imageUrl: string | null = null;
      if (imageFile && imageFile.size > 0) {
        const filePath = `${user.id}/${courseId}/${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course_images') // Assuming a bucket named 'course_images'
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error(`Error uploading image: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
        
        // Get public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('course_images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Preparar los datos para insertar en Supabase
      const courseData = {
        id: courseId,
        titulo: title,
        descripcion: description,
<<<<<<< HEAD
        teacher_id: teacherId,
=======
        profesor_id: teacherId,
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
        imagen_url: imageUrl, // Add image URL to course data
      };
      
      // Intentar insertar en la tabla 'cursos'
      const { error } = await supabase
        .from('cursos')
        .insert(courseData);
      
      if (error) {
        console.error('Error inserting course into Supabase:', error);
        toast.error(`Failed to create course: ${error.message}`);
        setIsSubmitting(false);
        return; // Stop execution on error
      }
      
      toast.success('Course created successfully!');
      navigate('/teacher/courses');
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error(`Failed to create course: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
      
      <CourseForm
        teacherId="" // No longer hardcoded, will be fetched inside handleSubmit
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AddCoursePage;
