"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Package,
  Factory,
  Truck,
  Store,
  Terminal,
  Clock,
  DollarSign,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Plus,
  X,
  MapPin,
  Shield,
  MessageSquare,
  Target,
  BarChart3,
  Layers,
} from "lucide-react";

// ═══════════════════════════════════════════
// Agent Configuration
// ═══════════════════════════════════════════

const AGENTS = [
  { id: "procurement_main", name: "Procurement", role: "Orchestrator", icon: Zap, color: "orange", framework: "CrewAI" },
  { id: "supplier_alpha", name: "Supplier", role: "Parts & Materials", icon: Package, color: "cyan", framework: "Python" },
  { id: "manufacturer_prime", name: "Manufacturer", role: "Assembly", icon: Factory, color: "emerald", framework: "Python" },
  { id: "logistics_global", name: "Logistics", role: "Shipping", icon: Truck, color: "violet", framework: "Python" },
  { id: "retailer_direct", name: "Retailer", role: "Delivery", icon: Store, color: "amber", framework: "Python" },
];

const COLOR_MAP = {
  orange: { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", glow: "shadow-orange-400/20", dot: "bg-orange-400" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30", glow: "shadow-cyan-400/20", dot: "bg-cyan-400" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", glow: "shadow-emerald-400/20", dot: "bg-emerald-400" },
  violet: { text: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30", glow: "shadow-violet-400/20", dot: "bg-violet-400" },
  amber: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", glow: "shadow-amber-400/20", dot: "bg-amber-400" },
};

const AGENT_TEXT_COLOR = Object.fromEntries(AGENTS.map(a => [a.id, COLOR_MAP[a.color].text]));
AGENT_TEXT_COLOR["system"] = "text-gray-500";

const EXAMPLES = [
  "Buy all the parts required to assemble a Ferrari in one click",
  "Order all components needed to build a high-end gaming PC",
  "Source all materials for a custom electric bicycle",
  "Procure everything needed to build a smart home system",
];

const BACKEND_URL = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000")
  : "http://localhost:8000";

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function newProject(index) {
  return {
    id: `p_${Date.now()}_${index}`,
    name: `Project ${index}`,
    intent: "",
    status: "idle",       // idle | running | completed | error
    logs: [],
    plan: null,
    agentStatuses: {},
    error: null,
  };
}

// ═══════════════════════════════════════════
// Main Dashboard
// ═══════════════════════════════════════════

export default function DashboardPage() {
  const [projects, setProjects] = useState([newProject(1)]);
  const [activeId, setActiveId] = useState(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  // Set initial active ID after mount (avoid SSR mismatch)
  useEffect(() => {
    if (!activeId && projects.length > 0) {
      setActiveId(projects[0].id);
    }
  }, [activeId, projects]);

  const active = projects.find(p => p.id === activeId) || projects[0];

  const updateProject = useCallback((id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [active?.logs]);

  // Agent status updater
  const updateAgentStatus = useCallback((projectId, agentId, event) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const statuses = { ...p.agentStatuses };
      if (event.includes("complete") || event.includes("ready") || event.includes("planned") || event.includes("generated") || event.includes("plan_complete")) {
        statuses[agentId] = "complete";
      } else {
        statuses[agentId] = "active";
      }
      return { ...p, agentStatuses: statuses };
    }));
  }, []);

  // Create new project
  const addProject = () => {
    const p = newProject(projects.length + 1);
    setProjects(prev => [...prev, p]);
    setActiveId(p.id);
  };

  // Close project tab
  const closeProject = (id) => {
    const remaining = projects.filter(p => p.id !== id);
    if (remaining.length === 0) {
      const p = newProject(1);
      setProjects([p]);
      setActiveId(p.id);
    } else {
      setProjects(remaining);
      if (activeId === id) setActiveId(remaining[0].id);
    }
  };

  // Run orchestration
  const handleRun = async () => {
    if (!active || !active.intent.trim() || active.status === "running") return;
    const pid = active.id;

    updateProject(pid, { status: "running", logs: [], plan: null, agentStatuses: {}, error: null });

    // Auto-rename the tab
    const shortName = active.intent.length > 30 ? active.intent.slice(0, 30) + "…" : active.intent;
    updateProject(pid, { name: shortName });

    try {
      const res = await fetch(`${BACKEND_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: active.intent.trim() }),
      });

      if (!res.ok) throw new Error(`Backend returned ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() || "";

        for (const part of parts) {
          for (const line of part.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "log") {
                setProjects(prev => prev.map(p =>
                  p.id === pid ? { ...p, logs: [...p.logs, data] } : p
                ));
                if (data.agent_id) updateAgentStatus(pid, data.agent_id, data.event || "");
              } else if (data.type === "plan") {
                updateProject(pid, { plan: data.data });
              } else if (data.type === "complete") {
                updateProject(pid, { status: "completed" });
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      const msg = err.message?.includes("fetch") || err.message?.includes("Failed")
        ? "Cannot connect to backend. Start the server: cd backend && source venv/bin/activate && python main.py"
        : err.message;
      updateProject(pid, { status: "error", error: msg });
    } finally {
      // If still running (e.g. stream ended without complete event), mark as completed
      setProjects(prev => prev.map(p =>
        p.id === pid && p.status === "running" ? { ...p, status: "completed" } : p
      ));
    }
  };

  const hasResults = active && (active.logs.length > 0 || active.plan);

  // Don't render until we have an active project (avoids hydration mismatch)
  if (!activeId) return null;

  return (
    <div className="bg-dark min-h-screen flex flex-col">
      {/* ── Top bar: project tabs ── */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-dark-mid/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-1 overflow-x-auto scrollbar-hide h-11">
          {projects.map(proj => (
            <button
              key={proj.id}
              onClick={() => setActiveId(proj.id)}
              className={`group flex items-center gap-2 px-4 py-2 text-xs tracking-wider whitespace-nowrap transition-all border-b-2 ${
                proj.id === activeId
                  ? "border-accent text-white/90 bg-white/[0.03]"
                  : "border-transparent text-white/30 hover:text-white/50"
              }`}
            >
              {proj.status === "running" && <Loader2 className="h-3 w-3 animate-spin text-accent" />}
              {proj.status === "completed" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              {proj.status === "error" && <AlertCircle className="h-3 w-3 text-red-400" />}
              <span className="max-w-[160px] truncate">{proj.name}</span>
              {projects.length > 1 && (
                <X
                  className="h-3 w-3 text-white/10 group-hover:text-white/30 hover:text-white/60 transition-colors"
                  onClick={(e) => { e.stopPropagation(); closeProject(proj.id); }}
                />
              )}
            </button>
          ))}
          <button
            onClick={addProject}
            className="flex items-center gap-1 px-3 py-2 text-white/15 hover:text-white/40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-[10px] tracking-wider">NEW</span>
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 pt-[7.75rem] pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-display text-white text-2xl sm:text-3xl lg:text-4xl">
              One Click AI
            </h1>
            <p className="text-white/30 mt-2 text-xs sm:text-sm tracking-wide">
              Supply chain orchestration — 5 agents, 90 partners, one command
            </p>
          </div>

          {/* Input */}
          <div className="mb-6">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={active.intent}
                onChange={(e) => updateProject(active.id, { intent: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRun(); }}}
                placeholder='Describe what you want to procure… e.g. "Buy all the parts required to assemble a Ferrari in one click"'
                rows={2}
                disabled={active.status === "running"}
                className="w-full bg-dark-mid border border-white/10 text-white placeholder:text-white/15 px-5 py-4 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none font-sans"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {hasResults && active.status !== "running" && (
                  <button
                    onClick={() => updateProject(active.id, { status: "idle", logs: [], plan: null, agentStatuses: {}, error: null, intent: "" })}
                    className="flex items-center gap-1.5 text-white/20 hover:text-white/50 text-xs tracking-wider transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" /> RESET
                  </button>
                )}
                <button
                  onClick={handleRun}
                  disabled={!active.intent.trim() || active.status === "running"}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:bg-white/5 disabled:text-white/15 text-white px-5 py-2 text-xs tracking-widest font-medium transition-all"
                >
                  {active.status === "running" ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> RUNNING</>
                  ) : (
                    <>EXECUTE <ArrowRight className="h-3.5 w-3.5" /></>
                  )}
                </button>
              </div>
            </div>

            {!hasResults && active.status === "idle" && (
              <div className="flex flex-wrap gap-2 mt-3">
                {EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => updateProject(active.id, { intent: ex })}
                    className="text-white/20 hover:text-white/40 hover:border-white/15 text-[11px] border border-white/5 px-3 py-1.5 transition-all">
                    {ex}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {active.error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-6 p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-xs flex items-start gap-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Connection Error</p>
                <p className="text-red-400/70">{active.error}</p>
              </div>
            </motion.div>
          )}

          {/* Agent cards */}
          {(active.status === "running" || hasResults) && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <SectionLabel icon={Layers} label="Agents" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {AGENTS.map(agent => {
                  const st = active.agentStatuses[agent.id] || "idle";
                  const c = COLOR_MAP[agent.color];
                  const Icon = agent.icon;
                  return (
                    <div key={agent.id} className={`relative border p-3 transition-all duration-500 ${
                      st === "active" ? `${c.border} ${c.bg} shadow-lg ${c.glow}` :
                      st === "complete" ? "border-white/10 bg-white/[0.02]" : "border-white/5 bg-white/[0.01]"
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon className={`h-3.5 w-3.5 ${st === "idle" ? "text-white/15" : c.text}`} />
                        <span className={`text-[10px] font-medium tracking-wider ${st === "idle" ? "text-white/25" : "text-white/70"}`}>
                          {agent.name.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-white/15 text-[9px] tracking-wider">{agent.role}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {st === "active" && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${c.dot}`} />
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${c.dot}`} />
                          </span>
                        )}
                        {st === "complete" && <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400/60" />}
                        <span className={`text-[9px] tracking-wider ${
                          st === "idle" ? "text-white/10" : st === "active" ? c.text : "text-emerald-400/50"
                        }`}>
                          {st === "idle" ? "STANDBY" : st === "active" ? "ACTIVE" : "DONE"}
                        </span>
                      </div>
                      <span className="absolute top-1.5 right-2 text-[7px] text-white/8 tracking-wider">{agent.framework}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Coordination Log */}
          {(active.status === "running" || active.logs.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
              <SectionLabel icon={Terminal} label="Coordination Log" extra={`${active.logs.length} events`} />
              <div ref={logRef} className="bg-[#0a0a0a] border border-white/5 p-3 max-h-[320px] overflow-y-auto font-mono text-[11px] leading-relaxed">
                <AnimatePresence>
                  {active.logs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
                      className="flex gap-2 py-1 border-b border-white/[0.02] last:border-0">
                      <span className="text-white/12 w-14 flex-shrink-0 text-right">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) : ""}
                      </span>
                      <span className={`w-20 flex-shrink-0 font-medium truncate ${AGENT_TEXT_COLOR[log.agent_id] || "text-gray-400"}`}>
                        {log.agent_name || log.agent_id}
                      </span>
                      <span className="text-white/50 flex-1">
                        <span className="text-white/20 mr-1.5">{log.event?.replace(/_/g, " ")}</span>
                        {log.details}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {active.status === "running" && active.logs.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 text-white/15">
                    <Loader2 className="h-3 w-3 animate-spin" /> Agents coordinating…
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ Execution Plan ═══ */}
          {active.plan && <ExecutionPlan plan={active.plan} />}

          {/* Empty state */}
          {active.status === "idle" && !hasResults && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-center py-20">
              <div className="w-14 h-14 mx-auto mb-5 border border-white/8 flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent/40" />
              </div>
              <p className="text-white/15 text-sm tracking-wide mb-1">Enter a procurement request above</p>
              <p className="text-white/8 text-xs tracking-wider">5 AI agents · 90 global partners · Real-time coordination</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// Execution Plan — Human-Readable
// ═══════════════════════════════════════════

function ExecutionPlan({ plan }) {
  const [openSections, setOpenSections] = useState({ suppliers: true, manufacturer: false, logistics: false, retailer: false, report: false });
  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <SectionLabel icon={CheckCircle2} label="Execution Plan" iconColor="text-emerald-400" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        <StatCard icon={DollarSign} label="TOTAL COST" value={`$${Number(plan.cost_summary?.total_cost_usd || 0).toLocaleString()}`} color="text-accent" />
        <StatCard icon={Clock} label="TIMELINE" value={`${plan.timeline?.total_days || "—"} days`} color="text-cyan-400" />
        <StatCard icon={Package} label="COMPONENTS" value={plan.suppliers?.component_count || "—"} color="text-emerald-400" />
        <StatCard icon={Target} label="PARTNERS" value={`${(plan.suppliers?.selected?.length || 0) + 1 + 1 + 1}`} color="text-violet-400" />
      </div>

      {/* Timeline */}
      <div className="bg-dark-mid border border-white/5 p-4 mb-5">
        <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase mb-3">Project Timeline</p>
        <div className="flex items-center gap-0.5 h-7">
          {[
            { label: "Procurement", days: plan.timeline?.parts_procurement_days, color: "bg-orange-400" },
            { label: "Assembly", days: plan.timeline?.assembly_days, color: "bg-emerald-400" },
            { label: "Shipping", days: plan.timeline?.shipping_days, color: "bg-violet-400" },
            { label: "Delivery", days: plan.timeline?.delivery_days, color: "bg-amber-400" },
          ].map((ph, i) => {
            const total = plan.timeline?.total_days || 1;
            const d = Number(ph.days) || 0;
            const pct = Math.max((d / total) * 100, 10);
            return (
              <div key={i} className={`${ph.color}/30 h-full flex items-center justify-center`} style={{ width: `${pct}%` }}>
                <span className="text-[8px] text-white/50 tracking-wider font-medium whitespace-nowrap px-1">
                  {ph.label} ({d}d)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible detail sections */}
      <div className="space-y-2 mb-5">
        {/* Suppliers */}
        <CollapsibleSection
          open={openSections.suppliers} onToggle={() => toggle("suppliers")}
          icon={Package} iconColor="text-cyan-400" title="Supplier Quotes"
          subtitle={`${plan.suppliers?.component_count || 0} components · $${Number(plan.suppliers?.total_parts_cost_usd || 0).toLocaleString()}`}
        >
          {plan.suppliers?.selected_details && (
            <div className="mb-4">
              <p className="text-white/20 text-[10px] tracking-wider uppercase mb-2">Selected Suppliers</p>
              <div className="flex flex-wrap gap-2">
                {plan.suppliers.selected_details.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[10px] text-cyan-400/70 border border-cyan-400/15 px-2 py-1">
                    <MapPin className="h-2.5 w-2.5" /> {s.name} — {s.location} ({s.reliability} reliability)
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-0">
            {plan.suppliers?.quotes?.map((q, i) => (
              <div key={i} className="flex justify-between items-start py-2 border-b border-white/[0.03] last:border-0">
                <div className="flex-1 mr-3">
                  <p className="text-white/60 text-xs font-medium">{q.component_name || q.name}</p>
                  <p className="text-white/20 text-[10px] mt-0.5 line-clamp-1">
                    {q.assigned_supplier && <span className="text-cyan-400/40 mr-1">via {q.assigned_supplier}</span>}
                    {q.description || q.specifications || "—"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-cyan-400/70 text-xs font-medium">${Number(q.unit_cost_usd || 0).toLocaleString()}</p>
                  <p className="text-white/15 text-[10px]">{q.lead_time_days || "?"}d lead</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Manufacturer */}
        <CollapsibleSection
          open={openSections.manufacturer} onToggle={() => toggle("manufacturer")}
          icon={Factory} iconColor="text-emerald-400" title="Assembly Plan"
          subtitle={`${plan.manufacturer?.selected || "—"} · ${plan.manufacturer?.assembly_plan?.total_assembly_time_days || "—"} days`}
        >
          {plan.manufacturer?.selected_details && (
            <div className="mb-3">
              <p className="text-white/20 text-[10px] tracking-wider uppercase mb-1.5">Selected Facility</p>
              <p className="text-white/50 text-xs">
                <span className="text-emerald-400/60 font-medium">{plan.manufacturer.selected_details.name}</span>
                {" — "}{plan.manufacturer.selected_details.location}
                {" · "}{plan.manufacturer.selected_details.facility_size}
                {" · "}{plan.manufacturer.selected_details.reliability} reliability
              </p>
            </div>
          )}
          {plan.manufacturer?.selection_rationale && (
            <p className="text-white/25 text-[10px] italic mb-3">&quot;{plan.manufacturer.selection_rationale}&quot;</p>
          )}
          {plan.manufacturer?.assembly_plan?.steps?.map((step, i) => (
            <div key={i} className="flex gap-2.5 py-1.5 border-b border-white/[0.03] last:border-0">
              <span className="text-emerald-400/30 text-xs font-mono w-5 flex-shrink-0">{step.step || i + 1}.</span>
              <div>
                <p className="text-white/55 text-xs">{step.description}</p>
                <p className="text-white/15 text-[10px]">{step.duration_hours}h</p>
              </div>
            </div>
          ))}
        </CollapsibleSection>

        {/* Logistics */}
        <CollapsibleSection
          open={openSections.logistics} onToggle={() => toggle("logistics")}
          icon={Truck} iconColor="text-violet-400" title="Logistics Route"
          subtitle={`${plan.logistics?.selected || "—"} · $${Number(plan.logistics?.shipping_cost_usd || 0).toLocaleString()}`}
        >
          {plan.logistics?.selected_details && (
            <div className="mb-3">
              <p className="text-white/20 text-[10px] tracking-wider uppercase mb-1.5">Selected Provider</p>
              <p className="text-white/50 text-xs">
                <span className="text-violet-400/60 font-medium">{plan.logistics.selected_details.name}</span>
                {" — Hub: "}{plan.logistics.selected_details.hub}
                {" · Modes: "}{plan.logistics.selected_details.modes?.join(", ")}
                {" · "}{plan.logistics.selected_details.reliability} reliability
              </p>
            </div>
          )}
          {plan.logistics?.selection_rationale && (
            <p className="text-white/25 text-[10px] italic mb-3">&quot;{plan.logistics.selection_rationale}&quot;</p>
          )}
          {plan.logistics?.route?.segments?.map((seg, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 text-xs">
              <span className="text-violet-400/40">→</span>
              <span className="text-white/50">{seg.from} → {seg.to}</span>
              <span className="text-white/15 ml-auto">{seg.duration_days}d · {seg.carrier || "—"}</span>
            </div>
          ))}
          <div className="pt-2 flex flex-wrap gap-4 text-[10px]">
            <span className="text-white/20">Mode: <span className="text-white/40">{plan.logistics?.route?.mode || "—"}</span></span>
            <span className="text-white/20">Risk: <span className="text-white/40">{plan.logistics?.route?.risk_level || "—"}</span></span>
            <span className="text-white/20">Tracking: <span className="text-white/40">{plan.logistics?.route?.tracking_type || plan.logistics?.selected_details?.tracking || "—"}</span></span>
          </div>
        </CollapsibleSection>

        {/* Retailer */}
        <CollapsibleSection
          open={openSections.retailer} onToggle={() => toggle("retailer")}
          icon={Store} iconColor="text-amber-400" title="Delivery & Customer Experience"
          subtitle={plan.retailer?.retail_price_usd > 0 ? `Retail: $${Number(plan.retailer.retail_price_usd).toLocaleString()}` : ""}
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
            <InfoRow label="Packaging" value={plan.retailer?.delivery_plan?.packaging} />
            <InfoRow label="Method" value={plan.retailer?.delivery_plan?.delivery_method} />
            <InfoRow label="Warranty" value={plan.retailer?.customer_experience?.warranty} />
            <InfoRow label="Returns" value={plan.retailer?.customer_experience?.return_policy} />
            <InfoRow label="Support" value={plan.retailer?.customer_experience?.support_channel} />
            <InfoRow label="Tracking" value={plan.retailer?.delivery_plan?.tracking_number} />
          </div>
          {plan.retailer?.customer_experience?.documentation_included && (
            <div className="mt-3">
              <p className="text-white/20 text-[10px] mb-1">Documentation included:</p>
              <p className="text-white/35 text-[10px]">{plan.retailer.customer_experience.documentation_included.join(", ")}</p>
            </div>
          )}
        </CollapsibleSection>

        {/* Network Coordination Report */}
        <CollapsibleSection
          open={openSections.report} onToggle={() => toggle("report")}
          icon={MessageSquare} iconColor="text-accent" title="Network Coordination Report"
          subtitle={`${plan.coordination_report?.agents_involved || 5} agents · ${plan.coordination_report?.total_partners_evaluated?.suppliers + plan.coordination_report?.total_partners_evaluated?.manufacturers + plan.coordination_report?.total_partners_evaluated?.logistics_providers || 90} partners evaluated`}
        >
          {/* Communication flow */}
          <div className="mb-5">
            <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">Agent Communication Flow</p>
            <div className="space-y-0.5">
              {plan.coordination_report?.communication_flow?.map((msg, i) => (
                <div key={i} className="flex items-start gap-2 py-1 text-[11px]">
                  <span className="text-accent/30 mt-0.5 flex-shrink-0">→</span>
                  <span className="text-white/40">
                    <span className="text-white/60 font-medium">{msg.from}</span>
                    {" → "}
                    <span className="text-white/60 font-medium">{msg.to}</span>
                  </span>
                  <span className="text-white/25 flex-1">{msg.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selection criteria */}
          <div className="mb-5">
            <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">Selection Criteria</p>
            <div className="flex flex-wrap gap-2">
              {plan.coordination_report?.selection_criteria?.map((c, i) => (
                <span key={i} className="text-[10px] text-white/30 border border-white/5 px-2 py-1">{c}</span>
              ))}
            </div>
          </div>

          {/* Partner evaluation */}
          <div className="mb-5">
            <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">Partner Evaluation</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Suppliers", total: plan.coordination_report?.total_partners_evaluated?.suppliers, selected: plan.coordination_report?.partners_shortlisted?.suppliers, color: "text-cyan-400" },
                { label: "Manufacturers", total: plan.coordination_report?.total_partners_evaluated?.manufacturers, selected: plan.coordination_report?.partners_shortlisted?.manufacturers, color: "text-emerald-400" },
                { label: "Logistics", total: plan.coordination_report?.total_partners_evaluated?.logistics_providers, selected: plan.coordination_report?.partners_shortlisted?.logistics_providers, color: "text-violet-400" },
              ].map((p, i) => (
                <div key={i} className="text-center">
                  <p className={`text-lg font-semibold ${p.color}`}>{p.selected}</p>
                  <p className="text-white/15 text-[10px]">of {p.total} {p.label.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust & policy */}
          <div className="mb-4">
            <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">Trust & Verification</p>
            <p className="text-white/35 text-xs leading-relaxed">{plan.coordination_report?.trust_verification}</p>
          </div>
          <div>
            <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">Policy Enforcement</p>
            <p className="text-white/35 text-xs leading-relaxed">{plan.coordination_report?.policy_enforcement}</p>
          </div>
        </CollapsibleSection>
      </div>
    </motion.div>
  );
}


// ═══════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════

function SectionLabel({ icon: Icon, label, extra, iconColor }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`h-3.5 w-3.5 ${iconColor || "text-white/25"}`} />
      <span className="text-white/25 text-[10px] tracking-[0.2em] uppercase">{label}</span>
      {extra && <span className="text-white/10 text-[10px]">{extra}</span>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-dark-mid border border-white/5 p-3 sm:p-4">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={`h-3 w-3 ${color}`} />
        <span className="text-white/20 text-[9px] tracking-[0.15em] uppercase">{label}</span>
      </div>
      <p className={`text-base sm:text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function CollapsibleSection({ open, onToggle, icon: Icon, iconColor, title, subtitle, children }) {
  return (
    <div className={`bg-dark-mid border transition-colors ${open ? "border-white/8" : "border-white/[0.03]"}`}>
      <button onClick={onToggle} className="flex items-center justify-between w-full px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
          <span className="text-white/50 text-xs font-medium tracking-wider">{title}</span>
          {subtitle && <span className="text-white/15 text-[10px] hidden sm:inline">— {subtitle}</span>}
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-white/15" /> : <ChevronDown className="h-3.5 w-3.5 text-white/15" />}
      </button>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pb-4 border-t border-white/[0.03] pt-3">
          {children}
        </motion.div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-white/20 text-xs">{label}</span>
      <span className="text-white/45 text-xs text-right">{value || "—"}</span>
    </div>
  );
}
