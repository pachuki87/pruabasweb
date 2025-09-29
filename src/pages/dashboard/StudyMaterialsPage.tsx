import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MaterialForm from '../../components/materials/MaterialForm';

type Material = {
  id: string;
<<<<<<< HEAD
  titulo: string;
  detail: string;
  remarks: string | null;
  file_path: string;
=======
  title: string;
  detail: string;
  remarks: string | null;
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
};

type StudyMaterialsPageProps = {
  role: string;
};

const StudyMaterialsPage: React.FC<StudyMaterialsPageProps> = ({ role }) => {
<<<<<<< HEAD
  const { courseId } = useParams<{ courseId: string }>();
=======
  const { id: courseId } = useParams<{ id: string }>();
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchMaterials();
    }
  }, [courseId]);

  const fetchMaterials = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('materiales')
        .select('*')
        .eq('curso_id', courseId);

      if (error) throw error;

      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (formData: FormData) => {
    setIsUploading(true);
    try {
      const file = formData.get('file') as File;
<<<<<<< HEAD
      const titulo = formData.get('titulo') as string;
=======
      const title = formData.get('title') as string;
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
      const remarks = formData.get('remarks') as string;

      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${courseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('materiales')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Create material record in the database
      const { error: dbError } = await supabase
        .from('materiales')
        .insert([
          {
            curso_id: courseId,
<<<<<<< HEAD
            titulo: titulo,
=======
            title: title,
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
            detail: file.name,
            remarks: remarks,
            file_path: filePath
          }
        ]);

      if (dbError) throw dbError;

      // 3. Refresh materials list
      fetchMaterials();
      setShowForm(false);
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Error al subir el material. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (material: Material) => {
    try {
      const { data, error } = await supabase.storage
        .from('materiales')
        .createSignedUrl(material.file_path, 60);

      if (error) throw error;
      if (!data?.signedUrl) throw new Error('No se pudo generar la URL de descarga');

      // Abrir la URL en una nueva pestaña
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading material:', error);
      alert('Error al descargar el material. Por favor, inténtalo de nuevo.');
    }
  };

  if (!courseId) {
    return <div>Course ID is required</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Materiales de Estudio ({materials.length})
        </h1>
        {role === 'teacher' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancelar' : 'Añadir Material'}
          </button>
        )}
      </div>

      {showForm && (
        <MaterialForm
          courseId={courseId}
          onSubmit={handleUpload}
          isLoading={isUploading}
        />
      )}
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="bg-gray-100 h-12 rounded-t-lg mb-2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 h-16 mb-2 rounded-md"></div>
          ))}
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">
            No study materials have been added to this course yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
<<<<<<< HEAD
                      {material.titulo}
=======
                      {material.title}
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{material.detail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{material.remarks || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDownload(material)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md"
                    >
                      <Download className="w-4 h-4 inline-block mr-1" />
                      Download Materials
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default StudyMaterialsPage;
=======
export default StudyMaterialsPage;
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
