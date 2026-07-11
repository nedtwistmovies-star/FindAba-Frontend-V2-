import React from 'react';
import { OrderStatus } from '../../types';
import { CheckCircle2, Clock, Truck, Package, AlertCircle, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Shipped':
      case 'Out for Delivery':
      case 'Processing':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Paid':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
      case 'Pending':
      case 'Awaiting Payment':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Cancelled':
      case 'Refunded':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Shipped':
      case 'Out for Delivery':
        return <Truck className="w-3.5 h-3.5" />;
      case 'Processing':
      case 'Paid':
        return <Package className="w-3.5 h-3.5" />;
      case 'Pending':
      case 'Awaiting Payment':
        return <Clock className="w-3.5 h-3.5" />;
      case 'Cancelled':
      case 'Refunded':
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle()}`}>
      {getIcon()}
      <span>{status}</span>
    </span>
  );
};
