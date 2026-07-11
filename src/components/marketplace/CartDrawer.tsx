import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Bookmark } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, saveForLater, savedForLater, moveToCart, removeSavedItem } = useOrderStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 1500 : 0;
  const serviceCharge = cart.length > 0 ? 500 : 0;
  const estimatedTotal = subtotal + (subtotal > 0 ? deliveryFee + serviceCharge : 0);

  const handleProceedCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0B7A3B]" />
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Shopping Cart</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#0B7A3B] text-xs font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Your cart is empty</h3>
              <p className="text-xs text-zinc-500">Explore Ariaria & Ekeoha marketplaces to add high-grade Aba products.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl flex gap-4">
                  <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                    <span className="font-black text-[#0B7A3B] text-sm block mt-1">₦{item.product.price.toLocaleString()}</span>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-zinc-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveForLater(item.product)}
                          className="text-[11px] font-semibold text-zinc-500 hover:text-[#0B7A3B]"
                          title="Save for Later"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Saved for Later ({savedForLater.length})
              </h4>
              <div className="space-y-3">
                {savedForLater.map((saved) => (
                  <div key={saved.product.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={saved.product.image_url} alt={saved.product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h6 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1">{saved.product.name}</h6>
                        <span className="text-xs font-bold text-[#0B7A3B]">₦{saved.product.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveToCart(saved.product.id)}
                        className="px-3 py-1.5 bg-[#0B7A3B] text-white rounded-lg text-[10px] font-bold"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeSavedItem(saved.product.id)}
                        className="text-zinc-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900 dark:text-white">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Estimated Delivery Fee</span>
                <span className="font-bold text-zinc-900 dark:text-white">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>FindAba Service Charge</span>
                <span className="font-bold text-zinc-900 dark:text-white">₦{serviceCharge.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-sm font-black text-zinc-900 dark:text-white">
                <span>Estimated Total</span>
                <span className="text-[#0B7A3B] dark:text-emerald-400 text-base">₦{estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
