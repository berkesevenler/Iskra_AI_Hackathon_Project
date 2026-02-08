"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Package, Factory, Truck, Store, User, ArrowRight, BookOpen, Database } from "lucide-react";

const LANE_CONFIG = {
  "User":               { icon: User,      color: "#f97316", bg: "#1a1008" },
  "Procurement Agent":  { icon: Zap,       color: "#f97316", bg: "#1a1008" },
  "Agent Registry":     { icon: BookOpen,  color: "#94a3b8", bg: "#111318" },
  "Partner Database":   { icon: Database,  color: "#94a3b8", bg: "#111318" },
  "Supplier Agent":     { icon: Package,   color: "#22d3ee", bg: "#0a1a1f" },
  "Manufacturer Agent": { icon: Factory,   color: "#34d399", bg: "#0a1a12" },
  "Logistics Agent":    { icon: Truck,     color: "#a78bfa", bg: "#120a1f" },
  "Retailer Agent":     { icon: Store,     color: "#fbbf24", bg: "#1a1508" },
};

// Normalize agent names from the report
function normalizeName(raw) {
  const map = {
    "user": "User",
    "procurement agent": "Procurement Agent",
    "procurement": "Procurement Agent",
    "agent registry": "Agent Registry",
    "partner database": "Partner Database",
    "supplier agent": "Supplier Agent",
    "supplier": "Supplier Agent",
    "manufacturer agent": "Manufacturer Agent",
    "manufacturer": "Manufacturer Agent",
    "logistics agent": "Logistics Agent",
    "logistics": "Logistics Agent",
    "retailer agent": "Retailer Agent",
    "retailer": "Retailer Agent",
    "system": "Procurement Agent",
  };
  return map[(raw || "").toLowerCase().trim()] || raw || "Unknown";
}

export default function MessageFlow({ plan, report }) {
  const scrollRef = useRef(null);
  const messages = useMemo(() => {
    const cr = plan?.coordination_report || report || {};
    return (cr.message_exchanges || []).map((m, i) => ({
      id: i,
      from: normalizeName(m.from),
      to: normalizeName(m.to),
      message: m.message,
      protocol: m.protocol || "HTTP/JSON",
    }));
  }, [plan, report]);

  // Determine which lanes are active
  const activeLanes = useMemo(() => {
    const all = new Set();
    messages.forEach((m) => {
      all.add(m.from);
      all.add(m.to);
    });
    // Fixed order
    const order = [
      "User",
      "Procurement Agent",
      "Agent Registry",
      "Partner Database",
      "Supplier Agent",
      "Manufacturer Agent",
      "Logistics Agent",
      "Retailer Agent",
    ];
    return order.filter((l) => all.has(l));
  }, [messages]);

  if (!plan && !report) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-white/15 text-sm">
        Run a project to see message flows
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-white/15 text-sm">
        No message exchanges recorded
      </div>
    );
  }

  const laneWidth = 130;
  const totalWidth = activeLanes.length * laneWidth;
  const messageHeight = 80;
  const headerHeight = 80;
  const totalHeight = headerHeight + messages.length * messageHeight + 40;

  return (
    <div className="w-full h-full overflow-auto" ref={scrollRef}>
      <div className="min-w-fit" style={{ width: Math.max(totalWidth + 60, 700) }}>
        {/* Header — Lane labels */}
        <div className="sticky top-0 z-10 flex items-end gap-0 px-5 pb-3 bg-[#0a0a0f] border-b border-white/[0.04]" style={{ height: headerHeight }}>
          {activeLanes.map((lane) => {
            const cfg = LANE_CONFIG[lane] || { color: "#666", bg: "#111" };
            const Icon = cfg.icon;
            return (
              <div
                key={lane}
                className="flex flex-col items-center justify-end"
                style={{ width: laneWidth }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center border mb-2"
                  style={{ borderColor: cfg.color + "40", background: cfg.bg }}
                >
                  {Icon && <Icon className="h-4 w-4" style={{ color: cfg.color }} />}
                </div>
                <span className="text-[9px] text-white/40 tracking-wider text-center leading-tight" style={{ maxWidth: laneWidth - 10 }}>
                  {lane}
                </span>
              </div>
            );
          })}
        </div>

        {/* Messages */}
        <svg width={totalWidth + 60} height={messages.length * messageHeight + 40} className="block">
          {/* Vertical lane lines */}
          {activeLanes.map((lane, i) => {
            const x = i * laneWidth + laneWidth / 2 + 20;
            return (
              <line
                key={`lane-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={messages.length * messageHeight + 40}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Messages */}
          {messages.map((msg, i) => {
            const fromIdx = activeLanes.indexOf(msg.from);
            const toIdx = activeLanes.indexOf(msg.to);
            if (fromIdx === -1 || toIdx === -1) return null;

            const y = i * messageHeight + 30;
            const x1 = fromIdx * laneWidth + laneWidth / 2 + 20;
            const x2 = toIdx * laneWidth + laneWidth / 2 + 20;
            const isLeftToRight = x2 > x1;
            const arrowX = isLeftToRight ? x2 - 6 : x2 + 6;
            const color = (LANE_CONFIG[msg.from] || {}).color || "#666";

            // Truncate message
            const shortMsg =
              msg.message.length > 80
                ? msg.message.slice(0, 77) + "…"
                : msg.message;
            const textX = (x1 + x2) / 2;
            const textAnchor = "middle";

            return (
              <g key={msg.id}>
                {/* Dots on lane lines */}
                <circle cx={x1} cy={y} r={3.5} fill={color} opacity={0.8} />
                <circle cx={x2} cy={y} r={3.5} fill={color} opacity={0.5} />

                {/* Arrow line */}
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={color}
                  strokeWidth={2}
                  opacity={0.7}
                  markerEnd={`url(#arrow-${i})`}
                />

                {/* Arrowhead def */}
                <defs>
                  <marker
                    id={`arrow-${i}`}
                    viewBox="0 0 10 10"
                    refX={isLeftToRight ? 9 : 1}
                    refY="5"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto"
                  >
                    <path
                      d={isLeftToRight ? "M 0 0 L 10 5 L 0 10 z" : "M 10 0 L 0 5 L 10 10 z"}
                      fill={color}
                      opacity={0.8}
                    />
                  </marker>
                </defs>

                {/* Protocol badge */}
                <rect
                  x={textX - 22}
                  y={y - 19}
                  width={44}
                  height={13}
                  rx={1}
                  fill="rgba(0,0,0,0.6)"
                  stroke={color}
                  strokeWidth={0.5}
                  opacity={0.4}
                />
                <text
                  x={textX}
                  y={y - 10}
                  textAnchor="middle"
                  fill={color}
                  fontSize={7}
                  opacity={0.5}
                  fontFamily="monospace"
                >
                  {msg.protocol}
                </text>

                {/* Message text */}
                <text
                  x={textX}
                  y={y + 16}
                  textAnchor={textAnchor}
                  fill="rgba(255,255,255,0.45)"
                  fontSize={9}
                  style={{ maxWidth: Math.abs(x2 - x1) + 60 }}
                >
                  {shortMsg}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
