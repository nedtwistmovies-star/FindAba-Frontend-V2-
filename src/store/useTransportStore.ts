import { create } from 'zustand';
import { Trip, Shipment, TransportVehicleType, DriverProfile, Vehicle } from '../types';
import { supabase } from '../lib/supabase';

interface TransportStore {
  activeTrips: Trip[];
  activeShipments: Shipment[];
  userTrips: Trip[];
  userShipments: Shipment[];
  drivers: DriverProfile[];
  vehicles: Vehicle[];
  isLoading: boolean;
  
  // Actions
  fetchUserTransportData: (userId: string) => Promise<void>;
  bookRide: (trip: Omit<Trip, 'id' | 'status' | 'created_at'>) => Promise<Trip | null>;
  bookLogistics: (shipment: Omit<Shipment, 'id' | 'status' | 'created_at' | 'tracking_number'>) => Promise<Shipment | null>;
  cancelTrip: (tripId: string) => Promise<void>;
  rateTrip: (tripId: string, rating: number, feedback?: string) => Promise<void>;
  
  // Driver Actions
  updateDriverStatus: (driverId: string, status: 'online' | 'offline' | 'on_trip') => Promise<void>;
  acceptTrip: (tripId: string, driverId: string) => Promise<void>;
  completeTrip: (tripId: string) => Promise<void>;
}

export const useTransportStore = create<TransportStore>((set, get) => ({
  activeTrips: [],
  activeShipments: [],
  userTrips: [],
  userShipments: [],
  drivers: [],
  vehicles: [],
  isLoading: false,

  fetchUserTransportData: async (userId) => {
    set({ isLoading: true });
    try {
      const [tripsRes, shipmentsRes, driversRes, vehiclesRes] = await Promise.all([
        supabase.from('trips').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('shipments').select('*').eq('sender_id', userId).order('created_at', { ascending: false }),
        supabase.from('driver_profiles').select('*'),
        supabase.from('vehicles').select('*')
      ]);

      set({
        userTrips: tripsRes.data || [],
        userShipments: shipmentsRes.data || [],
        drivers: driversRes.data || [],
        vehicles: vehiclesRes.data || [],
        activeTrips: (tripsRes.data || []).filter((t: Trip) => t.status !== 'completed' && t.status !== 'cancelled'),
        activeShipments: (shipmentsRes.data || []).filter((s: Shipment) => s.status !== 'delivered' && s.status !== 'cancelled'),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  bookRide: async (tripData) => {
    const newTrip: Omit<Trip, 'id'> = {
      ...tripData,
      status: 'searching',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('trips').insert([newTrip]).select().single();
    if (error) return null;

    const createdTrip = data as Trip;
    set((state) => ({
      activeTrips: [createdTrip, ...state.activeTrips],
      userTrips: [createdTrip, ...state.userTrips]
    }));
    
    return createdTrip;
  },

  bookLogistics: async (shipmentData) => {
    const trackingNumber = `FOS-LOG-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newShipment: Omit<Shipment, 'id'> = {
      ...shipmentData,
      status: 'pending',
      tracking_number: trackingNumber,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('shipments').insert([newShipment]).select().single();
    if (error) return null;

    const createdShipment = data as Shipment;
    set((state) => ({
      activeShipments: [createdShipment, ...state.activeShipments],
      userShipments: [createdShipment, ...state.userShipments]
    }));
    
    return createdShipment;
  },

  cancelTrip: async (tripId) => {
    const { error } = await supabase.from('trips').update({ status: 'cancelled' }).eq('id', tripId);
    if (!error) {
      set((state) => ({
        activeTrips: state.activeTrips.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t),
        userTrips: state.userTrips.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t)
      }));
    }
  },

  rateTrip: async (tripId, rating, feedback) => {
    const { error } = await supabase.from('trips').update({ rating, feedback }).eq('id', tripId);
    if (!error) {
      set((state) => ({
        userTrips: state.userTrips.map(t => t.id === tripId ? { ...t, rating, feedback } : t)
      }));
    }
  },

  updateDriverStatus: async (driverId, status) => {
    const { error } = await supabase.from('driver_profiles').update({ current_status: status }).eq('id', driverId);
    if (!error) {
      set((state) => ({
        drivers: state.drivers.map(d => d.id === driverId ? { ...d, current_status: status } : d)
      }));
    }
  },

  acceptTrip: async (tripId, driverId) => {
    const driver = get().drivers.find(d => d.id === driverId);
    const { error } = await supabase.from('trips').update({ 
      status: 'accepted', 
      driver_id: driverId, 
      driver_name: driver?.name 
    }).eq('id', tripId);

    if (!error) {
      await get().updateDriverStatus(driverId, 'on_trip');
      set((state) => ({
        activeTrips: state.activeTrips.map(t => 
          t.id === tripId ? { ...t, status: 'accepted', driver_id: driverId, driver_name: driver?.name } : t
        ),
        userTrips: state.userTrips.map(t => 
          t.id === tripId ? { ...t, status: 'accepted', driver_id: driverId, driver_name: driver?.name } : t
        )
      }));
    }
  },

  completeTrip: async (tripId) => {
    const trip = get().activeTrips.find(t => t.id === tripId);
    const { error } = await supabase.from('trips').update({ status: 'completed' }).eq('id', tripId);
    
    if (!error && trip?.driver_id) {
      await get().updateDriverStatus(trip.driver_id, 'online');
      set((state) => ({
        activeTrips: state.activeTrips.filter(t => t.id !== tripId),
        userTrips: state.userTrips.map(t => t.id === tripId ? { ...t, status: 'completed' } : t)
      }));
    }
  }
}));
