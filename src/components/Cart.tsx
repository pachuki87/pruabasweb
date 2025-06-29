import React, { useState } from 'react';
import { useCart } from 'react-use-cart';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    isEmpty,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    cartTotal,
    emptyCart
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (isEmpty) return;
    
    // Crear datos del carrito para enviar a la página de pago
    const cartData = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cartTotal,
      itemCount: totalUniqueItems
    };
    
    onClose();
    navigate('/payment', { state: { cartData } });
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="mr-2" size={20} />
              Carrito ({totalUniqueItems})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingCart size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-500 mb-6">
                  Agrega algunos cursos para comenzar
                </p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continuar Navegando
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    {/* Course Image Placeholder */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={24} className="text-gray-400" />
                    </div>
                    
                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        €{formatPrice(item.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={item.quantity === 1}
                      >
                        <Minus size={16} className={item.quantity === 1 ? 'text-gray-300' : 'text-gray-600'} />
                      </button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                      title="Eliminar del carrito"
                    >
                      <Trash2 size={16} className="text-blue-500" />
                    </button>
                  </div>
                ))}
                
                {/* Clear Cart Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={emptyCart}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {!isEmpty && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  €{formatPrice(cartTotal)}
                </span>
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <CreditCard className="mr-2" size={20} />
                    Proceder al Pago
                  </>
                )}
              </button>
              
              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;