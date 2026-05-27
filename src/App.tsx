/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useTransition } from 'react';
import {
  Sun,
  Zap,
  DollarSign,
  Trees,
  CloudLightning,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Scale,
  Award,
  ArrowUpRight,
  Globe,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculatorState, RoofOrientation } from './types';
import { calculateSolarSavings, ORIENTATION_LABELS } from './utils/calculator';
import SolarVisualizer from './components/SolarVisualizer';
import SavingsChart from './components/SavingsChart';
import MetricCard from './components/MetricCard';
import AIEnergyAdvisor from './components/AIEnergyAdvisor';
import BillAnalyzer, { ExtractedBillData } from './components/BillAnalyzer';
import { COUNTRIES } from './utils/countryConfig';
import SolarHardwareStore from './components/SolarHardwareStore';

// BLOG CONTENT REAL ESTATE MODULES
import BlogHub from './components/BlogHub';
import ArticleViewer from './components/ArticleViewer';

// COMPLIANCE AND PROTECTION INTERFACE LAYER MODALS
import LegalModal from './components/LegalModal';

export function App() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  // React 19 Concurrent rendering hooks to offload heavy country-switching calculations from the main thread
  const [, startTransition] = useTransition();

  const country = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];
  const currency = country.currency;
  const currencySymbol = country.symbol;

  const formatCurrency = (val: number) => {
    try {
      return new Intl.NumberFormat(country.currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: country.currency,
        maximumFractionDigits: 0,
      }).format(val);
    } catch (e) {
      return `${country.symbol}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  const formatRate = (val: number) => {
    return `${country.symbol}${val.toFixed(2)}`;
  };

  // USER INTERFACE ROUTING VIEW STATE CONTROLLER
  const [currentView, setCurrentView] = useState<'landing' | 'blog' | 'article'>('landing');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');

  // LEGAL OVERLAY GATEWAY STATE MACHINE
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms'>('privacy');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);

  const [apiStatus, setApiStatus] = useState<{
    status: 'checking' | 'active' | 'missing_key' | 'fallback_mode';
    details?: string;
  }>({ status: 'checking' });

  // FIXED: Cleaned up effect blocks
  React.useEffect(() => {
    let isMounted = true;
    
    fetch('/api/healthz')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.status === 'ok' && data.hasGeminiKey) {
          setApiStatus({ 
            status: 'active', 
            details: `Secure Connection to Gemini Core is Active. Key prefix: ${data.geminiKeyPrefix}, length: ${data.geminiKeyLength}` 
          });
        } else if (data.status === 'ok' && !data.hasGeminiKey) {
          setApiStatus({ 
            status: 'missing_key', 
            details: 'The GEMINI_API_KEY environment variable is not defined or is a blank placeholder.' 
          });
        } else {
          setApiStatus({ 
            status: 'fallback_mode', 
            details: `Static fallback: ${JSON.stringify(data)}` 
          });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('API Diagnostics Error:', err);
        setApiStatus({ 
          status: 'fallback_mode', 
          details: `Backend unreachable: ${err.message || 'Verification failed'}` 
        });
      });

    return () => { isMounted = false; };
  }, []);

  // Primary State representing Solar Configuration parameters
  const [state, setState] = useState<CalculatorState>({
    monthlyBill: country.defaultMonthlyBill || 150,
    sunHours: country.defaultSunHours || 4.5,
    utilityRate: country.defaultUtilityRate || 0.18,
    roofOrientation: 'south',
    panelCapacity: 400,
  });

  const [activeTab, setActiveTab] = useState<'financial' | 'environmental'>('financial');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [billData, setBillData] = useState<ExtractedBillData | null>(null);

  const handleNavigateToBlog = () => {
    setCurrentView('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToArticle = (id: string) => {
    setSelectedArticleId(id);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHome = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (type: 'privacy' | 'terms') => {
    setLegalModalType(type);
    setIsLegalModalOpen(true);
  };

  const handleBillExtracted = (data: ExtractedBillData) => {
    setBillData(data);
    setState((prev) => ({
      ...prev,
      monthlyBill: data.extractedBillAmount,
      utilityRate: data.utilityRate,
    }));
  };

  const results = calculateSolarSavings(state, country.typicalSolarCostPerWatt, country.incentiveRate);
  const billPresets = country.presets;

  const handleBillChange = (val: number) => {
    setState((prev) => ({ ...prev, monthlyBill: val }));
  };

  const handleSunHoursChange = (hours: number) => {
    setState((prev) => ({ ...prev, sunHours: hours }));
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    if (!isNaN(rate)) {
      setState((prev) => ({ ...prev, utilityRate: rate }));
    }
  };

  const handleOrientationChange = (orientation: RoofOrientation) => {
    setState((prev) => ({ ...prev, roofOrientation: orientation }));
  };

  // OPTIMIZED: Uses React concurrent transitions to prevent deep ratio math loops from locking up visual sliders
  const handleCountryChange = (newCode: string) => {
    const newCountry = COUNTRIES.find((c) => c.code === newCode);
    if (!newCountry || newCountry.code === selectedCountryCode) return;

    const oldCountry = country;
    setSelectedCountryCode(newCode);
    setIsCountryDropdownOpen(false);

    const ratio = newCountry.conversionRateFromUSD / oldCountry.conversionRateFromUSD;

    startTransition(() => {
      setState((prev) => {
        let scaledBill = Math.round(prev.monthlyBill * ratio);
        let scaledRate = Number((prev.utilityRate * ratio).toFixed(2));

        scaledBill = Math.max(newCountry.minBill, Math.min(newCountry.maxBill, scaledBill));
        scaledRate = Math.max(newCountry.minRate, Math.min(newCountry.maxRate, scaledRate));

        const wasAtOldDefaultBill = Math.abs(prev.monthlyBill - oldCountry.defaultMonthlyBill) < (oldCountry.stepBill * 1.5);
        const finalBill = wasAtOldDefaultBill ? newCountry.defaultMonthlyBill : scaledBill;

        const wasAtOldDefaultRate = Math.abs(prev.utilityRate - oldCountry.defaultUtilityRate) < 0.05;
        const finalRate = wasAtOldDefaultRate ? newCountry.defaultUtilityRate : scaledRate;

        const hasCustomSunHours = prev.sunHours !== oldCountry.defaultSunHours;
        const finalSunHours = hasCustomSunHours ? prev.sunHours : newCountry.defaultSunHours;

        return {
          ...prev,
          monthlyBill: finalBill,
          utilityRate: finalRate,
          sunHours: finalSunHours,
        };
      });

      if (billData) {
        setBillData((prev) => {
          if (!prev) return null;
          const scaledBill = Math.round(prev.extractedBillAmount * ratio);
          const scaledRate = Number((prev.utilityRate * ratio).toFixed(2));
          return {
            ...prev,
            extractedBillAmount: Math.max(newCountry.minBill, Math.min(newCountry.maxBill, scaledBill)),
            utilityRate: Math.max(newCountry.minRate, Math.min(newCountry.maxRate, scaledRate)),
          };
        });
      }
    });
  };

  const minBill = country.minBill;
  const maxBill = country.maxBill;
  const stepBill = country.stepBill;

  const minRate = country.minRate;
  const maxRate = country.maxRate;
  const stepRate = country.stepRate;

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* BACKGROUND GRAPHICS LAYER */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[5%] w-[45vw] h-[45vw] bg-amber-500/3 rounded-full blur-[140px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] bg-amber-500/3 rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,#000000_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      </div>

      {/* HEADER NAVBAR CONTAINER */}
      <header className="relative z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleNavigateToHome}
            className="flex items-center space-x-3 focus:outline-none cursor-pointer group/logo active:scale-[0.98] transition-transform duration-200 text-left"
            aria-label="Home"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/15 to-yellow-500/5 border border-amber-500/30 group-hover/logo:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0 transition-colors duration-300">
              <Sun className="w-5 h-5 text-amber-400 group-hover/logo:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider font-display bg-gradient-to-r from-yellow-400 via-amber-300 to-amber-500 bg-clip-text text-transparent uppercase group-hover/logo:opacity-90 transition-opacity">
                GRID PULSE AI
              </div>
              <div className="text-[9px] font-mono text-amber-550 uppercase tracking-[0.18em] leading-none mt-0.5 font-semibold">
                Clean Energy Forecasting
              </div>
            </div>
          </button>

          <div className="flex items-center space-x-3 text-xs">
            <motion.button
              type="button"
              onClick={handleNavigateToBlog}
              whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(245, 158, 11, 0.35)" }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black tracking-wider uppercase transition-all duration-300 cursor-pointer border overflow-hidden group ${
                currentView === 'blog' || currentView === 'article'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-transparent text-amber-400 border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <BookOpen className={`w-3.5 h-3.5 ${currentView === 'blog' || currentView === 'article' ? 'text-black' : 'text-amber-400 animate-pulse'}`} />
              <span>SOLAR INSIGHTS HUB</span>
            </motion.button>

            <div className="relative pr-1">
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl text-[11px] font-mono font-bold tracking-wider text-slate-200 transition-all duration-200 cursor-pointer shadow-inner hover:bg-slate-900"
              >
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>{country.flag} {country.currency} ({country.symbol})</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCountryDropdownOpen && (
                  <React.Fragment>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsCountryDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-slate-950/95 border border-slate-800 rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
                    >
                      <div className="px-2 py-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1 text-left">
                        Select Region & Currency
                      </div>
                      <div className="space-y-0.5">
                        {COUNTRIES.map((c) => {
                          const isSelected = c.code === selectedCountryCode;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleCountryChange(c.code)}
                              className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium font-sans transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
                                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-sm">{c.flag}</span>
                                <div>
                                  <div className={`font-semibold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                                    {c.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    {c.currency} ({c.symbol})
                                  </div>
                                </div>
                              </span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </React.Fragment>
                )}
              </AnimatePresence>
            </div>

            <span className="hidden md:inline-block text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 font-mono">
              Irradiance Model: v4.12
            </span>
            {apiStatus.status === 'checking' && (
              <span className="bg-slate-900 text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-slate-800 uppercase tracking-wider flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                Verifying Backend
              </span>
            )}
            {apiStatus.status === 'active' && (
              <span className="bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-emerald-500/25 uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="w-1.5 h-1.5 bg-emerald-450 rounded-full animate-ping"></span>
                Core Active
              </span>
            )}
          </div>
        </div>
      </header>

      {/* CORE CONTENT ROUTER LAYER */}
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.main 
            key="landing-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-8"
          >
            {/* HERO MODULE */}
            <div className="relative glass-panel p-6 sm:p-8 rounded-[28px] overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"></div>
              <div className="max-w-2xl">
                <h1 className="text-xl sm:text-2xl font-glass-title font-bold tracking-tight text-slate-100 flex items-center gap-2">
                  Grid Pulse AI
                </h1>
                <p className="text-xs sm:text-sm font-glass-body mt-2 leading-relaxed">
                  Analyze your photovoltaic generating potential, estimated hardware dimensions, payback cycles, and carbon savings in real-time. Use the slider below to adjust your grid electrical expenses.
                </p>
              </div>

              <div className="flex shrink-0 items-center">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4.5 py-3 flex items-center space-x-3.5 shadow-inner">
                  <div className="text-amber-400 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-slate-450 uppercase tracking-widest font-bold">Federal Incentive</div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">30% Investment Tax ITC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DASHBOARD GRAPH MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN INTERACTIVE SYSTEMS */}
              <section id="savings-calibration" className="lg:col-span-5 flex flex-col gap-6 w-full">
                <div className="relative glass-panel rounded-[28px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-600/40 to-transparent"></div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-black border border-white/10 text-amber-400 rounded-xl">
                        <Sun className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-glass-title font-bold tracking-tight pb-0.5">
                        Savings Calibration
                      </h2>
                    </div>
                    <span className="text-[9px] font-mono text-slate-450 uppercase tracking-widest font-bold">System Inputs</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label htmlFor="utility-bill-slider" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        Monthly Electricity Bill
                        <span className="text-slate-500 hover:text-slate-400 cursor-pointer">
                          <HelpCircle className="w-3.5 h-3.5" title="Your monthly grid power costs." />
                        </span>
                      </label>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-bold font-mono tracking-tight text-amber-400">
                          {formatCurrency(state.monthlyBill)}
                        </span>
                        <span className="text-xs font-mono text-slate-450">/mo</span>
                      </div>
                    </div>

                    <div className="relative pt-1">
                      <input
                        id="utility-bill-slider"
                        type="range"
                        min={minBill}
                        max={maxBill}
                        step={stepBill}
                        value={state.monthlyBill}
                        onChange={(e) => handleBillChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-slate-850 accent-amber-500 focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((state.monthlyBill - minBill) / (maxBill - minBill)) * 100}%, #020617 ${((state.monthlyBill - minBill) / (maxBill - minBill)) * 100}%, #020617 100%)`
                        }}
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                        <span>{formatCurrency(minBill)} Min</span>
                        <span>{formatCurrency(currency === 'INR' ? 12000 : 150)} Avg</span>
                        <span>{formatCurrency(currency === 'INR' ? 32000 : 400)} High</span>
                        <span>{formatCurrency(maxBill)} Max</span>
                      </div>
                    </div>

                    <div className="pt-1.5">
                      <div className="text-[11px] font-mono text-slate-450 uppercase tracking-wider mb-2">Quick Grid Presets</div>
                      <div className="grid grid-cols-5 gap-2">
                        {billPresets.map((val) => {
                          const isSelected = state.monthlyBill === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleBillChange(val)}
                              className={`py-2 text-xs font-mono font-bold rounded-xl transition-all duration-300 border cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-inner'
                                  : 'bg-slate-950/85 text-slate-400 border-slate-800/80 hover:border-slate-700/60 hover:text-slate-100'
                              }`}
                            >
                              {formatCurrency(val)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ORIENTATION MULTIPLIERS */}
                  <div className="space-y-3 mt-6 pt-5 border-t border-slate-850/60">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                      Roof Orientation Multiplier
                      <span className="text-slate-500 hover:text-slate-400 cursor-pointer">
                        <HelpCircle className="w-3.5 h-3.5" title="South orientation absorbs maximum photon counts." />
                      </span>
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      {(['south', 'west', 'east', 'north'] as RoofOrientation[]).map((orientation) => {
                        const isSelected = state.roofOrientation === orientation;
                        const orientationFactors = { south: '100%', west: '85%', east: '85%', north: '55%' };
                        return (
                          <button
                            key={orientation}
                            type="button"
                            onClick={() => handleOrientationChange(orientation)}
                            className={`px-4 py-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                              isSelected
                                ? 'bg-slate-950/90 border-amber-500/50 shadow-inner'
                                : 'bg-slate-950/45 border-slate-850 hover:bg-slate-950/80 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-center column">
                              <span className={`text-xs font-extrabold capitalize ${isSelected ? 'text-amber-400' : 'text-slate-300'}`}>
                                {orientation}
                              </span>
                              <span className={`text-[9px] font-mono ${isSelected ? 'text-amber-400 font-extrabold' : 'text-slate-500'}`}>
                                {orientationFactors[orientation]}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-450 mt-1.5 font-sans leading-tight truncate">
                              {orientation === 'south' && 'Maximum Daily Yield'}
                              {orientation === 'west' && 'Peak Evening Supply'}
                              {orientation === 'east' && 'High Morning Yield'}
                              {orientation === 'north' && 'Standard Ambient Production'}
                            </div>
                            {isSelected && <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-amber-550 to-yellow-500"></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ADVANCED CALIBRATORS ELEMENT */}
                  <div className="mt-5 pt-3.5 border-t border-slate-850/60">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1 font-mono transition-colors duration-200"
                    >
                      <span className="flex items-center gap-1.5">
                        <ChevronRight className={`w-3.5 h-3.5 text-amber-500 transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`} />
                        {showAdvanced ? 'Hide Advanced Parameters' : 'Show Advanced Parameters'}
                      </span>
                      <span className="text-[10px] text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                        Utility Rate, Panel Wattage
                      </span>
                    </button>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-3 pt-3.5 border-t border-slate-850/30 space-y-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <label htmlFor="utility-rate-input" className="text-slate-400 font-semibold">Grid Electricity Rate</label>
                              <span className="font-mono text-amber-400 font-bold">{formatRate(state.utilityRate)}/kWh</span>
                            </div>
                            <input
                              id="utility-rate-input"
                              type="range"
                              min={minRate}
                              max={maxRate}
                              step={stepRate}
                              value={state.utilityRate}
                              onChange={handleRateChange}
                              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center text-xs">
                              <label className="text-slate-400 font-semibold font-sans">Photovoltaic Rated Panel Capacity</label>
                              <span className="font-mono text-amber-400 font-bold">{state.panelCapacity} Watts</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[380, 400, 420].map((watt) => (
                                <button
                                  key={watt}
                                  type="button"
                                  onClick={() => setState((prev) => ({ ...prev, panelCapacity: watt }))}
                                  className={`py-1 text-[11px] font-mono rounded border ${
                                    state.panelCapacity === watt
                                      ? 'bg-amber-400/10 text-amber-300 border-amber-400/40'
                                      : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-400'
                                  }`}
                                >
                                  {watt}W {watt === 400 ? ' (Std)' : ''}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <BillAnalyzer onDataExtracted={handleBillExtracted} currency={currency} currencySymbol={currencySymbol} />
                <SolarVisualizer
                  panelsNeeded={results.panelsNeeded}
                  systemSizeKw={results.systemSizeKw}
                  sunHours={state.sunHours}
                  onSunHoursChange={handleSunHoursChange}
                  equivalentTrees={results.equivalentTrees}
                  carbonReducedTons={results.carbonReducedTons}
                  roofOrientation={state.roofOrientation}
                />
              </section>

              {/* RIGHT OUTPUT EVALUATION PANEL */}
              <section className="lg:col-span-7 flex flex-col gap-6 w-full">
                <div className="glass-panel border-amber-500/20 rounded-[28px] p-7 relative overflow-hidden shadow-[0_8px_32px_rgba(245,158,11,0.06)] flex flex-col min-h-[180px] justify-between group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="text-[9px] font-mono text-amber-400 uppercase tracking-[0.12em] font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 w-max">
                        <CloudLightning className="w-3.5 h-3.5 text-amber-400" />
                        Real-time Assessment
                      </span>
                      <h2 className="text-lg font-glass-title font-bold tracking-tight mt-3">Estimated Yearly Savings</h2>
                    </div>
                    <span className="text-[9px] font-mono text-slate-450 bg-black border border-white/5 px-2.5 py-1 rounded-md">Formula: Bill * 12 * 95%</span>
                  </div>

                  <div className="my-4 flex items-baseline flex-wrap gap-2">
                    <span className="text-5xl sm:text-6xl font-glass-highlight-amber font-bold tracking-tight">{formatCurrency(results.yearlySavings)}</span>
                    <span className="text-xs font-glass-body tracking-wide uppercase font-semibold">accumulated annually</span>
                  </div>

                  <p className="text-xs sm:text-sm font-glass-body leading-relaxed border-t border-white/5 pt-4 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 translate-y-1.5 inline-block"></span>
                    <span>
                      Adjusting your electricity costs offsets energy charges by <strong>95%</strong>. Generating solar power on-site is projected to yield <strong className="font-glass-mono-amber">{formatCurrency(results.yearlySavings / 12)}</strong> monthly net utility credits.
                    </span>
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-1 grid grid-cols-2 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setActiveTab('financial')}
                    className={`py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'financial' ? 'bg-slate-900/80 text-slate-100 border border-slate-850 shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    Financial Projections
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveTab('environmental')}
                    className={`py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'environmental' ? 'bg-slate-900/80 text-slate-100 border border-slate-850 shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Trees className="w-4 h-4 text-amber-400" />
                    Environmental Impact
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeTab === 'financial' ? (
                    <React.Fragment key="financial-metrics">
                      <MetricCard label="Net Hardware Investment" value={formatCurrency(results.netCost)} subValue={`Initial gross: ${formatCurrency(results.estimatedCost)}`} icon={DollarSign} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" glowingOrb />
                      <MetricCard label="Payback Break-Even" value={`${results.paybackPeriodYears} Years`} subValue={`Break-even year: ${new Date().getFullYear() + Math.ceil(results.paybackPeriodYears)}`} icon={Scale} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" />
                      <MetricCard label={country.incentiveName} value={formatCurrency(results.federalIncentive)} subValue={country.incentiveDesc} icon={Award} iconColorClass="text-yellow-400" bgColorClass="bg-yellow-500/10" borderColorClass="border-slate-850" />
                      <MetricCard label="25-Year Cumulative Yield" value={formatCurrency(results.lifetimeSavings25Years)} subValue="Assuming standard utility rise grid" icon={TrendingUp} iconColorClass="text-amber-500" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" glowingOrb />
                    </React.Fragment>
                  ) : (
                    <React.Fragment key="environmental-metrics">
                      <MetricCard label="CO2 Offset Yearly" value={`${results.carbonReducedTons} Metric Tons`} subValue="Avoided traditional power burning" icon={Trees} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" glowingOrb />
                      <MetricCard label="Equivalent Trees Grown" value={`${results.equivalentTrees} Trees`} subValue="Carbon sequestration over 10yr period" icon={Sun} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" />
                      <MetricCard label="Standard Generator Capacity" value={`${results.systemSizeKw.toFixed(1)} kW Peak`} subValue={`Fitted with ${results.panelsNeeded} solid glass panels`} icon={CloudLightning} iconColorClass="text-indigo-400" bgColorClass="bg-indigo-500/10" borderColorClass="border-slate-850" />
                      <MetricCard
                        label="Clean Energy Generated"
                        value={`${Math.round(results.systemSizeKw * state.sunHours * 365 * 0.8).toLocaleString()} kWh/yr`}
                        subValue="Powers direct home appliance cycle"
                        icon={ArrowUpRight}
                        iconColorClass="text-teal-400"
                        bgColorClass="bg-teal-500/10"
                        borderColorClass="border-slate-850"
                      />
                    </React.Fragment>
                  )}
                </div>

                <SavingsChart results={results} monthlyBill={state.monthlyBill} currency={currency} currencySymbol={currencySymbol} />
              </section>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-8 relative z-20">
              <SolarHardwareStore country={country} results={results} panelsNeeded={results.panelsNeeded} systemSizeKw={results.systemSizeKw} />
            </div>
          </motion.main>
        )}

        {currentView === 'blog' && (
          <motion.div 
            key="blog-hub-view" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }} 
            transition={{ duration: 0.3 }}
          >
            <BlogHub 
              onSelectArticle={handleNavigateToArticle} 
              onBack={handleNavigateToHome} 
            />
          </motion.div>
        )}

        {currentView === 'article' && (
          <motion.div key="article-viewer-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
            <ArticleViewer articleId={selectedArticleId} onBack={handleNavigateToBlog} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER LAYER */}
      <footer className="border-t border-white/5 bg-black py-10 mt-10 relative z-10 text-slate-500/80 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono font-semibold tracking-wider text-slate-400">
            <button onClick={handleNavigateToHome} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none">HOME FORECASTER</button>
            <button onClick={handleNavigateToBlog} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none">INSIGHTS & ARTICLES</button>
            <button type="button" onClick={() => handleOpenLegal('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none p-0 font-mono font-semibold text-[11px] tracking-wider">PRIVACY COMPLIANCE</button>
            <button type="button" onClick={() => handleOpenLegal('terms')} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none p-0 font-mono font-semibold text-[11px] tracking-wider">TERMS OF USE</button>
          </div>

          <div className="max-w-2xl text-center space-y-2 mt-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Technical Calculation Disclosures</p>
            <p className="leading-relaxed text-[11px] font-glass-body-muted">
              Solar energy production calculations incorporate standard irradiance coefficients under optimized peak sunshine profiles (sun nodes adjustable from 3.0 to 6.5 hours). Production yields model standard System Loss factors of 20% to account for inverter conversion, thermal heat losses, and cable drag resistance. {country.disclosureText}
            </p>
            <p className="text-[10px] text-slate-600">&copy; {new Date().getFullYear()} Grid Pulse AI. All simulated parameters are diagnostic calculations.</p>
          </div>
        </div>
      </footer>

      <AIEnergyAdvisor monthlyBill={state.monthlyBill} sunHours={state.sunHours} results={results} roofOrientation={state.roofOrientation} billExtractedData={billData} currency={currency} currencySymbol={currencySymbol} />
      
      <LegalModal 
        isOpen={isLegalModalOpen} 
        type={legalModalType} 
        onClose={() => setIsLegalModalOpen(false)} 
      />
    </div>
  );
}
