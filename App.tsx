
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ForexChart from './components/ForexChart';
import PredictionCard from './components/PredictionCard';
import { OHLCData, AIAnalysis, CurrencyPair, Timeframe } from './types';
import { CURRENCY_PAIRS, INITIAL_PAIR } from './constants';
import { analyzeForexData } from './services/geminiService';

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '10m', '15m', '30m', '1h'];

const App: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(INITIAL_PAIR);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1m');
  const [marketData, setMarketData] = useState<OHLCData[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const hasTriggeredThisCandle = useRef(false);

  const [logs, setLogs] = useState<{msg: string, type: 'info'|'error'|'success'|'warn'}[]>([]);

  const addLog = (msg: string, type: 'info'|'error'|'success'|'warn' = 'info') => {
    setLogs(prev => [...prev.slice(-100), { msg, type }]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Candle Synchronizer Logic
  useEffect(() => {
    const tfMinutes = selectedTimeframe.endsWith('h') 
      ? parseInt(selectedTimeframe) * 60 
      : parseInt(selectedTimeframe);
    const tfSeconds = tfMinutes * 60;

    const interval = setInterval(() => {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const remaining = tfSeconds - (nowSeconds % tfSeconds);
      setSecondsRemaining(remaining);

      // Reset trigger flag when a new candle starts
      if (remaining === tfSeconds) {
        hasTriggeredThisCandle.current = false;
      }

      // Auto Trigger Logic: Trigger at exactly 25 seconds remaining
      if (isAutoMode && remaining === 25 && !hasTriggeredThisCandle.current && !loading) {
        hasTriggeredThisCandle.current = true;
        addLog(`[AUTO-TRIGGER] 25s threshold reached. Commencing scan...`, 'warn');
        handleManualRefresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimeframe, isAutoMode, loading]);

  const generateMarketData = useCallback((pair: CurrencyPair, timeframe: Timeframe) => {
    const data: OHLCData[] = [];
    const isJpy = pair.symbol.includes('JPY');
    const basePrice = isJpy ? 145 + Math.random() * 10 : 1.05 + Math.random() * 0.2;
    let currentPrice = basePrice;
    
    const timeframeMinutes = timeframe.endsWith('h') 
      ? parseInt(timeframe) * 60 
      : parseInt(timeframe);

    const now = new Date();
    for (let i = 40; i >= 0; i--) {
      const time = new Date(now.getTime() - i * timeframeMinutes * 60000);
      const volatilityBase = isJpy ? 0.003 : 0.0015;
      const volatility = currentPrice * volatilityBase * (Math.sqrt(timeframeMinutes) / 2);
      
      const open = currentPrice;
      const move = (Math.random() - 0.48) * volatility; 
      const close = open + move;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.3);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.3);
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', ...(timeframeMinutes < 5 ? { second: '2-digit' } : {}) }),
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000),
      });
      currentPrice = close;
    }
    return data;
  }, []);

  const fetchAnalysis = useCallback(async (pair: CurrencyPair, data: OHLCData[], timeframe: Timeframe) => {
    setLoading(true);
    setError(null);
    addLog(`AI calculating next candle direction for ${pair.symbol}...`, 'info');
    try {
      const result = await analyzeForexData(pair.symbol, data, timeframe);
      setAnalysis(result);
      addLog(`SIGNAL READY: ${result.direction === 'UP' ? 'CALL' : 'PUT'} (${result.nextCandleProbability}% confidence)`, 'success');
    } catch (err: any) {
      setError(err.message || "Connection error.");
      addLog(`Scan Failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load or instrument change
  useEffect(() => {
    const data = generateMarketData(selectedPair, selectedTimeframe);
    setMarketData(data);
    addLog(`Instrument context updated: ${selectedPair.symbol}`, 'info');
    fetchAnalysis(selectedPair, data, selectedTimeframe);
  }, [selectedPair, selectedTimeframe, generateMarketData, fetchAnalysis]);

  const handleManualRefresh = () => {
    const newData = generateMarketData(selectedPair, selectedTimeframe);
    setMarketData(newData);
    fetchAnalysis(selectedPair, newData, selectedTimeframe);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 overflow-hidden flex flex-col h-[calc(100vh-160px)] sticky top-24 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Binary Assets</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-black">LIVE</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {CURRENCY_PAIRS.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => setSelectedPair(pair)}
                  className={`w-full group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
                    selectedPair.symbol === pair.symbol
                      ? 'bg-slate-800 border-emerald-500/50 text-white shadow-xl shadow-emerald-500/5'
                      : 'bg-slate-900/30 border-transparent hover:border-slate-700 hover:bg-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className={`font-black text-sm tracking-tight transition-colors ${selectedPair.symbol === pair.symbol ? 'text-emerald-400' : ''}`}>
                      {pair.symbol}
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-[0.1em] opacity-40">OTC Available</span>
                  </div>
                  <div className={`transition-all duration-500 ${selectedPair.symbol === pair.symbol ? 'opacity-100 scale-110' : 'opacity-0'}`}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chart Section */}
        <div className="lg:col-span-9 space-y-8">
          <div className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner group">
                   <div className="w-8 h-8 rounded-full border-2 border-emerald-500 group-hover:scale-110 transition-transform"></div>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white leading-none mb-2 tracking-tighter">
                    {selectedPair.symbol} 
                    <span className="text-emerald-500 ml-2 text-xl font-bold">85% Payout</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{selectedPair.name} • Quotex Protocol</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                 <div className="bg-slate-950/90 px-6 py-5 rounded-3xl border border-slate-800 shadow-2xl text-center min-w-[120px]">
                    <p className="text-[9px] uppercase font-black text-slate-500 mb-1 tracking-widest">Next Candle</p>
                    <p className={`text-2xl font-mono font-black ${secondsRemaining <= 25 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                      {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                    </p>
                 </div>
                 <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setIsAutoMode(!isAutoMode)}
                      className={`h-12 px-8 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all border flex items-center gap-3 shadow-xl ${
                        isAutoMode 
                        ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500 shadow-emerald-500/10' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-500'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isAutoMode ? 'bg-emerald-500 animate-ping' : 'bg-slate-700'}`}></div>
                      AUTO PREDICT: {isAutoMode ? 'ACTIVE' : 'OFF'}
                    </button>
                    <button 
                      onClick={handleManualRefresh}
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white h-12 px-8 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 border border-emerald-400/20"
                    >
                      {loading ? 'SCANNIG...' : 'FORCE SCAN'}
                    </button>
                 </div>
              </div>
            </div>

            {/* Timeframes */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-slate-950 border border-slate-800 rounded-3xl p-1.5 shadow-2xl">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black transition-all duration-500 ${
                      selectedTimeframe === tf
                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 scale-105'
                        : 'text-slate-600 hover:text-slate-300'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-slate-950/60 rounded-3xl border border-slate-800 p-8 shadow-inner">
              <ForexChart data={marketData} />
              <div className="absolute top-10 left-10 pointer-events-none">
                <span className="text-6xl font-black text-white/5 tracking-tighter uppercase select-none">{selectedTimeframe}</span>
              </div>
              {isAutoMode && secondsRemaining <= 30 && secondsRemaining > 25 && (
                <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] rounded-3xl flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-950 border border-emerald-500/50 px-8 py-4 rounded-2xl shadow-2xl animate-bounce">
                    <p className="text-emerald-500 font-black text-sm tracking-widest uppercase">Auto-Scan in {secondsRemaining - 25}s</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-5">
              <PredictionCard analysis={analysis} loading={loading} />
            </div>
            
            <div className="xl:col-span-7 bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 flex flex-col shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-4">
                  <span className="w-3 h-1 bg-emerald-500 rounded-full"></span>
                  Trade Execution Log
                </h3>
                {isAutoMode && (
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                    Auto-Sync Active
                  </span>
                )}
              </div>
              
              <div 
                ref={terminalRef}
                className="flex-1 min-h-[320px] bg-slate-950/90 rounded-3xl p-6 font-mono text-[11px] overflow-y-auto space-y-3 border border-slate-800 custom-scrollbar shadow-inner"
              >
                {logs.length === 0 ? (
                  <p className="text-slate-800 animate-pulse italic">Connecting to Quotex feed...</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="flex gap-4 leading-relaxed">
                      <span className="text-slate-700 font-bold shrink-0">{new Date().toLocaleTimeString([], {hour12: false, minute:'2-digit', second:'2-digit'})}</span>
                      <p className={`
                        ${log.type === 'info' ? 'text-slate-500' : ''}
                        ${log.type === 'success' ? 'text-emerald-500 font-black' : ''}
                        ${log.type === 'error' ? 'text-rose-500 font-black' : ''}
                        ${log.type === 'warn' ? 'text-amber-500' : ''}
                      `}>
                        <span className="mr-2 opacity-30">#</span>
                        {log.msg}
                      </p>
                    </div>
                  ))
                )}
                {loading && (
                  <p className="text-emerald-500 animate-pulse font-bold">CALCULATING BINARY PROBABILITY...</p>
                )}
                <div className="h-4 w-1 bg-emerald-500/50 animate-caret ml-1"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-slate-900 px-10 text-[9px] text-slate-700 uppercase font-black tracking-[0.4em] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">QuotexFlow AI Pro</span>
          <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
          <span>&copy; 2025 Binary Intelligence Group</span>
        </div>
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Auto-Sync: {isAutoMode ? 'Ready' : 'Standby'}</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> AI Model: Gemini 3 Flash</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @keyframes caret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-caret { animation: caret 1s infinite step-end; }
      `}</style>
    </div>
  );
};

export default App;
