import React, { useState } from 'react';
import { HeatmapPoint, Transaction } from '@/shared/types/fraud';
import { MapPin, Globe } from 'lucide-react';

interface GeoHeatmapProps {
  heatmapPoints: HeatmapPoint[];
  latestTransactions: Transaction[];
}

export const GeoHeatmap: React.FC<GeoHeatmapProps> = ({
  heatmapPoints,
  latestTransactions,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null);

  // Filter latest high risk transactions with speed jumps for velocity arcs
  const highSpeedJumps = latestTransactions.filter(
    (tx) => tx.speedKmh && tx.speedKmh > 500 && tx.previousLocation
  );

  // Helper to map lat/lng to SVG coordinates (Equirectangular Projection)
  const getSvgCoordinates = (lat: number, lng: number) => {
    // Width = 900, Height = 450
    const x = ((lng + 180) / 360) * 900;
    const y = ((90 - lat) / 180) * 450;
    return { x, y };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
              Geographic Threat & Velocity Heatmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time global transaction nodes and impossible geographic travel jumps
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>Normal Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500 inline-block"></span>
            <span>Medium Threat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500 inline-block"></span>
            <span>High Risk Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-6 bg-rose-500 border-b border-dashed border-rose-300 inline-block"></span>
            <span>Geo-Speed Arc</span>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 aspect-[2/1] min-h-[360px] flex items-center justify-center p-2">
        <svg viewBox="0 0 900 450" className="w-full h-full object-contain">
          {/* Subtle World Map Outline Grid */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
          </pattern>
          <rect width="900" height="450" fill="url(#grid)" />

          {/* Continents Vector Outlines Representation */}
          <path
            d="M150 120 Q180 100 240 110 T300 160 T250 220 T180 180 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M260 250 Q280 260 320 320 T280 390 T240 310 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M420 100 Q480 90 530 110 T510 180 T440 160 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M480 200 Q520 220 540 280 T500 340 T460 260 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M580 90 Q680 80 800 120 T780 220 T620 180 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M720 300 Q780 310 820 340 T760 380 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />

          {/* Draw Impossible Geo-Velocity Jump Arcs */}
          {highSpeedJumps.map((tx) => {
            if (!tx.previousLocation) return null;
            const from = getSvgCoordinates(tx.previousLocation.lat, tx.previousLocation.lng);
            const to = getSvgCoordinates(tx.location.lat, tx.location.lng);

            // Curve control point
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 - 40;

            return (
              <g key={`arc-${tx.id}`}>
                <path
                  d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse opacity-80"
                />
                <circle cx={to.x} cy={to.y} r="6" fill="#f43f5e" opacity="0.4" className="animate-ping" />
              </g>
            );
          })}

          {/* Render Heatmap Nodes */}
          {heatmapPoints.map((pt) => {
            const { x, y } = getSvgCoordinates(pt.lat, pt.lng);
            const isHighRisk = pt.maxRiskScore >= 60 || pt.fraudCount > 2;
            const isMedium = pt.maxRiskScore >= 35;

            const color = isHighRisk ? '#f43f5e' : isMedium ? '#f59e0b' : '#10b981';
            const radius = Math.min(18, Math.max(7, pt.txCount * 2));

            return (
              <g
                key={`node-${pt.city}-${pt.country}`}
                onClick={() => setSelectedPoint(pt)}
                className="cursor-pointer group"
              >
                {/* Glow ring */}
                <circle cx={x} cy={y} r={radius + 4} fill={color} opacity="0.25" />
                {/* Core node */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={color}
                  className="transition-transform group-hover:scale-125"
                />
                {/* Label */}
                <text
                  x={x}
                  y={y - radius - 4}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow"
                >
                  {pt.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Node Hover/Click Modal Box */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 z-20 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-700 text-white shadow-xl max-w-xs text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-bold text-sm flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-indigo-400" />
                {selectedPoint.city}, {selectedPoint.country}
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>Total Transactions: <span className="font-mono font-bold text-indigo-300">{selectedPoint.txCount}</span></div>
              <div>Flagged Threat: <span className="font-mono font-bold text-rose-400">{selectedPoint.fraudCount}</span></div>
              <div>Peak Risk Score: <span className="font-mono font-bold text-amber-300">{selectedPoint.maxRiskScore}/100</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
