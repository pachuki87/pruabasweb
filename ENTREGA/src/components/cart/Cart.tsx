import React from 'react';
import { useCart } from 'react-use-cart';
import { X, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { 
    isEmpty, 
    totalUniqueItems, 
    items, 
    updateItemQuantity, 
    removeItem, 
    cartTotal,
    emptyCart 
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Navegar a la página de pago
    navigate('/payment');
    onClose();
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
      
      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <ShoppingCart className="text-blue-400 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-white">
              Carrito ({totalUniqueItems})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {isEmpty ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="mx-auto text-gray-500 mb-4" size={64} />
                <p className="text-gray-400 text-lg mb-2">Tu carrito está vacío</p>
                <p className="text-gray-500 text-sm">Agrega algunos cursos para comenzar</p>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          {item.duration}
                        </p>
                        <p className="text-blue-400 font-semibold mt-2">
                          €{formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Eliminar del carrito"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                          className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white font-medium px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-white font-semibold">
                        €{formatPrice(item.price * (item.quantity || 1))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-700 p-4 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-xl font-bold text-blue-400">
                    €{formatPrice(cartTotal)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <CreditCard className="mr-2" size={20} />
                    Proceder al Pago
                  </button>
                  
                  <button
                    onClick={emptyCart}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;