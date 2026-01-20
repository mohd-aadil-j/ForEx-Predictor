
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-600/20 border border-emerald-400/30 rotate-3">
            <span className="text-white font-black text-2xl tracking-tighter">Q</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">QuotexFlow <span className="text-emerald-500">AI</span></h1>
            <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.3em] mt-1">Binary Options Intelligence</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-8">
            {['Dashboard', 'Trading Feed', 'Market Scanner', 'Account'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-colors">
                {item}
              </a>
            ))}
          </nav>
          
          <div className="h-6 w-px bg-slate-800"></div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-slate-300">{time.toLocaleTimeString([], { hour12: false })}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Server Time</span>
            </div>
            <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 group cursor-pointer hover:border-emerald-500/30 transition-all">
              <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest group-hover:animate-pulse flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Feed Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
