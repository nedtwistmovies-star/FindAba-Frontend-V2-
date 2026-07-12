import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Business, Product, CommunityPost, WalletTransaction, NotificationItem, User, Comment, Story, UserFollow } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

// Fetch Businesses
export async function fetchBusinesses(): Promise<Business[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase.from('businesses').select('*');
    if (error || !data) {
      return [];
    }
    return data as Business[];
  } catch (err) {
    console.warn('Supabase fetch businesses error:', err);
    return [];
  }
}

export function useBusinessesQuery() {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: fetchBusinesses,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch Products
export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data) {
      return [];
    }
    return data as Product[];
  } catch (err) {
    console.warn('Supabase fetch products error:', err);
    return [];
  }
}

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch Community Posts
export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      return [];
    }
    return data as CommunityPost[];
  } catch (err) {
    console.warn('Supabase fetch posts error:', err);
    return [];
  }
}

export function useCommunityPostsQuery() {
  return useQuery({
    queryKey: ['community_posts'],
    queryFn: fetchCommunityPosts,
    staleTime: 1000 * 60 * 2,
  });
}

// Fetch Comments for a post
export async function fetchComments(postId: string): Promise<Comment[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error || !data) return [];
    
    // Group by parent_id for nesting
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];
    
    data.forEach((c: any) => {
      const comment = { ...c, replies: [] };
      commentMap.set(c.id, comment);
      if (!c.parent_id) {
        rootComments.push(comment);
      }
    });
    
    data.forEach((c: any) => {
      if (c.parent_id && commentMap.has(c.parent_id)) {
        commentMap.get(c.parent_id)!.replies!.push(commentMap.get(c.id)!);
      }
    });
    
    return rootComments;
  } catch (err) {
    return [];
  }
}

export function useCommentsQuery(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });
}

// Fetch Stories
export async function fetchStories(): Promise<Story[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    return data as Story[];
  } catch (err) {
    return [];
  }
}

export function useStoriesQuery() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: fetchStories,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch Follows
export async function fetchFollows(userId: string, type: 'follower' | 'following'): Promise<UserFollow[]> {
  if (!isSupabaseConfigured) return [];
  const column = type === 'follower' ? 'following_id' : 'follower_id';
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq(column, userId);
    
    if (error || !data) return [];
    return data as UserFollow[];
  } catch (err) {
    return [];
  }
}

// Social Feed (Posts + Business Updates)
export function useSocialFeed() {
  const postsQuery = useCommunityPostsQuery();
  const businessQuery = useBusinessesQuery();
  
  const feed = React.useMemo(() => {
    const posts = postsQuery.data || [];
    const businesses = businessQuery.data || [];
    
    // Transform business updates into "posts" for the feed
    const bizUpdates = businesses.map(b => ({
      id: `biz_${b.id}`,
      author_id: b.id,
      author_name: b.name,
      author_avatar: b.image_url,
      author_role: 'Verified Business',
      type: 'business_update',
      category: 'business',
      content: `${b.name} is now available on FindAba OS! Visit us at ${b.address}.`,
      likes: b.reviews_count || 0,
      comments_count: 0,
      created_at: b.created_at || new Date().toISOString(),
      media_url: b.image_url,
      business_id: b.id,
    } as CommunityPost));
    
    return [...posts, ...bizUpdates].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [postsQuery.data, businessQuery.data]);
  
  return {
    data: feed,
    isLoading: postsQuery.isLoading || businessQuery.isLoading,
    error: postsQuery.error || businessQuery.error,
  };
}

// Fetch Wallet Transactions
export async function fetchWalletTransactions(): Promise<WalletTransaction[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase.from('wallet_transactions').select('*');
    if (error || !data) {
      return [];
    }
    return data as WalletTransaction[];
  } catch (err) {
    console.warn('Supabase fetch transactions error:', err);
    return [];
  }
}

export function useWalletTransactionsQuery() {
  return useQuery({
    queryKey: ['wallet_transactions'],
    queryFn: fetchWalletTransactions,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch Notifications
export async function fetchNotifications(): Promise<NotificationItem[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase.from('notifications').select('*');
    if (error || !data) {
      return [];
    }
    return data as NotificationItem[];
  } catch (err) {
    console.warn('Supabase fetch notifications error:', err);
    return [];
  }
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 2,
  });
}

// Fetch User Profile
export async function fetchUserProfile(): Promise<User | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error || !data) {
      return null;
    }
    return data as User;
  } catch (err) {
    console.warn('Supabase fetch profile error:', err);
    return null;
  }
}

export function useUserProfileQuery() {
  return useQuery({
    queryKey: ['user_profile'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch Dashboard Stats
export async function fetchDashboardStats() {
  if (!isSupabaseConfigured) {
    return {
      verifiedBusinesses: 0,
      productsAvailable: 0,
      hotelsSuites: 0,
      driversOnline: 0,
      communityMembers: 0,
      successfulDeliveries: 0,
      ariariaShops: 0,
      leatherArtisans: 0,
      fashionDesigners: 0,
      fabricationMakers: 0,
      verifiedHotels: 0,
      transportDrivers: 0,
    };
  }

  try {
    const [bizResult, prodResult, profileResult, postResult, transResult, hotelsResult, driversResult, ariariaResult, leatherResult, fashionResult, fabResult, ordersResult, tripsResult, shipmentsResult, topBizResult, recentOrdersResult] = await Promise.allSettled([
      supabase.from('businesses').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('community_posts').select('*', { count: 'exact', head: true }),
      supabase.from('wallet_transactions').select('*', { count: 'exact', head: true }),
      supabase.from('businesses').select('*', { count: 'exact', head: true }).or('category.ilike.%hotel%,category.ilike.%suite%,category.ilike.%hospitality%'),
      supabase.from('businesses').select('*', { count: 'exact', head: true }).or('category.ilike.%driver%,category.ilike.%transport%,category.ilike.%ride%'),
      supabase.from('businesses').select('*', { count: 'exact', head: true }).ilike('address', '%ariaria%'),
      supabase.from('businesses').select('*', { count: 'exact', head: true }).or('category.ilike.%leather%,category.ilike.%shoe%'),
      supabase.from('businesses').select('*', { count: 'exact', head: true }).or('category.ilike.%fashion%,category.ilike.%tailor%'),
      supabase.from('businesses').select('*', { count: 'exact', head: true }).or('category.ilike.%metal%,category.ilike.%fabrication%,category.ilike.%tool%'),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('trips').select('*', { count: 'exact', head: true }),
      supabase.from('shipments').select('*', { count: 'exact', head: true }),
      supabase.from('businesses').select('id, name, address, reviews_count, market_zone').order('reviews_count', { ascending: false }).limit(5),
      supabase.from('orders').select('id, buyer_name, seller_name, total, status, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    const getCount = (res: any) => {
      return res.status === 'fulfilled' ? (res.value as any).count || 0 : 0;
    };

    const getTopBiz = () => {
      return topBizResult.status === 'fulfilled' ? (topBizResult.value as any).data || [] : [];
    };

    const getRecentOrders = () => {
      return recentOrdersResult.status === 'fulfilled' ? (recentOrdersResult.value as any).data || [] : [];
    };

    return {
      verifiedBusinesses: getCount(bizResult),
      productsAvailable: getCount(prodResult),
      hotelsSuites: getCount(hotelsResult),
      driversOnline: getCount(driversResult),
      communityMembers: getCount(profileResult) + getCount(postResult),
      successfulDeliveries: getCount(transResult),
      ariariaShops: getCount(ariariaResult) || getCount(bizResult),
      leatherArtisans: getCount(leatherResult),
      fashionDesigners: getCount(fashionResult),
      fabricationMakers: getCount(fabResult),
      verifiedHotels: getCount(hotelsResult),
      transportDrivers: getCount(driversResult),
      totalOrders: getCount(ordersResult) || getCount(transResult),
      totalTrips: getCount(tripsResult) || getCount(driversResult),
      totalShipments: getCount(shipmentsResult) || getCount(fabResult),
      topBusinesses: getTopBiz(),
      recentOrders: getRecentOrders(),
    };
  } catch (err) {
    console.warn('Error fetching dashboard stats:', err);
    return {
      verifiedBusinesses: 0,
      productsAvailable: 0,
      hotelsSuites: 0,
      driversOnline: 0,
      communityMembers: 0,
      successfulDeliveries: 0,
      ariariaShops: 0,
      leatherArtisans: 0,
      fashionDesigners: 0,
      fabricationMakers: 0,
      verifiedHotels: 0,
      transportDrivers: 0,
    };
  }
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
}

// Helper for auto-healing Supabase errors (missing columns)
export async function healingInsert(table: string, record: any) {
  const { data, error } = await supabase.from(table).insert([record]).select().single();
  
  if (error && (
    error.code === '42703' || 
    error.message?.toLowerCase().includes('column') || 
    error.message?.toLowerCase().includes('not find') ||
    error.message?.toLowerCase().includes('not found') ||
    error.message?.toLowerCase().includes('does not exist')
  )) {
    const match = error.message.match(/column ["'](.+)["'] of relation/i) || 
                  error.message.match(/Could not find the ["'](.+)["'] column/i) ||
                  error.message.match(/column ["'](.+)["'] does not exist/i) ||
                  error.message.match(/column ["']?([^"'\s]+)["']? column/i); // More generic fallback
    
    if (match && match[1]) {
      const missingColumn = match[1].replace(/['"]/g, '').split('.').pop() || '';
      if (missingColumn && record[missingColumn] !== undefined) {
        console.warn(`[Supabase Healing] Omiting missing column "${missingColumn}" from table "${table}" and retrying insert.`);
        const sanitized = { ...record };
        delete sanitized[missingColumn];
        return healingInsert(table, sanitized);
      }
    }
  }
  return { data, error };
}

export async function healingUpsert(table: string, record: any, onConflict: string = 'id') {
  const { data, error } = await supabase.from(table).upsert([record], { onConflict }).select().single();
  
  if (error && (
    error.code === '42703' || 
    error.message?.toLowerCase().includes('column') || 
    error.message?.toLowerCase().includes('not find') ||
    error.message?.toLowerCase().includes('not found') ||
    error.message?.toLowerCase().includes('does not exist')
  )) {
    const match = error.message.match(/column ["'](.+)["'] of relation/i) || 
                  error.message.match(/Could not find the ["'](.+)["'] column/i) ||
                  error.message.match(/column ["'](.+)["'] does not exist/i) ||
                  error.message.match(/column ["']?([^"'\s]+)["']? column/i);
    
    if (match && match[1]) {
      const missingColumn = match[1].replace(/['"]/g, '').split('.').pop() || '';
      if (missingColumn && record[missingColumn] !== undefined) {
        console.warn(`[Supabase Healing] Omiting missing column "${missingColumn}" from table "${table}" and retrying upsert.`);
        const sanitized = { ...record };
        delete sanitized[missingColumn];
        return healingUpsert(table, sanitized, onConflict);
      }
    }
  }
  return { data, error };
}

export async function healingUpdate(table: string, id: string, updates: any) {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
  
  if (error && (
    error.code === '42703' || 
    error.message?.toLowerCase().includes('column') || 
    error.message?.toLowerCase().includes('not find') ||
    error.message?.toLowerCase().includes('not found') ||
    error.message?.toLowerCase().includes('does not exist')
  )) {
    const match = error.message.match(/column ["'](.+)["'] of relation/i) || 
                  error.message.match(/Could not find the ["'](.+)["'] column/i) ||
                  error.message.match(/column ["'](.+)["'] does not exist/i) ||
                  error.message.match(/column ["']?([^"'\s]+)["']? column/i);
    
    if (match && match[1]) {
      const missingColumn = match[1].replace(/['"]/g, '').split('.').pop() || '';
      if (missingColumn && updates[missingColumn] !== undefined) {
        console.warn(`[Supabase Healing] Omiting missing column "${missingColumn}" from table "${table}" and retrying update.`);
        const sanitized = { ...updates };
        delete sanitized[missingColumn];
        return healingUpdate(table, id, sanitized);
      }
    }
  }
  return { data, error };
}

// Create Business mutation
export async function createBusinessInSupabase(newBiz: Omit<Business, 'id' | 'rating' | 'reviews_count'>) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  
  // Try to find if a business with same name and owner already exists to handle duplicates gracefully
  const { data: existing } = await supabase
    .from('businesses')
    .select('id')
    .eq('name', newBiz.name)
    .eq('owner_id', newBiz.owner_id as string)
    .maybeSingle();

  if (existing) {
    console.log(`[Business Sync] Found existing business "${newBiz.name}" (ID: ${existing.id}), performing upsert.`);
    return healingUpsert('businesses', {
      id: existing.id,
      ...newBiz,
      updated_at: new Date().toISOString()
    });
  }

  return healingInsert('businesses', {
    ...newBiz,
    rating: 5.0,
    reviews_count: 0,
    created_at: new Date().toISOString()
  });
}

export async function updateBusiness(id: string, updates: Partial<Business>) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  return healingUpdate('businesses', id, updates);
}

// Create Community Post mutation
export async function createPostInSupabase(post: Omit<CommunityPost, 'id' | 'likes' | 'comments_count' | 'created_at'>) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  
  return healingInsert('community_posts', {
    ...post,
    likes: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
  });
}
// ============================================================
// ADD THESE FUNCTIONS TO src/services/supabaseService.ts
// Do not replace the whole file — paste these in alongside
// the existing exports (e.g. near createBusinessInSupabase).
// ============================================================

export interface EventTicketInput {
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
}

// Create a pending ticket record before payment
export async function createEventTicket(ticket: EventTicketInput) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('event_tickets')
    .insert([{
      ...ticket,
      user_id: user?.id || null,
    }])
    .select()
    .single();

  return { data, error };
}

// Optimistically mark a ticket as paid after the Paystack popup succeeds.
// The /api/paystack-webhook on the backend is the source of truth and will
// also update this record server-side once Paystack's webhook fires —
// this call just gives the user immediate feedback without waiting on that.
export async function markTicketPaid(ticketId: string, paymentReference: string) {
  if (!isSupabaseConfigured) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await supabase
    .from('event_tickets')
    .update({
      status: 'paid',
      payment_reference: paymentReference,
    })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) {
    console.warn('[EventTickets] Failed to mark ticket paid client-side (webhook will still confirm):', error.message);
  }

  return { data, error };
}

// Fetch a user's own tickets (for a "My Tickets" view, if needed later)
export async function fetchUserEventTickets(userId: string) {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('event_tickets')
      .select('*, events(name, date, venue, image_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn('Supabase fetch event tickets error:', err);
    return [];
  }
  }
        
