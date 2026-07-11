import React from 'react';
import { OrderStatus } from '../../types';
import { CheckCircle2, Circle, Truck, Package, Clock, ShieldCheck } from 'lucide-react';

interface OrderTimelineProps {
  status: OrderStatus;
}

const STEPS: OrderStatus[] = [
  'Pending',
  'Paid',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Completed'
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'Pending':
      case 'Awaiting Payment':
        return 0;
      case 'Paid':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      case 'Completed':
        return 6;
      case 'Cancelled':
      case 'Refunded':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  if (status === 'Cancelled' || status === 'Refunded') {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
        <span>This order was {status.toLowerCase()} and payment secured or refunded accordingly.</span>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((stepName, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stepName} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCompleted 
                    ? 'bg-[#0B7A3B] text-white shadow-md shadow-emerald-600/30' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[10px] font-semibold mt-2 text-center max-w-[70px] ${isCurrent ? 'text-[#0B7A3B] dark:text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
