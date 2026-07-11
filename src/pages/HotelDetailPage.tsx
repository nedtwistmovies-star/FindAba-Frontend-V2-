import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Wifi, 
  Coffee, 
  Wind, 
  Car, 
  ShieldCheck, 
  Clock, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Share2,
  Heart,
  Navigation
} from 'lucide-react';
import { useHospitalityStore } from '../store/useHospitalityStore';
import { RoomCard } from '../components/hospitality/RoomCard';
import { AvailabilityCalendar } from '../components/hospitality/AvailabilityCalendar';

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotels, rooms } = useHospitalityStore();
  
  const hotel = hotels.find(h => h.id === id);
  const hotelRooms = rooms.filter(r => r.business_id === id);

  const [activeTab, setActiveTab] = useState<'rooms' | 'amenities' | 'reviews' | 'location'>('rooms');
  const [selectedImage, setSelectedImage] = useState(hotel?.image_url);

  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-3">
          <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl text-slate-500 shadow-sm">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl text-slate-500 shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Section with Gallery */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl">
            <img 
              src={selectedImage} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt={hotel.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#D4AF37] text-white text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                </div>
                <span className="text-white/80 text-xs font-bold">({hotel.reviews_count} Verified Reviews)</span>
              </div>
              <h1 className="text-4xl font-black text-white">{hotel.name}</h1>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[hotel.image_url, ...(hotel.gallery_urls || [])].map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden flex-shrink-0 border-4 transition-all ${
                  selectedImage === img ? 'border-[#0B7A3B]' : 'border-transparent'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="Gallery" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0B7A3B]/10 rounded-xl flex items-center justify-center text-[#0B7A3B]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">{hotel.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone / WhatsApp</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">{hotel.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-zinc-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Popular Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {hotel.amenities?.slice(0, 4).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400">
                    <div className="w-6 h-6 bg-slate-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      {amenity.includes('WiFi') ? <Wifi className="w-3.5 h-3.5" /> : 
                       amenity.includes('Power') ? <Wind className="w-3.5 h-3.5" /> : 
                       amenity.includes('Food') ? <Coffee className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setActiveTab('rooms')}
                className="w-full py-5 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Book Your Stay
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4">
            <h4 className="font-black">Special Offer</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Book directly through FindAba and get 15% discount on all suites and a free airport shuttle service.</p>
            <div className="bg-white/10 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20">
              Code: FINDABA15
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="space-y-10">
        <div className="flex border-b border-slate-100 dark:border-zinc-800">
          {[
            { id: 'rooms', label: 'Available Rooms' },
            { id: 'amenities', label: 'Amenities & Policies' },
            { id: 'reviews', label: 'Guest Reviews' },
            { id: 'location', label: 'Location & Nearby' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-6 text-sm font-black transition-all relative ${
                activeTab === tab.id ? 'text-[#0B7A3B]' : 'text-slate-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B7A3B] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'rooms' && (
              <motion.div
                key="rooms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-8">
                  {hotelRooms.map(room => (
                    <RoomCard 
                      key={room.id} 
                      room={room} 
                      onBook={() => navigate(`/hospitality/book/${hotel.id}/${room.id}`)} 
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'amenities' && (
              <motion.div
                key="amenities"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Full Amenities List</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {hotel.amenities?.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Property Policies</h3>
                  <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 space-y-6 shadow-sm">
                    {hotel.policies?.map((policy, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{policy}</p>
                      </div>
                    ))}
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        This property follows all official FindAba Health & Safety guidelines for verified hospitality providers.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'location' && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                <div className="h-[400px] bg-slate-100 dark:bg-zinc-800 rounded-[3rem] overflow-hidden relative shadow-inner">
                  {/* Mock Map */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Navigation className="w-12 h-12 text-[#0B7A3B] animate-bounce" />
                    <p className="absolute bottom-10 text-xs font-black uppercase tracking-widest text-slate-400">Live Map View Initializing...</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Explore Nearby</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Museum of Colonial History', dist: '1.2 km away', type: 'Tourism' },
                      { name: 'Aba Sports Club', dist: '0.8 km away', type: 'Entertainment' },
                      { name: 'Ariaria International Market', dist: '4.5 km away', type: 'Shopping' },
                    ].map((spot, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl hover:border-[#0B7A3B] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#0B7A3B] transition-colors">
                            <Navigation className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black">{spot.name}</h4>
                            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{spot.type}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{spot.dist}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 border-2 border-slate-100 dark:border-zinc-800 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-50 transition-colors">
                    Get Driving Directions
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
