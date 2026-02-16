
import React from 'react';
import { AnalysisData, Language } from '../types';
import { TrendingUp, TrendingDown, Minus, ShieldAlert, Target, Activity, BarChart2, Layers, LineChart as ChartIcon, Info } from 'lucide-react';
import TradingViewChart from './TradingViewChart';

interface Props {
  data: AnalysisData;
  language: Language;
}

const translations = {
  EN: {
    marketStructure: "Market Structure",
    signal: "Signal",
    veteranInsight: "Veteran Insight",
    structureTrend: "Structure & Trend",
    momentumVolatility: "Momentum & Volatility",
    momentum: "Momentum (RSI/Stoch)",
    volatility: "Volatility (ATR/BB)",
    emaVolume: "EMA & Volume Profile",
    emaAlignment: "EMA Alignment",
    liquidity: "Liquidity/Volume",
    keyLevels: "Key Levels",
    resistance: "Resistance",
    support: "Support",
    fibonacci: "Fibonacci",
    executionPlan: "Execution Plan",
    entryZone: "Entry Zone",
    stopLoss: "Stop Loss",
    risk: "RISK",
    takeProfits: "Take Profits",
    noSetup: "No Valid Setup",
    copyParams: "Copy Parameters",
    sources: "Data Sources (Grounding)",
    liveChart: "Live Technical Chart",
    realtimeActive: "Real-time Search Active",
    realtimeDisabled: "Search Restricted - Using Internal Logic"
  },
  ID: {
    marketStructure: "Struktur Pasar",
    signal: "Sinyal",
    veteranInsight: "Wawasan Veteran",
    structureTrend: "Struktur & Tren",
    momentumVolatility: "Momentum & Volatilitas",
    momentum: "Momentum (RSI/Stoch)",
    volatility: "Volatilitas (ATR/BB)",
    emaVolume: "EMA & Profil Volume",
    emaAlignment: "Keselarasan EMA",
    liquidity: "Likuiditas/Volume",
    keyLevels: "Level Kunci",
    resistance: "Resistensi",
    support: "Support",
    fibonacci: "Fibonacci",
    executionPlan: "Rencana Eksekusi",
    entryZone: "Area Entry",
    stopLoss: "Stop Loss",
    risk: "RISIKO",
    takeProfits: "Target Profit (TP)",
    noSetup: "Tidak Ada Setup Valid",
    copyParams: "Salin Parameter",
    sources: "Sumber Data",
    liveChart: "Grafik Teknikal Real-time",
    realtimeActive: "Pencarian Real-time Aktif",
    realtimeDisabled: "Pencarian Dibatasi - Menggunakan Logika Internal"
  }
};

const AnalysisDashboard: React.FC<Props> = ({ data, language }) => {
  const isBullish = data.setup.signal === 'LONG';
  const isBearish = data.setup.signal === 'SHORT';
  const isNeutral = data.setup.signal === 'NEUTRAL';

  const t = translations[language];

  const signalColor = isBullish ? 'text-terminal-green' : isBearish ? 'text-terminal-red' : 'text-terminal-dim';
  const signalBg = isBullish ? 'bg-terminal-green/10' : isBearish ? 'bg-terminal-red/10' : 'bg-terminal-dim/10';
  const signalBorder = isBullish ? 'border-terminal-green/30' : isBearish ? 'border-terminal-red/30' : 'border-terminal-dim/30';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* Real-time Status Indicator */}
      <div className={`flex items-center gap-2 text-[10px] font-mono px-3 py-1 rounded-full border w-fit ${data.isRealTime ? 'text-terminal-green border-terminal-green/20 bg-terminal-green/5' : 'text-terminal-gold border-terminal-gold/20 bg-terminal-gold/5'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${data.isRealTime ? 'bg-terminal-green animate-pulse' : 'bg-terminal-gold'}`}></div>
        {data.isRealTime ? t.realtimeActive : t.realtimeDisabled}
      </div>

      {/* Header Summary */}
      <div className={`rounded-xl border ${signalBorder} ${signalBg} p-6 relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold font-mono tracking-tighter text-white">{data.asset}</h2>
              {data.currentPrice && <span className="text-xl font-mono text-terminal-gold opacity-90">{data.currentPrice}</span>}
            </div>
            <p className="text-terminal-dim text-sm uppercase tracking-widest font-semibold">
              {t.marketStructure}: <span className="text-white">{data.marketStructure}</span>
            </p>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2">
                <span className="text-terminal-dim text-xs uppercase">{t.signal}</span>
                <span className={`text-2xl font-bold font-mono ${signalColor} px-4 py-1 rounded border border-current`}>
                  {data.setup.signal}
                </span>
             </div>
             <span className="text-xs text-terminal-dim mt-1 font-mono">R:R {data.setup.riskRewardRatio}</span>
          </div>
        </div>
      </div>

      {/* TradingView Chart Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-terminal-dim text-xs uppercase font-bold tracking-widest ml-2">
          <ChartIcon size={14} />
          {t.liveChart}
        </div>
        <TradingViewChart asset={data.asset} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Technicals & Structure */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Veteran Insight Quote */}
          <div className="bg-terminal-panel border border-terminal-gold/20 rounded-xl p-6 shadow-lg relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-terminal-gold/50 rounded-l-xl"></div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-terminal-gold/10 text-terminal-gold shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-terminal-gold font-bold uppercase tracking-wider text-sm mb-2">{t.veteranInsight}</h3>
                <p className="text-gray-300 italic font-medium leading-relaxed">
                  "{data.veteranInsight}"
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Market Structure */}
             <div className="bg-terminal-panel border border-terminal-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <Activity size={18} />
                  <h4 className="uppercase text-xs font-bold tracking-wider">{t.structureTrend}</h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{data.marketStructureDetails}</p>
             </div>

             {/* Volatility & Momentum */}
             <div className="bg-terminal-panel border border-terminal-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <BarChart2 size={18} />
                  <h4 className="uppercase text-xs font-bold tracking-wider">{t.momentumVolatility}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-terminal-dim block mb-1">{t.momentum}</span>
                    <p className="text-sm text-gray-300">{data.technicals.momentum}</p>
                  </div>
                  <div>
                    <span className="text-xs text-terminal-dim block mb-1">{t.volatility}</span>
                    <p className="text-sm text-gray-300">{data.technicals.volatility}</p>
                  </div>
                </div>
             </div>
             
             {/* EMA & Volume */}
             <div className="bg-terminal-panel border border-terminal-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <Layers size={18} />
                  <h4 className="uppercase text-xs font-bold tracking-wider">{t.emaVolume}</h4>
                </div>
                 <div className="space-y-3">
                  <div>
                    <span className="text-xs text-terminal-dim block mb-1">{t.emaAlignment}</span>
                    <p className="text-sm text-gray-300">{data.technicals.ema}</p>
                  </div>
                  <div>
                    <span className="text-xs text-terminal-dim block mb-1">{t.liquidity}</span>
                    <p className="text-sm text-gray-300">{data.technicals.volume}</p>
                  </div>
                </div>
             </div>

             {/* Key Levels */}
             <div className="bg-terminal-panel border border-terminal-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <Target size={18} />
                  <h4 className="uppercase text-xs font-bold tracking-wider">{t.keyLevels}</h4>
                </div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between border-b border-terminal-border pb-1">
                    <span className="text-terminal-red">{t.resistance}</span>
                    <span className="text-right font-bold">{data.levels.resistances[0]}</span>
                  </div>
                   <div className="flex justify-between border-b border-terminal-border pb-1">
                    <span className="text-terminal-green">{t.support}</span>
                    <span className="text-right font-bold">{data.levels.supports[0]}</span>
                  </div>
                  {data.levels.fibonacci && data.levels.fibonacci.length > 0 && (
                     <div className="flex justify-between pt-1">
                      <span className="text-terminal-gold">{t.fibonacci}</span>
                      <span className="text-right font-bold">{data.levels.fibonacci[0]}</span>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Trade Setup */}
        <div className="lg:col-span-1">
           <div className={`bg-terminal-panel border ${signalBorder} rounded-xl p-6 h-full flex flex-col shadow-2xl`}>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {isBullish ? <TrendingUp className="text-terminal-green"/> : isBearish ? <TrendingDown className="text-terminal-red"/> : <Minus className="text-gray-400"/>}
                {t.executionPlan}
              </h3>

              <div className="space-y-6 flex-grow">
                {/* Entry */}
                <div className="space-y-2">
                  <label className="text-xs uppercase text-terminal-dim font-bold tracking-wider">{t.entryZone}</label>
                  <div className="p-4 bg-[#000] border border-terminal-border rounded font-mono text-blue-400 text-lg shadow-inner">
                    {data.setup.entryZone}
                  </div>
                </div>

                {/* Stop Loss */}
                <div className="space-y-2">
                  <label className="text-xs uppercase text-terminal-dim font-bold tracking-wider">{t.stopLoss}</label>
                   <div className="p-4 bg-[#000] border border-terminal-red/30 rounded font-mono text-terminal-red text-lg flex justify-between items-center shadow-inner">
                    {data.setup.stopLoss}
                    <span className="text-xs text-terminal-red bg-terminal-red/10 px-2 py-1 rounded font-bold uppercase">{t.risk}</span>
                  </div>
                </div>

                {/* Take Profits */}
                <div className="space-y-2">
                  <label className="text-xs uppercase text-terminal-dim font-bold tracking-wider">{t.takeProfits}</label>
                  <div className="space-y-2">
                    {data.setup.takeProfits.map((tp, idx) => (
                      <div key={idx} className="p-3 bg-[#000] border border-terminal-green/30 rounded font-mono text-terminal-green flex justify-between items-center shadow-inner transition-transform hover:scale-[1.02]">
                         <span className="text-[10px] opacity-70">TP {idx + 1}</span>
                         <span className="font-bold">{tp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                className={`w-full mt-8 py-4 rounded font-bold uppercase tracking-wider transition-all duration-300 ${isNeutral ? 'bg-terminal-border text-gray-400 cursor-not-allowed' : 'bg-terminal-gold text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]'}`}
              >
                {isNeutral ? t.noSetup : t.copyParams}
              </button>
           </div>
        </div>

      </div>

      {/* Sources Footer */}
      {data.groundingUrls && data.groundingUrls.length > 0 && (
        <div className="mt-8 pt-6 border-t border-terminal-border text-xs text-terminal-dim">
          <p className="mb-2 uppercase tracking-wider font-semibold">{t.sources}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {data.groundingUrls.map((url, i) => (
              <li key={i} className="flex items-center gap-2 overflow-hidden">
                <span className="shrink-0 opacity-30 text-[10px]">[{i+1}]</span>
                <a href={url} target="_blank" rel="noreferrer" className="hover:text-terminal-gold underline decoration-terminal-dim/50 truncate block flex-1 transition-colors">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
