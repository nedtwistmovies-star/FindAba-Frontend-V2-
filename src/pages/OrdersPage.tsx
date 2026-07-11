import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Clock, 
  XCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { OrderStatusBadge } from '../components/marketplace/OrderStatusBadge';
import { OrderTimeline } from '../components/marketplace/OrderTimeline';
import { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const { orders, confirmDelivery, disputeOrder } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some(i => i.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ord.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDisputeSubmit = async () => {
    if (!selectedOrder || !disputeReason) return;
    await disputeOrder(selectedOrder.id, disputeReason);
    setDisputeModalOpen(false);
    setDisputeReason('');
    setSelectedOrder(null);
    alert('Dispute submitted. Payment frozen in FindAba Escrow. Admin and seller notified.');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Buyer Dashboard & Orders</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Track shipments, manage escrow payments, and download official invoices.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search orders, invoices, products..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-[#0B7A3B] text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No orders found</h3>
            <p className="text-xs text-zinc-500 mt-1">Orders placed in the marketplace will appear here.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-[#0B7A3B]/50 transition-all space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white">{order.order_number}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    Seller: <strong className="text-zinc-700 dark:text-zinc-300">{order.seller_name}</strong> • Placed on {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Track & Escrow</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <img src={item.product_image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1">{item.product_name}</h5>
                      <span className="text-xs text-zinc-500">Qty: {item.quantity}</span>
                      <span className="text-xs font-black text-[#0B7A3B] block">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info & Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>Payment: <strong className="capitalize text-zinc-700 dark:text-zinc-300">{order.payment_method}</strong></span>
                  <span>Escrow: <strong className="capitalize text-emerald-600 dark:text-emerald-400">{order.escrow_status}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">Total:</span>
                  <span className="text-lg font-black text-[#0B7A3B] dark:text-emerald-400">₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Tracking & Escrow Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#0B7A3B]">{selectedOrder.order_number}</span>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white">Order Tracking & Escrow</h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Animated Fulfillment Timeline</h4>
              <OrderTimeline status={selectedOrder.status} />
            </div>

            {/* Delivery Info */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#0B7A3B]" /> Delivery & Logistics Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Tracking Number</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">{selectedOrder.tracking.tracking_number}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Delivery Company</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{selectedOrder.tracking.delivery_company}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Driver Name & Phone</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{selectedOrder.tracking.driver_name} ({selectedOrder.tracking.driver_phone})</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Estimated Arrival</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedOrder.tracking.estimated_arrival}</span>
                </div>
              </div>
            </div>

            {/* FindAba Secure Escrow State */}
            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B7A3B] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> FindAba Secure Escrow Protection
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[11px] uppercase">
                  {selectedOrder.escrow_status}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Funds are protected in escrow. Inspect your items upon delivery and click "Confirm Delivery & Release Funds" to complete the transaction.
              </p>

              {selectedOrder.escrow_status === 'held' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={async () => {
                      await confirmDelivery(selectedOrder.id);
                      setSelectedOrder(null);
                      alert('Delivery confirmed! Funds successfully released from escrow to seller wallet.');
                    }}
                    className="flex-1 py-2.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm Delivery & Release Funds
                  </button>
                  <button
                    onClick={() => setDisputeModalOpen(true)}
                    className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-xs transition-colors"
                  >
                    Raise Dispute
                  </button>
                </div>
              )}
            </div>

            {/* Invoice Download */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0B7A3B]" /> Official Tax & Escrow Invoice ({selectedOrder.invoice_number})
                </h5>
                <span className="text-[11px] text-zinc-500">Generated automatically by FindAba OS V2</span>
              </div>
              <button
                onClick={() => alert(`Downloading official PDF invoice ${selectedOrder.invoice_number}...`)}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:opacity-90"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">Raise Escrow Dispute</h3>
            <p className="text-xs text-zinc-500">
              Provide the reason for your dispute. FindAba Admin will freeze escrow funds immediately and investigate.
            </p>
            <textarea
              rows={4}
              value={disputeReason || ''}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Describe the issue (e.g., incorrect item, damaged product, missing package)..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg"
              >
                Submit Dispute & Freeze Escrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
