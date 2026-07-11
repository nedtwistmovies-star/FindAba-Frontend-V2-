import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  ShoppingBag, 
  Users, 
  Wallet, 
  Bot, 
  ArrowRight, 
  Star, 
  MapPin, 
  ShieldCheck, 
  TrendingUp,
  Sparkles,
  Compass,
  Search,
  Truck,
  Car,
  Building2,
  PlusCircle,
  Clock,
  Calendar,
  Phone,
  CheckCircle2,
  Heart,
  Share2,
  MessageSquare,
  Loader2,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useBusinessesQuery, useProductsQuery, useCommunityPostsQuery, useDashboardStats } from '../services/supabaseService';
import { CityImage } from '../components/common/CityImage';

const rotatingHeadlines = [
  "Discover Everything in Aba",
  "Find Trusted Businesses",
  "Shop Made-in-Aba Products",
  "Book Hotels & Apartments",
  "Hire Trusted Logistics",
  "Find Skilled Artisans",
  "Explore Aba Like Never Before",
  "Your Digital Gateway to Aba"
];

const searchCategories = [
  "Businesses", "Products", "Services", "Hotels", "Tourism", "Events", "Markets", "Drivers", "Restaurants", "Community"
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setAiDrawerOpen } = useStore();

  const { data: businesses = [], isLoading: bizLoading, error: bizError } = useBusinessesQuery();
  const { data: products = [], isLoading: prodLoading } = useProductsQuery();
  const { data: posts = [], isLoading: postLoading } = useCommunityPostsQuery();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('Businesses');

  const hotels = businesses.filter(b => 
    b.category?.toLowerCase().includes('hotel') || 
    b.category?.toLowerCase().includes('hospitality') ||
    b.sub_category?.toLowerCase().includes('hotel')
  ).slice(0, 3);

  const transport = businesses.filter(b => 
    b.category?.toLowerCase().includes('driver') || 
    b.category?.toLowerCase().includes('transport') ||
    b.category?.toLowerCase().includes('ride')
  ).slice(0, 3);

  const logistics = businesses.filter(b => 
    b.category?.toLowerCase().includes('logistic') || 
    b.category?.toLowerCase().includes('cargo') ||
    b.category?.toLowerCase().includes('delivery') ||
    b.category?.toLowerCase().includes('shipment')
  ).slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % rotatingHeadlines.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const featuredBusinesses = businesses.slice(0, 3);
  const featuredProducts = products.slice(0, 4);

  const popularCategories = [
    { name: "Ariaria Market", icon: Store, count: statsLoading ? "Loading..." : `${stats?.ariariaShops ?? 0} shops`, color: "from-emerald-500 to-teal-600" },
    { name: "Leather Works", icon: ShoppingBag, count: statsLoading ? "Loading..." : `${stats?.leatherArtisans ?? 0} artisans`, color: "from-amber-500 to-yellow-600" },
    { name: "Fashion & Tailoring", icon: Users, count: statsLoading ? "Loading..." : `${stats?.fashionDesigners ?? 0} designers`, color: "from-blue-500 to-indigo-600" },
    { name: "Fabrication & Tools", icon: Truck, count: statsLoading ? "Loading..." : `${stats?.fabricationMakers ?? 0} makers`, color: "from-purple-500 to-pink-600" },
    { name: "Hotels & Suites", icon: Building2, count: statsLoading ? "Loading..." : `${stats?.verifiedHotels ?? 0} verified`, color: "from-rose-500 to-red-600" },
    { name: "Transport & Rides", icon: Car, count: statsLoading ? "Loading..." : `${stats?.transportDrivers ?? 0} drivers`, color: "from-cyan-500 to-blue-600" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&cat=${selectedCat}`);
    } else {
      navigate('/discover');
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Hero Section */}
      <div className="bg-[#0B7A3B] rounded-[2.55rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#169C4A] rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-[-60px] w-80 h-80 bg-[#D4AF37] rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-[#D4AF37]/50 text-[#F4D35E] text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>FindAba OS V2 — Digital City Operating System</span>
          </div>

          <div className="h-20 sm:h-24 flex items-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={headlineIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-white"
              >
                {rotatingHeadlines[headlineIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-emerald-100 text-sm sm:text-base max-w-xl leading-relaxed">
            Navigate Ariaria market, connect with master leather craftsmen, buy verified Made-in-Aba goods, book rides, and manage your city wallet seamlessly.
          </p>

          {/* 2. Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-3 pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2 text-slate-900">
              <Search className="w-6 h-6 ml-3 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses, products, services or people in Aba..."
                className="w-full pl-3 pr-28 py-3 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-3 bg-[#0B7A3B] hover:bg-[#169C4A] text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Search OS
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {searchCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedCat === cat
                      ? 'bg-[#D4AF37] text-zinc-950 shadow'
                      : 'bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>

          {/* 3. Hero Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-4">
            {[
              { label: 'Businesses', icon: Store, path: '/discover' },
              { label: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
              { label: 'Hotels', icon: Building2, path: '/hospitality' },
              { label: 'Tourism', icon: MapPin, path: '/tourism' },
              { label: 'Events', icon: Calendar, path: '/events' },
              { label: 'Logistics', icon: Truck, path: '/logistics' },
              { label: 'Ask Kalu AI', icon: Bot, action: () => setAiDrawerOpen(true), highlight: true },
              { label: 'Register Biz', icon: PlusCircle, path: '/register-business' },
              { label: 'Biz Portal', icon: LayoutDashboard, path: '/business-dashboard', highlight: true },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (action.action) action.action();
                    else if (action.path) navigate(action.path);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all text-center gap-1.5 group ${
                    action.highlight
                      ? 'bg-[#D4AF37] text-zinc-950 font-bold shadow-lg hover:bg-[#F4D35E]'
                      : 'bg-emerald-800/40 hover:bg-emerald-800/70 text-white border border-emerald-700/40 backdrop-blur'
                  }`}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-semibold truncate w-full">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error state alert if Supabase fetch failed */}
      {bizError && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex items-center gap-3 text-amber-800 dark:text-amber-200 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Note: Connected in offline/fallback mode (Supabase connection unconfigured or tables empty). Showing live mock city data.</span>
        </div>
      )}

      {/* 4. Hero Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Verified Businesses', value: stats?.verifiedBusinesses ?? 0, icon: Store, change: 'Supabase verified' },
          { label: 'Products Available', value: stats?.productsAvailable ?? 0, icon: ShoppingBag, change: 'Made in Aba' },
          { label: 'Hotels & Suites', value: stats?.hotelsSuites ?? 0, icon: Building2, change: 'Verified stays' },
          { label: 'Drivers Online', value: stats?.driversOnline ?? 0, icon: Car, change: 'Ariaria & Environs' },
          { label: 'Community Members', value: stats?.communityMembers ?? 0, icon: Users, change: 'Active citizens' },
          { label: 'Successful Deliveries', value: stats?.successfulDeliveries ?? 0, icon: Truck, change: 'Escrow tracked' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-[#0B7A3B]/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{stat.label}</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#0B7A3B] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              {statsLoading ? (
                <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg h-7 w-20 mb-1" />
              ) : (
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value.toLocaleString()}</div>
              )}
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* 5. Popular Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Popular City Categories</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Explore Ariaria market zones, artisan crafts, and professional services</p>
          </div>
          <button onClick={() => navigate('/discover')} className="text-xs font-semibold text-[#0B7A3B] hover:underline flex items-center gap-1">
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => navigate('/discover')}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#0B7A3B]/50 cursor-pointer transition-all group flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-400">{cat.count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Trending Businesses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Trending Businesses in Aba</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Most visited and top-rated merchants this week</p>
          </div>
          <button onClick={() => navigate('/discover')} className="text-xs font-semibold text-[#0B7A3B] hover:underline flex items-center gap-1">
            <span>Explore directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {bizLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#0B7A3B]" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">No businesses found in database.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz) => (
              <div
                key={biz.id}
                onClick={() => navigate(`/business/${biz.id}`)}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0B7A3B]/50 cursor-pointer transition-all group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <CityImage src={biz.image_url} alt={biz.name} fallback="business" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur text-white text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span>Verified Maker</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B7A3B] bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                        {biz.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{biz.rating} ({biz.reviews_count})</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-[#0B7A3B] transition-colors">{biz.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mb-4">{biz.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <MapPin className="w-3.5 h-3.5 text-[#0B7A3B] flex-shrink-0" />
                    <span className="truncate">{biz.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Featured Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Featured Marketplace Products</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Authentic leather goods, bespoke shoes, and industrial wear</p>
          </div>
          <button onClick={() => navigate('/marketplace')} className="text-xs font-semibold text-[#0B7A3B] hover:underline flex items-center gap-1">
            <span>Open marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {prodLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#0B7A3B]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">No marketplace products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate('/marketplace')}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0B7A3B]/50 cursor-pointer transition-all group flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <CityImage src={prod.image_url} alt={prod.name} fallback="product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0B7A3B] text-white text-[10px] font-bold shadow">
                    Made in Aba
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{prod.category}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-[#0B7A3B] transition-colors line-clamp-1">{prod.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mb-3">{prod.business_name}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <span className="font-black text-[#0B7A3B] dark:text-emerald-400 text-base">₦{prod.price.toLocaleString()}</span>
                    <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-[#0B7A3B] dark:text-emerald-400 rounded-xl">
                      View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. Nearby Businesses / Ariaria Zones */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-xl relative z-10 space-y-4">
          <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F4D35E] text-xs font-semibold">
            Ariaria & Ekeoha Zoning
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">Discover Verified Cluster Zones</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Aba is organized into specialised manufacturing and trading zones. Explore footwear rows in Faulks Road, garment clusters in Cemetery Road, and electronics in Ekeoha Market.
          </p>
          <div className="pt-2 flex gap-4">
            <button onClick={() => navigate('/discover')} className="px-6 py-3 bg-[#0B7A3B] hover:bg-[#169C4A] text-white font-bold rounded-xl text-sm transition-all shadow-md">
              View Map & Zones
            </button>
            <button onClick={() => setAiDrawerOpen(true)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all border border-white/20">
              Ask Kalu AI for Directions
            </button>
          </div>
        </div>
      </div>

      {/* 9. Made in Aba Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Made-in-Aba Quality Guarantee</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Every verified manufacturer on FindAba OS undergoes quality auditing by the Aba Chamber of Commerce. Shop with absolute confidence in genuine leather and precision engineering.
            </p>
          </div>
          <div className="pt-6">
            <button onClick={() => navigate('/marketplace')} className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-[#0B7A3B] font-semibold rounded-xl text-xs hover:bg-emerald-100 transition-colors">
              Verify Certified Badge
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Escrow & Secure City Wallet</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Pay securely for bulk orders and retail goods using the FindAba City Wallet. Funds are held in escrow until delivery is confirmed by you or your shipping agent.
            </p>
          </div>
          <div className="pt-6">
            <button onClick={() => navigate('/wallet')} className="px-5 py-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 font-semibold rounded-xl text-xs hover:bg-blue-100 transition-colors">
              Manage Wallet & Escrow
            </button>
          </div>
        </div>
      </div>

      {/* 10. Community Highlights & Town Hall */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Community Town Hall Highlights</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Dispatches and updates from Aba leaders and market unions</p>
          </div>
          <button onClick={() => navigate('/community')} className="text-xs font-semibold text-[#0B7A3B] hover:underline flex items-center gap-1">
            <span>Join town hall</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {postLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#0B7A3B]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">No dispatches available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(0, 2).map((post) => (
              <div key={post.id} onClick={() => navigate('/community')} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0B7A3B] text-white font-bold flex items-center justify-center text-sm">
                      {post.author_name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{post.author_name}</h4>
                      <p className="text-[11px] text-slate-400">{post.category} • {post.created_at}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#0B7A3B] text-[10px] font-bold">
                    Verified Dispatch
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3">{post.content}</p>
                <div className="flex items-center gap-6 pt-2 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> {post.likes} Likes</span>
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-blue-500" /> {post.comments_count} Comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 11. Hotels & Apartments, Transport, Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotels & Hospitality */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0B7A3B]" /> Hospitality & Stays
            </h3>
            <button onClick={() => navigate('/hospitality')} className="text-xs text-[#0B7A3B] font-semibold hover:underline">Explore</button>
          </div>
          <div className="space-y-3">
            {hotels.length > 0 ? (
              hotels.map((h, i) => (
                <div key={h.id} onClick={() => navigate(`/business/${h.id}`)} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{h.name}</h4>
                    <p className="text-[11px] text-[#0B7A3B] font-semibold">{h.price_range || 'Contact for price'}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">★ {h.rating || '5.0'}</span>
                </div>
              ))
            ) : (
              [
                { name: "Binez Hotel GRA Aba", price: "₦35,000 / night", rating: "4.8" },
                { name: "Covenant Suites Azikiwe", price: "₦25,000 / night", rating: "4.6" },
                { name: "De Rigg Luxury Hotel", price: "₦50,000 / night", rating: "4.9" }
              ].map((h, i) => (
                <div key={i} onClick={() => navigate('/hospitality')} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{h.name}</h4>
                    <p className="text-[11px] text-[#0B7A3B] font-semibold">{h.price}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">★ {h.rating}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transport & Rides */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Car className="w-5 h-5 text-[#0B7A3B]" /> City Transport & Rides
            </h3>
            <button onClick={() => navigate('/transport')} className="text-xs text-[#0B7A3B] font-semibold hover:underline">Book ride</button>
          </div>
          <div className="space-y-3">
            {transport.length > 0 ? (
              transport.map((t) => (
                <div key={t.id} onClick={() => navigate(`/business/${t.id}`)} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.sub_category || t.category}</p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-100 text-[#0B7A3B] rounded-lg">Available</span>
                </div>
              ))
            ) : (
              [
                { route: "Ariaria Market ⇄ Aba Township", eta: "4 mins away", type: "Verified Keke & Cab" },
                { route: "Abayi ⇄ Ekeoha Market", eta: "7 mins away", type: "Executive Ride" },
                { route: "Milverton ⇄ Express Junction", eta: "2 mins away", type: "City Shuttle" }
              ].map((t, i) => (
                <div key={i} onClick={() => navigate('/transport')} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{t.route}</h4>
                    <p className="text-[11px] text-slate-400">{t.type}</p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-100 text-[#0B7A3B] rounded-lg">{t.eta}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logistics & Delivery */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0B7A3B]" /> Logistics & Cargo
            </h3>
            <button onClick={() => navigate('/logistics')} className="text-xs text-[#0B7A3B] font-semibold hover:underline">Send cargo</button>
          </div>
          <div className="space-y-3">
            {logistics.length > 0 ? (
              logistics.map((l) => (
                <div key={l.id} onClick={() => navigate(`/business/${l.id}`)} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{l.name}</h4>
                    <p className="text-[11px] text-slate-400">{l.sub_category || l.category}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#0B7A3B]">Book</span>
                </div>
              ))
            ) : (
              [
                { title: "Nationwide Container Dispatch", time: "Same Day", status: "Active Fleet" },
                { title: "Ariaria Bulk Shoe Delivery", time: "Express", status: "Verified Riders" },
                { title: "Interstate Cargo to Lagos / PH", time: "24 hrs", status: "Insured Transit" }
              ].map((l, i) => (
                <div key={i} onClick={() => navigate('/logistics')} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{l.title}</h4>
                    <p className="text-[11px] text-slate-400">{l.time} • {l.status}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#0B7A3B]">Book</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 12. Recommended for You & Footer */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Personalized City OS</span>
          <h3 className="text-2xl font-bold">Have an enterprise or shop in Ariaria?</h3>
          <p className="text-sm text-slate-300 max-w-lg">
            Register your business today on FindAba OS V2 to receive verified maker badges, accept escrow payments, and connect with global buyers.
          </p>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="px-8 py-4 bg-[#D4AF37] hover:bg-[#F4D35E] text-zinc-950 font-bold rounded-2xl text-sm transition-all shadow-lg flex-shrink-0"
        >
          Register Your Business Now
        </button>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400 space-y-2">
        <p className="font-bold text-slate-600 dark:text-zinc-300">FINDABA OS V2 — The Digital Operating System of Aba City</p>
        <p>Ariaria Market • Ekeoha • Faulks Road • Cemetery Market • Ogbo Hill • Azikiwe Road</p>
        <p className="pt-2 text-[10px]">© 2026 FindAba City Government & Chamber of Commerce. All rights reserved.</p>
      </footer>
    </div>
  );
};
