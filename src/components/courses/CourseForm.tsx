import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

type CourseFormProps = {
  courseId?: string;
  teacherId: string;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
};

type Course = {
  id: string;
  title: string;
  description: string;
  technologies: string;
  image_url: string | null;
};

const CourseForm: React.FC<CourseFormProps> = ({ 
  courseId, 
  teacherId, 
  onSubmit, 
  isLoading 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (courseId) {
      setIsEditing(true);
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;

    try {
      // In a real implementation, we'd fetch from Supabase
      // const { data, error } = await supabase
      //   .from('courses')
      //   .select('*')
      //   .eq('id', courseId)
      //   .single();
      
      // if (error) throw error;
      
      // Mock data for the example
      const data: Course = {
        id: courseId,
        title: 'Master en Adicciones',
        description: 'Información actualizada sobre el Master en Adicciones.',
        technologies: 'psicologia,neurociencia,terapia',
        image_url: null
      };
      
      setTitle(data.title);
      setDescription(data.description);
      setTechnologies(data.technologies);
      
      if (data.image_url) {
        setPreviewUrl(data.image_url);
      }
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError('Failed to load course data');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      setPreviewUrl(null);
      return;
    }
    
    const file = e.target.files[0];
    setImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!courseId) {
      setError('Course ID is missing. Cannot upload materials.');
      return;
    }

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('technologies', technologies);
    formData.append('teacher_id', teacherId);
    
    if (courseId) {
      formData.append('id', courseId);
    }

    // If no image is selected, just update the course info
    if (!image) {
      onSubmit(formData);
      return;
    }

    try {
      console.log('Uploading file to Supabase Storage...');
      console.log('Course ID:', courseId);
      console.log('File name:', image.name);
      
      const fileExtension = image.name.split('.').pop();
      const fileName = `${Date.now()}_${image.name}`; // Ensure unique file name
      // Change filePath to upload directly to the bucket root, as per user's current setup
      const filePath = fileName; // Path format: timestamp_filename.ext
      
      console.log('File path for upload:', filePath);

      const { data, error: uploadError } = await supabase.storage
        .from('cursomasteradicciones') // Change bucket name
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: true, // Overwrite if file exists
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setError(`Error al subir el archivo: ${uploadError.message}`);
        return;
      }

      console.log('Upload successful:', data);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('cursomasteradicciones') // Corrected bucket name
        .getPublicUrl(filePath);
      
      console.log('Public URL:', publicUrl);
      
      // Add the file info to formData
      formData.append('material_url', publicUrl);
      formData.append('material_name', fileName);
      
      // Now call onSubmit with the complete formData
      onSubmit(formData);
      
      toast.success('Material subido exitosamente!');

    } catch (err: any) {
      console.error('Error during file upload process:', err);
      setError(`Error inesperado: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Update Course' : 'Add New Course'}
      </h2>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="course-material" className="block text-sm font-medium text-gray-700 mb-1">
            Material del Curso
          </label>
          <input
            type="file"
            id="course-material"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Course preview"
                className="w-32 h-32 object-cover border rounded-md"
              />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Course' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
