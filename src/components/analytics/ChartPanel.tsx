import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  type: 'area' | 'bar' | 'pie' | 'line';
  data: any[];
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  title,
  subtitle,
  type,
  data,
  dataKeys,
  colors = ['#0B7A3B', '#3B82F6', '#D4AF37', '#8B5CF6'],
  height = 350
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="mb-8">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>

      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                {dataKeys.map((key, i) => (
                  <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: '700'
                }} 
              />
              {dataKeys.map((key, i) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[i % colors.length]} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill={`url(#color${key})`} 
                />
              ))}
            </AreaChart>
          ) : type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8f8f8' }}
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: '700'
                }} 
              />
              {dataKeys.map((key, i) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={colors[i % colors.length]} 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              ))}
            </BarChart>
          ) : type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: '700'
                }} 
              />
            </PieChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: '700'
                }} 
              />
              {dataKeys.map((key, i) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[i % colors.length]} 
                  strokeWidth={4} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
