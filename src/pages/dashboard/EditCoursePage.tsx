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
      // In a real implementation, we would:
      // 1. Upload the new image to Supabase Storage if provided
      // 2. Update the course in the courses table
      
      // Mock the process for now
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Course updated successfully!');
        navigate('/teacher/courses');
      }, 1000);
    } catch (error) {
      console.error('Error updating course:', error);
      setIsSubmitting(false);
      toast.error('Failed to update course');
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