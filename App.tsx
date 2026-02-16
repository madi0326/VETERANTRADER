
import React, { useState } from 'react';
import { analyzeAsset } from './services/geminiService';
import { AnalysisData, LoadingState, Language } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';
import { Terminal, AlertTriangle, Cpu, Globe, ShieldCheck, Lock, ChevronRight, Search } from 'lucide-react';

const App: React.FC = () => {
  const [assetInput, setAssetInput] = useState('');
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('ID');

  const performAnalysis = async (target: string) => {
    if (!target.trim()) return;
    
    // Clear previous view and start terminal sequence
    setData(null);
    setError(null);
    setLoadingState(LoadingState.SCANNING_MARKET);

    try {
      const result = await analyzeAsset(target, language);
      setData(result);
      setLoadingState(LoadingState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menghubungi pusat data eksternal.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(assetInput);
  };

  const handleAssetClick = (asset: string) => {
    setAssetInput(asset);
    performAnalysis(asset);
  };

  const isScanning = loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETE && loadingState !== LoadingState.ERROR;

  return (
    <div className="min-h-screen bg-[#070708] text-terminal-text font-sans selection:bg-terminal-gold/30 selection:text-white">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-terminal-gold/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-terminal-green/5 blur-[120px] rounded-full"></div>
      </div>

      <nav className="border-b border-terminal-border/50 bg-terminal-bg/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-shrink-0 cursor-pointer" onClick={() => { setData(null); setLoadingState(LoadingState.IDLE); setAssetInput(''); }}>
             <div className="bg-terminal-panel p-2 rounded-lg border border-terminal-border group hover:border-terminal-gold transition-colors">
               <Terminal size={18} className="text-terminal-gold group-hover:scale-110 transition-transform" />
             </div>
             <div className="hidden xs:block">
                <h1 className="font-black text-xl tracking-tighter text-white uppercase italic leading-none">VT<span className="text-terminal-gold">TERM</span></h1>
                <p className="text-[8px] text-terminal-dim uppercase tracking-[0.2em] font-mono font-black">Core v4.0</p>
             </div>
          </div>

          {/* Persistent Header Search for Rapid Market Switching */}
          {(data || loadingState === LoadingState.ERROR || isScanning) && (
            <form onSubmit={handleFormSubmit} className="flex-1 max-w-md animate-fade-in">
              <div className="relative group">
                <input
                  type="text"
                  value={assetInput}
                  onChange={(e) => setAssetInput(e.target.value)}
                  placeholder={language === 'ID' ? "PINDAH KE ASET LAIN..." : "SWITCH TO ASSET..."}
                  className="w-full bg-terminal-panel/80 border border-terminal-border text-white text-xs font-mono py-2.5 pl-10 pr-10 rounded-full focus:outline-none focus:border-terminal-gold focus:ring-1 focus:ring-terminal-gold/20 transition-all"
                  disabled={isScanning}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-dim">
                  <Search size={14} />
                </div>
                <button type="submit" disabled={isScanning} className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-terminal-gold text-black rounded-full hover:bg-white transition-colors disabled:opacity-50">
                  <ChevronRight size={14} />
                </button>
              </div>
            </form>
          )}
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-terminal-panel/50 border border-terminal-border rounded-full text-[9px] font-black text-terminal-green uppercase tracking-widest">
              <Lock size={10} />
              Session Live
            </div>

            <div className="flex bg-terminal-panel border border-terminal-border rounded-full p-1">
              {['ID', 'EN'].map((l) => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l as Language)}
                  className={`px-3 py-1 text-[10px] font-black rounded-full transition-all ${language === l ? 'bg-terminal-gold text-black' : 'text-terminal-dim hover:text-white'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        
        {/* Landing Hero (Only if no data and not scanning) */}
        {!data && !isScanning && loadingState === LoadingState.IDLE && (
          <div className="text-center mb-12 animate-fade-in space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-terminal-gold/5 border border-terminal-gold/10 rounded-full text-[10px] font-black text-terminal-gold uppercase tracking-widest mb-4">
              <ShieldCheck size={14} />
              Professional Advisory System
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
              DECODE THE <br/>
              <span className="text-terminal-gold italic">SMART MONEY.</span>
            </h2>
            <p className="text-terminal-dim text-lg max-w-2xl mx-auto uppercase tracking-wide font-medium">
              30 years of institutional market experience, <br/> now powered by specialized Gemini reasoning.
            </p>
          </div>
        )}

        {/* Primary Search Interface */}
        {!data && !isScanning && loadingState === LoadingState.IDLE && (
          <div className="transition-all duration-700 ease-in-out min-h-[30vh] flex flex-col items-center">
            <form onSubmit={handleFormSubmit} className="w-full max-w-3xl relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Globe className="text-terminal-dim group-focus-within:text-terminal-gold transition-colors" size={24} />
              </div>
              <input
                type="text"
                value={assetInput}
                onChange={(e) => setAssetInput(e.target.value)}
                placeholder={language === 'ID' ? "MASUKKAN SIMBOL ASET..." : "TARGETING ASSET SYMBOL..."}
                className="w-full bg-terminal-panel/80 backdrop-blur-xl border border-terminal-border text-white text-xl font-mono py-7 pl-16 pr-40 rounded-3xl focus:outline-none focus:border-terminal-gold focus:ring-4 focus:ring-terminal-gold/5 transition-all placeholder:text-terminal-dim/50 shadow-2xl"
              />
              <button 
                type="submit"
                className="absolute right-3 top-3 bottom-3 bg-terminal-gold text-black px-10 rounded-2xl font-black text-xs tracking-widest uppercase transition-all hover:bg-white active:scale-95 shadow-lg shadow-terminal-gold/20"
              >
                SCAN
              </button>
            </form>

            <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
              {['BTC/USDT', 'ETH/USDT', 'XAU/USD', 'EUR/USD', 'AAPL', 'NVDA'].map(asset => (
                <button 
                  key={asset}
                  onClick={() => handleAssetClick(asset)}
                  className="px-6 py-2 bg-terminal-panel/40 border border-terminal-border/50 rounded-full text-[10px] font-black text-terminal-dim hover:text-white hover:border-terminal-gold hover:bg-terminal-gold/5 transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <Search size={10} className="opacity-50" />
                  {asset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Terminal Animation */}
        {isScanning && (
           <div className="w-full max-w-2xl mx-auto mt-20 text-center space-y-12 animate-fade-in">
              <div className="relative w-32 h-32 mx-auto">
                 <div className="absolute inset-0 border-2 border-terminal-border rounded-full scale-125 opacity-20 animate-pulse"></div>
                 <div className="absolute inset-0 border-t-2 border-terminal-gold rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="text-terminal-gold animate-bounce" size={40} />
                 </div>
              </div>
              <div className="space-y-4">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Analyzing Market Architecture...</h3>
                 <div className="w-full h-1 bg-terminal-panel rounded-full overflow-hidden max-w-xs mx-auto">
                    <div className="h-full bg-terminal-gold animate-[loading_2s_ease-in-out_infinite]"></div>
                 </div>
              </div>
              
              <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 font-mono text-[10px] text-left text-terminal-green border border-terminal-border/50 h-48 overflow-hidden shadow-2xl">
                <p className="animate-pulse">&gt; INITIALIZING QUANT FEED...</p>
                <p className="delay-100 animate-pulse">&gt; FETCHING INSTITUTIONAL ORDER DATA FOR {assetInput.toUpperCase()}...</p>
                <p className="delay-200 animate-pulse">&gt; ANALYZING LIQUIDITY POOLS & ORDER BLOCKS...</p>
                <p className="delay-500 animate-pulse">&gt; CALCULATING MARKET STRUCTURE SHIFT PROBABILITIES...</p>
                <p className="delay-700 animate-pulse">&gt; APPLYING SMC VALIDATION RULES...</p>
                <p className="delay-1000 animate-pulse">&gt; GENERATING EXECUTION BLUEPRINT...</p>
                <p className="mt-4 text-terminal-gold font-bold">&gt; CONNECTING TO VETERAN CORE...</p>
              </div>
           </div>
        )}

        {/* Error Handling */}
        {loadingState === LoadingState.ERROR && (
          <div className="w-full max-w-2xl mx-auto mt-20 p-10 bg-terminal-red/5 border border-terminal-red/20 rounded-3xl text-center space-y-6">
            <div className="w-20 h-20 bg-terminal-red/10 rounded-full flex items-center justify-center mx-auto text-terminal-red">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic">Protocol Interrupted</h3>
            <div className="bg-black/40 p-4 rounded-xl border border-terminal-border">
                <p className="text-terminal-dim font-mono text-xs leading-relaxed">{error}</p>
            </div>
            <div className="flex flex-col gap-4 items-center pt-4">
              <button 
                onClick={() => { setLoadingState(LoadingState.IDLE); setError(null); setAssetInput(''); }}
                className="px-8 py-3 bg-terminal-panel border border-terminal-border text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all"
              >
                Reset Terminal
              </button>
            </div>
          </div>
        )}

        {/* Result Dashboard */}
        {data && loadingState === LoadingState.COMPLETE && (
           <AnalysisDashboard data={data} language={language} />
        )}

      </main>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 400px) {
          .xs\:block { display: none; }
        }
      `}</style>
    </div>
  );
};

export default App;
