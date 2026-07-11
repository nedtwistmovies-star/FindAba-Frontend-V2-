import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Clock, 
  ShoppingBag,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { CityImage } from '../components/common/CityImage';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useBusinessesQuery, useProductsQuery } from '../services/supabaseService';

export const BusinessProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedBusinessIds, toggleSaveBusiness } = useStore();
  
  const { data: businesses = [], isLoading: bizLoading } = useBusinessesQuery();
  const { data: products = [], isLoading: prodLoading } = useProductsQuery();

  const business = businesses.find(b => b.id === id);
  const businessProducts = products.filter(p => p.business_id === id);
  const isSaved = business ? savedBusinessIds.includes(business.id) : false;

  if (bizLoading || prodLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-sm font-bold text-zinc-500 animate-pulse tracking-tight">Syncing with city grid...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Enterprise Not Found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-xs">
          The requested business profile could not be located in the FindAba directory.
        </p>
        <button
          onClick={() => navigate('/discover')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Breadcrumbs items={[
        { label: 'Businesses', path: '/discover' },
        { label: business.name }
      ]} />

      {/* Business Hero Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <CityImage src={business.image_url} alt={business.name} fallback="business" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Aba Enterprise
                </span>
                <span className="px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur text-zinc-200 text-xs font-semibold">
                  {business.market_zone}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{business.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSaveBusiness(business.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs backdrop-blur border transition-all ${
                  isSaved
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-900/80 border-zinc-700 text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {isSaved ? 'Saved Enterprise' : 'Save Enterprise'}
              </button>

              <button
                onClick={() => navigate('/messages')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Owner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Details Bar */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="block font-semibold text-zinc-900 dark:text-white">Location / Address</span>
              <span>{business.address || 'Ariaria, Aba'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="block font-semibold text-zinc-900 dark:text-white">Phone & WhatsApp</span>
              <span>{business.phone || 'Contact via message'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="block font-semibold text-zinc-900 dark:text-white">Opening Hours</span>
              <span>
                {(() => {
                  if (!business.opening_hours) return '8:00 AM - 6:00 PM';
                  if (typeof business.opening_hours === 'string') return business.opening_hours;
                  if (typeof business.opening_hours === 'object') {
                    const hours = business.opening_hours as any;
                    if (hours.schedule) return hours.schedule;
                    if (hours.Monday) return `Mon-Fri: ${hours.Monday}`;
                    return Object.entries(hours).slice(0, 1).map(([day, time]) => `${day}: ${time}`).join('') || '8:00 AM - 6:00 PM';
                  }
                  return '8:00 AM - 6:00 PM';
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">About {business.name}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{business.description || 'No description provided.'}</p>
      </div>

      {/* Products Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Products & Catalog</h2>
            <p className="text-xs text-zinc-500">Available for direct order or pickup in Aba</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            {businessProducts.length} Items Listed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <CityImage src={prod.image_url} alt={prod.name} fallback="product" className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">{prod.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">{prod.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">₦{(prod.price || 0).toLocaleString()}</span>
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {businessProducts.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <ShoppingBag className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No products listed for this enterprise yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
