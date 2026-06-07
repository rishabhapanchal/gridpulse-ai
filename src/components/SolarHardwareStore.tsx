/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, ArrowUpRight, ShieldCheck, Cpu, Layers } from 'lucide-react';

interface HardwareProduct {
  id: string;
  name: string;
  description: string;
  priceEstimate: string;
  asinOrQuery: string;
  badge?: string;
  specs: string[];
}

interface SolarHardwareStoreProps {
  country: {
    code: string;
    currency: string;
    symbol: string;
  };
  results: {
    panelsNeeded: number;
    systemSizeKw: number;
  };
  panelsNeeded: number;
  systemSizeKw: number;
  getRegionalAffiliateLink: (asinOrQuery: string) => string;
}

export default function SolarHardwareStore({
  country,
  systemSizeKw,
  panelsNeeded,
  getRegionalAffiliateLink
}: SolarHardwareStoreProps) {
  
  // Dynamic generation of products based on calculated system capacity constraints
  const hardwareBundles = React.useMemo<HardwareProduct[]>(() => {
    const target = country.code.toUpperCase();
    const isINR = target === 'IN';

    if (systemSizeKw <= 4) {
      return [
        {
          id: 'panels-starter',
          name: isINR ? 'Waaree/Adani Mono PERC Solar Array Pack' : 'Renogy Monocrystalline Solar Panel Bundle',
          description: `Complete structural matching set of PV units to hit your calculated ${systemSizeKw.toFixed(1)} kW generation target footprint.`,
          priceEstimate: isINR ? '₹1,15,000' : '$1,450',
          asinOrQuery: isINR ? 'Solar Panel 400W Mono' : 'B07GF5G63B',
          badge: 'Perfect Fit',
          specs: [`Includes ${panelsNeeded} High-Efficiency Panels`, 'Optimized for Low-Light Irradiance', '25-Year Performance Warranty']
        },
        {
          id: 'inverter-starter',
          name: isINR ? 'Microtek/Luminous 24V Smart Hybrid Inverter' : 'Renogy 3000W Pure Sine Wave Hybrid Inverter',
          description: 'High-speed processing core matrix managing battery isolation and real-time residential net-metering synchronization.',
          priceEstimate: isINR ? '₹24,500' : '$520',
          asinOrQuery: isINR ? 'Hybrid Inverter 3kW' : 'B07N1C777H',
          specs: ['Pure Sine Wave Clean Output', 'Built-in MPPT Charge Controller', '95% Efficiency Conversion Rating']
        }
      ];
    } else {
      // High-Ticket Commercial/Heavy Residential Infrastructure Tiers
      return [
        {
          id: 'panels-advanced',
          name: isINR ? 'Premium BiFacial High-Yield Solar Array Grid' : 'BougeRV 400W Mono PERC Heavy Array Bundle',
          description: `Heavy-duty industrial scale module set designed to output your calculated ${systemSizeKw.toFixed(1)} kW power load requirements.`,
          priceEstimate: isINR ? '₹3,40,000' : '$4,800',
          asinOrQuery: isINR ? 'Bifacial Solar Panel 400W' : 'Solar Panel Kit 400W Pack',
          badge: 'High Yield Capability',
          specs: [`Includes ${panelsNeeded} Dynamic Modules`, 'Dual-Side Albedo Extraction Ready', 'Anti-PID Infrastructure Hardening']
        },
        {
          id: 'inverter-advanced',
          name: isINR ? 'Growatt/Sukam 48V Commercial Hybrid Inverter' : 'EG4 18kPV Smart Hybrid Inverter Core',
          description: 'Industrial-grade distribution center orchestrating concurrent multi-phase load profiles, automated battery banks, and high-voltage inputs.',
          priceEstimate: isINR ? '₹85,000' : '$1,850',
          asinOrQuery: isINR ? 'Growatt Hybrid Inverter 10kW' : 'Growatt Inverter 10kW Hybrid',
          specs: ['Multi-Phase Load Orchestration', 'Rapid Shutdown Grid Compliance', 'Mobile Telemetry Application Sync']
        },
        {
          id: 'storage-advanced',
          name: isINR ? '48V 100Ah LiFePO4 Lithium Battery Storage Bank' : 'TimeUSB 48V 100Ah LiFePO4 Deep Cycle Battery Core',
          description: 'High-density structural energy storage matrix ensuring uninterrupted grid-independent operational backup loops.',
          priceEstimate: isINR ? '₹1,65,000' : '$1,299',
          asinOrQuery: isINR ? 'LiFePO4 48V Battery' : 'B0C7K6B8X6',
          badge: 'Off-Grid Essential',
          specs: ['5,000+ Deep Amortization Cycles', 'Integrated Intelligent BMS Protection', 'Expandable Modular Architecture Node']
        }
      ];
    }
  }, [systemSizeKw, panelsNeeded, country.code]);

  return (
    <div className="mt-8 relative z-20 w-full bg-slate-950/40 border border-slate-900 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Structural Accent Highlights */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8 text-left">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-black uppercase tracking-widest bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-xl w-max">
            <ShoppingBag className="w-3.5 h-3.5" /> Hardware Procurement Storefront
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-100 mt-3 font-display">
            Recommended Component Hardware Bundles
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured hardware listings programmatically sized to match your <span className="text-amber-400 font-mono font-bold">{systemSizeKw.toFixed(1)}kW</span> system load forecast.
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0 bg-slate-900/40 border border-slate-850 rounded-2xl px-4 py-2.5 font-mono">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target Geo Market Marketplace</div>
          <div className="text-xs text-slate-200 font-bold mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Amazon OneLink Ecosystem ({country.currency})
          </div>
        </div>
      </div>

      {/* Product Display Cards Mapping Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hardwareBundles.map((product) => {
          const affiliateUrl = getRegionalAffiliateLink(product.asinOrQuery);
          
          return (
            <div 
              key={product.id}
              className="group relative bg-slate-950/80 border border-slate-900 hover:border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-left"
            >
              {product.badge && (
                <span className="absolute top-3 right-3 text-[9px] font-mono font-black bg-amber-500 text-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm z-10">
                  {product.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl w-max group-hover:border-amber-500/20 group-hover:bg-amber-500/5 transition-colors duration-300">
                  {product.id.includes('panel') ? (
                    <Layers className="w-5 h-5 text-amber-400" />
                  ) : product.id.includes('inverter') ? (
                    <Cpu className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-400 transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed min-h-[32px]">
                    {product.description}
                  </p>
                </div>

                <ul className="space-y-1.5 pt-1 border-t border-slate-900/60">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="text-[11px] font-mono text-slate-450 flex items-center gap-2 truncate">
                      <span className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Est. Market Cost</div>
                  <div className="text-base font-black font-mono text-slate-200 mt-0.5">
                    {product.priceEstimate}
                  </div>
                </div>

                <a 
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-amber-500 text-slate-300 hover:text-black border border-slate-800 hover:border-amber-400 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md active:scale-95 group/btn"
                >
                  View Pack <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center gap-2.5 text-[10px] font-mono text-slate-500 max-w-xl mx-auto text-center justify-center border-t border-slate-900/60 pt-4">
        <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
        <span>Affiliate Disclosure: Hardware links route via regionalized marketplace tags tracking commission payouts automatically.</span>
      </div>
    </div>
  );
}
