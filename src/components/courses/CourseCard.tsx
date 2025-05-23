import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, FileText, Eye, Book } from 'lucide-react';

type CourseCardProps = {
  id: string;
  title: string;
  image: string;
  enrollment: number;
  role: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const CourseCard: React.FC<CourseCardProps> = ({ 
  id, 
  title, 
  image, 
  enrollment, 
  role,
  onEdit,
  onDelete
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEdit) onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) onDelete(id);
  };

  const getImageUrl = () => {
    // Common programming language logos
    const imageMap: Record<string, string> = {
      'php': 'https://www.php.net/images/logos/new-php-logo.svg',
      'python': 'https://www.python.org/static/community_logos/python-logo-generic.svg',
      'flask': 'https://flask.palletsprojects.com/en/2.0.x/_images/flask-logo.png',
      'laravel': 'https://laravel.com/img/logomark.min.svg',
      'react': 'https://reactjs.org/logo-og.png',
      'javascript': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
    };
    
    const lowerTitle = title.toLowerCase();
    
    // Try to match a technology name in the title
    for (const [key, url] of Object.entries(imageMap)) {
      if (lowerTitle.includes(key)) {
        return url;
      }
    }
    
    // Default course image
    return 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img 
          src={getImageUrl()} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-blue-600 mb-2 line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>{enrollment} student(s)</span>
          </div>
          
          <div className="flex space-x-1">
            {role === 'teacher' && (
              <>
                <button 
                  onClick={handleEdit}
                  className="p-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  title="Edit course"
                >
                  <Edit size={18} />
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="p-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                  title="Delete course"
                >
                  <Trash size={18} />
                </button>
                
                <Link 
                  to={`/${role}/courses/${id}/materials`}
                  className="p-1 text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                  title="Study materials"
                >
                  <FileText size={18} />
                </Link>
                
                <Link 
                  to={`/${role}/courses/${id}/chapters`}
                  className="p-1 text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
                  title="Chapters"
                >
                  <Book size={18} />
                </Link>
              </>
            )}
            
            <Link 
              to={`/${role}/courses/${id}`}
              className="p-1 text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              title="View course"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;