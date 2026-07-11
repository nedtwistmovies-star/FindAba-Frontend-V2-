import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Order, OrderStatus, EscrowStatus, DeliveryAddress, DeliveryMethod, PaymentMethod } from '../types';
import { supabase } from '../lib/supabase';

interface CartItem {
  product: Product;
  quantity: number;
}

interface SavedItem {
  product: Product;
  saved_at: string;
}

interface OrderStoreState {
  cart: CartItem[];
  savedForLater: SavedItem[];
  orders: Order[];
  wishlistIds: string[];
  isLoading: boolean;
  
  // Actions
  fetchOrders: (userId: string) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (product: Product) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;

  // Order & Escrow Actions
  createOrder: (data: {
    items: { product: Product; quantity: number }[];
    deliveryAddress: DeliveryAddress;
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
  }) => Promise<Order | null>;

  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNote?: string) => Promise<void>;
  confirmDelivery: (orderId: string) => Promise<void>;
  disputeOrder: (orderId: string, reason: string) => Promise<void>;
  confirmShipment: (orderId: string) => Promise<void>;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      savedForLater: [],
      orders: [],
      wishlistIds: [],
      isLoading: false,

  fetchOrders: async (userId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (data) {
        set({ orders: data as Order[] });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        };
      }
      return { cart: [...state.cart, { product, quantity }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId)
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  saveForLater: (product) => {
    set((state) => {
      const exists = state.savedForLater.some((item) => item.product.id === product.id);
      if (exists) return state;
      return {
        cart: state.cart.filter((item) => item.product.id !== product.id),
        savedForLater: [...state.savedForLater, { product, saved_at: new Date().toISOString() }]
      };
    });
  },

  moveToCart: (productId) => {
    const item = get().savedForLater.find((i) => i.product.id === productId);
    if (!item) return;
    set((state) => ({
      savedForLater: state.savedForLater.filter((i) => i.product.id !== productId),
      cart: [...state.cart, { product: item.product, quantity: 1 }]
    }));
  },

  removeSavedItem: (productId) => {
    set((state) => ({
      savedForLater: state.savedForLater.filter((i) => i.product.id !== productId)
    }));
  },

  toggleWishlist: (productId) => {
    set((state) => {
      const exists = state.wishlistIds.includes(productId);
      return {
        wishlistIds: exists
          ? state.wishlistIds.filter((id) => id !== productId)
          : [...state.wishlistIds, productId]
      };
    });
  },

  createOrder: async ({ items, deliveryAddress, deliveryMethod, paymentMethod, buyerId, buyerName, buyerEmail }) => {
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const delivery_fee = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'express' ? 3500 : 1500;
    const service_charge = 500;
    const total = subtotal + delivery_fee + service_charge;

    const randNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `FOS-ORD-${randNum}`;
    const invoiceNumber = `FOS-INV-${randNum}`;

    const firstProduct = items[0]?.product;
    const seller_id = firstProduct?.business_id || 'biz_1';
    const seller_name = firstProduct?.business_name || 'Ariaria Verified Merchant';

    const orderItems = items.map((i) => ({
      product_id: i.product.id,
      product_name: i.product.name,
      product_image: i.product.image_url,
      price: i.product.price,
      quantity: i.quantity,
      business_id: i.product.business_id,
      business_name: i.product.business_name || 'FindAba Merchant'
    }));

    const newOrder: Omit<Order, 'id'> = {
      order_number: orderNumber,
      invoice_number: invoiceNumber,
      buyer_id: buyerId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      seller_id,
      seller_name,
      items: orderItems,
      subtotal,
      delivery_fee,
      service_charge,
      total,
      status: paymentMethod === 'transfer' ? 'Awaiting Payment' : 'Paid',
      escrow_status: paymentMethod === 'escrow' ? 'held' : 'released',
      delivery_method: deliveryMethod,
      payment_method: paymentMethod,
      delivery_address: deliveryAddress,
      tracking: {
        status: paymentMethod === 'transfer' ? 'Awaiting Payment' : 'Processing',
        estimated_arrival: '3 - 5 Business Days',
        delivery_company: 'FindAba City Logistics',
        driver_name: 'Pending Assignment',
        driver_phone: '+234 800 000 0000',
        tracking_number: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`
      },
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error('Order creation failed:', error);
      return null;
    }

    const createdOrder = data as Order;
    set((state) => ({
      orders: [createdOrder, ...state.orders],
      cart: []
    }));

    return createdOrder;
  },

  updateOrderStatus: async (orderId, status, trackingNote) => {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        'tracking->status': status,
        'tracking->estimated_arrival': trackingNote || undefined
      })
      .eq('id', orderId);

    if (!error) {
      set((state) => ({
        orders: state.orders.map((ord) => 
          ord.id === orderId ? { ...ord, status, tracking: { ...ord.tracking, status, estimated_arrival: trackingNote || ord.tracking.estimated_arrival } } : ord
        )
      }));
    }
  },

  confirmDelivery: async (orderId) => {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'Completed',
        escrow_status: 'released',
        'tracking->status': 'Completed'
      })
      .eq('id', orderId);

    if (!error) {
      set((state) => ({
        orders: state.orders.map((ord) => 
          ord.id === orderId ? { ...ord, status: 'Completed', escrow_status: 'released', tracking: { ...ord.tracking, status: 'Completed' } } : ord
        )
      }));
    }
  },

  disputeOrder: async (orderId, reason) => {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'Cancelled',
        escrow_status: 'disputed',
        dispute_reason: reason
      })
      .eq('id', orderId);

    if (!error) {
      set((state) => ({
        orders: state.orders.map((ord) => 
          ord.id === orderId ? { ...ord, status: 'Cancelled', escrow_status: 'disputed', dispute_reason: reason } : ord
        )
      }));
    }
  },

  confirmShipment: async (orderId) => {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'Shipped',
        'tracking->status': 'Shipped',
        'tracking->driver_name': 'Chinedu Express Driver',
        'tracking->driver_phone': '+234 805 444 3322'
      })
      .eq('id', orderId);

    if (!error) {
      set((state) => ({
        orders: state.orders.map((ord) => 
          ord.id === orderId ? { ...ord, status: 'Shipped', tracking: { ...ord.tracking, status: 'Shipped', driver_name: 'Chinedu Express Driver', driver_phone: '+234 805 444 3322' } } : ord
        )
      }));
    }
  }
}),
{
  name: 'findaba-os-order-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ 
      cart: state.cart,
      savedForLater: state.savedForLater,
      wishlistIds: state.wishlistIds
    }),
  }
)
);
