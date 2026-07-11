export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'citizen' | 'merchant' | 'admin';
  verified: boolean;
  cover_url?: string;
  bio?: string;
  address?: string;
  followers_count?: number;
  following_count?: number;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  category: 'leather' | 'fashion' | 'electronics' | 'manufacturing' | 'food' | 'services' | 'tech' | 'hospitality' | 'tourism' | 'entertainment';
  sub_category?: string; // e.g. 'Hotel', 'Apartment', 'Event Centre', 'Restaurant', 'Museum'
  description: string;
  address: string;
  market_zone?: string;
  price_range?: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  rating: number;
  reviews_count: number;
  image_url: string;
  gallery_urls?: string[];
  verified: boolean;
  owner_id?: string;
  opening_hours?: Record<string, string>;
  featured?: boolean;
  created_at: string;
  products_count?: number;
  amenities?: string[];
  policies?: string[];
  coordinates?: { lat: number; lng: number };
}

export interface Product {
  id: string;
  business_id: string;
  business_name?: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string; // For hospitality: 'Room', 'Ticket', 'Menu Item'
  image_url: string;
  gallery_urls?: string[];
  in_stock: boolean;
  made_in_aba: boolean;
  // Hospitality specific
  capacity?: number;
  features?: string[];
  availability?: {
    booked_dates: string[];
    maintenance_dates: string[];
  };
}

export interface Booking {
  id: string;
  user_id: string;
  business_id: string;
  business_name: string;
  business_image: string;
  product_id: string; // Room or Ticket ID
  product_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: PaymentMethod;
  special_requests?: string;
  booking_reference: string;
  created_at: string;
}

export interface EventListing {
  id: string;
  name: string;
  organizer: string;
  description: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  ticket_price: number;
  category: 'concert' | 'conference' | 'party' | 'festival' | 'workshop';
  image_url: string;
  contact_phone: string;
  coordinates?: { lat: number; lng: number };
}

export interface TourismSpot {
  id: string;
  name: string;
  category: 'historic' | 'market' | 'nature' | 'culture' | 'monument';
  description: string;
  location: string;
  image_url: string;
  gallery_urls?: string[];
  best_time_to_visit?: string;
  entry_fee?: number;
  coordinates?: { lat: number; lng: number };
}

export interface CommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_role?: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'question' | 'celebration' | 'announcement' | 'business_update' | 'product_update';
  category: 'announcement' | 'town_hall' | 'recommendation' | 'marketplace' | 'general' | 'business' | 'promotion' | 'event';
  title?: string;
  content: string;
  media_url?: string;
  likes: number;
  reactions?: Record<string, number>;
  comments_count: number;
  created_at: string;
  liked_by_user?: boolean;
  poll_data?: {
    options: { id: string; text: string; votes: number }[];
    total_votes: number;
    has_voted?: boolean;
  };
  business_id?: string;
  product_id?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string; // For nested comments
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  likes: number;
  created_at: string;
  replies?: Comment[];
}

export interface Story {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  media_url: string;
  type: 'image' | 'video';
  created_at: string;
  expires_at: string;
}

export interface SocialGroup {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: 'community' | 'market' | 'church' | 'school' | 'professional' | 'neighborhood' | 'business';
  members_count: number;
  created_by: string;
  is_private: boolean;
  created_at: string;
}

export interface SocialMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  media_url?: string;
  type: 'text' | 'image' | 'voice' | 'video';
  read: boolean;
  created_at: string;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string; // Can be user_id, business_id, or group_id
  type: 'user' | 'business' | 'group' | 'creator';
  created_at: string;
}

export interface MessageThread {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar: string;
  business_name?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  online_status?: boolean;
  is_typing?: boolean;
  messages: {
    id: string;
    sender: 'user' | 'other';
    text: string;
    timestamp: string;
  }[];
}

export interface CityBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'verified_merchant' | 'trusted_artisan' | 'top_driver' | 'community_leader' | 'top_reviewer' | 'ambassador' | 'made_in_aba';
}

export interface UserProfile extends User {
  bio?: string;
  cover_url?: string;
  followers_count: number;
  following_count: number;
  badges: CityBadge[];
  achievements?: string[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  title: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'message' | 'order' | 'system';
  read: boolean;
  avatar_url?: string;
  created_at: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Awaiting Payment' 
  | 'Paid' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Refunded';

export type EscrowStatus = 'held' | 'released' | 'disputed' | 'refunded';

export type DeliveryMethod = 'pickup' | 'local' | 'interstate' | 'express';

export type PaymentMethod = 'wallet' | 'paystack' | 'transfer' | 'escrow' | 'cash';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  business_id: string;
  business_name: string;
}

export interface DeliveryAddress {
  receiver_name: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
}

export interface DeliveryTrackingInfo {
  status: OrderStatus;
  estimated_arrival: string;
  delivery_company: string;
  driver_name: string;
  driver_phone: string;
  tracking_number: string;
  current_location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  timeline?: {
    status: string;
    time: string;
    location?: string;
  }[];
}

export type TransportVehicleType = 
  | 'okada' 
  | 'keke' 
  | 'taxi' 
  | 'ride_hailing' 
  | 'mini_bus' 
  | 'luxury_car' 
  | 'truck' 
  | 'pickup_van' 
  | 'container' 
  | 'interstate';

export interface Trip {
  id: string;
  user_id: string;
  user_name: string;
  driver_id?: string;
  driver_name?: string;
  vehicle_type: TransportVehicleType;
  pickup_location: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  fare: number;
  status: 'searching' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_time?: string;
  payment_method: PaymentMethod;
  created_at: string;
  rating?: number;
  feedback?: string;
}

export interface Shipment {
  id: string;
  sender_id: string;
  sender_details: {
    name: string;
    phone: string;
    address: string;
  };
  receiver_details: {
    name: string;
    phone: string;
    address: string;
  };
  package_details: {
    description: string;
    weight: number;
    dimensions?: string;
    is_fragile: boolean;
    image_urls?: string[];
  };
  type: 'courier' | 'pickup' | 'moving' | 'cargo' | 'container' | 'interstate' | 'warehouse' | 'office';
  fare: number;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  tracking_number: string;
  driver_id?: string;
  logistics_company_id?: string;
  created_at: string;
}

export interface DriverProfile {
  id: string;
  user_id: string;
  name: string;
  photo_url: string;
  verified: boolean;
  rating: number;
  completed_trips: number;
  experience_years: number;
  license_number: string;
  insurance_info: string;
  current_status: 'online' | 'offline' | 'on_trip';
  current_location?: {
    lat: number;
    lng: number;
  };
}

export interface Vehicle {
  id: string;
  driver_id: string;
  type: TransportVehicleType;
  make: string;
  model: string;
  plate_number: string;
  color: string;
  image_urls: string[];
  documents: {
    registration: string;
    insurance: string;
    road_worthiness: string;
  };
  verified: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  invoice_number: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  seller_id: string;
  seller_name: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  service_charge: number;
  total: number;
  status: OrderStatus;
  escrow_status: EscrowStatus;
  delivery_method: DeliveryMethod;
  payment_method: PaymentMethod;
  delivery_address: DeliveryAddress;
  tracking: DeliveryTrackingInfo;
  created_at: string;
  dispute_reason?: string;
}

