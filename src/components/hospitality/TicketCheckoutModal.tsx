import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Loader2 } from 'lucide-react';
import { EventListing } from '../../types';
import { createEventTicket, markTicketPaid } from '../../services/supabaseService';
import { useUserProfileQuery } from '../../services/supabaseService';

interface TicketCheckoutModalProps {
  event: EventListing;
  isOpen: boolean;
  onClose: () => void;
}

// Paystack inline script types (loaded via index.html or dynamically)
declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export const TicketCheckoutModal: React.FC<TicketCheckoutModalProps> = ({ event, isOpen, onClose }) => {
  const { data: profile } = useUserProfileQuery();

  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState(profile?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(profile?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(profile?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalAmount = event.ticket_price * quantity;

  const loadPaystackScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack'));
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setError(null);

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError('Payment is not configured. Please contact support.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create a pending ticket record
      const { data: ticket, error: ticketError } = await createEventTicket({
        event_id: event.id,
        buyer_name: buyerName.trim(),
        buyer_email: buyerEmail.trim(),
        buyer_phone: buyerPhone.trim(),
        quantity,
        unit_price: event.ticket_price,
        total_amount: totalAmount,
        status: 'pending',
      });

      if (ticketError || !ticket) {
        throw new Error(ticketError?.message || 'Could not create ticket record.');
      }

      // 2. Load Paystack and open the payment popup
      await loadPaystackScript();

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: buyerEmail.trim(),
        amount: Math.round(totalAmount * 100), // Paystack expects kobo
        currency: 'NGN',
        ref: `TICKET-${ticket.id}-${Date.now()}`,
        metadata: {
          event_ticket_id: ticket.id,
          event_id: event.id,
          event_name: event.name,
          buyer_name: buyerName.trim(),
          quantity,
        },
        callback: (response: { reference: string }) => {
          // Payment succeeded client-side; webhook will confirm server-side.
          // We optimistically mark it here too for immediate UI feedback.
          markTicketPaid(ticket.id, response.reference).finally(() => {
            setIsProcessing(false);
            setSuccess(true);
          });
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      console.error('[TicketCheckout] Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setSuccess(false);
    setError(null);
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white dark:bg-zinc-900 w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-[#0B7A3B]/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🎟️</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">You're in!</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Your ticket{quantity > 1 ? 's' : ''} for {event.name} {quantity > 1 ? 'are' : 'is'} confirmed.
                  A receipt has been sent to {buyerEmail}.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-4 bg-[#0B7A3B] text-white font-black rounded-2xl mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0B7A3B]">
                    Get Tickets
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
                    {event.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{event.venue}</p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quantity</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        ₦{event.ticket_price.toLocaleString()} <span className="text-xs font-medium text-slate-400">each</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center active:scale-95 transition-transform"
                        disabled={isProcessing}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-black">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center active:scale-95 transition-transform"
                        disabled={isProcessing}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-[#0B7A3B] rounded-2xl text-sm font-bold outline-none transition-all disabled:opacity-50"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-[#0B7A3B] rounded-2xl text-sm font-bold outline-none transition-all disabled:opacity-50"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-[#0B7A3B] rounded-2xl text-sm font-bold outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {error && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <span className="text-sm font-bold text-slate-500">Total</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full py-5 bg-[#0B7A3B] text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      `Pay ₦${totalAmount.toLocaleString()}`
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
