import React from 'react';
import { ShoppingCart, ExternalLink, ShieldCheck, Truck, Package, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CountryConfig {
  code: string;
  currency: string;
  symbol: string;
  typicalSolarCostPerWatt: number;
}

interface SolarHardwareStoreProps {
  country: CountryConfig;
  results: {
    panelsNeeded: number;
    systemSizeKw: number;
    netCost: number;
  };
  panelsNeeded: number;
  systemSizeKw: number;
  localizedAmazonUrl?: string; // Derived from App.tsx region state
}

export default function SolarHardwareStore({
  country,
  results,
  panelsNeeded,
  systemSizeKw,
  localizedAmazonUrl,
}: SolarHardwareStoreProps) {
  
  // Clean fallback if the link isn't fully generated upstream
  const amazonSearchLink = localizedAmazonUrl || `https://www.amazon.com/s?k=Monocrystalline+Solar+Panels+400W`;

  // Dynamic hardware hardware specifications dictionary matrix matching system calculations
  const hardwareItems = [
    {
      id: 'pv-modules',
      name: 'Tier-1 Monocrystalline High-Yield PV Panels',
      specs: `${panelsNeeded}x 400W Modules | Solid Tempered Glass`,
      description: 'Ultra-high efficiency multi-busbar panels optimized for extreme low-light photon absorption metrics.',
      priceEstimate: results.netCost * 0.45, // Proportional estimation matrix
      searchQuery: `${panelsNeeded} Monocrystalline Solar Panels 400W`
    },
    {
      id: 'hybrid-inverter',
      name: 'Smart Grid-Tied Hybrid MPPT Inverter',
      specs: `${Math.ceil(systemSizeKw)}kW Capacity Pure Sine Wave System`,
      description: 'Dual phase logic engine with integrated automatic transfer switching and real-time app telemetry links.',
      priceEstimate: results.netCost * 0.25,
      searchQuery: `${Math.ceil(systemSizeKw)}kW Grid Tied Solar Inverter`
    },
    {
      id: 'storage-battery',
      name: 'Lithium Iron Phosphate (LiFePO4) Battery Pack',
      specs: '48V 100Ah | 5,000+ Deep Continuous Life Cycles',
      description: 'Thermal-runaway proof high-density safe modular home energy cell backup expansion array.',
      priceEstimate: results.netCost * 0.30,
      searchQuery: '48V 100Ah LiFePO4 Solar Battery Backup'
    }
  ];

  // Helper formatting calculation
  const formatLocalPrice = (val: number) => {
    return new Intl.NumberFormat(country.currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: country.currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="relative glass-panel rounded-[28px] p-5 sm:p-7 border border-white/5 bg-slate-900/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
      
      {/* HUB HEADERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-5 mb-6">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md inline-block">
            Integrators Tool & Hardware Deck
          </span>
          <h2 className="text-lg font-glass-title font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-amber-500" />
            Amazon Hardware Marketplace
          </h2>
        </div>
        <div className="text-[10px] font-mono text-slate-450 bg-black/40 border border-white/5 px-3 py-1 rounded-lg flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-amber-500" />
          <span>Regional Delivery Active ({country.code})</span>
        </div>
      </div>

      {/* HARDWARE SPECIFICATION GRID LAYOUT MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {hardwareItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-slate-700 group relative"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-wide truncate max-w-[180px]">
                  {item.specs}
                </span>
                <Package className="w-4 h-4 text-slate-600 group-hover:text-amber-500 transition-colors shrink-0" />
              </div>
              <h3 className="text-xs font-bold text-slate-200 group-hover:text-slate-100 transition-colors leading-snug">
                {item.name}
              </h3>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between gap-2">
              <div>
                <div className="text-[9px] font-mono text-slate-500 uppercase">Est. Local Price</div>
                <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">
                  {formatLocalPrice(item.priceEstimate)}
                </div>
              </div>
              
              <a
                href={amazonSearchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 hover:bg-amber-500/5 text-slate-400 hover:text-amber-400 transition-all duration-200 cursor-pointer shadow-inner"
                title={`Search exact item on Amazon ${country.code}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DISCLOSURE FOOTER BANNER ACTIONS */}
      <div className="p-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-2.5 max-w-2xl text-left">
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 translate-y-0.5" />
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            <strong>Verified Partner Integration:</strong> All system components map directly back to target local inventory channels. Procurement triggers secure tracking logs configuration setup models to optimize your design pipeline hardware specs.
          </p>
        </div>

        <motion.a
          href={amazonSearchLink}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(245,158,11,0.25)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto text-center shrink-0 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Procure Complete DIY Solar Kit</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.a>
      </div>
    </div>
  );
}
