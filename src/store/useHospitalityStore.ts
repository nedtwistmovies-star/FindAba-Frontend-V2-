import { create } from 'zustand';
import { Business, Product, Booking, EventListing, TourismSpot } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface HospitalityStore {
  hotels: Business[];
  rooms: Product[];
  bookings: Booking[];
  events: EventListing[];
  tourismSpots: TourismSpot[];
  isLoading: boolean;
  
  // Actions
  fetchHospitalityData: () => Promise<void>;
  fetchUserBookings: (userId: string) => Promise<void>;
  setHotels: (hotels: Business[]) => void;
  setRooms: (rooms: Product[]) => void;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  setEvents: (events: EventListing[]) => void;
  setTourismSpots: (spots: TourismSpot[]) => void;
}

export const useHospitalityStore = create<HospitalityStore>((set, get) => ({
  hotels: [],
  rooms: [],
  bookings: [],
  events: [],
  tourismSpots: [],
  isLoading: false,

  fetchHospitalityData: async () => {
    if (!isSupabaseConfigured) return;
    set({ isLoading: true });
    try {
      const [hotelsRes, roomsRes] = await Promise.all([
        supabase.from('businesses').select('*').or('category.eq.hospitality,category.ilike.%hotel%,category.ilike.%suite%'),
        supabase.from('products').select('*').or('category.eq.Room,category.eq.Ticket')
      ]);

      set({
        hotels: hotelsRes.data || [],
        rooms: roomsRes.data || [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserBookings: async (userId: string) => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      set({ bookings: data as Booking[] });
    }
  },

  setHotels: (hotels) => set({ hotels }),
  setRooms: (rooms) => set({ rooms }),
  
  addBooking: async (booking) => {
    const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
    if (!error && data) {
      set((state) => ({ bookings: [data as Booking, ...state.bookings] }));
    }
  },

  updateBookingStatus: async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) {
      set((state) => ({
        bookings: state.bookings.map((b) => b.id === id ? { ...b, status } : b)
      }));
    }
  },

  setEvents: (events) => set({ events }),
  setTourismSpots: (spots) => set({ tourismSpots: spots })
}));
