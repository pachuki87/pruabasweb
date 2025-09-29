import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash, FileText, Eye, Book, CreditCard, ShoppingCart, Check } from 'lucide-react';
import { useCart } from 'react-use-cart';

type CourseCardProps = {
  id: string;
  titulo: string;
  image: string;
  enrollment: number;
  role: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const CourseCard: React.FC<CourseCardProps> = ({ 
  id, 
  titulo, 
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
      name: titulo,
      price: 2500, // Precio en centavos (25.00 EUR)
      quantity: 1,
      image: getImageUrl(),
      duration: '12 meses',
      description: `Curso especializado: ${titulo}`
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
    
    const lowerTitle = titulo.toLowerCase();
    
    // Intentar encontrar una imagen que coincida con el título
    for (const [key, url] of Object.entries(imageMap)) {
      if (lowerTitle.includes(key)) {
        return url;
      }
    }
    
    // Imagen por defecto
    return 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  // Función para manejar clic en el div principal (ir al curso directo)
  const handleDivClick = () => {
    if (role && role !== 'visitor') {
      navigate(`/${role}/courses/${id}`);
    } else {
      // Si es visitante, redirigir al login
      navigate('/login/student');
    }
  };

  // Función para manejar clic en el SVG (ir a página informativa)
  const handleSvgClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se propague al div padre
    // Para el Master de Adicciones, ir a la página informativa
    if (titulo.toLowerCase().includes('adicciones') || titulo.toLowerCase().includes('master')) {
      navigate('/master-adicciones-intervencion');
    } else {
      // Para otros cursos, mantener comportamiento actual
      navigate(`/${role}/courses/${id}`);
    }
  };

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl hover:border-blue-400 transition-all hover:shadow-2xl cursor-pointer"
      onClick={handleDivClick}
    >
      <div className="h-40 bg-gray-700 flex items-center justify-center overflow-hidden">
        <img 
          src={getImageUrl()} 
          alt={titulo} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {titulo}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>{enrollment} estudiante(s)</span>
          </div>
          
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
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
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
                  className="p-1 text-blue-400 bg-blue-900/30 rounded hover:bg-blue-900/50 transition-colors"
                  title="Edit course"
                >
                  <Edit size={18} />
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="p-1 text-blue-400 bg-blue-900/30 rounded hover:bg-blue-900/50 transition-colors"
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
            
            <button
              className="p-1 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
              title="View course"
              onClick={handleSvgClick}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
