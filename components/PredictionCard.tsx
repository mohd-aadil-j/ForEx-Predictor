
import React from 'react';
import { AIAnalysis, TrendDirection } from '../types';

interface PredictionCardProps {
  analysis: AIAnalysis | null;
  loading: boolean;
}

const DirectionBadge = ({ direction }: { direction: TrendDirection }) => {
  const styles = {
    UP: 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    DOWN: 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    WAIT: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const labels = {
    UP: 'CALL / HIGHER',
    DOWN: 'PUT / LOWER',
    WAIT: 'NO SIGNAL',
  };

  const icons = {
    UP: '▲',
    DOWN: '▼',
    WAIT: '⊘',
  };

  return (
    <div className={`px-6 py-3 rounded-xl border-2 text-base font-black flex items-center justify-center gap-3 transition-all ${styles[direction]}`}>
      <span className="text-2xl">{icons[direction]}</span>
      {labels[direction]}
    </div>
  );
};

const PredictionCard: React.FC<PredictionCardProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 h-full flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-500">AI</div>
        </div>
        <div className="text-center">
          <p className="text-white font-black uppercase tracking-widest">Calculating Probability</p>
          <p className="text-slate-500 text-xs mt-1">Quotex Optimization Engine...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 text-2xl">?</div>
        <p className="italic text-slate-500 text-sm">Waiting for instrument selection to generate Binary signals.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 h-full flex flex-col space-y-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="space-y-4">
        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Signal Execution</h3>
        <DirectionBadge direction={analysis.direction} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
          <p className="text-slate-500 text-[9px] uppercase font-black mb-1">Expiration</p>
          <p className="text-white font-bold text-sm tracking-tight">{analysis.recommendedExpiration}</p>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
          <p className="text-slate-500 text-[9px] uppercase font-black mb-1">Win Rate Prob.</p>
          <p className="text-emerald-400 font-black text-lg font-mono">{analysis.nextCandleProbability}%</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-blue-400 text-[10px] font-black uppercase mb-2 tracking-widest">Pattern Detection</h4>
          <p className="text-white font-bold text-xl tracking-tight">{analysis.pattern}</p>
        </div>

        <div className="bg-blue-500/5 rounded-2xl p-5 border border-blue-500/10">
          <h4 className="text-slate-500 text-[9px] font-black uppercase mb-2">Strategy Note</h4>
          <p className="text-slate-300 text-xs leading-relaxed font-medium italic">
            "{analysis.explanation}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
           <div>
             <p className="text-slate-600 text-[9px] uppercase font-black">Support</p>
             <p className="text-white font-mono font-bold text-xs">{analysis.keyLevels.support.toFixed(5)}</p>
           </div>
           <div className="text-right">
             <p className="text-slate-600 text-[9px] uppercase font-black">Resistance</p>
             <p className="text-white font-mono font-bold text-xs">{analysis.keyLevels.resistance.toFixed(5)}</p>
           </div>
        </div>
      </div>

      <div className="pt-2 mt-auto text-[9px] text-slate-700 uppercase font-black tracking-[0.3em] text-center">
        Quotex Optimized Analysis Engine
      </div>
    </div>
  );
};

export default PredictionCard;
