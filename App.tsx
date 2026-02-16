
import React, { useState, useEffect } from 'react';
import { analyzeAsset } from './services/geminiService';
import { AnalysisData, LoadingState, Language } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';
import { Search, Terminal, AlertTriangle, Cpu, Key } from 'lucide-react';

// The global `aistudio` object and its type `AIStudio` are assumed to be pre-configured
// and accessible in the execution context. We remove the local declaration to avoid
// conflicts with the environment's existing definitions.

const App: React.FC = () => {
  const [assetInput, setAssetInput] = useState('');
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('ID');
  const [hasKey, setHasKey] = useState<boolean>(true);

  // Cek status API Key saat inisialisasi
  useEffect(() => {
    const checkKeyStatus = async () => {
      // Accessing aistudio from the window object. 
      // We use a safe check as per the guidelines.
      if ((window as any).aistudio) {
        try {
          const isSelected = await (window as any).aistudio.hasSelectedApiKey();
          setHasKey(isSelected);
        } catch (e) {
          console.warn("AI Studio key check failed", e);
        }
      }
    };
    checkKeyStatus();
  }, []);

  const handleConnectKey = async () => {
    if ((window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        // As per race condition guidelines: assume the key selection was successful 
        // after triggering openSelectKey() and proceed to the app.
        setHasKey(true);
        setError(null);
      } catch (e) {
        console.error("Failed to open key dialog", e);
      }
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetInput.trim()) return;

    setData(null);
    setError(null);
    setLoadingState(LoadingState.SCANNING_MARKET);

    try {
      const phase1 = setTimeout(() => setLoadingState(LoadingState.ANALYZING_STRUCTURE), 1500);
      const phase2 = setTimeout(() => setLoadingState(LoadingState.CALCULATING_LEVELS), 3000);
      
      const result = await analyzeAsset(assetInput, language);
      
      clearTimeout(phase1);
      clearTimeout(phase2);
      
      setData(result);
      setLoadingState(LoadingState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      
      // Jika error terkait entitas tidak ditemukan, reset status kunci
      // sesuai dengan pedoman API Error Handling.
      if (err.message?.includes('not found')) {
        setHasKey(false);
      }

      const errorMessage = err.message || (language === 'ID' 
        ? "Pemindaian pasar gagal. Sektor mungkin sedang offline atau aset tidak dikenali." 
        : "Market scan failed. The sector might be offline or the asset is unrecognizable.");
      setError(errorMessage);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const getLoadingMessage = (state: LoadingState) => {
    const isID = language === 'ID';
    switch (state) {
      case LoadingState.SCANNING_MARKET: return isID ? "Menginisialisasi feed global & memindai harga..." : "Initializing global feed & scanning asset price action...";
      case LoadingState.ANALYZING_STRUCTURE: return isID ? "Mengidentifikasi struktur pasar & arus uang pintar..." : "Identifying market structure & smart money flow...";
      case LoadingState.CALCULATING_LEVELS: return isID ? "Menghitung zona supply/demand & volatilitas..." : "Calculating institutional supply/demand zones & volatility...";
      default: return isID ? "Sedang memproses..." : "Processing...";
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text font-sans selection:bg-terminal-gold/30 selection:text-white pb-10">
      
      {/* Top Navigation / Branding */}
      <nav className="border-b border-terminal-border bg-terminal-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-terminal-panel p-2 rounded border border-terminal-border">
               <Terminal size={20} className="text-terminal-gold" />
             </div>
             <div>
                <h1 className="font-bold text-lg tracking-tight text-white leading-none">VETERAN<span className="text-terminal-gold">TRADER</span></h1>
                <p className="text-[10px] text-terminal-dim uppercase tracking-widest font-mono">Terminal v3.5 // Gemini Engine</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* API Key Connection Status */}
            <button 
              onClick={handleConnectKey}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${!hasKey ? 'bg-terminal-red/10 border-terminal-red text-terminal-red animate-pulse' : 'bg-terminal-panel border-terminal-border text-terminal-dim hover:text-white hover:border-terminal-gold'}`}
              title="Manage Connection"
            >
              <Key size={14} />
              <span className="hidden sm:inline">{!hasKey ? 'SELECT KEY' : 'CONNECTED'}</span>
            </button>

            <div className="flex bg-terminal-panel border border-terminal-border rounded-lg p-1">
              <button 
                onClick={() => setLanguage('ID')}
                className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'ID' ? 'bg-terminal-gold text-black' : 'text-terminal-dim hover:text-white'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'EN' ? 'bg-terminal-gold text-black' : 'text-terminal-dim hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Warning Banner if Key is missing */}
        {!hasKey && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-terminal-gold/5 border border-terminal-gold/20 rounded-xl flex items-center gap-4 animate-fade-in border-dashed">
            <div className="p-3 bg-terminal-gold/10 rounded-full text-terminal-gold">
              <Key size={20} />
            </div>
            <div className="text-sm flex-1">
              <p className="text-white font-bold">{language === 'ID' ? 'API Key Belum Terhubung' : 'API Key Not Connected'}</p>
              <p className="text-terminal-dim">
                {language === 'ID' 
                  ? 'Gunakan tombol Connect untuk memilih API Key dari proyek Google Cloud berbayar agar fitur Search Grounding aktif.' 
                  : 'Use the Connect button to select an API key from a paid GCP project to enable Search Grounding features.'}
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="ml-2 underline text-terminal-gold/80 hover:text-terminal-gold">Docs</a>
              </p>
            </div>
            <button 
              onClick={handleConnectKey}
              className="px-5 py-2 bg-terminal-gold text-black font-bold text-xs rounded uppercase hover:bg-white transition-all shadow-lg shadow-terminal-gold/20"
            >
              Connect
            </button>
          </div>
        )}

        {/* Search Section */}
        <div className={`transition-all duration-500 ${data ? 'mb-10' : 'min-h-[50vh] flex flex-col justify-center items-center'}`}>
          
          {!data && loadingState === LoadingState.IDLE && (
            <div className="text-center mb-10 max-w-2xl animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                {language === 'ID' ? 'Analisis Pasar Kelas' : 'Institutional Grade'} <br/>
                <span className="text-terminal-gold">{language === 'ID' ? 'Institusional' : 'Market Analysis'}</span>
              </h2>
              <p className="text-terminal-dim text-lg">
                {language === 'ID' 
                  ? 'Menerapkan 30 tahun pengalaman trading untuk memindai struktur, tren, dan jebakan pasar.' 
                  : 'Deploying 30 years of trading experience to scan structure, trends, and traps.'}
              </p>
            </div>
          )}

          <form onSubmit={handleAnalyze} className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-terminal-dim group-focus-within:text-terminal-gold transition-colors" size={20} />
            </div>
            <input
              type="text"
              value={assetInput}
              onChange={(e) => setAssetInput(e.target.value)}
              placeholder={language === 'ID' ? "MASUKKAN ASET (misal: BTC/USDT, GOLD, NVDA)" : "ENTER ASSET (e.g., BTC/USDT, XAUUSD, NVDA)"}
              className="w-full bg-terminal-panel border border-terminal-border text-white text-lg font-mono py-5 pl-12 pr-32 rounded-xl focus:outline-none focus:border-terminal-gold/50 focus:ring-1 focus:ring-terminal-gold/50 transition-all placeholder:text-terminal-dim shadow-2xl"
              disabled={loadingState !== LoadingState.IDLE && loadingState !== LoadingState.ERROR}
            />
            <button 
              type="submit"
              disabled={loadingState !== LoadingState.IDLE && loadingState !== LoadingState.ERROR}
              className="absolute right-2 top-2 bottom-2 bg-terminal-gold/10 hover:bg-terminal-gold/20 text-terminal-gold border border-terminal-gold/30 px-6 rounded-lg font-bold text-sm tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'ID' ? 'PINDAI' : 'SCAN'}
            </button>
          </form>

          {/* Quick suggestions */}
          {!data && loadingState === LoadingState.IDLE && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['BTC/USDT', 'ETH/USDT', 'XAU/USD', 'EUR/USD', 'NVDA', 'TSLA'].map(asset => (
                <button 
                  key={asset}
                  onClick={() => setAssetInput(asset)}
                  className="px-4 py-2 bg-terminal-panel border border-terminal-border rounded-full text-xs font-mono text-terminal-dim hover:text-white hover:border-terminal-dim transition-all"
                >
                  {asset}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State Overlay */}
        {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETE && loadingState !== LoadingState.ERROR && (
           <div className="w-full max-w-2xl mx-auto mt-10 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                 <div className="absolute inset-0 border-4 border-terminal-border rounded-full"></div>
                 <div className="absolute inset-0 border-t-4 border-terminal-gold rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="text-terminal-gold animate-pulse" size={32} />
                 </div>
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-mono text-white animate-pulse">{getLoadingMessage(loadingState)}</h3>
                 <p className="text-xs text-terminal-dim uppercase tracking-widest">{language === 'ID' ? 'Memproses dataset masif...' : 'Processing massive dataset...'}</p>
              </div>
              
              <div className="bg-black/50 rounded p-4 font-mono text-xs text-left text-terminal-green/80 h-32 overflow-hidden border border-terminal-border/50 opacity-70">
                <p className="animate-pulse">> {language === 'ID' ? 'Menginisialisasi koneksi bursa global...' : 'Initializing connection to global exchanges...'}</p>
                <p className="delay-100 animate-pulse">> {language === 'ID' ? 'Mengambil data OHLCV untuk ' : 'Fetching OHLCV data for '}{assetInput}...</p>
                {(loadingState >= LoadingState.ANALYZING_STRUCTURE) && <p className="delay-200 animate-pulse">> {language === 'ID' ? 'Mendeteksi zona Support/Resistansi...' : 'Detecting Support/Resistance zones...'}</p>}
                {(loadingState >= LoadingState.CALCULATING_LEVELS) && <p className="delay-300 animate-pulse">> {language === 'ID' ? 'Menghitung retracement Fibonacci...' : 'Calculating Fibonacci retracements...'}</p>}
                {(loadingState >= LoadingState.CALCULATING_LEVELS) && <p className="delay-500 animate-pulse">> {language === 'ID' ? 'Menganalisis Profil Volume...' : 'Analyzing Volume Profile...'}</p>}
              </div>
           </div>
        )}

        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className="w-full max-w-2xl mx-auto mt-10 p-6 bg-terminal-red/10 border border-terminal-red/30 rounded-xl text-center">
            <AlertTriangle className="mx-auto text-terminal-red mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">{language === 'ID' ? 'Sistem Terkendala' : 'System Issue'}</h3>
            <p className="text-terminal-dim mb-6 text-sm">{error}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setLoadingState(LoadingState.IDLE);
                  setError(null);
                }}
                className="px-6 py-2 bg-terminal-panel border border-terminal-border text-white rounded font-bold uppercase tracking-widest text-xs hover:border-white transition-colors"
              >
                {language === 'ID' ? 'Reset Sistem' : 'Reset System'}
              </button>
              
              {(error?.includes('403') || error?.includes('permission') || error?.includes('Ditolak')) && (
                <button 
                  onClick={handleConnectKey}
                  className="px-6 py-2 bg-terminal-gold text-black rounded font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                >
                  {language === 'ID' ? 'Ganti API Key' : 'Change API Key'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {data && loadingState === LoadingState.COMPLETE && (
           <AnalysisDashboard data={data} language={language} />
        )}

      </main>
    </div>
  );
};

export default App;
