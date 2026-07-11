import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  CreditCard, 
  Lock, 
  Check, 
  ShoppingBag,
  Building2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useOrderStore } from '../store/useOrderStore';
import { useStore } from '../store/useStore';
import { DeliveryAddress, DeliveryMethod, PaymentMethod, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, createOrder } = useOrderStore();
  const { walletBalance, addTransaction, user } = useStore();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Form states
  const [addressData, setAddressData] = useState<DeliveryAddress>({
    receiver_name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    state: 'Abia',
    lga: 'Aba South'
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('local');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('escrow');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'express' ? 3500 : 1500;
  const serviceCharge = 500;
  const total = subtotal + deliveryFee + serviceCharge;

  const config = {
    reference: `FOS-PAY-${Date.now()}`,
    email: user?.email || 'customer@findaba.os',
    amount: total * 100, // Amount is in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePayment = usePaystackPayment(config);

  const handleNext = () => {
    if (step === 1) {
      if (!addressData.receiver_name || !addressData.phone || !addressData.address) {
        alert('Please fill in all delivery address fields.');
        return;
      }
    }
    setStep(prev => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    if (step === 1) {
      navigate('/marketplace');
      return;
    }
    setStep(prev => Math.max(1, prev - 1));
  };

  const processOrder = async (payRef?: string) => {
    setLoading(true);
    try {
      // If Paystack was used, verify on server first
      if (payRef) {
        const verifyRes = await fetch(`/api/paystack/verify/${payRef}`);
        const verifyData = await verifyRes.json();
        
        if (!verifyData.status || verifyData.data.status !== 'success') {
          alert('Payment verification failed. Please contact support.');
          setLoading(false);
          return;
        }
      }

      const newOrder = await createOrder({
        items: cart,
        deliveryAddress: addressData,
        deliveryMethod,
        paymentMethod,
        buyerId: user?.id || 'usr_demo1',
        buyerName: addressData.receiver_name,
        buyerEmail: user?.email || 'customer@findaba.os'
      });

      if (newOrder) {
        if (paymentMethod === 'wallet') {
          await addTransaction({
            id: `tx_${Date.now()}`,
            type: 'debit',
            title: `Order Payment (${newOrder.order_number})`,
            amount: total,
            status: 'completed',
            date: new Date().toISOString(),
            reference: newOrder.invoice_number
          });
        }
        setSuccessOrder(newOrder);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = () => {
    if (paymentMethod === 'wallet' && walletBalance < total) {
      alert('Insufficient FindAba Wallet balance. Please fund your wallet or choose Paystack/Escrow.');
      return;
    }

    if (paymentMethod === 'paystack' || paymentMethod === 'escrow') {
      initializePayment({
        onSuccess: (response: any) => {
          // Verify payment on backend
          processOrder(response.reference);
        },
        onClose: () => {
          alert('Payment cancelled.');
        }
      });
    } else {
      processOrder();
    }
  };

  if (successOrder) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#0B7A3B] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold">
              {successOrder.payment_method === 'escrow' ? 'FindAba Secure Escrow Active' : 'Order Placed Successfully'}
            </span>
            <h1 className="text-2xl font-black mt-2">Thank you for your order!</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Your payment is securely held in escrow until you confirm delivery of your items from <strong className="text-white">{successOrder.seller_name}</strong>.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Order Number:</span>
              <span className="font-bold text-white font-mono">{successOrder.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Invoice Reference:</span>
              <span className="font-bold text-white font-mono">{successOrder.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Total Paid:</span>
              <span className="font-bold text-[#0B7A3B] dark:text-emerald-400">₦{successOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 py-3 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg transition-all"
            >
              View Orders & Track
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold text-xs transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <ShoppingBag className="w-16 h-16 text-zinc-400" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-500">Add products to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-6 py-3 bg-[#0B7A3B] text-white rounded-xl text-xs font-bold shadow-lg"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Back to Marketplace' : 'Back'}
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0B7A3B]" />
          <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">FindAba Secure Checkout</span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: 'Address', icon: MapPin },
          { num: 2, label: 'Delivery', icon: Truck },
          { num: 3, label: 'Payment', icon: CreditCard },
          { num: 4, label: 'Review', icon: CheckCircle2 }
        ].map((s) => {
          const Icon = s.icon;
          const active = step === s.num;
          const completed = step > s.num;
          return (
            <div 
              key={s.num}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                active 
                  ? 'bg-[#0B7A3B]/10 border-[#0B7A3B] text-[#0B7A3B] dark:text-emerald-400' 
                  : completed 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-bold">{s.num}. {s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step Contents */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Step 1: Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Receiver Full Name</label>
                <input
                  type="text"
                  value={addressData.receiver_name || ''}
                  onChange={(e) => setAddressData({ ...addressData, receiver_name: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={addressData.phone || ''}
                  onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 mb-1">Street Address</label>
                <input
                  type="text"
                  value={addressData.address || ''}
                  onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">State</label>
                <input
                  type="text"
                  value={addressData.state || ''}
                  disabled
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">LGA (Local Government)</label>
                <select
                  value={addressData.lga || ''}
                  onChange={(e) => setAddressData({ ...addressData, lga: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                >
                  <option value="Aba South">Aba South (Ariaria zone)</option>
                  <option value="Aba North">Aba North (Ekeoha zone)</option>
                  <option value="Osisioma">Osisioma Ngwa</option>
                  <option value="Umuahia">Umuahia Capital</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Step 2: Choose Delivery Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'local', title: 'Local Delivery (Aba Metro)', price: '₦1,500', desc: 'Delivered directly to your door within Aba in 24 hours.' },
                { id: 'express', title: 'Express Dispatch', price: '₦3,500', desc: 'Priority rider delivery within 6 hours.' },
                { id: 'interstate', title: 'Interstate Transport', price: '₦2,500', desc: 'Secure transport via luxury bus / park dispatch to your state.' },
                { id: 'pickup', title: 'Store Pickup (Ariaria / Ekeoha)', price: 'Free', desc: 'Pick up directly from the verified artisan workshop.' }
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setDeliveryMethod(m.id as DeliveryMethod)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === m.id
                      ? 'bg-[#0B7A3B]/10 border-[#0B7A3B]'
                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{m.title}</h4>
                    <span className="font-black text-[#0B7A3B]">{m.price}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Step 3: Payment & Escrow Protection</h2>
            <div className="space-y-4">
              {[
                { 
                  id: 'escrow', 
                  title: 'FindAba Secure Escrow (Recommended)', 
                  desc: 'Funds are safely held by FindAba OS. Seller ships your items. You inspect and confirm delivery before payment is released.' 
                },
                { 
                  id: 'wallet', 
                  title: `FindAba City Wallet (Balance: ₦${walletBalance.toLocaleString()})`, 
                  desc: 'Instant deduction from your verified City OS wallet.' 
                },
                { 
                  id: 'paystack', 
                  title: 'Paystack (Card / USSD / Bank Transfer)', 
                  desc: 'Secure payment via Visa, Mastercard, or Bank Transfer.' 
                },
                { 
                  id: 'transfer', 
                  title: 'Direct Bank Transfer', 
                  desc: 'Transfer directly to FindAba Merchant Escrow Settlement account.' 
                }
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === p.id
                      ? 'bg-[#0B7A3B]/10 border-[#0B7A3B]'
                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#0B7A3B]" /> {p.title}
                    </h4>
                    {paymentMethod === p.id && <Check className="w-5 h-5 text-[#0B7A3B]" />}
                  </div>
                  <p className="text-xs text-zinc-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Step 4: Review Your Order</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <h4 className="font-bold text-xs uppercase text-zinc-400">Delivery Address</h4>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">{addressData.receiver_name} ({addressData.phone})</p>
                <p className="text-xs text-zinc-500">{addressData.address}, {addressData.lga}, {addressData.state}</p>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="font-bold text-xs uppercase text-zinc-400">Items ({cart.reduce((s, i) => s + i.quantity, 0)})</h4>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-white">{item.product.name}</span>
                        <span className="text-zinc-400 block">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-black text-[#0B7A3B]">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Service Charge</span>
                  <span>₦{serviceCharge.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-emerald-500/20 flex justify-between font-black text-sm text-zinc-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-[#0B7A3B] dark:text-emerald-400 text-base">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-800 mt-8">
          <button
            onClick={handlePrev}
            className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-bold text-xs transition-colors"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="px-8 py-3 bg-[#0B7A3B] hover:bg-[#169C4A] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Pay ₦{total.toLocaleString()}</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
