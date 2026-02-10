
import React from 'react';
import { HistoricalPrediction } from '../types';

interface PredictionHistoryProps {
  history: HistoricalPrediction[];
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ history }) => {
  const winCount = history.filter(p => p.status === 'WIN').length;
  const lossCount = history.filter(p => p.status === 'LOSS').length;
  const winRate = history.length > 0 ? ((winCount / (winCount + lossCount || 1)) * 100).toFixed(0) : '0';

  return (
    <div className="bg-[#1c1f26] border border-[#2d3139] rounded-3xl p-5 flex flex-col shadow-xl h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Signal History</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">{history.length}</span>
            <span className="text-[10px] text-slate-600 font-bold uppercase">Signals Found</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Accuracy</p>
          <span className="text-xl font-black text-emerald-500 font-mono">{winRate}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-[10px] uppercase font-black tracking-widest">No signals recorded</p>
          </div>
        ) : (
          [...history].reverse().map((item) => (
            <div key={item.id} className="bg-[#131722] border border-[#2a2e39] rounded-xl p-3 flex items-center justify-between group hover:border-[#363c4e] transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${item.direction === 'UP' ? 'bg-[#26a69a]' : 'bg-[#ef5350]'}`}>
                  {item.direction === 'UP' ? '↑' : '↓'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold text-white">{item.symbol}</p>
                    <span className="text-[8px] bg-[#1c1f26] px-1.5 py-0.5 rounded text-slate-500 font-black">{item.timeframe}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium truncate max-w-[120px]">{item.pattern}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-[10px] font-black mb-0.5 ${
                  item.status === 'WIN' ? 'text-emerald-500' : 
                  item.status === 'LOSS' ? 'text-rose-500' : 'text-amber-500 animate-pulse'
                }`}>
                  {item.status}
                </div>
                <p className="text-[8px] text-slate-700 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PredictionHistory;
