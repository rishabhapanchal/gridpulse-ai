/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useTransition, useEffect } from 'react';
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
import { BlogHub } from './components/BlogHub';
import { ArticleViewer } from './components/ArticleViewer';
import { ARTICLES } from './data/articles';

// COMPLIANCE AND PROTECTION INTERFACE LAYER MODALS
import LegalModal from './components/LegalModal';
import { legalContent } from './data/legalContent';

// GEO STRUCTURED DATA FOR AI MODELS & SEARCH ENGINES
import AIEngineSchema from './components/AIEngineSchema';

// ----------------------------------------------------------------
// AMAZON AFFILIATE & ONELINK CONFIGURATION MATRIX
// ----------------------------------------------------------------
const AMAZON_MARKETPLACE_DOMAINS: Record<string, string> = {
  IN: 'amazon.in',
  US: 'amazon.com',
  GB: 'amazon.co.uk',
  CA: 'amazon.ca',
  DE: 'amazon.de',
  ES: 'amazon.es',
  DEFAULT: 'amazon.com'
};

const AMAZON_ASSOCIATE_TAGS: Record<string, string> = {
  IN: 'gridpulseai-21',    // Direct Indian Marketplace Associate ID
  US: 'gridpulseglob-20',  // Global/US Root Associate ID
  GB: 'gridpulseglob-20',  // OneLink Routed to Global ID
  CA: 'gridpulseglob-20',  // OneLink Routed to Global ID
  DE: 'gridpulseglob-20',  // OneLink Routed to Global ID
  ES: 'gridpulseglob-20',  // OneLink Routed to Global ID
  DEFAULT: 'gridpulseglob-20'
};
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// SUPPORTED COUNTRY CODES IN countryConfig.ts
// ----------------------------------------------------------------
const SUPPORTED_COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));
// ----------------------------------------------------------------

export function App() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [, startTransition] = useTransition();

  // USER INTERFACE ROUTING VIEW STATE CONTROLLER
  const [currentView, setCurrentView] = useState<'landing' | 'blog' | 'article'>('landing');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');

  const [state, setState] = useState<CalculatorState>({
    monthlyBill: 150, // Temporary fallback baseline before geo-detection hooks complete
    sunHours: 4.5,
    utilityRate: 0.18,
    roofOrientation: 'south',
    panelCapacity: 400,
  });

  // ----------------------------------------------------------------
  // GEO AUTO-DETECTION: Detect user country via IP and synchronize state
  // ----------------------------------------------------------------
  useEffect(() => {
    const cached = sessionStorage.getItem('gp_detected_country');
    if (cached) {
      if (SUPPORTED_COUNTRY_CODES.has(cached)) {
        setSelectedCountryCode(cached);
        const cachedCountry = COUNTRIES.find((c) => c.code === cached);
        if (cachedCountry) {
          setState((prev) => ({
            ...prev,
            monthlyBill: cachedCountry.defaultMonthlyBill,
            utilityRate: cachedCountry.defaultUtilityRate,
            sunHours: cachedCountry.defaultSunHours,
          }));
        }
      }
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        clearTimeout(timeoutId);
        const code: string = (data?.country_code ?? '').toUpperCase();
        sessionStorage.setItem('gp_detected_country', code);
        if (SUPPORTED_COUNTRY_CODES.has(code)) {
          setSelectedCountryCode(code);
          
          const detectedCountry = COUNTRIES.find((c) => c.code === code);
          if (detectedCountry) {
            setState((prev) => ({
              ...prev,
              monthlyBill: detectedCountry.defaultMonthlyBill,
              utilityRate: detectedCountry.defaultUtilityRate,
              sunHours: detectedCountry.defaultSunHours,
            }));
          }
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        // Silent fallback loop — defaults back to initial USD configurations
        const defaultUS = COUNTRIES.find((c) => c.code === 'US');
        if (defaultUS) {
          setState((prev) => ({
            ...prev,
            monthlyBill: defaultUS.defaultMonthlyBill,
            utilityRate: defaultUS.defaultUtilityRate,
            sunHours: defaultUS.defaultSunHours,
          }));
        }
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);
  // ----------------------------------------------------------------

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
  
  // ----------------------------------------------------------------
  // NAVIGATION ROUTING CORE ENGINE: Browser State Management
  // ----------------------------------------------------------------
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.articleId) {
          setSelectedArticleId(event.state.articleId);
        }
      } else {
        setCurrentView('landing');
      }
    };

    if (!window.history.state) {
      window.history.replaceState({ view: 'landing' }, '');
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateToBlog = () => {
    window.history.pushState({ view: 'blog' }, '');
    setCurrentView('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToArticle = (id: string) => {
    window.history.pushState({ view: 'article', articleId: id }, '');
    setSelectedArticleId(id);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHome = () => {
    window.history.pushState({ view: 'landing' }, '');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // ----------------------------------------------------------------

  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms'>('privacy');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{
    status: 'checking' | 'active' | 'missing_key' | 'fallback_mode';
    details?: string;
  }>({ status: 'checking' });

  useEffect(() => {
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
            details: `Secure Connection to Gemini Core is Active.` 
          });
        } else if (data.status === 'ok' && !data.hasGeminiKey) {
          setApiStatus({ 
            status: 'missing_key', 
            details: 'The GEMINI_API_KEY environment variable is not defined.' 
          });
        } else {
          setApiStatus({ 
            status: 'fallback_mode', 
            details: `Static fallback active.` 
          });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setApiStatus({ 
          status: 'fallback_mode', 
          details: `Backend unreachable: ${err.message}` 
        });
      });
    return () => { isMounted = false; };
  }, []);

  const [activeTab, setActiveTab] = useState<'financial' | 'environmental'>('financial');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [billData, setBillData] = useState<ExtractedBillData | null>(null);

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

  const handleCountryChange = (newCode: string) => {
    const newCountry = COUNTRIES.find((c) => c.code === newCode);
    if (!newCountry || newCountry.code === selectedCountryCode) return;

    const oldCountry = country;
    setSelectedCountryCode(newCode);
    setIsCountryDropdownOpen(false);

    sessionStorage.setItem('gp_detected_country', newCode);

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

  const getRegionalAmazonLink = (asinOrQuery: string): string => {
    const targetCode = selectedCountryCode.toUpperCase();
    const domain = AMAZON_MARKETPLACE_DOMAINS[targetCode] || AMAZON_MARKETPLACE_DOMAINS.DEFAULT;
    const tag = AMAZON_ASSOCIATE_TAGS[targetCode] || AMAZON_ASSOCIATE_TAGS.DEFAULT;
    
    const cleanInput = decodeURIComponent(asinOrQuery).trim();
    const isAsin = /^[A-Z0-9]{10}$/i.test(cleanInput);

    if (isAsin) {
      return `https://www.${domain}/dp/${cleanInput}?tag=${tag}`;
    } else {
      return `https://www.${domain}/s?k=${asinOrQuery}&tag=${tag}`;
    }
  };

  const minBill = country.minBill;
  const maxBill = country.maxBill;
  const stepBill = country.stepBill;
  const minRate = country.minRate;
  const maxRate = country.maxRate;
  const stepRate = country.stepRate;

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* STRUCTURED JSON-LD MATRIX FOR AI ENGINE TRACKING */}
      <AIEngineSchema />

      {/* BACKGROUND GRAPHICS LAYER */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[5%] w-[45vw] h-[45vw] bg-amber-500/3 rounded-full blur-[140px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] bg-amber-500/3 rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,#000000_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      </div>

      {/* HEADER NAVBAR CONTAINER */}
      <header className="relative z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 min-h-16 py-3 flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
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

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs ml-auto sm:ml-0">
            <span className="hidden lg:inline-block text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 font-mono">
              Irradiance Model: v4.12
            </span>

            <motion.button
              type="module"
              onClick={handleNavigateToBlog}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-black tracking-wider uppercase transition-all duration-300 cursor-pointer border overflow-hidden group ${
                currentView === 'blog' || currentView === 'article'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-transparent text-amber-400 border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">SOLAR INSIGHTS HUB</span>
              <span className="sm:hidden">INSIGHTS</span>
            </motion.button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl text-[11px] font-mono font-bold tracking-wider text-slate-200 transition-all duration-200 cursor-pointer shadow-inner hover:bg-slate-900"
              >
                <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{country.flag} {country.currency}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
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
                      className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-slate-950/95 border border-slate-800 rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50"
                    >
                      <div className="px-2 py-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1 text-left">
                        Select Region
                      </div>
                      <div className="space-y-0.5">
                        {COUNTRIES.map((c) => {
                          const isSelected = c.code === selectedCountryCode;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleCountryChange(c.code)}
                              className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                                isSelected ? 'bg-amber-500/15 text-amber-300' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-sm">{c.flag}</span>
                                <div>
                                  <div className={`font-semibold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>{c.name}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{c.currency} ({c.symbol})</div>
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

            {apiStatus.status === 'checking' && (
              <span className="bg-slate-900 text-slate-400 px-2 py-1 rounded-full text-[10px] font-semibold border border-slate-800 uppercase tracking-wider flex items-center gap-2 animate-pulse shrink-0">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                <span className="hidden sm:inline">Verifying</span>
              </span>
            )}
            {apiStatus.status === 'active' && (
              <span className="bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-emerald-500/25 uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)] shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-450 rounded-full animate-ping"></span>
                <span>Live</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT MATRIX */}
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.main 
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 sm:gap-8"
          >
            {/* HERO MODULE */}
            <div className="relative glass-panel p-5 sm:p-8 rounded-[28px] overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"></div>
              <div className="max-w-2xl">
                <h1 className="text-[clamp(1.25rem,4vw,1.625rem)] font-glass-title font-bold tracking-tight text-slate-100">
                  Grid Pulse AI
                </h1>
                <p className="text-xs sm:text-sm font-glass-body mt-2 leading-relaxed text-slate-300">
                  Analyze your photovoltaic generating potential, estimated hardware dimensions, payback cycles, and carbon savings in real-time. Use the slider below to adjust your grid electrical expenses.
                </p>
              </div>

              <div className="flex shrink-0 items-center w-full md:w-auto">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 flex items-center space-x-3.5 shadow-inner w-full justify-center md:justify-start">
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

            {/* DASHBOARD GRID MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <section id="savings-calibration" className="lg:col-span-5 flex flex-col gap-6 w-full">
                <div className="relative glass-panel rounded-[28px] p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
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
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <label htmlFor="utility-bill-slider" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        Monthly Electricity Bill
                      </label>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button"
                          onClick={() => handleBillChange(Math.max(minBill, state.monthlyBill - stepBill))}
                          className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 active:bg-slate-800 text-slate-400 font-mono text-sm font-bold shadow-sm"
                        >
                          -
                        </button>
                        <div className="flex items-baseline space-x-0.5 min-w-[70px] justify-center">
                          <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-amber-400">
                            {formatCurrency(state.monthlyBill)}
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleBillChange(Math.min(maxBill, state.monthlyBill + stepBill))}
                          className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 active:bg-slate-800 text-slate-400 font-mono text-sm font-bold shadow-sm"
                        >
                          +
                        </button>
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
                      <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-2">
                        <span>{formatCurrency(minBill)}</span>
                        <span>{formatCurrency(currency === 'INR' ? 12000 : 150)} Avg</span>
                        <span>{formatCurrency(maxBill)}</span>
                      </div>
                    </div>

                    <div className="pt-1.5">
                      <div className="text-[11px] font-mono text-slate-450 uppercase tracking-wider mb-2">Quick Grid Presets</div>
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-1.5 sm:gap-2">
                        {billPresets.map((val) => {
                          const isSelected = state.monthlyBill === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleBillChange(val)}
                              className={`py-2 text-[11px] font-mono font-bold rounded-xl border cursor-pointer truncate px-0.5 text-center ${
                                isSelected ? 'bg-amber-500/10 text-amber-300 border-amber-500/40' : 'bg-slate-950/85 text-slate-400 border-slate-800/80'
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
                    </label>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5">
                      {(['south', 'west', 'east', 'north'] as RoofOrientation[]).map((orientation) => {
                        const isSelected = state.roofOrientation === orientation;
                        const orientationFactors = { south: '100%', west: '85%', east: '85%', north: '55%' };
                        return (
                          <button
                            key={orientation}
                            type="button"
                            onClick={() => handleOrientationChange(orientation)}
                            className={`px-3.5 py-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${
                              isSelected ? 'bg-slate-950 border-amber-500/40 shadow-inner' : 'bg-slate-950/45 border-slate-850 hover:bg-slate-950/80'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-extrabold capitalize ${isSelected ? 'text-amber-400' : 'text-slate-300'}`}>
                                {orientation}
                              </span>
                              <span className={`text-[9px] font-mono ${isSelected ? 'text-amber-400 font-extrabold' : 'text-slate-500'}`}>
                                {orientationFactors[orientation]}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1.5 leading-tight truncate">
                              {orientation === 'south' && 'Maximum Daily Yield'}
                              {orientation === 'west' && 'Peak Evening Supply'}
                              {orientation === 'east' && 'High Morning Yield'}
                              {orientation === 'north' && 'Ambient Production'}
                            </div>
                            {isSelected && <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-amber-500"></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ADVANCED MODULES */}
                  <div className="mt-5 pt-3.5 border-t border-slate-850/60">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1 font-mono transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <ChevronRight className={`w-3.5 h-3.5 text-amber-500 transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`} />
                        {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
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
                              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <label className="text-xs text-slate-400 font-semibold block">Panel Capacity</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[380, 400, 420].map((watt) => (
                                <button
                                  type="button"
                                  key={watt}
                                  onClick={() => setState((prev) => ({ ...prev, panelCapacity: watt }))}
                                  className={`py-1 text-[11px] font-mono rounded border ${
                                    state.panelCapacity === watt ? 'bg-amber-400/10 text-amber-300 border-amber-400/40' : 'bg-slate-950 text-slate-500 border-slate-850'
                                  }`}
                                >
                                  {watt}W
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="w-full">
                  <BillAnalyzer onDataExtracted={handleBillExtracted} currency={currency} currencySymbol={currencySymbol} />
                </div>
                
                <div className="w-full">
                  <SolarVisualizer
                    panelsNeeded={results.panelsNeeded}
                    systemSizeKw={results.systemSizeKw}
                    sunHours={state.sunHours}
                    onSunHoursChange={handleSunHoursChange}
                    equivalentTrees={results.equivalentTrees}
                    carbonReducedTons={results.carbonReducedTons}
                    roofOrientation={state.roofOrientation}
                  />
                </div>
              </section>

              {/* RIGHT OUTPUT PANEL */}
              <section className="lg:col-span-7 flex flex-col gap-6 w-full">
                <div className="glass-panel border-amber-500/20 rounded-[28px] p-5 sm:p-7 relative overflow-hidden shadow-[0_8px_32px_rgba(245,158,11,0.06)] flex flex-col min-h-[180px] justify-between group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-[9px] font-mono text-amber-400 uppercase tracking-[0.12em] font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 w-max">
                        <CloudLightning className="w-3.5 h-3.5 text-amber-400" />
                        Assessment
                      </span>
                      <h2 className="text-[clamp(1.1rem,3.5vw,1.25rem)] font-glass-title font-bold tracking-tight mt-2.5">Estimated Yearly Savings</h2>
                    </div>
                    <span className="text-[9px] font-mono text-slate-450 bg-black border border-white/5 px-2 py-0.5 rounded-md">Bill * 12 * 95%</span>
                  </div>

                  <div className="my-3 flex items-baseline flex-wrap gap-2">
                    <span className="text-[clamp(2.5rem,7vw,3.75rem)] font-glass-highlight-amber font-bold tracking-tight leading-none">{formatCurrency(results.yearlySavings)}</span>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wide">/ yr saved</span>
                  </div>

                  <div className="text-xs sm:text-sm font-glass-body leading-relaxed border-t border-white/5 pt-4">
                    Adjusting electricity costs offsets energy charges by <strong>95%</strong>. Generating solar power on-site yields <strong className="text-amber-400 font-mono">{formatCurrency(results.yearlySavings / 12)}</strong> monthly utility credits.
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-1 grid grid-cols-2 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setActiveTab('financial')}
                    className={`py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'financial' ? 'bg-slate-900 text-slate-100 border border-slate-850 shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Scale className="w-4 h-4 text-amber-400" />
                    Financials
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('environmental')}
                    className={`py-2.5 text-xs font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'environmental' ? 'bg-slate-900 text-slate-100 border border-slate-850 shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Trees className="w-4 h-4 text-amber-400" />
                    Environment
                  </button>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                  {activeTab === 'financial' ? (
                    <React.Fragment key="financial-metrics">
                      <MetricCard label="Net Hardware Investment" value={formatCurrency(results.netCost)} subValue={`Gross: ${formatCurrency(results.estimatedCost)}`} icon={DollarSign} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" glowingOrb />
                      <MetricCard label="Payback Break-Even" value={`${results.paybackPeriodYears} Years`} subValue={`Year: ${new Date().getFullYear() + Math.ceil(results.paybackPeriodYears)}`} icon={Scale} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" />
                      <MetricCard label={country.incentiveName} value={formatCurrency(results.federalIncentive)} subValue={country.incentiveDesc} icon={Award} iconColorClass="text-yellow-400" bgColorClass="bg-yellow-500/10" borderColorClass="border-slate-850" />
                      <MetricCard label="25-Year Cumulative Yield" value={formatCurrency(results.lifetimeSavings25Years)} subValue="Assuming utility grid inflation" icon={TrendingUp} iconColorClass="text-amber-500" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" glowingOrb />
                    </React.Fragment>
                  ) : (
                    <React.Fragment key="environmental-metrics">
                      <MetricCard label="CO2 Offset Yearly" value={`${results.carbonReducedTons} Metric Tons`} subValue="Avoided grid burning cycles" icon={Trees} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" glowingOrb />
                      <MetricCard label="Equivalent Trees Grown" value={`${results.equivalentTrees} Trees`} subValue="Sequestration over 10yr spectrum" icon={Sun} iconColorClass="text-amber-400" bgColorClass="bg-amber-500/10" borderColorClass="border-slate-850" />
                      <MetricCard label="Standard Generator Capacity" value={`${results.systemSizeKw.toFixed(1)} kW Peak`} subValue={`Configured with ${results.panelsNeeded} PV units`} icon={CloudLightning} iconColorClass="text-indigo-400" bgColorClass="bg-indigo-500/10" borderColorClass="border-slate-850" />
                      <MetricCard
                        label="Clean Energy Generated"
                        value={`${Math.round(results.systemSizeKw * state.sunHours * 365 * 0.8).toLocaleString()} kWh/yr`}
                        subValue="Gross generation grid assessment"
                        icon={ArrowUpRight}
                        iconColorClass="text-teal-400"
                        bgColorClass="bg-teal-500/10"
                        borderColorClass="border-slate-850"
                      />
                    </React.Fragment>
                  )}
                </div>

                <div className="w-full">
                  <SavingsChart results={results} monthlyBill={state.monthlyBill} currency={currency} currencySymbol={currencySymbol} />
                </div>
              </section>
            </div>

            {/* SOLAR HARDWARE ASSORTMENT REAL ESTATE LAYOUT */}
            <div className="max-w-7xl mx-auto px-0 pb-4 relative z-20 w-full">
              <SolarHardwareStore 
                country={country} 
                results={results} 
                panelsNeeded={results.panelsNeeded} 
                systemSizeKw={results.systemSizeKw} 
                getRegionalAffiliateLink={getRegionalAmazonLink}
              />
            </div>
          </motion.main>
        )}

        {currentView === 'blog' && (
          <motion.div key="blog-hub-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BlogHub onSelectArticle={handleNavigateToArticle} />
          </motion.div>
        )}

        {currentView === 'article' && (
          <motion.div key="article-viewer-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ArticleViewer 
              currentSlug={selectedArticleId} 
              onBack={handleNavigateToBlog} 
              onNavigateToArticle={handleNavigateToArticle} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUMAN VISIBLE FOOTER INTERFACE CONTROLS */}
      <footer className="border-t border-white/5 bg-black py-8 mt-auto relative z-10 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-[10px] font-mono font-semibold tracking-wider text-slate-400">
            <button onClick={handleNavigateToHome} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none">HOME FORECASTER</button>
            <button onClick={handleNavigateToBlog} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none">INSIGHTS</button>
            <button type="button" onClick={() => handleOpenLegal('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none p-0 font-mono">PRIVACY</button>
            <button type="button" onClick={() => handleOpenLegal('terms')} className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none p-0 font-mono">TERMS</button>
          </div>

          <div className="max-w-2xl text-center space-y-1.5 text-slate-500">
            <p className="leading-relaxed text-[11px] font-glass-body-muted px-1 text-slate-400">
              Solar yield diagnostics account for local conversion factor assumptions and System Loss models of 20%. {country.disclosureText}
            </p>
            <p className="text-[10px] text-slate-600">&copy; {new Date().getFullYear()} Grid Pulse AI. Diagnostic assessments.</p>
          </div>
        </div>
      </footer>

      {/* BOT CRAWLER SHIELD REAL ESTATE: Invisible to humans, perfectly crawlable for Google AdSense compliance bots */}
      <footer className="sr-only" aria-hidden="false">
        <h2>{legalContent.privacy.title}</h2>
        <p>{legalContent.privacy.subtitle}</p>
        {legalContent.privacy.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        
        <h2>{legalContent.terms.title}</h2>
        <p>{legalContent.terms.subtitle}</p>
        {legalContent.terms.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </footer>

      <AIEnergyAdvisor monthlyBill={state.monthlyBill} sunHours={state.sunHours} results={results} roofOrientation={state.roofOrientation} billExtractedData={billData} currency={currency} currencySymbol={currencySymbol} />
      <LegalModal isOpen={isLegalModalOpen} type={legalModalType} onClose={() => setIsLegalModalOpen(false)} />
    </div>
  );
}
