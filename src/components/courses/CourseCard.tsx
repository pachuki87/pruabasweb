import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash, FileText, Eye, Book, CreditCard, ShoppingCart, Check } from 'lucide-react';
import { useCart } from 'react-use-cart';
import { getMasterPriceCents, formatPrice } from '../../config/pricing';

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
  const navigate = useNavigate();
  const { addItem, inCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEdit) onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) onDelete(id);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (inCart(id)) {
      return; // Ya está en el carrito
    }
    
    setIsAdding(true);
    
    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Datos del curso para agregar al carrito
    const courseItem = {
      id,
      name: title,
      price: getMasterPriceCents(), // Precio dinámico según configuración
      quantity: 1,
      image: getImageUrl(),
      duration: '12 meses',
      description: `Curso especializado: ${title}`
    };
    
    addItem(courseItem);
    setIsAdding(false);
    setJustAdded(true);
    
    // Resetear el estado después de 2 segundos
    setTimeout(() => setJustAdded(false), 2000);
  };

  const getImageUrl = () => {
    if (image) {
      return image;
    }

    // Imágenes por defecto para los cursos de adicciones
    const imageMap: Record<string, string> = {
      'master': 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg',
      'adicciones': 'https://images.pexels.com/photos/4098277/pexels-photo-4098277.jpeg',
      'conductas': 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
    };
    
    const lowerTitle = title.toLowerCase();
    
    // Intentar encontrar una imagen que coincida con el título
    for (const [key, url] of Object.entries(imageMap)) {
      if (lowerTitle.includes(key)) {
        return url;
      }
    }
    
    // Imagen por defecto
    return 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl hover:border-red-400 transition-all hover:shadow-2xl">
      <div className="h-40 bg-gray-700 flex items-center justify-center overflow-hidden">
        <img 
          src={getImageUrl()} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {title}
        </h3>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>{enrollment} estudiante(s)</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-400">€{formatPrice(getMasterPriceCents())}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
          
            {/* Botón de agregar al carrito para visitantes */}
            {(role === 'visitor' || !role) && (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || inCart(id)}
                className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors ${
                  inCart(id)
                    ? 'bg-green-600 text-white cursor-default'
                    : justAdded
                    ? 'bg-green-600 text-white'
                    : isAdding
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                title={inCart(id) ? 'Ya está en el carrito' : 'Agregar al carrito'}
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1" />
                    Agregando...
                  </>
                ) : inCart(id) ? (
                  <>
                    <Check size={16} className="mr-1" />
                    En carrito
                  </>
                ) : justAdded ? (
                  <>
                    <Check size={16} className="mr-1" />
                    ¡Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} className="mr-1" />
                    Agregar
                  </>
                )}
              </button>
            )}
          
            <div className="flex space-x-1">
            {role === 'teacher' && (
              <>
                <button 
                  onClick={handleEdit}
                  className="p-1 text-red-400 bg-red-900/30 rounded hover:bg-red-900/50 transition-colors"
                  title="Edit course"
                >
                  <Edit size={18} />
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="p-1 text-red-400 bg-red-900/30 rounded hover:bg-red-900/50 transition-colors"
                  title="Delete course"
                >
                  <Trash size={18} />
                </button>
                
                <Link 
                  to={`/${role}/courses/${id}/materials`}
                  className="p-1 text-green-400 bg-green-900/30 rounded hover:bg-green-900/50 transition-colors"
                  title="Study materials"
                >
                  <FileText size={18} />
                </Link>
                
                <Link 
                  to={`/${role}/courses/${id}/chapters`}
                  className="p-1 text-purple-400 bg-purple-900/30 rounded hover:bg-purple-900/50 transition-colors"
                  title="Chapters"
                >
                  <Book size={18} />
                </Link>
              </>
            )}
            
            <Link 
              to={`/${role}/courses/${id}`}
              className="p-1 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
              title="View course"
            >
              <Eye size={18} />
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
