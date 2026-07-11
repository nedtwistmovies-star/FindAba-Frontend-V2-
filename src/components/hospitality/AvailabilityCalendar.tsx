import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info } from 'lucide-react';

interface AvailabilityCalendarProps {
  bookedDates: string[];
  maintenanceDates: string[];
  onDateSelect?: (date: string) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ 
  bookedDates, 
  maintenanceDates,
  onDateSelect 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);

    // Empty cells for days of previous month
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-full" />);
    }

    // Actual days of the month
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isBooked = bookedDates.includes(dateStr);
      const isMaintenance = maintenanceDates.includes(dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

      days.push(
        <div 
          key={i} 
          onClick={() => !isBooked && !isMaintenance && onDateSelect?.(dateStr)}
          className={`h-12 w-full flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer relative group
            ${isBooked ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-300 cursor-not-allowed' : 
              isMaintenance ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-300 cursor-not-allowed' : 
              'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'}
            ${isToday ? 'border-2 border-[#0B7A3B]' : ''}
          `}
        >
          <span className="text-xs font-bold">{i}</span>
          {isBooked && <div className="absolute bottom-1 w-1 h-1 bg-rose-500 rounded-full" />}
          {isMaintenance && <div className="absolute bottom-1 w-1 h-1 bg-amber-500 rounded-full" />}
          {!isBooked && !isMaintenance && <div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100" />}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-slate-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest py-2">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Maintenance</span>
        </div>
      </div>
    </div>
  );
};
