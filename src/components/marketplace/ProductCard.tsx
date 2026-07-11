import React, { useState } from 'react';
import { Product } from '../../types';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { ProductDetailModal } from './ProductDetailModal';
import { CityImage } from '../common/CityImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlistIds, toggleWishlist } = useOrderStore();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
        <div>
          <div className="relative h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <CityImage 
              src={product.image_url} 
              alt={product.name} 
              fallback="product"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            {product.made_in_aba && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B7A3B] text-white text-[10px] font-bold shadow-lg">
                Made in Aba
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                isWishlisted 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-200 hover:bg-white'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setIsDetailOpen(true)}
              className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs"
            >
              <Eye className="w-4 h-4" /> Quick View
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" /> 4.9
              </span>
            </div>
            <h3 
              onClick={() => setIsDetailOpen(true)}
              className="font-bold text-zinc-900 dark:text-white text-base mb-1 cursor-pointer hover:text-[#0B7A3B] transition-colors line-clamp-1"
            >
              {product.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">
              {product.description}
            </p>
          </div>
        </div>

        <div className="p-5 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 mt-2 pt-3">
          <div>
            <span className="text-[10px] text-zinc-400 block">Verified Price</span>
            <span className="font-black text-[#0B7A3B] dark:text-emerald-400 text-lg">
              ₦{product.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {isDetailOpen && (
        <ProductDetailModal product={product} onClose={() => setIsDetailOpen(false)} />
      )}
    </>
  );
};
