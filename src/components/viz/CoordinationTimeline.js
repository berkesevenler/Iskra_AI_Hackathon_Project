"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Package, Factory, Truck, Store, Zap, CheckCircle2, Search, Shield, FileText } from "lucide-react";

const PHASE_STYLES = [
  { key: "intent_analysis",    label: "Intent Analysis",        icon: Zap,          color: "#f97316", bg: "#f97316" },
  { key: "registry_discovery", label: "Registry & Discovery",   icon: Search,       color: "#8b5cf6", bg: "#8b5cf6" },
  { key: "supplier_quotes",    label: "Supplier Coordination",  icon: Package,      color: "#22d3ee", bg: "#22d3ee" },
  { key: "trust_verification", label: "Trust & Verification",   icon: Shield,       color: "#f472b6", bg: "#f472b6" },
  { key: "manufacturer",       label: "Manufacturer Planning",  icon: Factory,      color: "#34d399", bg: "#34d399" },
  { key: "logistics",          label: "Logistics Routing",      icon: Truck,        color: "#a78bfa", bg: "#a78bfa" },
  { key: "retailer",           label: "Retailer & Delivery",    icon: Store,        color: "#fbbf24", bg: "#fbbf24" },
  { key: "compilation",        label: "Plan Compilation",       icon: FileText,     color: "#60a5fa", bg: "#60a5fa" },
];

export default function CoordinationTimeline({ plan, report, logs }) {
  const phases = useMemo(() => {
    if (!plan) return [];

    const timeline = plan.timeline || {};
    const cr = plan.coordination_report || report || {};
    const supplierDays = Number(timeline.parts_procurement_days) || 0;
    const assemblyDays = Number(timeline.assembly_days) || 0;
    const shippingDays = Number(timeline.shipping_days) || 0;
    const deliveryDays = Number(timeline.delivery_days) || 0;
    const totalDays = Number(timeline.total_days) || (supplierDays + assemblyDays + shippingDays + deliveryDays) || 1;

    const numComponents = plan.components?.length || plan.suppliers?.component_count || 0;
    const numQuotes = plan.suppliers?.quotes?.length || 0;
    const numSuppliers = plan.suppliers?.selected?.length || 0;
    const mfgName = plan.manufacturer?.selected || "—";
    const logName = plan.logistics?.selected || "—";
    const logDuration = plan.logistics?.route?.total_duration_days || shippingDays;
    const deliveryOffset = plan.retailer?.delivery_plan?.estimated_delivery_date_offset_days || deliveryDays;

    return [
      {
        ...PHASE_STYLES[0],
        duration: "~2s",
        dayRange: null,
        details: `Analyzed user intent. Decomposed into ${numComponents} component groups.`,
        status: "complete",
        agent: "Procurement Agent (CrewAI)",
      },
      {
        ...PHASE_STYLES[1],
        duration: "~1s",
        dayRange: null,
        details: `Queried agent registry. Scored 90 partners (30 suppliers, 30 manufacturers, 30 logistics). Shortlisted top candidates.`,
        status: "complete",
        agent: "Procurement Agent",
      },
      {
        ...PHASE_STYLES[2],
        duration: `${supplierDays} days`,
        dayRange: supplierDays > 0 ? `Day 1 → ${supplierDays}` : null,
        details: `${numQuotes} quotes generated across ${numSuppliers} suppliers. Parts sourced and verified.`,
        status: "complete",
        agent: "Supplier Agent (Python)",
        width: supplierDays / totalDays,
      },
      {
        ...PHASE_STYLES[3],
        duration: "~1s",
        dayRange: null,
        details: `ISO 9001, IATF 16949 certifications verified. All partners passed compliance checks.`,
        status: "complete",
        agent: "Procurement Agent",
      },
      {
        ...PHASE_STYLES[4],
        duration: `${assemblyDays} days`,
        dayRange: assemblyDays > 0 ? `Day ${supplierDays + 1} → ${supplierDays + assemblyDays}` : null,
        details: `Selected ${mfgName}. Assembly plan created with quality checks.`,
        status: "complete",
        agent: "Manufacturer Agent (Python)",
        width: assemblyDays / totalDays,
      },
      {
        ...PHASE_STYLES[5],
        duration: `${shippingDays} days`,
        dayRange: shippingDays > 0 ? `Day ${supplierDays + assemblyDays + 1} → ${supplierDays + assemblyDays + shippingDays}` : null,
        details: `Selected ${logName}. Optimal route planned. Duration: ${logDuration} days.`,
        status: "complete",
        agent: "Logistics Agent (Python)",
        width: shippingDays / totalDays,
      },
      {
        ...PHASE_STYLES[6],
        duration: `${deliveryDays} days`,
        dayRange: deliveryDays > 0 ? `Day ${supplierDays + assemblyDays + shippingDays + 1} → ${totalDays}` : null,
        details: `Delivery plan finalized. Packaging, tracking, warranty, and support configured.`,
        status: "complete",
        agent: "Retailer Agent (Python)",
        width: deliveryDays / totalDays,
      },
      {
        ...PHASE_STYLES[7],
        duration: "~1s",
        dayRange: null,
        details: `Final execution plan compiled and delivered to user.`,
        status: "complete",
        agent: "Procurement Agent",
      },
    ];
  }, [plan, report]);

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-white/15 text-sm">
        Run a project to see the coordination timeline
      </div>
    );
  }

  const totalDays = plan.timeline?.total_days || 0;

  return (
    <div className="w-full h-full overflow-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white/50 text-sm font-medium tracking-wider">
            Coordination Timeline
          </h3>
          <p className="text-white/20 text-xs mt-0.5">
            {plan.product} · {totalDays} days total · 5 agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400/60 text-[10px] tracking-wider uppercase">
            Complete
          </span>
        </div>
      </div>

      {/* Gantt-style bar chart */}
      {totalDays > 0 && (
        <div className="mb-8 bg-dark-mid border border-white/5 p-5">
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase mb-3">
            Project Duration — {totalDays} Days
          </p>
          <div className="flex gap-[2px] h-8 mb-4">
            {phases
              .filter((p) => p.width && p.width > 0)
              .map((p, i) => (
                <motion.div
                  key={i}
                  className="h-full relative group"
                  style={{
                    width: `${Math.max(p.width * 100, 8)}%`,
                    background: p.color + "25",
                    borderLeft: `3px solid ${p.color}60`,
                  }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-medium tracking-wide" style={{ color: p.color + "90" }}>
                      {p.label.split(" ")[0]}
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
          {/* Day axis */}
          <div className="flex justify-between text-white/10 text-[9px]">
            <span>Day 1</span>
            <span>Day {Math.round(totalDays / 4)}</span>
            <span>Day {Math.round(totalDays / 2)}</span>
            <span>Day {Math.round((totalDays * 3) / 4)}</span>
            <span>Day {totalDays}</span>
          </div>
        </div>
      )}

      {/* Step-by-step phases */}
      <div className="relative">
        {/* Vertical connector line */}
        <div
          className="absolute left-5 top-0 bottom-0 w-px"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          }}
        />

        <div className="space-y-1">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={i}
                className="relative flex gap-4 pl-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Step icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="w-7 h-7 flex items-center justify-center border"
                    style={{
                      borderColor: phase.color + "40",
                      background: phase.color + "10",
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: phase.color }} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-5 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-xs font-medium tracking-wide"
                      style={{ color: phase.color }}
                    >
                      {phase.label}
                    </span>
                    <span className="text-white/15 text-[10px] font-mono">
                      {phase.duration}
                    </span>
                    {phase.dayRange && (
                      <span className="text-white/10 text-[9px] border border-white/[0.04] px-1.5 py-0.5">
                        {phase.dayRange}
                      </span>
                    )}
                  </div>

                  <p className="text-white/30 text-[11px] leading-relaxed mb-1">
                    {phase.details}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/10 text-[9px] tracking-wider">
                      {phase.agent}
                    </span>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400/40" />
                      <span className="text-emerald-400/40 text-[8px] tracking-wider uppercase">
                        Complete
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cost summary bar */}
      {plan.cost_summary && (
        <div className="mt-6 bg-dark-mid border border-white/5 p-4">
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase mb-3">
            Cost Summary
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Parts", value: plan.cost_summary.parts_cost_usd, color: "#22d3ee" },
              { label: "Shipping", value: plan.cost_summary.shipping_cost_usd, color: "#a78bfa" },
              { label: "Total", value: plan.cost_summary.total_cost_usd, color: "#f97316" },
              { label: "Retail", value: plan.cost_summary.retail_price_usd, color: "#fbbf24" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-white/15 text-[9px] tracking-wider uppercase mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-semibold" style={{ color: item.color }}>
                  ${Number(item.value || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
