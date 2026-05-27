/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ExtractedBillData {
  extractedBillAmount: number;
  estimatedConsumptionKwh: number;
  utilityRate: number;
  recommendedActions: string[];
  estimatedSavingsPotential: string;
  summaryOfFindings: string;
}

interface BillAnalyzerProps {
  onDataExtracted: (data: ExtractedBillData) => void;
  currency?: string;
  currencySymbol?: string;
}

export default function BillAnalyzer({ onDataExtracted, currency = 'USD', currencySymbol = '$' }: BillAnalyzerProps) {
  // FIXED: Binds the local tracking symbol tightly to the component props to prevent falling back to $ USD metrics
  const symbol = currencySymbol;
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    'Scanning document structures and line items...',
    'Isolating grid charges & power tariffs...',
    'Estimating seasonal consumption cycles...',
    'Formulating prioritized clean energy action items...'
  ];

  const startLoadingAnimation = () => {
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 2800);
    return interval;
  };

  const processFile = (selectedFile: File) => {
    setError(null);
    setExtractedData(null);

    const maxSize = 8 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File is too large. Please select a document or image under 8MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    const progressInterval = startLoadingAnimation();

    try {
      const reader = new FileReader();
      
      const fileBase64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = (err) => reject(err);
      });

      reader.readAsDataURL(file);
      const base64Content = await fileBase64Promise;

      const response = await fetch('/api/analyze-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileBase64: base64Content,
          mimeType: file.type || 'image/jpeg',
          currency: currency, // Passes target location indicators back to Gemini logic prompts
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        let errMsg = 'Server returned an error status during extraction';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errMsg = errorData.error || errMsg;
          } else {
            const textResponse = await response.text();
            if (textResponse.includes('<!DOCTYPE html>') || textResponse.includes('The page')) {
              errMsg = `Server Configuration Error: The server returned an HTML error page. This usually means the GEMINI_API_KEY secret is not configured. Please check your deployment settings.`;
            } else {
              errMsg = `Server Error (${response.status}): ${textResponse.substring(0, 140)}`;
            }
          }
        } catch {
          errMsg = `Server encountered error with status code ${response.status}`;
        }
        throw new Error(errMsg);
      }

      let data: ExtractedBillData;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Failed to map server insights. Exception: ${jsonErr}`);
      }
      setExtractedData(data);
      onDataExtracted(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to communicate with AI server. Please verify your connection or try again.');
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setExtractedData(null);
    setError(null);
  };

  return (
    <div className="glass-panel rounded-[28px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Top ambient decor bar */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-black border border-white/10 text-amber-400 rounded-xl">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-glass-title font-bold tracking-tight pb-0.5">
              AI Bill Analyzer
            </h2>
            <p className="text-[10px] text-slate-450">Multimodal savings extraction & auditing</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-500 uppercase tracking-widest font-bold">
          Beta
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!file && !extractedData && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-dashed py-8 px-4 flex flex-col items-center justify-center transition-all duration-300 text-center ${
              isDragActive 
                ? 'border-amber-450 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <div className={`p-4 rounded-2xl mb-3.5 transition-all duration-300 ${
              isDragActive 
                ? 'bg-amber-500/15 text-amber-400 scale-110' 
                : 'bg-slate-900 text-slate-400 group-hover:text-slate-300 group-hover:bg-slate-850'
            }`}>
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-xs font-bold text-slate-300 group-hover:text-slate-200">
              {isDragActive ? 'Drop your utility bill here' : 'Drop electricity bill, or browse'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 max-w-[240px]">
              Supports PDF, PNG, JPG, or JPEG up to 8MB
            </p>
          </motion.div>
        )}

        {file && !extractedData && !isAnalyzing && (
          <motion.div
            key="file-loaded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5.5 rounded-2xl bg-slate-950/70 border border-slate-850 flex flex-col items-center text-center"
          >
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 animate-pulse">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-200 truncate max-w-[280px]">
              {file.name}
            </h4>
            <p className="text-[10px] font-mono text-slate-500 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
            </p>

            <div className="mt-5 w-full flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2 px-3 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl text-xs transition duration-200"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 border border-amber-450/40 text-slate-950 font-extrabold rounded-xl text-xs shadow-[0_0_15px_rgba(245,158,11,0.15)] transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Analyze Bill
              </button>
            </div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 px-4 rounded-2xl bg-slate-950/50 border border-slate-850 flex flex-col items-center justify-center text-center"
          >
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-4" />
            <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest mb-1.5 animate-pulse">
              Gemini parsing lines
            </span>
            <p className="text-xs text-slate-350 font-medium max-w-[270px]">
              {loadingSteps[loadingStep]}
            </p>
          </motion.div>
        )}

        {extractedData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Sync Confirmation HUD banner */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-400">Successfully Calibrated!</h4>
                <p className="text-[10px] text-slate-350 mt-0.5 leading-relaxed">
                  We've successfully extracted key values and automatically synced your primary settings sliders.
                </p>
              </div>
            </div>

            {/* Structured Insights Card Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-left">
              <div className="bg-slate-950/70 border border-slate-850 p-2.5 rounded-xl">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Monthly Bill</span>
                <span className="text-sm font-extrabold font-mono text-amber-400 mt-1 block">
                  {/* FIXED: Swapped template literal default references straight to dynamic target layout props */}
                  {symbol}{extractedData.extractedBillAmount.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-450 block mt-0.5">extracted</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-850 p-2.5 rounded-xl">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Rate/kWh</span>
                <span className="text-sm font-extrabold font-mono text-emerald-450 mt-1 block">
                  {symbol}{extractedData.utilityRate.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-450 block mt-0.5">calibrated</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-850 p-2.5 rounded-xl">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Est. Power</span>
                <span className="text-sm font-extrabold font-mono text-indigo-400 mt-1 block">
                  {extractedData.estimatedConsumptionKwh}
                </span>
                <span className="text-[9px] text-slate-450 block mt-0.5">kWh/mo</span>
              </div>
            </div>

            {/* Findings Text block */}
            <div className="bg-slate-950/40 p-3.5 border border-slate-850/60 rounded-xl text-left">
              <span className="text-[10px] font-mono text-slate-450 font-bold uppercase tracking-widest block mb-1">
                Auditor Findings:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {/* FIXED: Uses clean string normalization regex or values to swap out any stray backend "USD" mentions with localized currency states on the fly */}
                {extractedData.summaryOfFindings.replace(/\bUSD\b/g, currency).replace(/\$/g, symbol)}
              </p>
            </div>

            {/* Estimated Clean Energy Savings */}
            <div className="bg-amber-500/5 p-3.5 border border-amber-500/10 rounded-xl text-left">
              <div className="flex items-center space-x-2 text-amber-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Estimated Savings potential
                </span>
              </div>
              <p className="text-xs text-amber-250 font-bold mt-1.5 leading-relaxed font-mono">
                {extractedData.estimatedSavingsPotential.replace(/\bUSD\b/g, currency).replace(/\$/g, symbol)}
              </p>
            </div>

            {/* Recommended Action Guide */}
            <div className="text-left space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Recommended actions:
              </span>
              <div className="space-y-2">
                {extractedData.recommendedActions.map((action, idx) => (
                  <div key={idx} className="flex gap-2.5 bg-slate-950/30 p-2.5 border border-slate-850/30 rounded-xl">
                    <div className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-550/20 text-amber-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {action.replace(/\bUSD\b/g, currency).replace(/\$/g, symbol)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row wrapper */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-350 hover:text-slate-200 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
              >
                Clear Audit & Analyze New Bill
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Handling of Error state displays */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2.5 text-left">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-red-300 leading-relaxed">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
