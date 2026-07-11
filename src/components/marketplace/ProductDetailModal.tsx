import React, { useState } from 'react';
import { Product } from '../../types';
import { X, ShoppingCart, Heart, Share2, Star, ShieldCheck, Store, Phone, Check, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductsQuery } from '../../services/supabaseService';
import { useNavigate } from 'react-router-dom';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, wishlistIds, toggleWishlist } = useOrderStore();
  const { data: allProducts = [] } = useProductsQuery();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative h-80 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              {product.made_in_aba && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0B7A3B] text-white text-xs font-bold shadow">
                  Made in Aba - Verified
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[product.image_url, product.image_url, product.image_url].map((img, idx) => (
                <div key={idx} className="h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100">
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-[#0B7A3B] dark:text-emerald-400 font-semibold text-xs uppercase">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9 (128 reviews)
                </span>
              </div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
                {product.name}
              </h1>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-[#0B7A3B] dark:text-emerald-400">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  In Stock (Verified Maker)
                </span>
              </div>
            </div>

            {/* Business info card */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B7A3B]/10 flex items-center justify-center text-[#0B7A3B]">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{product.business_name || 'Ariaria Master Craftsmen'}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#0B7A3B]" /> Verified Aba Business
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/discover');
                }}
                className="text-xs font-bold text-[#0B7A3B] dark:text-emerald-400 hover:underline"
              >
                View Profile
              </button>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="space-y-2 border-t border-b border-zinc-200 dark:border-zinc-800 py-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Craft Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <div>• Material: Premium Genuine Leather</div>
                <div>• Origin: Ariaria Market, Aba</div>
                <div>• Warranty: 1 Year Craftsmanship</div>
                <div>• Delivery: Nationwide & Global</div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-zinc-500">Quantity</span>
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-zinc-900 dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {addedSuccess ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  <span>{addedSuccess ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <span>Buy Now (Escrow)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold ${isWishlisted ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Link Copied!' : 'Share Product'}</span>
                </button>
                <a
                  href={`tel:+2348031234567`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0B7A3B] dark:text-emerald-400 hover:underline"
                >
                  <Phone className="w-4 h-4" /> Contact Seller
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="p-6 md:p-8 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-4">Related Made-in-Aba Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map(rel => (
                <div key={rel.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
                  <img src={rel.image_url} alt={rel.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1">{rel.name}</h5>
                    <span className="text-xs font-black text-[#0B7A3B]">₦{rel.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
