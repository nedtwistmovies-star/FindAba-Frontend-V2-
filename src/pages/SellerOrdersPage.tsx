import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Download, 
  Search, 
  Store,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { OrderStatusBadge } from '../components/marketplace/OrderStatusBadge';

export const SellerOrdersPage: React.FC = () => {
  const { orders, confirmShipment } = useOrderStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders for seller
  const sellerOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some(i => i.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || ord.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.filter(o => o.status === 'Completed' || o.escrow_status === 'released').reduce((s, o) => s + o.total, 0);
  const escrowPending = orders.filter(o => o.escrow_status === 'held').reduce((s, o) => s + o.total, 0);
  const incomingCount = orders.filter(o => o.status === 'Paid' || o.status === 'Processing').length;

  const handleExportCSV = () => {
    const headers = 'Order Number,Invoice,Buyer,Total,Status,Escrow,Date\n';
    const rows = orders.map(o => `"${o.order_number}","${o.invoice_number}","${o.buyer_name}",${o.total},"${o.status}","${o.escrow_status}","${o.created_at}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FindAba_Seller_Orders_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0B7A3B]/10 text-[#0B7A3B] text-xs font-bold">
              Merchant & Artisan Portal
            </span>
            <span className="text-xs text-zinc-400 font-semibold">• Ariaria Zone A</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Seller Orders & Revenue Dashboard</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage incoming orders, process shipments, and track escrow settlements.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <Download className="w-4 h-4" /> Export Orders (CSV)
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#0B7A3B] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">₦{totalRevenue.toLocaleString()}</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 18% increase this month
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Escrow Held (Pending Delivery)</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">₦{escrowPending.toLocaleString()}</h3>
          <p className="text-xs text-zinc-500 mt-2">Releases upon buyer confirmation</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Incoming Orders to Ship</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{incomingCount}</h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-semibold">Requires dispatch</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {['all', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-[#0B7A3B] text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search buyer or order..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
          />
        </div>
      </div>

      {/* Orders Table / List */}
      <div className="space-y-4">
        {sellerOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No incoming orders found</h3>
            <p className="text-xs text-zinc-500 mt-1">Orders from buyers will appear here in real-time.</p>
          </div>
        ) : (
          sellerOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-emerald-500/50 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white">{order.order_number}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    Buyer: <strong className="text-zinc-700 dark:text-zinc-300">{order.buyer_name}</strong> ({order.delivery_address.phone}) • {order.delivery_address.address}, {order.delivery_address.lga}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {order.status === 'Paid' || order.status === 'Processing' ? (
                    <button
                      onClick={async () => {
                        await confirmShipment(order.id);
                        alert(`Order ${order.order_number} marked as Shipped! Logistics driver notified.`);
                      }}
                      className="px-4 py-2.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Truck className="w-4 h-4" /> Confirm Shipment & Dispatch
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Dispatched
                    </span>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <img src={item.product_image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1">{item.product_name}</h5>
                      <span className="text-xs text-zinc-500">Qty: {item.quantity} • ₦{item.price.toLocaleString()} each</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="text-zinc-500">Escrow Status: <strong className="text-emerald-600 capitalize">{order.escrow_status}</strong></span>
                <span className="font-black text-sm text-[#0B7A3B] dark:text-emerald-400">Total Payout: ₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
