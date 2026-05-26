/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculatorResults } from '../types';
import { ExtractedBillData } from './BillAnalyzer';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  isStreaming?: boolean;
}

interface AIEnergyAdvisorProps {
  monthlyBill: number;
  sunHours: number;
  results: CalculatorResults;
  roofOrientation: string;
  billExtractedData?: ExtractedBillData | null;
  currency?: string;
  currencySymbol?: string;
}

export default function AIEnergyAdvisor({
  monthlyBill,
  sunHours,
  results,
  roofOrientation,
  billExtractedData,
  currency = 'USD',
  currencySymbol = '$',
}: AIEnergyAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialGeneratedRef = useRef(false);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages, isLoading]);

  // Sync initial personalized recommendation message once, but update it when the state undergoes major changes if chat is empty
  useEffect(() => {
    const symbol = currencySymbol;
    const initialText = `Hey there! 👋 I see your monthly bill is averaging ${symbol}${monthlyBill}. Based on your calculation data, I can help you figure out how to lower your ${results.paybackPeriodYears}-year break-even point. What's on your mind?`;

    if (messages.length === 0 || !initialGeneratedRef.current || (messages.length === 1 && messages[0].id === 'init-msg')) {
      setMessages([
        {
          id: 'init-msg',
          role: 'assistant',
          text: initialText,
        },
      ]);
      initialGeneratedRef.current = true;
    }
  }, [monthlyBill, results.paybackPeriodYears, currency, currencySymbol]);

  // Proactively notify user in chat when bill is analyzed & automatically open assistant
  useEffect(() => {
    if (billExtractedData) {
      const symbol = currencySymbol;
      const summaryText = `🎉 *Electricity Bill Audited!* I've run an analysis on your uploaded document:

- **Bills:** ${symbol}${billExtractedData.extractedBillAmount}/month (Extracted)
- **Grid Rate:** ${symbol}${billExtractedData.utilityRate.toFixed(2)}/kWh (Calibrated)
- **Power Usage:** ${billExtractedData.estimatedConsumptionKwh} kWh/month

**My Auditor Observations:** 
${billExtractedData.summaryOfFindings}

**Rooftop Offsets Forecast:**
${billExtractedData.estimatedSavingsPotential}

I've automatically synchronized your sliders with these key settings so the entire 3D solar model matches your actual utility footprints. Feel free to ask me questions specifically about these energy actions!`;

      setMessages((prev) => [
        ...prev,
        {
          id: `bill-audit-${Date.now()}`,
          role: 'assistant',
          text: summaryText,
        },
      ]);
      setIsOpen(true);
      setHasNewMessage(true);
    }
  }, [billExtractedData, currency]);

  // Handle Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    setIsLoading(true);

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `ai-${Date.now()}`;

    // Add user message to local array
    const updatedMessages = [
      ...messages,
      { id: userMsgId, role: 'user', text: userText } as Message,
    ];
    setMessages(updatedMessages);

    // Prepare streaming state with temporary empty assistant msg
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: 'assistant', text: '', isStreaming: true },
    ]);

    try {
      const symbol = currency === 'INR' ? '₹' : '$';
      const currencyLabel = currency === 'INR' ? 'INR (₹)' : 'USD ($)';
      // Build systemic prompt context dynamically using active calculator values
      const systemInstruction = `You are an objective, elite clean-energy consultant. Provide advice on solar installations, payback estimation, and carbon reductions based on the user's specific parameters. All prices are calculated and displayed in ${currencyLabel}.

${billExtractedData ? `
The user has uploaded and analyzed their actual electricity bill.
Extracted Details:
- Bill amount: ${symbol}${billExtractedData.extractedBillAmount}/month
- Estimated Consumption: ${billExtractedData.estimatedConsumptionKwh} kWh/month
- Extracted Utility Rate: ${symbol}${billExtractedData.utilityRate.toFixed(2)}/kWh
- Bill Audit Summary: ${billExtractedData.summaryOfFindings}
- AI Recommended actions for this bill: ${billExtractedData.recommendedActions.join(', ')}
- Solar savings potential details: ${billExtractedData.estimatedSavingsPotential}
` : ''}

Current User Calibration Data:
- Monthly Bill: ${symbol}${monthlyBill}/month
- Peak Sun Hours: ${sunHours} hours/day
- Recommended Solar System Size: ${results.systemSizeKw.toFixed(2)} kW
- Estimated Payback Break-even: ${results.paybackPeriodYears} years
- Cumulative 25-Year Savings: ${symbol}${results.lifetimeSavings25Years.toLocaleString()}
- Panels Recommended: ${results.panelsNeeded} panels
- Roof Orientation: ${roofOrientation}

Keep your responses conversional, highly positive, concise, and focused on clean-energy efficiency. Avoid listing engineering variables unless requested.

Strict Monetization Directive:
If the user asks high-intent buying questions (e.g., "How do I buy panels?", "Where do I find an installer?", "Are there rebates?", "Get installer quotes", "Connect with installer", "purchase panels", "buy standard boards"), you MUST instruct them to use our dedicated local matching tool and explicitly output the special trigger string:
[CTA:Compare local installer quotes securely here]
Ensure you include that EXACT bracketed string value. The UI will render it as a styled button.`;

      // Call Express server-side route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
          systemInstruction,
        }),
      });

      if (!response.ok) {
        let serverErrorMsg = '';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            serverErrorMsg = errorData.error;
          } else {
            const textResponse = await response.text();
            if (textResponse.includes('<!DOCTYPE html>') || textResponse.includes('The page')) {
              serverErrorMsg = "Server Configuration Error: The server returned an HTML error. This typically indicates that your GEMINI_API_KEY is not configured or is missing in your deployed application settings. Please verify your secrets in the settings panel.";
            } else {
              serverErrorMsg = `Server response error (${response.status}): ${textResponse.substring(0, 100)}`;
            }
          }
        } catch {
          serverErrorMsg = `Server error code: ${response.status}`;
        }
        throw new Error(serverErrorMsg || 'Failed to start streaming context');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let currentResponseText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const content = line.slice(6).trim();
              if (content === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(content);
                if (parsed.text) {
                  currentResponseText += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, text: currentResponseText }
                        : msg
                    )
                  );
                }
              } catch (err) {
                // Ignore JSON parsing errors for partial frames
              }
            }
          }
        }
      }

      // Mark streaming as finalized
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = error?.message || 'Sorry, I encountered an issue connecting to the AI system. Please verify your network connection and retry.';
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                text: errorMessage,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger high conversion scrolling interaction matching the bottom affiliate area
  const handleCtaClick = () => {
    setIsOpen(false);
    const adBottom = document.getElementById('ad-bottom');
    if (adBottom) {
      adBottom.scrollIntoView({ behavior: 'smooth' });
      // Temporary highlighted pulsing feedback to direct user focus
      adBottom.classList.add('animate-[pulse_1.5s_infinite]');
      setTimeout(() => {
        adBottom.classList.remove('animate-[pulse_1.5s_infinite]');
      }, 4500);
    }
  };

  // Split and render content dynamically containing custom high-conversion CTAs
  const renderMessageText = (text: string) => {
    const ctaIdentifier = '[CTA:Compare local installer quotes securely here]';
    if (!text.includes(ctaIdentifier)) {
      return <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-line">{text}</p>;
    }

    const parts = text.split(ctaIdentifier);
    return (
      <div className="space-y-3.5">
        <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-line">{parts[0]}</p>
        <button
          onClick={handleCtaClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 border border-amber-450/40 text-slate-950 font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Compare local installer quotes securely here
        </button>
        {parts[1] && <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-line">{parts[1]}</p>}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-[340px] sm:w-[380px] h-[480px] max-h-[80vh] bg-slate-900/95 backdrop-blur-2xl border border-slate-800/80 rounded-[28px] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-amber-500/20 pointer-events-auto"
          >
            {/* Chat header area */}
            <div className="p-4 border-b border-slate-850 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-550 border-2 border-slate-900 rounded-full animate-pulse"></span>
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black tracking-wider text-slate-100 font-display">
                    SOLARIS AI ADVISOR
                  </h3>
                  <p className="text-[9px] font-mono text-amber-500 font-extrabold uppercase tracking-widest mt-0.5">
                    Context Aware Engine
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-850/65 transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Context Sync Info HUD */}
            <div className="px-4 py-2 bg-slate-950/30 border-b border-slate-850/45 flex items-center justify-between text-[10px] text-slate-450 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Bill: {currencySymbol}{monthlyBill}/mo
              </span>
              <span>Orientation: {roofOrientation.toUpperCase()}</span>
              <span>Size: {results.systemSizeKw.toFixed(1)} kW</span>
            </div>

            {/* Chat messages feed zone */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[20px] p-3.5 text-left transition-all duration-300 relative ${
                      m.role === 'user'
                        ? 'bg-slate-950/80 border border-slate-850 text-slate-200 rounded-tr-[4px]'
                        : 'bg-slate-950/40 border border-amber-500/10 text-slate-300 rounded-tl-[4px] shadow-sm'
                    }`}
                  >
                    {renderMessageText(m.text)}

                    {/* Quick stream indicator cursor */}
                    {m.isStreaming && m.text.length > 0 && (
                      <span className="inline-block w-1.5 h-3 bg-amber-400 animate-pulse ml-0.5" />
                    )}
                  </div>
                </div>
              ))}

              {/* Server loading indicator */}
              {isLoading && messages[messages.length - 1]?.text === '' && (
                <div className="flex justify-start">
                  <div className="bg-slate-950/40 border border-amber-500/10 rounded-[20px] rounded-tl-[4px] p-3.5 space-y-2 w-[70px] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-[bounce_1.2s_infinite]"></span>
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-[bounce_1.2s_infinite_0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-[bounce_1.2s_infinite_0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form base */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-850 bg-slate-950/70">
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your solar payback, size, or rebates..."
                  className="w-full bg-slate-950/90 border border-slate-850 text-slate-200 text-xs rounded-xl pl-3.5 pr-12 py-2.5 focus:outline-none focus:border-amber-500/50 font-sans tracking-wide"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-1.5 p-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-500/35 text-slate-950 font-bold rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-md"
                >
                  <Send className="w-3 h-3 text-slate-950" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row container for badge & floating trigger */}
      <div className="flex items-center pointer-events-auto mt-4 gap-3">
        {/* Glassmorphic Invitation Badge */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.95 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="px-3 py-1.5 bg-slate-950/70 backdrop-blur-xl border border-slate-800/80 rounded-xl text-[9px] font-mono font-medium uppercase tracking-[0.16em] text-slate-300 shadow-xl flex items-center gap-2 hover:border-amber-500/30 transition-all duration-300"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span>AI ASSISTANT</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Glassmorphic Bubble Trigger */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setHasNewMessage(false);
          }}
          className="p-4 bg-slate-950/60 backdrop-blur-xl border border-slate-800 hover:border-amber-500/40 text-amber-400 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] cursor-pointer flex items-center justify-center relative group transition-colors duration-300 pointer-events-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          title="Chat with Solaris AI Advisor"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5.5 h-5.5 text-amber-400 stroke-[2.5]" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageSquare className="w-5.5 h-5.5 text-amber-400 stroke-[2.5]" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Unread dot notification bubble */}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 block w-3 h-3 bg-amber-500 border-2 border-slate-950 rounded-full animate-pulse"></span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
