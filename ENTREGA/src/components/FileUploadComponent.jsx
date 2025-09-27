import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Image } from 'lucide-react';

const FileUploadComponent = ({ onFileUpload, acceptedFileTypes = 'image/*,.pdf', maxFiles = 1, placeholder = "Arrastra tu archivo aquí o haz clic para seleccionar" }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Simular upload o procesar archivos
      for (const file of acceptedFiles) {
        // Aquí podrías subir a un servicio como Supabase Storage, S3, etc.
        // Por ahora, guardamos el archivo localmente
        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        };

        setUploadedFiles(prev => [...prev, fileData]);
        onFileUpload && onFileUpload(fileData);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.includes(',') ?
      acceptedFileTypes.split(',').reduce((acc, type) => {
        if (type.trim().startsWith('.')) {
          // Extensiones de archivo
          const mimeTypes = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          };
          const mime = mimeTypes[type.trim()];
          if (mime) acc[mime] = [type.trim()];
        } else if (type.trim().includes('/')) {
          // MIME types
          acc[type.trim()] = [];
        }
        return acc;
      }, {}) :
      { 'image/*': [], 'application/pdf': [] },
    maxFiles: maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      // Revocar URL del objeto para liberar memoria
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return newFiles;
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <File className="w-8 h-8 text-red-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const dropzoneClass = `
    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
    ${isDragAccept ? 'border-green-500 bg-green-50' : ''}
    ${isDragReject ? 'border-red-500 bg-red-50' : ''}
    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-50'}
  `;

  return (
    <div className="w-full">
      {/* Área de dropzone */}
      <div {...getRootProps()} className={dropzoneClass}>
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Subiendo archivo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium mb-1">{placeholder}</p>
            <p className="text-sm text-gray-500">
              {isDragActive ? 'Suelta el archivo aquí' : 'o arrastra y suelta'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Formatos aceptados: {acceptedFileTypes} (Máx. {formatFileSize(10 * 1024 * 1024)})
            </p>
          </div>
        )}
      </div>

      {/* Archivos subidos */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Archivos subidos:</h4>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Eliminar archivo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Vista previa para imágenes */}
      {uploadedFiles.some(f => f.type.startsWith('image/')) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {uploadedFiles
              .filter(f => f.type.startsWith('image/'))
              .map((file) => (
                <div key={file.id} className="relative group">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;