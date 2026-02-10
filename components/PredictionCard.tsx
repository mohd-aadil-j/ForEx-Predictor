
import React from 'react';
import { AIAnalysis, TrendDirection } from '../types';

interface PredictionCardProps {
  analysis: AIAnalysis | null;
  loading: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ analysis, loading }) => {
  const isUp = analysis?.direction === 'UP';
  const isDown = analysis?.direction === 'DOWN';

  if (loading) {
    return (
      <div className="bg-[#1c1f26] border border-[#2d3139] rounded-3xl p-8 h-full flex flex-col items-center justify-center space-y-6 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-500">AI</div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] animate-pulse">Running Neural Scan</p>
          <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Detecting High Prob. Entries</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-[#1c1f26] border border-[#2d3139] rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center opacity-40 group hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mb-4 border border-slate-800">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Awaiting Trigger...</p>
        <p className="text-[9px] text-slate-700 mt-2 uppercase font-black">25s Scan Window Active</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1c1f26] border border-[#2d3139] rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] rounded-full transition-colors duration-700 ${isUp ? 'bg-[#26a69a]/20' : isDown ? 'bg-[#ef5350]/20' : 'bg-slate-500/10'}`}></div>

      {/* Probability Display */}
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Signal Confidence</span>
          <div className="flex items-center gap-3">
             <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-1000 ${isUp ? 'bg-[#26a69a]' : isDown ? 'bg-[#ef5350]' : 'bg-slate-500'}`} 
                  style={{ width: `${analysis.nextCandleProbability}%` }}
                ></div>
             </div>
             <span className={`text-sm font-black font-mono ${isUp ? 'text-[#26a69a]' : isDown ? 'text-[#ef5350]' : 'text-slate-400'}`}>
               {analysis.nextCandleProbability}%
             </span>
          </div>
        </div>
        <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex flex-col items-center">
          <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Exp.</span>
          <span className="text-[10px] text-emerald-500 font-bold">{analysis.recommendedExpiration}</span>
        </div>
      </div>

      {/* High-Fidelity Execution Controls */}
      <div className="flex flex-col gap-4 relative z-10">
        {/* UP BUTTON */}
        <div className={`group relative transition-all duration-500 ${isUp ? 'scale-[1.03] translate-x-1' : 'opacity-30 grayscale'}`}>
          <div className={`absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${isUp ? 'bg-[#26a69a]' : 'bg-transparent'}`}></div>
          <button className="relative w-full bg-[#26a69a] hover:bg-[#2bbbad] text-white py-5 rounded-2xl flex items-center justify-between px-8 transition-all overflow-hidden shadow-[0_10px_30px_rgba(38,166,154,0.3)]">
            <div className="flex flex-col items-start relative z-10">
              <span className="text-sm font-black uppercase tracking-widest leading-none">Call / Up</span>
              <span className="text-[9px] font-bold opacity-60 uppercase mt-1 tracking-wider">Bullish Execution</span>
            </div>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md relative z-10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
              </svg>
            </div>
            {/* Shimmer effect */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer"></div>
          </button>
        </div>

        {/* DOWN BUTTON */}
        <div className={`group relative transition-all duration-500 ${isDown ? 'scale-[1.03] translate-x-1' : 'opacity-30 grayscale'}`}>
          <div className={`absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${isDown ? 'bg-[#ef5350]' : 'bg-transparent'}`}></div>
          <button className="relative w-full bg-[#ef5350] hover:bg-[#ff5252] text-white py-5 rounded-2xl flex items-center justify-between px-8 transition-all overflow-hidden shadow-[0_10px_30px_rgba(239,83,80,0.3)]">
            <div className="flex flex-col items-start relative z-10">
              <span className="text-sm font-black uppercase tracking-widest leading-none">Put / Down</span>
              <span className="text-[9px] font-bold opacity-60 uppercase mt-1 tracking-wider">Bearish Execution</span>
            </div>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md relative z-10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Shimmer effect */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer"></div>
          </button>
        </div>
      </div>

      {/* Pattern Analysis Metadata */}
      <div className="bg-[#131722]/80 border border-[#2d3139] rounded-2xl p-5 space-y-4 relative z-10">
        <div className="flex justify-between items-center pb-3 border-b border-[#2a2e39]">
          <div>
            <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1">AI Logic Node</p>
            <p className="text-xs text-white font-black uppercase tracking-tighter">{analysis.pattern}</p>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1">Volatility</p>
            <p className="text-[10px] text-blue-400 font-black">MODERATE</p>
          </div>
        </div>
        
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic border-l-2 border-emerald-500/30 pl-4">
          "{analysis.explanation}"
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <p className="text-[7px] text-slate-600 uppercase font-black mb-1">Support Zone</p>
            <p className="text-white font-mono text-[10px] font-bold">{analysis.keyLevels.support.toFixed(5)}</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <p className="text-[7px] text-slate-600 uppercase font-black mb-1">Resist Zone</p>
            <p className="text-white font-mono text-[10px] font-bold">{analysis.keyLevels.resistance.toFixed(5)}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PredictionCard;
