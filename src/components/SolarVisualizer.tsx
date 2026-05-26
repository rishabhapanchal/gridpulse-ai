/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sun, ShieldCheck, Zap, Info, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SolarVisualizerProps {
  panelsNeeded: number;
  systemSizeKw: number;
  sunHours: number;
  onSunHoursChange: (hours: number) => void;
  equivalentTrees: number;
  carbonReducedTons: number;
  roofOrientation: 'south' | 'west' | 'east' | 'north';
}

export default function SolarVisualizer({
  panelsNeeded,
  systemSizeKw,
  sunHours,
  onSunHoursChange,
  equivalentTrees,
  carbonReducedTons,
  roofOrientation,
}: SolarVisualizerProps) {
  const [hoveredPanelIndex, setHoveredPanelIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Do not rotate the rooftop solar array model
  const rotateAngle = 0;

  // We can represent a grid of 24 maximum panels on the isometric roof
  const maxPanelsInVisualizer = 24;
  const activePanels = Math.min(panelsNeeded, maxPanelsInVisualizer);

  // Generate coordinate array for a nice perspective roof layout (4 columns x 6 rows)
  const roofPanels = [];
  const rows = 4;
  const cols = 6;
  const spacingX = 24;
  const spacingY = 12;

  // Origin point of the isometric roof plane
  const originX = 140;
  const originY = 60;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;
      // Isometric projection coordinate transformations
      const x = originX + (c * spacingX) - (r * spacingY * 0.8);
      const y = originY + (r * spacingY) + (c * spacingX * 0.4);
      
      roofPanels.push({
        index,
        x,
        y,
        active: index < activePanels,
      });
    }
  }

  // Handle circular sun slider dragging
  const handleSunClick = (e: React.MouseEvent, hours: number) => {
    e.stopPropagation();
    onSunHoursChange(hours);
  };

  return (
    <div className="w-full glass-panel rounded-[28px] p-6 relative overflow-hidden flex flex-col justify-between h-[350px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section of visualizer */}
      <div className="z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-amber-450 font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
              Photovoltaic Array HUD
            </span>
          </div>
          <h2 className="text-base font-glass-title font-bold mt-2">
            Rooftop Solar Array
          </h2>
        </div>

        <div className="text-right">
          <div className="text-[9px] text-slate-450 font-mono uppercase tracking-wider">Size Config</div>
          <div className="text-sm font-black font-display text-amber-400 mt-0.5">
            {systemSizeKw.toFixed(2)} kWp
          </div>
        </div>
      </div>

      {/* Main Isometric SVG Graphic */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full h-[185px] relative flex justify-center items-center my-1 select-none cursor-pointer bg-slate-950/20 hover:bg-slate-950/40 border border-slate-800/10 hover:border-amber-500/20 rounded-2xl transition-all duration-300 group/roof shadow-inner"
        title="Click to view detailed specs & environmental impact"
      >
        {/* Floating click indicator badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-950/70 border border-slate-800/40 text-[8px] font-mono tracking-widest text-[#fbbf24] px-2 py-0.5 rounded-md flex items-center gap-1.5 opacity-65 group-hover/roof:opacity-100 transition-opacity duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          CLICK AREA TO CONFIGURE
        </div>
        <svg
          viewBox="0 0 320 180"
          className="w-full h-full max-w-[340px] drop-shadow-[0_0_15px_rgba(245,158,11,0.04)]"
          style={{ overflow: 'visible' }}
        >
          {/* DEFINITIONS FOR GLOW FILTERS */}
          <defs>
            <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* STATIC OVERLAY DIRECTIONAL COMPASS FOR ISOMETRIC ROTATION EXPLANATION */}
          <g opacity="0.35" className="font-mono text-[9px] font-semibold">
            {/* Outer dotted alignment circle */}
            <ellipse cx="140" cy="105" rx="108" ry="52" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" strokeDasharray="3 3"/>
            
            {/* Axis marks & Labels */}
            <text x="140" y="44" textAnchor="middle" className="fill-slate-500 hover:fill-amber-400 transition-colors duration-200">N</text>
            <text x="256" y="108" textAnchor="start" className="fill-slate-500 hover:fill-amber-400 transition-colors duration-200">E</text>
            <text x="140" y="171" textAnchor="middle" className="fill-slate-500 hover:fill-amber-400 transition-colors duration-200">S</text>
            <text x="24" y="108" textAnchor="end" className="fill-slate-500 hover:fill-amber-400 transition-colors duration-200">W</text>
          </g>

          {/* ISOMETRIC GRID BASE PLATFORM */}
          <polygon
            points="160,165 290,105 160,45 30,105"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* DYNAMIC HOUSE GROUP COMPONENT ROTATED TOWARDS COMPASS POINTS */}
          <motion.g
            animate={{ rotate: rotateAngle }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
            style={{ transformOrigin: "140px 105px" }}
          >
            {/* HOUSE WIREFRAME STRUCTURE */}
            {/* Base structure floor foundation */}
            <polygon
              points="140,145 230,105 140,65 50,105"
              fill="rgba(8, 8, 10, 0.65)"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Walls */}
            {/* South-West Wall */}
            <polygon
              points="50,105 140,145 140,110 50,70"
              fill="none"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* South-East Wall */}
            <polygon
              points="140,145 230,105 230,70 140,110"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Rooftop Outline / Attic triangles */}
            <polygon
              points="50,70 140,110 140,60"
              fill="rgba(245, 158, 11, 0.05)"
              stroke="#334155"
              strokeWidth="1"
            />
            <polygon
              points="140,110 230,70 230,30 140,60"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* ROOFTOP PLANE (where panels mount) */}
            <polygon
              points="50,70 140,110 140,60 50,70"
              fill="none"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* ACTIVE & INACTIVE SOLAR PANELS */}
            {roofPanelPanelsGroup(roofPanels, hoveredPanelIndex, setHoveredPanelIndex)}

            {/* Energy flow beam from solar panels to household inverter (always aligned with house inverter) */}
            {panelsNeeded > 0 && (
              <path
                d="M 140,95 L 140,128"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-[dash_1.5s_linear_infinite]"
                style={{
                  strokeDashoffset: 10,
                }}
              />
            )}

            {/* Power Inverter inside the moving group */}
            <circle
              cx="140"
              cy="128"
              r="3.5"
              fill="#fbbf24"
              className="animate-ping absolute origin-center"
              style={{ animationDuration: '3s' }}
            />
            <circle cx="140" cy="128" r="2.5" fill="#f59e0b" />
          </motion.g>

          {/* SUN ORBIT PATH AND GLOWING SUN - ALWAYS KEEPS THE PHYSICAL SKY STABLE */}
          {/* Sunrise to Sunset Arc */}
          <path
            d="M 40,75 A 130,100 0 0,1 280,75"
            fill="none"
            stroke="rgba(245, 158, 11, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Drag-adjustable/clickable Sun indicators over key hour nodes */}
          {[3.0, 4.0, 4.5, 5.5, 6.5].map((hours) => {
            // Map sun hours to positions along the arc
            const anglePct = (hours - 2.5) / 5.0; 
            const angleRad = Math.PI - (anglePct * 0.7 * Math.PI + 0.15 * Math.PI);
            
            const rX = 125;
            const rY = 65;
            const sX = 160 + rX * Math.cos(angleRad);
            const sY = 125 + rY * Math.sin(angleRad);
            const isSelected = Math.abs(sunHours - hours) < 0.25;

            return (
              <g key={hours} className="cursor-pointer group" onClick={(e) => handleSunClick(e, hours)}>
                {/* Visual Sun Hour Node */}
                <circle
                  cx={sX}
                  cy={sY}
                  r={isSelected ? 6 : 3}
                  className={`transition-all duration-300 ${
                    isSelected 
                      ? 'fill-amber-400 stroke-amber-500/40 stroke-[6px]' 
                      : 'fill-slate-700 hover:fill-amber-300 stroke-[#1e293b] stroke-[1px]'
                  }`}
                  filter={isSelected ? 'url(#sun-glow)' : undefined}
                />
                
                {/* Sun Hour Indicator Labels */}
                {isSelected && (
                  <g>
                    <rect
                      x={sX - 22}
                      y={sY - 22}
                      width="44"
                      height="14"
                      rx="3"
                      fill="rgba(15, 23, 42, 0.85)"
                      stroke="rgba(245, 158, 11, 0.35)"
                      strokeWidth="0.8"
                    />
                    <text
                      x={sX}
                      y={sY - 12}
                      textAnchor="middle"
                      className="fill-amber-300 font-mono text-[8px] font-bold"
                    >
                      {hours} Hrs
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dashboard floating panels summary */}
        <div className="absolute bottom-1.5 right-2 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800/80 px-2.5 py-1.5 flex items-center space-x-1.5 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
          <span className="text-[9px] font-mono text-slate-350 font-medium">
            {activePanels} / {maxPanelsInVisualizer} Panels Powered
          </span>
        </div>
      </motion.div>

      {/* Array Status footer summary */}
      <div className="border-t border-slate-850/60 pt-3 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-450/15 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-450 uppercase tracking-wider">
              Total Recommended
            </div>
            <div className="text-xs font-black text-amber-400 font-display">
              {panelsNeeded} Panels
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-950/40 border border-slate-850 rounded-xl px-3 py-1.5 text-[10px] text-slate-400 font-sans">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Click dynamic sun nodes on the arc to customize irradiance.</span>
        </div>
      </div>

      {/* DETAILED GLASSMORPHISM MODAL - SPECIFICATIONS AND ENVIRONMENTAL IMPACT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-x-0 inset-y-0 bg-slate-950/80 backdrop-blur-md"
            ></motion.div>

            {/* Modal Body card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-amber-500/30 rounded-[28px] p-6 shadow-[0_20px_50px_rgba(245,158,11,0.15)] z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative radial glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-4 -mt-4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none -ml-4 -mb-4" />

              {/* Close Button element */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header section of Modal */}
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-450">
                  <Leaf className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-amber-450 font-mono">
                    Solaris Array Audit
                  </h4>
                  <h3 className="text-base font-extrabold text-slate-100 font-display">
                    Hardware &amp; Eco Specs
                  </h3>
                </div>
              </div>

              {/* Specs Detailed Lists */}
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed font-sans text-left">
                  The recommended array model leverages raw satellite diagnostic layouts factoring local roof coordinates, pitch parameters, and solar density:
                </p>

                {/* Grid items */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-3 shadow-inner">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block text-left">
                      Recommended Hardware
                    </span>
                    <span className="text-amber-400 font-extrabold font-display text-sm mt-1 block text-left">
                      {panelsNeeded} Photovoltaic Panels
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-sans text-left">
                      Solid glass tier-1 silicon
                    </span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-3 shadow-inner">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block text-left">
                      Array Peak Capacity
                    </span>
                    <span className="text-slate-100 font-extrabold font-display text-sm mt-1 block text-left">
                      {systemSizeKw.toFixed(1)} kWp Peak
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-sans text-left">
                      Direct power potential
                    </span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-3 shadow-inner col-span-2 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">
                        Equivalent Trees Planted
                      </span>
                      <span className="text-amber-400 font-black font-display text-base mt-0.5 block">
                        {equivalentTrees} Trees
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block font-sans text-left">
                        Equivalent reduction over 10yr period
                      </span>
                    </div>
                    <div className="text-amber-450 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <Sun className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-3 shadow-inner col-span-2 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">
                        Annual CO₂ Reduced
                      </span>
                      <span className="text-amber-400 font-black font-display text-base mt-0.5 block">
                        {carbonReducedTons} Metric Tons
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block font-sans text-left">
                        Avoided grid utility coal extraction
                      </span>
                    </div>
                    <div className="text-amber-450 p-2 bg-amber-550/10 border border-amber-500/20 rounded-xl text-amber-450">
                      <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Disclaimer info */}
                <div className="flex items-start space-x-1.5 bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-[9px] text-slate-450 leading-relaxed font-sans text-left">
                  <Info className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Carbon estimates align with standard EPA greenhouse gas equivalencies (utilizing ~0.4 kg/kWh carbon mitigation values).
                  </span>
                </div>

                {/* CTA / Close Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-xl transition-all duration-300 block shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
                >
                  Confirm Specifications
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component wrapper for roof panels drawing to optimize and clear space
function roofPanelPanelsGroup(
  roofPanels: Array<{ index: number; x: number; y: number; active: boolean }>,
  hoveredIndex: number | null,
  setHoveredIndex: (idx: number | null) => void
) {
  return (
    <g>
      {roofPanels.map((panel) => {
        const isHovered = hoveredIndex === panel.index;
        
        // Compute polygon corners of a standard flat rectangular solar panel in isometric 3D perspective
        const w = 11; // isometric panel width code
        const h = 7;  // isometric panel height code
        
        // Isometric points relative to panel.x and panel.y
        const p1 = `${panel.x},${panel.y}`;                     // top
        const p2 = `${panel.x + w},${panel.y + w * 0.45}`;       // right
        const p3 = `${panel.x + w - h},${panel.y + w * 0.45 + h}`; // bottom
        const p4 = `${panel.x - h},${panel.y + h}`;               // left
        
        return (
          <g
            key={panel.index}
            onMouseEnter={() => setHoveredIndex(panel.index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer transition-all duration-300"
          >
            {/* Panel glow backdrop */}
            {panel.active && (
              <polygon
                points={`${p1} ${p2} ${p3} ${p4}`}
                fill="rgba(245, 158, 11, 0.15)"
                stroke="transparent"
                filter="url(#gold-glow)"
              />
            )}

            {/* Main Panel outline/fill */}
            <polygon
              points={`${p1} ${p2} ${p3} ${p4}`}
              fill={
                panel.active
                  ? isHovered
                    ? 'rgba(251, 191, 36, 0.9)'
                    : 'rgba(245, 158, 11, 0.65)'
                  : isHovered
                  ? 'rgba(45, 45, 50, 0.8)'
                  : 'rgba(15, 15, 18, 0.45)'
              }
              stroke={
                panel.active
                  ? '#fbbf24'
                  : isHovered
                  ? '#5b5b66'
                  : '#1e293b'
              }
              strokeWidth={panel.active ? '1.2' : '0.6'}
              className="transition-all duration-200"
            />

            {/* Grid line gridmarks on the active panel itself for extra scientific aesthetic */}
            {panel.active && (
              <line
                x1={panel.x + w/2 - h/2}
                y1={panel.y + (w*0.45)/2 + h/2}
                x2={panel.x + w - h}
                y2={panel.y + w*0.45 + h}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.5"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
