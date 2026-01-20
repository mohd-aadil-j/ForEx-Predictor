
import React from 'react';
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Cell,
  CartesianGrid,
} from 'recharts';
import { OHLCData } from '../types';

interface ForexChartProps {
  data: OHLCData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-2xl text-xs mono">
        <p className="text-slate-400 mb-2 border-b border-slate-800 pb-1">{label}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-slate-500 uppercase text-[10px]">Open</span>
          <span className="text-white text-right font-bold">{d.open.toFixed(5)}</span>
          <span className="text-slate-500 uppercase text-[10px]">High</span>
          <span className="text-emerald-400 text-right font-bold">{d.high.toFixed(5)}</span>
          <span className="text-slate-500 uppercase text-[10px]">Low</span>
          <span className="text-rose-400 text-right font-bold">{d.low.toFixed(5)}</span>
          <span className="text-slate-500 uppercase text-[10px]">Close</span>
          <span className={`text-right font-bold ${d.close >= d.open ? 'text-emerald-500' : 'text-rose-500'}`}>{d.close.toFixed(5)}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom shape for the Candlestick
const Candlestick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isUp = close >= open;
  const color = isUp ? '#10b981' : '#f43f5e';
  
  // High-Low wick
  const cx = x + width / 2;
  
  return (
    <g>
      {/* Wick */}
      <line
        x1={cx}
        y1={y}
        x2={cx}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      {/* Actual Body - we need to calculate where open/close are relative to high/low */}
      {/* In Recharts Bar, 'y' is the top of the bar and 'height' is the height */}
      {/* This simple implementation relies on the Bar dataKey mapping to body */}
      <rect
        x={x}
        y={y + (high - Math.max(open, close)) * (height / (high - low))}
        width={width}
        height={Math.max(1, Math.abs(open - close) * (height / (high - low)))}
        fill={color}
      />
    </g>
  );
};

const ForexChart: React.FC<ForexChartProps> = ({ data }) => {
  const minPrice = Math.min(...data.map(d => d.low)) * 0.9995;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.0005;

  // For Recharts Bar to work as a candlestick wick, we map it to High-Low range
  const chartData = data.map(d => ({
    ...d,
    range: [d.low, d.high], // This defines the full vertical span of the "bar"
  }));

  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.5} />
          <XAxis 
            dataKey="time" 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            orientation="right"
            tickFormatter={(val) => val.toFixed(4)}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          
          <Bar
            dataKey="range"
            isAnimationActive={false}
            shape={(props: any) => {
              const d = chartData[props.index];
              return (
                <Candlestick 
                  {...props} 
                  open={d.open} 
                  close={d.close} 
                  high={d.high} 
                  low={d.low} 
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForexChart;
