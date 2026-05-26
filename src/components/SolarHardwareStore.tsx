/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  Layers, 
  Cpu, 
  BatteryCharging, 
  Wrench, 
  ShieldCheck, 
  Award,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CountryConfig } from '../utils/countryConfig';
import { CalculatorResults } from '../types';

interface SolarHardwareStoreProps {
  country: CountryConfig;
  results: CalculatorResults;
  panelsNeeded: number;
  systemSizeKw: number;
}

interface ProductTemplate {
  name: string;
  category: 'panel' | 'inverter' | 'battery' | 'accessory';
  description: string;
  baseUsdPrice: number;
  searchQuery: (panels: number, kw: number) => string;
  bulletSpecs: (panels: number, kw: number) => string[];
  icon: React.ComponentType<any>;
}

const AMAZON_DOMAINS: Record<string, string> = {
  US: 'amazon.com',
  IN: 'amazon.in',
  DE: 'amazon.de',
  GB: 'amazon.co.uk',
  AU: 'amazon.com.au',
  CA: 'amazon.ca',
  JP: 'amazon.co.jp',
  ZA: 'amazon.co.za',
  AE: 'amazon.ae'
};

const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    name: "Monocrystalline High-Yield Solar Panels",
    category: 'panel',
    description: "Anti-reflective tempered glass solar panels tailored to high snow & wind load resistance.",
    baseUsdPrice: 220, // Per panel base rate
    searchQuery: (panels) => `Renogy monocrystalline solar panels 400W ${panels} pack`,
    bulletSpecs: (panels) => [
      `Suggested setup: ${panels} x 400W panels`,
      "Cell Efficiency: > 22.8%",
      "25-Year transferable power warranty"
    ],
    icon: Layers
  },
  {
    name: "Smart grid-tie MPPT Inverter",
    category: 'inverter',
    description: "Dual-MPPT tracking inverter to synchronize solar DC electricity into clean AC grid power.",
    baseUsdPrice: 850,
    searchQuery: (_, kw) => `pure sine wave grid tie inverter MPPT ${Math.ceil(kw)}kW`,
    bulletSpecs: (_, kw) => [
      `Suited capacity: ${kw.toFixed(1)} kW power input`,
      "Peak Efficiency: 98.2%",
      "WiFi-enabled cloud diagnostics dashboard"
    ],
    icon: Cpu
  },
  {
    name: "Deep Cycle LiFePO4 Battery Bank",
    category: 'battery',
    description: "Eco-safe solar storage unit featuring smart BMS monitoring and high current discharges.",
    baseUsdPrice: 580,
    searchQuery: () => "LiFePO4 battery 48V 100Ah solar deep cycle storage bank",
    bulletSpecs: () => [
      "Capacity: 48V 100Ah (4.8 kWh storage)",
      "Standard Lifecycle: 6,000+ cycles",
      "Overcharge / Thermal runaway protection"
    ],
    icon: BatteryCharging
  },
  {
    name: "Weatherproof MC4 Connection Extension Cables",
    category: 'accessory',
    description: "Twin-core solar extension cables with sealed connectors for minimal signal propagation loss.",
    baseUsdPrice: 42,
    searchQuery: () => "10 AWG solar panel extension cable with MC4 male female connectors 50 feet",
    bulletSpecs: () => [
      "Length: 50ft / 15m double wire core",
      "Rating: 10 AWG heavy duty copper strands",
      "IP68 waterproof dustproof sealed couplers"
    ],
    icon: Wrench
  },
  {
    name: "Heavy-Duty Rooftop Mounting Z-Brackets & Rails",
    category: 'accessory',
    description: "Rustproof structural aluminum brackets customized for quick angled roof attachment.",
    baseUsdPrice: 35,
    searchQuery: (panels) => `solar panel roof Z brackets mounting kits ${panels > 4 ? 'heavy duty rails' : '4 pack'}`,
    bulletSpecs: (panels) => [
      `Holds: Full roof mounting layout for ${panels} panels`,
      "Material: Corrosive-resistant structural alloy",
      "Includes all hex screws and flange nuts"
    ],
    icon: Wrench
  }
];

export default function SolarHardwareStore({
  country,
  results,
  panelsNeeded,
  systemSizeKw
}: SolarHardwareStoreProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'panel' | 'inverter' | 'battery' | 'accessory'>('all');
  
  // Amazon Associate ID Store tag (configurable via environment variables for user privacy)
  const affiliateTag = (import.meta as any).env?.VITE_AMAZON_ASSOCIATE_ID || "gridpulse-20";
  const amazonDomain = AMAZON_DOMAINS[country.code] || 'amazon.com';

  // Format currency dynamically based on the country rates
  const formatLocalCost = (usdBase: number, multiplyByPanels: boolean = false) => {
    const rawUsdValue = multiplyByPanels ? usdBase * panelsNeeded : usdBase;
    // Calculate according to regional conversion rates
    const localValue = rawUsdValue * country.conversionRateFromUSD;
    
    try {
      return new Intl.NumberFormat(country.currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: country.currency,
        maximumFractionDigits: 0,
      }).format(localValue);
    } catch {
      return `${country.symbol}${localValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  // Generate the clean, valid Amazon affiliate search URL
  const getAffiliateUrl = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.${amazonDomain}/s?k=${encodedQuery}&tag=${affiliateTag}`;
  };

  // Filter products by toggled tab
  const filteredProducts = PRODUCT_TEMPLATES.filter(p => 
    activeCategory === 'all' ? true : p.category === activeCategory
  );

  return (
    <section id="solar-hardware-marketplace" className="w-full mt-10 p-6 glass-panel border-amber-500/10 rounded-[32px] overflow-hidden relative shadow-[0_12px_40px_rgba(0,0,0,0.7)] group">
      {/* Visual highlights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-105" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />

      {/* Program Partner Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/5 z-10 relative">
        <div className="space-y-1.5 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono tracking-widest uppercase font-extrabold rounded-full">
            <ShoppingBag className="w-3.5 h-3.5 animate-pulse" />
            Integrators Tool & Hardware Deck
          </span>
          <h2 className="text-xl md:text-2xl font-glass-title font-bold tracking-tight text-white flex items-center gap-2">
            Amazon Hardware Marketplace
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-2xl">
            Acquire matching clean-energy equipment recommended directly for your calibrated <strong className="text-amber-300 font-mono">{systemSizeKw.toFixed(1)} kW</strong> setup. All components link to authorized local listings using regional portal optimizations under your local currency rates.
          </p>
        </div>

        {/* Amazon Associate Tag HUD (ID hidden from public UI for privacy) */}
        <div className="bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3 text-right flex flex-col items-end shrink-0 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Partner Integration</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1 block">
            Amazon Associates Program Feed
          </span>
        </div>
      </div>

      {/* Dynamic system configuration summary widget */}
      <div className="my-5 bg-amber-500/5 border border-amber-500/15 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-amber-500/10 rounded-xl border border-amber-500/25 shrink-0">
            <Award className="w-5.5 h-5.5 text-amber-400" />
          </div>
          <div className="text-left">
            <div className="text-xs font-mono text-amber-300 uppercase tracking-wider font-extrabold">Configured Specs</div>
            <div className="text-sm font-sans font-bold text-slate-200 mt-0.5">
              Ideal DIY solar build out requires ~<span className="text-amber-400">{panelsNeeded} PV panels</span> of <span className="text-amber-400">400W rating</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span className="text-[10px] font-mono text-slate-400 py-1 px-2.5 bg-black/45 border border-white/5 rounded-lg">
            Active Regional Feed: {country.flag} Amazon.{amazonDomain}
          </span>
        </div>
      </div>

      {/* CATEGORY SELECTOR TABS */}
      <div className="flex flex-wrap gap-1.5 pt-1 pb-4 z-10 relative">
        {[
          { id: 'all', label: 'All Hardware', icon: ShoppingBag },
          { id: 'panel', label: 'Solar Panels', icon: Layers },
          { id: 'inverter', label: 'Inverters & MPPT', icon: Cpu },
          { id: 'battery', label: 'Storage Battery', icon: BatteryCharging },
          { id: 'accessory', label: 'Connectors & Mounts', icon: Wrench }
        ].map((tab) => {
          const isSelected = activeCategory === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'bg-amber-400/15 text-amber-300 border-amber-500/30 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-slate-850 hover:bg-slate-900 hover:text-slate-200 hover:borderColor border-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* COMPONENT STORE LISTINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 z-10 relative">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p, idx) => {
            const isPanel = p.category === 'panel';
            const costFormatted = formatLocalCost(p.baseUsdPrice, isPanel);
            const rawLocalValue = p.baseUsdPrice * (isPanel ? panelsNeeded : 1) * country.conversionRateFromUSD;
            const queryText = p.searchQuery(panelsNeeded, systemSizeKw);
            const affiliateLink = getAffiliateUrl(queryText);
            const ProductIcon = p.icon;

            return (
              <motion.div
                layout
                key={p.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-slate-950/75 border border-slate-855 hover:border-amber-500/25 rounded-2xl p-4 flex flex-col justify-between group/card transition-all duration-300 hover:shadow-[0_4px_20px_rgba(245,158,11,0.03)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-3">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 group-hover/card:bg-amber-500/5 group-hover/card:border-amber-500/20 transition-all duration-300">
                      <ProductIcon className="w-5 h-5" />
                    </div>
                    {isPanel && (
                      <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                        Qty: {panelsNeeded} Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover/card:text-amber-300 transition-colors duration-300 text-left">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed text-left min-h-[34px]">
                    {p.description}
                  </p>

                  <div className="my-3.5 border-t border-b border-white/5 py-2.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest text-left block">
                      Target Equipment Specs
                    </span>
                    <ul className="space-y-1 mt-1.5">
                      {p.bulletSpecs(panelsNeeded, systemSizeKw).map((spec, sIdx) => (
                        <li key={sIdx} className="text-[10px] text-slate-300 flex items-center gap-1.5 text-left font-sans">
                          <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline justify-between mb-3 text-left">
                    <div>
                      <span className="text-xs font-mono text-slate-500 block leading-tight">Est. Market Cost</span>
                      <span className="text-lg font-mono font-bold text-slate-200">
                        {costFormatted}
                      </span>
                    </div>
                    {isPanel && (
                      <span className="text-[9px] text-slate-500 font-mono">
                        {formatLocalCost(p.baseUsdPrice)} / unit
                      </span>
                    )}
                  </div>

                  <a
                    href={affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3.5 bg-amber-500 text-black font-sans font-bold text-xs rounded-xl hover:bg-amber-450 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-350 shadow-inner group/btn"
                  >
                    <span>Procure on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* HIGH-CONVERSION SPONSORED BANNER CALLOUT */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10 rounded-2xl text-left z-10 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono bg-amber-400 text-black px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">AD</span>
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest font-sans">
              Solar DIY Starter Kits & Powerstations
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal max-w-xl">
            Sourcing an all-in-one bundle is ideal for beginners. Explore completely integrated plug-and-play kits including portable powerstations with solar panel briefcases on Amazon.
          </p>
        </div>

        <a
          href={getAffiliateUrl("Renogy Solar Panel Kit or Jackery Solar Generator")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500/20 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all duration-300 cursor-pointer text-center whitespace-nowrap"
        >
          <span>Browse Complete Bundles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </section>
  );
}
