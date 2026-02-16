import React, { useEffect, useRef } from 'react';

interface Props {
  asset: string;
}

const TradingViewChart: React.FC<Props> = ({ asset }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Normalisasi simbol untuk TradingView
    // Contoh: BTC/USDT -> BINANCE:BTCUSDT
    let symbol = asset.toUpperCase().replace('/', '');
    if (!symbol.includes(':')) {
      // Default ke Binance untuk crypto, atau OANDA untuk forex jika mengandung pair mayor
      if (['EURUSD', 'GBPUSD', 'XAUUSD', 'XAGUSD'].includes(symbol)) {
        symbol = `OANDA:${symbol}`;
      } else {
        symbol = `BINANCE:${symbol}`;
      }
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "240",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com",
      "backgroundColor": "rgba(10, 10, 12, 1)",
      "gridColor": "rgba(42, 46, 57, 0.06)",
      "hide_top_toolbar": false,
      "save_image": false,
      "container_id": "tradingview_widget_container"
    });

    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }
  }, [asset]);

  return (
    <div className="tradingview-widget-container border border-terminal-border rounded-xl overflow-hidden shadow-2xl bg-terminal-panel" style={{ height: "500px", width: "100%" }}>
      <div id="tradingview_widget_container" ref={container} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default TradingViewChart;