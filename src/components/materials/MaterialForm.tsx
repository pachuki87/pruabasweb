import React, { useState } from 'react';
import { Upload } from 'lucide-react';

type MaterialFormProps = {
  courseId: string;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
};

const MaterialForm: React.FC<MaterialFormProps> = ({ courseId, onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('remarks', remarks);
    formData.append('course_id', courseId);
    
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add Study Material</h2>
      
      {error && (
        <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
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
          <label htmlFor="material-file" className="block text-sm font-medium text-gray-700 mb-1">
            File
          </label>
          <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
            {file ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Drag and drop a file here, or click to select a file
                </p>
                <p className="text-xs text-gray-400">
                  PDF, Word, Excel, PPT, etc.
                </p>
              </div>
            )}
            <input
              type="file"
              id="material-file"
              onChange={handleFileChange}
              className={file ? 'hidden' : 'absolute inset-0 w-full h-full opacity-0 cursor-pointer'}
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isLoading || !file}
        >
          {isLoading ? 'Uploading...' : 'Upload Material'}
        </button>
      </form>
    </div>
  );
};

export default MaterialForm;
