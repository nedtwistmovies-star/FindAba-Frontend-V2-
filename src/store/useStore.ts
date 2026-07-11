import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Business, Product, CommunityPost, WalletTransaction, NotificationItem } from '../types';
import { supabase } from '../lib/supabase';
import { healingInsert, healingUpsert } from '../services/supabaseService';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  walletBalance: number;
  escrowBalance: number;
  transactions: WalletTransaction[];
  businesses: Business[];
  products: Product[];
  posts: CommunityPost[];
  notifications: NotificationItem[];
  savedBusinessIds: string[];
  cart: { product: Product; quantity: number }[];
  isAiDrawerOpen: boolean;
  aiMessages: { role: 'user' | 'assistant'; content: string }[];
  isCheckingSession: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  toggleTheme: () => void;
  toggleSaveBusiness: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addTransaction: (tx: WalletTransaction) => Promise<void>;
  addPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments_count' | 'created_at'>) => Promise<void>;
  toggleLikePost: (postId: string) => Promise<void>;
  setAiDrawerOpen: (open: boolean) => void;
  addAiMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
  markNotificationRead: (id: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>;
  fetchWalletData: (userId: string) => Promise<void>;
  fetchNotifications: (userId: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      theme: 'light',
      walletBalance: 0,
      escrowBalance: 0,
      transactions: [],
      businesses: [],
      products: [],
      posts: [],
      notifications: [],
      savedBusinessIds: [],
      cart: [],
      isAiDrawerOpen: false,
      isCheckingSession: true,
      aiMessages: [
        { role: 'assistant', content: 'Hello! I am your FindAba OS AI Concierge. Ask me anything about Aba markets (Ariaria, Ekeoha), verified shoe manufacturers, local events, or logistics.' }
      ],

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (!error) {
      set({ user: { ...user, ...data } });
    }
    return { error };
  },

  fetchWalletData: async (userId: string) => {
    const [walletRes, txRes, ordersRes] = await Promise.all([
      supabase.from('wallets').select('balance').eq('user_id', userId).single(),
      supabase.from('wallet_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('orders').select('total, escrow_status').or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    ]);

    if (walletRes.data) {
      set({ walletBalance: walletRes.data.balance });
    }
    if (txRes.data) {
      set({ transactions: txRes.data as WalletTransaction[] });
    }
    
    // Calculate escrow balance
    if (ordersRes.data) {
      const escrow = ordersRes.data
        .filter(o => o.escrow_status === 'held')
        .reduce((sum, o) => sum + o.total, 0);
      set({ escrowBalance: escrow });
    }
  },

  fetchNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      set({ notifications: data as NotificationItem[] });
    }
  },

  checkSession: async () => {
    set({ isCheckingSession: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({
            isAuthenticated: true,
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              role: profile.role || 'citizen',
              verified: profile.verified || false,
              avatar_url: profile.avatar_url,
              phone: profile.phone,
              created_at: profile.created_at,
            }
          });
          
          await get().fetchWalletData(session.user.id);
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      set({ isCheckingSession: false });
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        set({
          isAuthenticated: true,
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: profile.name || '',
            role: profile.role || 'citizen',
            verified: profile.verified || false,
            avatar_url: profile.avatar_url,
            phone: profile.phone,
            created_at: profile.created_at,
          }
        });
        
        await get().fetchWalletData(data.user.id);
      }
    }
    return { error: null };
  },

  signUp: async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name: name,
          full_name: name,
          phone: phone
        }
      }
    });

    if (error) return { error };

    if (data.user) {
      const now = new Date().toISOString();
      
      // Use healingUpsert to avoid collision with handle_new_user trigger and handle schema mismatch
      const { error: profileError } = await healingUpsert('profiles', {
        id: data.user.id,
        name,
        email,
        phone,
        role: 'citizen',
        verified: false,
        created_at: now
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      // Create wallet - note: wallets table might not exist yet in some environments
      try {
        const { error: walletError } = await healingUpsert('wallets', {
          user_id: data.user.id,
          balance: 0,
          currency: 'NGN',
          created_at: now
        }, 'user_id');
        if (walletError) console.warn('Wallet creation error (table may not exist):', walletError);
      } catch (e) {
        console.warn('Wallet creation exception:', e);
      }

      set({
        isAuthenticated: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name,
          role: 'citizen',
          verified: false,
          phone,
          created_at: now,
        }
      });
    }
    return { error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, walletBalance: 0 });
  },

  toggleTheme: () => {
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
  },

  toggleSaveBusiness: (id) => {
    set((state) => {
      const exists = state.savedBusinessIds.includes(id);
      return {
        savedBusinessIds: exists
          ? state.savedBusinessIds.filter((item) => item !== id)
          : [...state.savedBusinessIds, id]
      };
    });
  },

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId)
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  addTransaction: async (tx) => {
    const { user } = get();
    if (!user) return;

    // Persist to Supabase
    const { error: txError } = await supabase.from('wallet_transactions').insert({
      user_id: user.id,
      type: tx.type,
      title: tx.title,
      amount: tx.amount,
      status: tx.status,
      reference: tx.reference,
      created_at: new Date().toISOString()
    });

    if (!txError) {
      // Re-fetch wallet data from source of truth
      await get().fetchWalletData(user.id);
    }
  },

  addPost: async (postData) => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await healingInsert('community_posts', {
      ...postData,
      likes: 1,
      comments_count: 0,
      created_at: new Date().toISOString()
    });

    if (!error && data) {
      set((state) => ({ posts: [data as CommunityPost, ...state.posts] }));
    }
  },

  toggleLikePost: async (postId) => {
    const post = get().posts.find(p => p.id === postId);
    if (!post) return;

    const liked = post.liked_by_user;
    const newLikes = liked ? post.likes - 1 : post.likes + 1;

    const { error } = await supabase
      .from('community_posts')
      .update({ likes: newLikes })
      .eq('id', postId);

    if (!error) {
      set((state) => ({
        posts: state.posts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              liked_by_user: !liked,
              likes: newLikes,
            };
          }
          return p;
        })
      }));
    }
  },

  setAiDrawerOpen: (open) => {
    set({ isAiDrawerOpen: open });
  },

  addAiMessage: (message) => {
    set((state) => ({ aiMessages: [...state.aiMessages, message] }));
  },

  markNotificationRead: async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      }));
    }
  }
}),
{
  name: 'findaba-os-v2-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ 
      theme: state.theme,
      savedBusinessIds: state.savedBusinessIds,
      aiMessages: state.aiMessages
    }),
  }
)
);
