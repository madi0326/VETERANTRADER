
import React, { useState } from 'react';
import { AnalysisData, Language } from '../types';
import { 
  TrendingUp, TrendingDown, Minus, ShieldAlert, Target, 
  Activity, BarChart2, Layers, LineChart as ChartIcon, 
  CheckCircle2, XCircle, Copy, Check, Info, AlertTriangle
} from 'lucide-react';
import TradingViewChart from './TradingViewChart';

interface Props {
  data: AnalysisData;
  language: Language;
}

const translations = {
  EN: {
    marketStructure: "Market Structure",
    signal: "Primary Signal",
    veteranInsight: "Veteran Mentorship",
    structureTrend: "Institutional Structure",
    momentumVolatility: "Momentum & Volatility",
    emaVolume: "Flow & Volume Profile",
    keyLevels: "Institutional Levels",
    executionPlan: "Execution Blueprint",
    entryZone: "Strategic Entry",
    stopLoss: "Invalidation Point",
    takeProfits: "Target Objectives",
    copyParams: "Copy Trade Setup",
    copied: "Parameters Copied",
    sources: "Grounding Intel",
    liveChart: "Technical Feed",
    institutionalChecklist: "Validation Checklist",
    riskWarning: "High Risk Warning: This analysis is for educational purposes. Trading involves significant risk of loss."
  },
  ID: {
    marketStructure: "Struktur Makro",
    signal: "Sinyal Utama",
    veteranInsight: "Mentorship Veteran",
    structureTrend: "Struktur Institusional",
    momentumVolatility: "Momentum & Volatilitas",
    emaVolume: "Arus & Profil Volume",
    keyLevels: "Level Institusional",
    executionPlan: "Blueprint Eksekusi",
    entryZone: "Entry Strategis",
    stopLoss: "Titik Invalidation",
    takeProfits: "Target Objektif",
    copyParams: "Salin Setup Trading",
    copied: "Parameter Tersalin",
    sources: "Data Intelijen",
    liveChart: "Feed Teknikal",
    institutionalChecklist: "Daftar Validasi",
    riskWarning: "Peringatan Risiko Tinggi: Analisis ini hanya untuk tujuan edukasi. Trading melibatkan risiko kehilangan modal yang signifikan."
  }
};

const AnalysisDashboard: React.FC<Props> = ({ data, language }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[language];
  const isBullish = data.setup.signal === 'LONG';
  const isBearish = data.setup.signal === 'SHORT';

  const signalColors = {
    bg: isBullish ? 'bg-terminal-green/5' : isBearish ? 'bg-terminal-red/5' : 'bg-terminal-dim/5',
    border: isBullish ? 'border-terminal-green/30' : isBearish ? 'border-terminal-red/30' : 'border-terminal-border',
    text: isBullish ? 'text-terminal-green' : isBearish ? 'text-terminal-red' : 'text-terminal-dim',
    glow: isBullish ? 'shadow-[0_0_20px_rgba(0,240,144,0.1)]' : isBearish ? 'shadow-[0_0_20px_rgba(255,68,68,0.1)]' : ''
  };

  const handleCopy = () => {
    const text = `
Asset: ${data.asset}
Signal: ${data.setup.signal}
Entry: ${data.setup.entryZone}
SL: ${data.setup.stopLoss}
TPs: ${data.setup.takeProfits.join(', ')}
R:R: ${data.setup.riskRewardRatio}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-24">
      
      {/* Header Info */}
      <div className={`rounded-2xl border ${signalColors.border} ${signalColors.bg} p-8 backdrop-blur-sm ${signalColors.glow}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold font-mono tracking-tighter text-white">{data.asset}</h2>
              {data.currentPrice && (
                <div className="px-3 py-1 bg-terminal-panel border border-terminal-border rounded text-lg font-mono text-terminal-gold">
                  {data.currentPrice}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-terminal-dim">
              <div className={`w-2 h-2 rounded-full ${data.isRealTime ? 'bg-terminal-green animate-pulse' : 'bg-terminal-gold'}`}></div>
              {data.marketStructure} // {data.isRealTime ? 'Real-time Feed' : 'Internal Engine'}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-3">
                <span className="text-terminal-dim text-xs uppercase font-bold tracking-widest">{t.signal}</span>
                <span className={`text-3xl font-black font-mono ${signalColors.text} border-b-4 border-current pb-1`}>
                  {data.setup.signal}
                </span>
             </div>
             <div className="bg-terminal-panel px-4 py-1 rounded-full border border-terminal-border text-[10px] font-mono text-terminal-dim">
                EXPECTED RISK/REWARD: <span className="text-white font-bold">{data.setup.riskRewardRatio}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Analysis Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Live Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-terminal-dim text-[10px] uppercase font-black tracking-widest">
                <ChartIcon size={14} className="text-terminal-gold" />
                {t.liveChart}
              </div>
              <div className="text-[10px] text-terminal-dim font-mono">4H TIME FRAME // CANDLESTICK</div>
            </div>
            <TradingViewChart asset={data.asset} />
          </div>

          {/* Mentorship Insight */}
          <div className="bg-terminal-panel/50 border border-terminal-gold/10 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 -mt-6 -mr-6 opacity-5 transition-transform group-hover:scale-110">
              <ShieldAlert size={120} className="text-terminal-gold" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-terminal-gold/50"></div>
                <h3 className="text-terminal-gold font-bold uppercase tracking-[0.3em] text-[10px]">{t.veteranInsight}</h3>
              </div>
              <p className="text-xl text-gray-200 font-medium leading-relaxed italic">
                "{data.veteranInsight}"
              </p>
            </div>
          </div>

          {/* Technical Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-terminal-panel border border-terminal-border/50 rounded-xl p-6 hover:border-terminal-dim/50 transition-colors">
                <div className="flex items-center gap-2 mb-4 text-terminal-dim">
                  <Activity size={16} />
                  <h4 className="uppercase text-[10px] font-black tracking-widest">{t.structureTrend}</h4>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">{data.marketStructureDetails}</p>
             </div>

             <div className="bg-terminal-panel border border-terminal-border/50 rounded-xl p-6 hover:border-terminal-dim/50 transition-colors">
                <div className="flex items-center gap-2 mb-4 text-terminal-dim">
                  <BarChart2 size={16} />
                  <h4 className="uppercase text-[10px] font-black tracking-widest">{t.momentumVolatility}</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-terminal-dim block mb-1 font-bold uppercase">Sentiment Flow</span>
                    <p className="text-sm text-gray-300">{data.technicals.momentum}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-terminal-dim block mb-1 font-bold uppercase">ATR Expansion</span>
                    <p className="text-sm text-gray-300">{data.technicals.volatility}</p>
                  </div>
                </div>
             </div>

             <div className="bg-terminal-panel border border-terminal-border/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-terminal-dim">
                  <Layers size={16} />
                  <h4 className="uppercase text-[10px] font-black tracking-widest">{t.emaVolume}</h4>
                </div>
                 <div className="space-y-4">
                  <p className="text-sm text-gray-300 border-l-2 border-terminal-gold/20 pl-3">{data.technicals.ema}</p>
                  <p className="text-sm text-gray-300 border-l-2 border-terminal-gold/20 pl-3">{data.technicals.volume}</p>
                </div>
             </div>

             <div className="bg-terminal-panel border border-terminal-border/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-terminal-dim">
                  <Target size={16} />
                  <h4 className="uppercase text-[10px] font-black tracking-widest">{t.keyLevels}</h4>
                </div>
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-terminal-red opacity-70">CEILING</span>
                    <span className="text-white font-bold">{data.levels.resistances[0]}</span>
                  </div>
                   <div className="flex justify-between items-center text-xs">
                    <span className="text-terminal-green opacity-70">FLOOR</span>
                    <span className="text-white font-bold">{data.levels.supports[0]}</span>
                  </div>
                  {data.levels.institutionalZones && data.levels.institutionalZones.length > 0 && (
                     <div className="mt-3 p-2 bg-terminal-gold/5 border border-terminal-gold/10 rounded text-[10px]">
                        <span className="text-terminal-gold block mb-1 font-black">INSTITUTIONAL ZONE</span>
                        <span className="text-white">{data.levels.institutionalZones[0]}</span>
                     </div>
                  )}
                </div>
             </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="lg:col-span-4 space-y-6">
           {/* Blueprint */}
           <div className={`bg-terminal-panel border-l-4 ${signalColors.border} rounded-r-2xl p-8 space-y-8 shadow-2xl sticky top-20`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white tracking-tight">{t.executionPlan}</h3>
                <div className={signalColors.text}>
                  {isBullish ? <TrendingUp size={24}/> : isBearish ? <TrendingDown size={24}/> : <Minus size={24}/>}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase text-terminal-dim font-black tracking-widest block">{t.entryZone}</label>
                  <div className="p-5 bg-black border border-terminal-border rounded-xl font-mono text-xl text-blue-400 text-center shadow-inner">
                    {data.setup.entryZone}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase text-terminal-dim font-black tracking-widest block">{t.stopLoss}</label>
                   <div className="p-5 bg-black border border-terminal-red/20 rounded-xl font-mono text-xl text-terminal-red text-center shadow-inner">
                    {data.setup.stopLoss}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase text-terminal-dim font-black tracking-widest block">{t.takeProfits}</label>
                  <div className="space-y-2">
                    {data.setup.takeProfits.map((tp, idx) => (
                      <div key={idx} className="p-4 bg-black border border-terminal-green/10 rounded-xl font-mono text-terminal-green flex justify-between items-center hover:border-terminal-green/30 transition-colors">
                         <span className="text-[10px] font-black opacity-50 uppercase tracking-tighter">OBJ_{idx + 1}</span>
                         <span className="text-lg font-bold">{tp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="pt-6 border-t border-terminal-border/50">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-terminal-dim mb-4">{t.institutionalChecklist}</h4>
                <div className="space-y-2">
                  {data.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {item.confirmed ? <CheckCircle2 size={14} className="text-terminal-green" /> : <XCircle size={14} className="text-terminal-dim" />}
                      <span className={item.confirmed ? "text-gray-300" : "text-terminal-dim line-through"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCopy}
                disabled={data.setup.signal === 'NEUTRAL'}
                className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${copied ? 'bg-terminal-green text-black' : 'bg-terminal-gold text-black hover:bg-white active:scale-95 shadow-lg shadow-terminal-gold/20'} disabled:opacity-30`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? t.copied : t.copyParams}
              </button>
           </div>
        </div>
      </div>

      {/* Footer Intel */}
      <footer className="pt-10 border-t border-terminal-border/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-terminal-red uppercase font-black text-[10px] tracking-widest">
              <AlertTriangle size={14} />
              RISK PROTOCOL
            </div>
            <p className="text-[10px] text-terminal-dim leading-relaxed max-w-md uppercase tracking-tight">
              {t.riskWarning}
            </p>
          </div>
          
          {data.groundingUrls && data.groundingUrls.length > 0 && (
            <div className="flex flex-col md:items-end">
              <span className="text-[10px] font-black text-terminal-dim uppercase tracking-widest mb-3">{t.sources}</span>
              <div className="flex flex-wrap md:justify-end gap-2">
                {data.groundingUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-terminal-panel border border-terminal-border rounded text-[10px] text-terminal-dim hover:text-terminal-gold hover:border-terminal-gold transition-colors truncate max-w-[150px]">
                    {new URL(url).hostname}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default AnalysisDashboard;
