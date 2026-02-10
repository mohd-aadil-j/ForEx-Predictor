
import React from 'react';
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { OHLCData } from '../types';

interface ForexChartProps {
  data: OHLCData[];
}

const QUOTEX_COLORS = {
  up: '#26a69a',
  down: '#ef5350',
  grid: '#2a2e39',
  bg: '#131722'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-[#1e222d] border border-[#363c4e] p-3 rounded shadow-2xl text-[10px] mono text-slate-300">
        <p className="text-slate-500 mb-2 border-b border-slate-800 pb-1">{label}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Open</span><span className="text-white text-right">{d.open.toFixed(5)}</span>
          <span>High</span><span className="text-[#26a69a] text-right">{d.high.toFixed(5)}</span>
          <span>Low</span><span className="text-[#ef5350] text-right">{d.low.toFixed(5)}</span>
          <span>Close</span><span className={`text-right font-bold ${d.close >= d.open ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>{d.close.toFixed(5)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const Candlestick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isUp = close >= open;
  const color = isUp ? QUOTEX_COLORS.up : QUOTEX_COLORS.down;
  const cx = x + width / 2;
  
  // High-Low wick
  const ratio = height / (high - low);
  const bodyTop = y + (high - Math.max(open, close)) * ratio;
  const bodyHeight = Math.max(1.5, Math.abs(open - close) * ratio);

  return (
    <g>
      <line x1={cx} y1={y} x2={cx} y2={y + height} stroke={color} strokeWidth={1} />
      <rect x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} />
    </g>
  );
};

const ForexChart: React.FC<ForexChartProps> = ({ data }) => {
  if (!data.length) return null;
  
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const padding = (maxPrice - minPrice) * 0.15;

  const chartData = data.map(d => ({ ...d, range: [d.low, d.high] }));

  return (
    <div className="w-full h-full min-h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={QUOTEX_COLORS.grid} strokeDasharray="0" vertical={true} horizontal={true} />
          <XAxis 
            dataKey="time" 
            stroke="#4b5563" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false}
            dy={10}
            interval={5}
          />
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]} 
            stroke="#4b5563" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false}
            orientation="right"
            tickFormatter={(val) => val.toFixed(5)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#363c4e', strokeWidth: 1 }} />
          
          {/* Simulation of Quotex "Current Price" Line */}
          <ReferenceLine y={data[data.length-1].close} stroke="#5d606b" strokeDasharray="3 3" label={{ position: 'right', value: data[data.length-1].close.toFixed(5), fill: '#fff', fontSize: 10, backgroundColor: '#2a2e39' }} />

          <Bar
            dataKey="range"
            isAnimationActive={false}
            shape={(props: any) => {
              const d = chartData[props.index];
              return <Candlestick {...props} open={d.open} close={d.close} high={d.high} low={d.low} />;
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForexChart;
