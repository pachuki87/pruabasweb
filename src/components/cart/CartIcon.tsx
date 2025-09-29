import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from 'react-use-cart';

interface CartIconProps {
  onClick: () => void;
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick, className = '' }) => {
  const { totalUniqueItems, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-700 ${className}`}
      title="Ver carrito"
    >
      <div className="relative">
        <ShoppingCart className="text-gray-300" size={24} />
        {totalUniqueItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalUniqueItems}
          </span>
        )}
      </div>
      
      {totalUniqueItems > 0 && (
        <div className="hidden md:flex flex-col items-start">
          <span className="text-gray-300 text-sm font-medium">
            {totalUniqueItems} {totalUniqueItems === 1 ? 'curso' : 'cursos'}
          </span>
          <span className="text-blue-400 text-xs font-semibold">
            €{formatPrice(cartTotal)}
          </span>
        </div>
      )}
    </button>
  );
};

export default CartIcon;