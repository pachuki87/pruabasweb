import React, { useState } from 'react';
import { useCart } from 'react-use-cart';
import { ShoppingCart } from 'lucide-react';
import Cart from './Cart';

const CartIcon: React.FC = () => {
  const { totalUniqueItems, isEmpty } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={toggleCart}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        title="Abrir carrito"
      >
        <ShoppingCart size={24} />
        
        {/* Badge with item count */}
        {!isEmpty && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {totalUniqueItems > 99 ? '99+' : totalUniqueItems}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default CartIcon;