/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { generateSavingsProjection, CumulativeSavingsPoint } from '../utils/calculator';
import { CalculatorResults } from '../types';

interface SavingsChartProps {
  results: CalculatorResults;
  monthlyBill: number;
  currency?: string;
  currencySymbol?: string;
}

export default function SavingsChart({ results, monthlyBill, currency = 'USD', currencySymbol = '$' }: SavingsChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<CumulativeSavingsPoint | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement | null>(null);

  const data = generateSavingsProjection(results, monthlyBill);
  const totalYears = data.length;

  // Let's scale calculations
  const maxVal = Math.max(
    data[totalYears - 1].traditionalCost,
    data[totalYears - 1].solarSavings
  ) * 1.05; // 5% padding at top

  // Chart Dimensions
  const width = 500;
  const height = 220;
  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Coordinate mapper functions
  const getX = (index: number) => {
    return paddingLeft + (index / (totalYears - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return height - paddingBottom - (value / maxVal) * chartHeight;
  };

  // Build SVG Path string for Traditional Costs (Amber/Rose line)
  let traditionalPath = '';
  let traditionalArea = `M ${getX(0)} ${getY(0)} `;
  data.forEach((p, index) => {
    const x = getX(index);
    const y = getY(p.traditionalCost);
    if (index === 0) {
      traditionalPath += `M ${x} ${y} `;
    } else {
      traditionalPath += `L ${x} ${y} `;
    }
    traditionalArea += `L ${x} ${y} `;
  });
  traditionalArea += `L ${getX(totalYears - 1)} ${getY(0)} Z`;

  // Build SVG Path string for Solar Savings (Emerald line)
  let solarPath = '';
  let solarArea = `M ${getX(0)} ${getY(0)} `;
  data.forEach((p, index) => {
    const x = getX(index);
    const y = getY(p.solarSavings);
    if (index === 0) {
      solarPath += `M ${x} ${y} `;
    } else {
      solarPath += `L ${x} ${y} `;
    }
    solarArea += `L ${x} ${y} `;
  });
  solarArea += `L ${getX(totalYears - 1)} ${getY(0)} Z`;

  // Handle MouseMove overlay tracker to render dynamic tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const xInSvg = ((e.clientX - rect.left) / rect.width) * width;
    
    // Convert coordinate to Year index
    const chartX = xInSvg - paddingLeft;
    const hoverPercent = chartX / chartWidth;
    let yearIndex = Math.round(hoverPercent * (totalYears - 1));
    yearIndex = Math.max(0, Math.min(totalYears - 1, yearIndex));

    setHoverIdx(yearIndex);
    setHoveredPoint(data[yearIndex]);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverIdx(null);
  };

  // Format currencies simply
  const formatCurrencySimple = (value: number) => {
    const symbol = currencySymbol;
    if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(0)}k`;
    }
    return `${symbol}${value}`;
  };

  const formatCurrencyFull = (value: number) => {
    try {
      return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      return `${currencySymbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  // Year ticks to show on X Axis
  const xTicks = [1, 5, 10, 15, 20, 25];

  return (
    <div className="w-full glass-panel rounded-[28px] p-6 relative flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Background Gradient Orbs */}
      <div className="absolute bottom-4 right-1/4 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-slate-400 font-bold bg-slate-800/80 border border-slate-700/50 px-2.5 py-0.5 rounded-md">
              25-Year Cumulative Forecast
            </span>
          </div>
          <h2 className="text-base font-glass-title font-bold mt-1.5">
            Cumulative Power Savings
          </h2>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[9px] font-mono text-slate-450 font-sans">Lifetime Net Benefit</span>
          <span className="text-lg font-black font-display text-amber-400 leading-tight">
            {formatCurrencyFull(results.lifetimeSavings25Years)}
          </span>
        </div>
      </div>

      {/* Dynamic Graph Chart */}
      <div className="w-full h-[220px] relative">
        <svg
          ref={chartRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ overflow: 'visible' }}
        >
          {/* Gradients declarations */}
          <defs>
            <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
            </linearGradient>
            <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const hVal = maxVal * ratio;
            const y = getY(hVal);
            return (
              <line
                key={ratio}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#1e293b"
                strokeWidth="0.8"
                strokeDasharray="2 3"
              />
            );
          })}

          {/* Grid values labels (Y-Axis) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const hVal = maxVal * ratio;
            return (
              <text
                key={ratio}
                x={paddingLeft - 8}
                y={getY(hVal) + 3}
                textAnchor="end"
                className="fill-slate-500 font-mono text-[9px]"
              >
                {formatCurrencySimple(hVal)}
              </text>
            );
          })}

          {/* Area under curves */}
          <path d={traditionalArea} fill="url(#gridGrad)" />
          <path d={solarArea} fill="url(#solarGrad)" />

          {/* Traditional Cost Path Lines */}
          <path
            d={traditionalPath}
            fill="none"
            stroke="rgba(245, 158, 11, 0.55)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Solar Cost Path Lines */}
          <path
            d={solarPath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* X Axis ticks */}
          {xTicks.map((year) => {
            const x = getX(year - 1);
            return (
              <g key={year}>
                <line
                  x1={x}
                  y1={height - paddingBottom}
                  x2={x}
                  y2={height - paddingBottom + 5}
                  stroke="#334155"
                  strokeWidth="1.2"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 17}
                  textAnchor="middle"
                  className="fill-slate-500 font-mono text-[9px] font-semibold"
                >
                  Yr {year}
                </text>
              </g>
            );
          })}

          {/* Dynamic tracking vertical line on hovered point */}
          {hoverIdx !== null && (
            <g>
              <line
                x1={getX(hoverIdx)}
                y1={paddingTop}
                x2={getX(hoverIdx)}
                y2={height - paddingBottom}
                stroke="#475569"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Traditional point circle */}
              <circle
                cx={getX(hoverIdx)}
                cy={getY(data[hoverIdx].traditionalCost)}
                r="5"
                className="fill-amber-500 stroke-slate-900 stroke-[1.5px]"
              />

              {/* Solar point circle */}
              <circle
                cx={getX(hoverIdx)}
                cy={getY(data[hoverIdx].solarSavings)}
                r="6"
                className="fill-amber-400 stroke-slate-900 stroke-[1.5px]"
                filter="url(#glow)"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltips overlay using hover index calculations */}
        {hoveredPoint && (
          <div
            className="absolute bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-slate-800 p-3 shadow-2xl z-20"
            style={{
              left: `${Math.min(
                Math.max(paddingLeft, getX(hoverIdx || 0) - 75),
                width - 150
              )}px`,
              top: `${Math.max(10, getY(hoveredPoint.solarSavings) - 95)}px`,
              width: '150px',
              pointerEvents: 'none',
              transition: 'left 0.1s ease, top 0.1s ease',
            }}
          >
            <div className="font-bold text-xs text-slate-100 font-mono tracking-tight pb-1.5 border-b border-slate-800 flex justify-between items-center">
              <span>Year {hoveredPoint.year}</span>
              {hoveredPoint.year >= results.paybackPeriodYears && (
                <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.2 rounded">
                  Profitable
                </span>
              )}
            </div>
            
            <div className="mt-1.5 space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 flex items-center gap-1 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Grid Utility:
                </span>
                <span className="font-mono text-slate-200 font-semibold">
                  {formatCurrencySimple(hoveredPoint.traditionalCost)}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 flex items-center gap-1 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Solar Savings:
                </span>
                <span className="font-mono text-amber-400 font-extrabold">
                  {formatCurrencySimple(hoveredPoint.solarSavings)}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] pt-1.5 mt-1 border-t border-slate-900">
                <span className="text-slate-500 font-sans">Net Benefit:</span>
                <span className={`font-mono font-bold ${hoveredPoint.netGain >= 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {hoveredPoint.netGain >= 0 ? '+' : ''}
                  {formatCurrencySimple(hoveredPoint.netGain)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Stats Details */}
      <div className="flex mt-4 pt-4 border-t border-slate-850/60 justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-1 rounded bg-amber-400 font-sans"></span>
            <span className="text-xs text-slate-455 font-medium font-sans">Savings with Solar</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-1 rounded bg-amber-550"></span>
            <span className="text-xs text-slate-455 font-medium font-sans">Grid Standard</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-805/10 px-2 py-0.5 rounded text-[11px] text-slate-550">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-mono text-[10px]">Rates inflate at ~3%/yr</span>
        </div>
      </div>
    </div>
  );
}
