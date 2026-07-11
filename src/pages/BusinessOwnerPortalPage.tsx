import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  ClipboardList, 
  Wallet, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Business, Product, WalletTransaction, MessageThread, Order } from '../types';
import { updateBusiness } from '../services/supabaseService';
import { BusinessSidebar } from '../components/business/BusinessSidebar';
import { BusinessHeader } from '../components/business/BusinessHeader';
import { ImageUploader } from '../components/business/ImageUploader';
import { BusinessAnalyticsView } from '../components/analytics/BusinessAnalyticsView';
import { CityImage } from '../components/common/CityImage';

export const BusinessOwnerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Business state
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [messages, setMessages] = useState<MessageThread[]>([]);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'Footwear',
    price: 15000,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
    in_stock: true,
    made_in_aba: true,
  });

  useEffect(() => {
    fetchOwnerData();
  }, [user]);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      // Fetch business owned by user
      const ownerId = user?.id || '';
      let { data: bizData } = await supabase.from('businesses').select('*').eq('owner_id', ownerId).limit(1).single();
      
      if (!bizData) {
        // Fallback to first business if none found linked specifically (for demo/admin purposes)
        const { data: allBiz } = await supabase.from('businesses').select('*').limit(1);
        bizData = allBiz?.[0] || null;
      }

      if (bizData) {
        setBusiness(bizData as Business);
        
        // Parallel fetch for products and orders to get real stats
        const [prodResult, orderResult] = await Promise.all([
          supabase.from('products').select('*').eq('business_id', bizData.id),
          supabase.from('orders').select('*').eq('seller_id', bizData.id)
        ]);

        if (prodResult.data) {
          setProducts(prodResult.data as Product[]);
        }

        if (orderResult.data) {
          const bizOrders = orderResult.data as Order[];
          setOrders(bizOrders);
          
          // Calculate revenue from completed orders
          // setTransactions(...) 
        }
      }
    } catch (err) {
      console.warn('Error fetching owner portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real-time stats from fetched data
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status === 'Completed' || o.status === 'Paid').reduce((sum, o) => sum + o.total, 0),
    storeViews: 0 // Placeholder until analytics table is ready
  };

  const handleSaveBusinessProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSupabaseConfigured) {
        const { error } = await updateBusiness(business.id, {
          name: business.name,
          description: business.description,
          address: business.address,
          phone: business.phone,
          whatsapp: business.whatsapp,
          image_url: business.image_url,
          market_zone: business.market_zone,
          opening_hours: business.opening_hours,
          website: business.website,
        });

        if (error) throw error;
      }
      setSuccessMsg('Business profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update business profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    setErrorMsg('');

    try {
      if (editingProduct) {
        if (isSupabaseConfigured) {
          await supabase.from('products').update(prodForm).eq('id', editingProduct.id);
        }
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...prodForm } : p));
      } else {
        const newProd: Product = {
          id: `p_${Date.now()}`,
          business_id: business.id,
          ...prodForm,
        };
        if (isSupabaseConfigured) {
          await supabase.from('products').insert([newProd]);
        }
        setProducts([newProd, ...products]);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setSuccessMsg('Product saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      if (isSupabaseConfigured) {
        await supabase.from('products').delete().eq('id', id);
      }
      setProducts(products.filter(p => p.id !== id));
      setSuccessMsg('Product deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <BusinessHeader
        businessName={business?.name || 'My Business Portal'}
        category={business?.category || 'Merchant'}
        verified={business?.verified || false}
      />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <BusinessSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenRegister={() => navigate('/register-business')}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Business Command Center</h2>
                  <p className="text-xs text-zinc-400">Live operational stats for {business?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdForm({ name: '', category: 'Footwear', price: 15000, description: '', image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', in_stock: true, made_in_aba: true });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-semibold uppercase">Total Products</span>
                    <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-extrabold">{stats.totalProducts}</div>
                  <p className="text-[10px] text-emerald-400 mt-1">Active in catalog</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-semibold uppercase">Store Views</span>
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-extrabold">{stats.storeViews.toLocaleString()}</div>
                  <p className="text-[10px] text-blue-400 mt-1">Live traffic monitor</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-semibold uppercase">Customer Orders</span>
                    <ClipboardList className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-extrabold">{stats.totalOrders}</div>
                  <p className="text-[10px] text-amber-400 mt-1">Escrow secured</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-semibold uppercase">Revenue (₦)</span>
                    <DollarSign className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-extrabold">₦{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-[10px] text-purple-400 mt-1">Direct payout</p>
                </div>
              </div>

              {/* Recent Products Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-base font-bold mb-4">Inventory Overview</h3>
                {products.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-8">No products found. Add your first product.</p>
                ) : (
                  <div className="divide-y divide-zinc-800">
                    {products.slice(0, 5).map(p => (
                      <div key={p.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CityImage src={p.image_url} alt="" fallback="product" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-sm text-white">{p.name}</h4>
                            <p className="text-xs text-zinc-400">₦{p.price.toLocaleString()} • {p.category}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${p.in_stock ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {p.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. BUSINESS PROFILE TAB */}
          {activeTab === 'profile' && business && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Business Profile Settings</h2>
                <p className="text-xs text-zinc-400">Update your store branding, address, and contact details</p>
              </div>

              <form onSubmit={handleSaveBusinessProfile} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Business Name</label>
                    <input
                      type="text"
                      value={business.name || ''}
                      onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={business.description || ''}
                      onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={business.phone || ''}
                      onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">WhatsApp</label>
                    <input
                      type="text"
                      value={business.whatsapp || ''}
                      onChange={(e) => setBusiness({ ...business, whatsapp: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Address / Market Zone</label>
                    <input
                      type="text"
                      value={business.address || ''}
                      onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Category</label>
                    <input
                      type="text"
                      value={business.category || ''}
                      onChange={(e) => setBusiness({ ...business, category: e.target.value as any })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Website</label>
                    <input
                      type="text"
                      value={business.website || ''}
                      onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Opening Hours</label>
                    <input
                      type="text"
                      value={typeof business.opening_hours === 'object' && business.opening_hours !== null ? (business.opening_hours as any).schedule || '' : (typeof business.opening_hours === 'string' ? business.opening_hours : '')}
                      onChange={(e) => setBusiness({ ...business, opening_hours: { schedule: e.target.value } as any })}
                      placeholder="e.g. Mon-Sat 8am-6pm"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUploader
                      value={business.image_url}
                      onChange={(url) => setBusiness({ ...business, image_url: url })}
                      label="Store Logo / Front Image"
                      aspectSquare={false}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-all"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. PRODUCTS TAB (CRUD) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Product Catalog Management</h2>
                  <p className="text-xs text-zinc-400">Add, edit or remove products synced with Supabase</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdForm({ name: '', category: 'Footwear', price: 15000, description: '', image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', in_stock: true, made_in_aba: true });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 bg-zinc-950">
                        <CityImage src={p.image_url} alt="" fallback="product" className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                          {p.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-white text-base truncate">{p.name}</h3>
                          <span className="text-emerald-400 font-extrabold text-sm">₦{p.price.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2">{p.description}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-zinc-800 mt-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.in_stock ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {p.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProdForm({ name: p.name, category: p.category, price: p.price, description: p.description, image_url: p.image_url, in_stock: p.in_stock, made_in_aba: p.made_in_aba });
                            setIsProductModalOpen(true);
                          }}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Customer Orders & Escrow</h2>
              <p className="text-xs text-zinc-400">Track active orders and fulfillment status</p>
              
              {orders.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-400">
                  <ClipboardList className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">No pending orders</h3>
                  <p className="text-xs">Orders placed by customers will appear here in real time.</p>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-800/50 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                        <th className="px-6 py-4">Order #</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-white">{order.order_number}</td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-white">{order.buyer_name}</div>
                            <div className="text-[10px] text-zinc-500">{order.buyer_email}</div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-emerald-400">₦{order.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                              order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-blue-500/10 text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] text-zinc-400 font-medium">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 5. WALLET TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Business Wallet & Payouts</h2>
              <div className="bg-gradient-to-r from-emerald-900/60 to-zinc-900 border border-emerald-800/50 rounded-3xl p-8">
                <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold block mb-1">Available Balance (Settled)</span>
                <div className="text-4xl font-extrabold text-white mb-4">₦{stats.totalRevenue.toLocaleString()}.00</div>
                <button className="px-6 py-3 bg-[#D4AF37] hover:bg-[#F4D35E] text-zinc-950 font-bold text-xs rounded-xl shadow transition-colors">
                  Withdraw to Bank Account
                </button>
              </div>
            </div>
          )}

          {/* 6. ANALYTICS TAB */}
          {activeTab === 'analytics' && <BusinessAnalyticsView />}

          {/* 7. MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Customer Messages</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-400">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Inbox is active</h3>
                <p className="text-xs">Direct inquiries from buyers will appear here.</p>
              </div>
            </div>
          )}

          {/* 8. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Business Settings</h2>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-500" /> Public Profile Info
                </h3>
                
                <form onSubmit={handleSaveBusinessProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Business Name</label>
                      <input 
                        type="text" 
                        value={business?.name || ''} 
                        onChange={(e) => setBusiness(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Description</label>
                      <textarea 
                        rows={3}
                        value={business?.description || ''} 
                        onChange={(e) => setBusiness(prev => prev ? { ...prev, description: e.target.value } : null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Address</label>
                      <input 
                        type="text" 
                        value={business?.address || ''} 
                        onChange={(e) => setBusiness(prev => prev ? { ...prev, address: e.target.value } : null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Market Zone</label>
                      <input 
                        type="text" 
                        value={business?.market_zone || ''} 
                        onChange={(e) => setBusiness(prev => prev ? { ...prev, market_zone: e.target.value } : null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Phone</label>
                      <input 
                        type="text" 
                        value={business?.phone || ''} 
                        onChange={(e) => setBusiness(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">WhatsApp</label>
                      <input 
                        type="text" 
                        value={business?.whatsapp || ''} 
                        onChange={(e) => setBusiness(prev => prev ? { ...prev, whatsapp: e.target.value } : null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end">
                    <button 
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" /> Platform Settings
                </h3>
                
                <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                  <div>
                    <h4 className="font-bold text-sm text-white">Store Visibility</h4>
                    <p className="text-xs text-zinc-400">Show business in FindAba Discover & Marketplace directory</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-rose-400">Delete Business Listing</h4>
                    <p className="text-xs text-zinc-400">Permanently remove business from FindAba OS</p>
                  </div>
                  <button onClick={() => alert('Please contact FindAba OS Administrator to delete business listing.')} className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <h3 className="text-lg font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Product Name</label>
                <input
                  type="text"
                  value={prodForm.name || ''}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  required
                  placeholder="e.g. Handmade Leather Loafers"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={prodForm.price || 0}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Category</label>
                  <input
                    type="text"
                    value={prodForm.category || ''}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description || ''}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <ImageUploader
                value={prodForm.image_url}
                onChange={(url) => setProdForm({ ...prodForm, image_url: url })}
                label="Product Image"
                aspectSquare={true}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
