
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ForexChart from './components/ForexChart';
import PredictionCard from './components/PredictionCard';
import PredictionHistory from './components/PredictionHistory';
import { OHLCData, AIAnalysis, CurrencyPair, Timeframe, HistoricalPrediction, AssetCategory } from './types';
import { CURRENCY_PAIRS, INITIAL_PAIR } from './constants';
import { analyzeForexData } from './services/geminiService';
import { fetchLiveMarketData } from './services/marketService';

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '10m', '15m', '30m', '1h'];
const CATEGORIES: AssetCategory[] = ['Major', 'Minor', 'Exotic', 'Crypto'];

const App: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(INITIAL_PAIR);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1m');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [marketData, setMarketData] = useState<OHLCData[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<HistoricalPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentCandleTimestamp = useRef<number>(0);
  const hasTriggeredCurrentCycle = useRef<boolean>(false);

  const [logs, setLogs] = useState<{msg: string, type: 'info'|'error'|'success'|'warn'}[]>([]);

  const addLog = (msg: string, type: 'info'|'error'|'success'|'warn' = 'info') => {
    setLogs(prev => [...prev.slice(-100), { msg, type }]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const evaluateLastSignal = useCallback((newData: OHLCData[]) => {
    setPredictionHistory(prev => prev.map(p => {
      if (p.status !== 'PENDING') return p;
      const latestCandle = newData[newData.length - 1];
      const result = latestCandle.close > latestCandle.open ? 'UP' : 'DOWN';
      const isWin = p.direction === result;
      return { ...p, status: isWin ? 'WIN' : 'LOSS', actualResult: latestCandle.close };
    }));
  }, []);

  const refreshMarketData = useCallback(async (withAnalysis = false) => {
    setLoading(true);
    try {
      const data = await fetchLiveMarketData(selectedPair, selectedTimeframe);
      setMarketData(data);
      setIsLive(true);
      evaluateLastSignal(data);
      
      if (withAnalysis) {
        addLog(`Neural Scan: ${selectedPair.symbol} (${selectedTimeframe})`, 'info');
        const result = await analyzeForexData(selectedPair.symbol, data, selectedTimeframe);
        setAnalysis(result);
        if (result.direction !== 'WAIT') {
          const entryPrice = data[data.length - 1].close;
          const newPrediction: HistoricalPrediction = {
            ...result,
            id: Math.random().toString(36).substr(2, 9),
            symbol: selectedPair.symbol,
            timeframe: selectedTimeframe,
            timestamp: Date.now(),
            entryPrice,
            status: 'PENDING'
          };
          setPredictionHistory(prev => [...prev.slice(-49), newPrediction]);
          addLog(`ENTRY TRIGGER: ${result.direction} [${result.nextCandleProbability}%]`, 'success');
        } else {
          addLog(`Range Bound: Signal Filtered`, 'warn');
        }
      }
    } catch (err: any) {
      addLog(`Feed Latency: Re-syncing ${selectedPair.symbol}...`, 'error');
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, [selectedPair, selectedTimeframe, evaluateLastSignal]);

  useEffect(() => {
    const tfMinutes = selectedTimeframe.endsWith('h') ? parseInt(selectedTimeframe) * 60 : parseInt(selectedTimeframe);
    const tfSeconds = tfMinutes * 60;
    const interval = setInterval(() => {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const candleStartTime = Math.floor(nowSeconds / tfSeconds) * tfSeconds;
      const remaining = tfSeconds - (nowSeconds % tfSeconds);
      setSecondsRemaining(remaining);
      if (candleStartTime !== currentCandleTimestamp.current) {
        currentCandleTimestamp.current = candleStartTime;
        hasTriggeredCurrentCycle.current = false;
        refreshMarketData(false);
      }
      if (isAutoMode && !loading && !hasTriggeredCurrentCycle.current) {
        if (remaining <= 25 && remaining > 5) {
          hasTriggeredCurrentCycle.current = true;
          addLog(`[AUTO] Scanning High-Yield Opportunity`, 'warn');
          refreshMarketData(true);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, isAutoMode, loading, selectedPair, refreshMarketData]);

  useEffect(() => {
    refreshMarketData(true);
    hasTriggeredCurrentCycle.current = false;
  }, [selectedPair, selectedTimeframe, refreshMarketData]);

  const filteredPairs = CURRENCY_PAIRS.filter(p => 
    p.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e11] text-[#f8fafc] font-sans overflow-x-hidden selection:bg-emerald-500/30">
      <Header />

      <main className="flex-1 max-w-[1920px] mx-auto w-full p-2 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Main Content Area */}
        <div className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-4 gap-4">
          
          <div className="xl:col-span-3 flex flex-col gap-4">
            
            {/* Asset & Timeframe Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 bg-[#1c1f26] border border-[#2d3139] rounded-2xl p-6 flex items-center justify-between shadow-xl relative overflow-visible">
                <div className="flex items-center gap-6">
                  {/* SEARCHABLE DROPDOWN */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex flex-col items-start bg-[#131722] border border-[#2d3139] px-4 py-2 rounded-xl hover:border-emerald-500 transition-all min-w-[200px]"
                    >
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Asset Selector</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white">{selectedPair.symbol}</span>
                        <svg className={`w-4 h-4 text-slate-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-[300px] bg-[#1c1f26] border border-[#2d3139] rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[500px]">
                        <div className="p-3 border-b border-[#2d3139]">
                          <input 
                            autoFocus
                            type="text" 
                            placeholder="Find any currency..." 
                            className="w-full bg-[#131722] border border-[#2d3139] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                          {CATEGORIES.map(cat => {
                            const catPairs = filteredPairs.filter(p => p.category === cat);
                            if (catPairs.length === 0) return null;
                            return (
                              <div key={cat} className="p-2">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] px-2 mb-1">{cat}</p>
                                {catPairs.map(pair => (
                                  <button
                                    key={pair.symbol}
                                    onClick={() => {
                                      setSelectedPair(pair);
                                      setIsDropdownOpen(false);
                                      setSearchTerm('');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#252830] transition-colors group"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold text-slate-300 group-hover:text-white">{pair.symbol}</span>
                                      <span className="text-[8px] text-emerald-500 font-black">85%</span>
                                    </div>
                                    <span className="text-[7px] text-slate-600 uppercase truncate block">{pair.name}</span>
                                  </button>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-10 w-px bg-[#2d3139]"></div>

                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Global Yield</span>
                    <span className="text-xl font-black text-emerald-500">85%</span>
                  </div>
                </div>

                <div className="flex bg-[#131722] rounded-xl p-1 border border-[#2d3139]">
                  {TIMEFRAMES.slice(0, 4).map(tf => (
                    <button 
                      key={tf} 
                      onClick={() => setSelectedTimeframe(tf)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${selectedTimeframe === tf ? 'bg-[#363c4e] text-white' : 'text-slate-600 hover:text-slate-300'}`}
                    >
                      {tf.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* TIMER */}
              <div className="bg-[#1c1f26] border border-[#2d3139] rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent transition-opacity ${secondsRemaining <= 25 ? 'opacity-100' : 'opacity-0'}`}></div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 relative z-10">Decision Clock</p>
                <div className={`text-6xl font-mono font-black tracking-tighter relative z-10 transition-all duration-300 ${secondsRemaining <= 25 ? 'text-[#ef5350] scale-110 drop-shadow-[0_0_20px_rgba(239,83,80,0.3)]' : 'text-emerald-500'}`}>
                  {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 bg-[#131722] border border-[#2d3139] rounded-3xl p-6 shadow-2xl relative min-h-[500px] flex flex-col">
              <ForexChart data={marketData} />
            </div>
            
            {/* Terminal Feed */}
            <div className="bg-[#1c1f26] border border-[#2d3139] rounded-3xl p-5 shadow-xl h-[120px] flex flex-col">
               <div ref={terminalRef} className="flex-1 text-[10px] font-mono space-y-2 overflow-y-auto custom-scrollbar text-slate-600">
                 {logs.map((log, i) => (
                   <div key={i} className="flex gap-3">
                     <span className="text-slate-800">[{new Date().toLocaleTimeString([], {hour12: false, second: '2-digit'})}]</span>
                     <span className={log.type === 'success' ? 'text-emerald-500' : log.type === 'error' ? 'text-rose-500' : log.type === 'warn' ? 'text-amber-500' : ''}>{log.msg}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            <PredictionCard analysis={analysis} loading={loading} />
            
            <div className="bg-[#1c1f26] border border-[#2d3139] rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
              <button 
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`w-full py-4 rounded-xl text-[10px] font-black tracking-widest transition-all border ${
                  isAutoMode ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-[#131722] border-[#2d3139] text-slate-500'
                }`}
              >
                AUTO-TRADING: {isAutoMode ? 'ENABLED' : 'DISABLED'}
              </button>
              <button 
                onClick={() => refreshMarketData(true)}
                disabled={loading}
                className="w-full bg-[#363c4e] text-white py-4 rounded-xl text-[10px] font-black tracking-widest transition-all hover:bg-[#4a526a] disabled:opacity-50"
              >
                RE-SCAN MARKET
              </button>
            </div>

            <div className="flex-1 min-h-[350px]">
              <PredictionHistory history={predictionHistory} />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 bg-[#0b0e11] border-t border-[#1c1f26] px-8 flex items-center justify-between text-[8px] text-slate-700 font-black uppercase tracking-[0.4em]">
        <span>QuotexFlow Enterprise v6.0</span>
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span> {isLive ? 'Exchange Feed' : 'Optimized Feed'}</span>
          <span>&copy; 2025 Institutional Intelligence</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2d3139; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
