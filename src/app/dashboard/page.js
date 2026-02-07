"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

// ═══════════════════════════════════════════
// Agent configuration
// ═══════════════════════════════════════════

const AGENTS = [
  {
    id: "procurement_main",
    name: "Procurement",
    role: "Orchestrator",
    icon: Zap,
    colorClass: "text-orange-400",
    bgClass: "bg-orange-400/10",
    borderClass: "border-orange-400/30",
    glowClass: "shadow-orange-400/20",
    framework: "CrewAI",
  },
  {
    id: "supplier_alpha",
    name: "Supplier",
    role: "Parts & Materials",
    icon: Package,
    colorClass: "text-cyan-400",
    bgClass: "bg-cyan-400/10",
    borderClass: "border-cyan-400/30",
    glowClass: "shadow-cyan-400/20",
    framework: "Python",
  },
  {
    id: "manufacturer_prime",
    name: "Manufacturer",
    role: "Assembly",
    icon: Factory,
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-400/10",
    borderClass: "border-emerald-400/30",
    glowClass: "shadow-emerald-400/20",
    framework: "Python",
  },
  {
    id: "logistics_global",
    name: "Logistics",
    role: "Shipping & Routes",
    icon: Truck,
    colorClass: "text-violet-400",
    bgClass: "bg-violet-400/10",
    borderClass: "border-violet-400/30",
    glowClass: "shadow-violet-400/20",
    framework: "Python",
  },
  {
    id: "retailer_direct",
    name: "Retailer",
    role: "Delivery & Support",
    icon: Store,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
    glowClass: "shadow-amber-400/20",
    framework: "Python",
  },
];

const AGENT_COLOR_MAP = Object.fromEntries(
  AGENTS.map((a) => [a.id, a.colorClass])
);
AGENT_COLOR_MAP["system"] = "text-gray-500";

const EXAMPLES = [
  "Buy all the parts required to assemble a Ferrari in one click",
  "Order all components needed to build a high-end gaming PC",
  "Source all materials for a custom electric bicycle",
  "Procure everything needed to build a smart home system",
];

const BACKEND_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    : "http://localhost:8000";

// ═══════════════════════════════════════════
// Main Dashboard Component
// ═══════════════════════════════════════════

export default function DashboardPage() {
  const [intent, setIntent] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [plan, setPlan] = useState(null);
  const [agentStatuses, setAgentStatuses] = useState({});
  const [error, setError] = useState(null);
  const [showFullPlan, setShowFullPlan] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  // Update agent status based on log events
  const updateAgentStatus = (agentId, event) => {
    setAgentStatuses((prev) => {
      const updated = { ...prev };
      if (
        event.includes("complete") ||
        event.includes("ready") ||
        event.includes("planned") ||
        event.includes("generated") ||
        event.includes("plan_complete")
      ) {
        updated[agentId] = "complete";
      } else {
        updated[agentId] = "active";
      }
      return updated;
    });
  };

  const handleRun = async () => {
    if (!intent.trim() || isRunning) return;

    setIsRunning(true);
    setLogs([]);
    setPlan(null);
    setAgentStatuses({});
    setError(null);
    setShowFullPlan(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: intent.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "log") {
                  setLogs((prev) => [...prev, data]);
                  if (data.agent_id) {
                    updateAgentStatus(data.agent_id, data.event || "");
                  }
                } else if (data.type === "plan") {
                  setPlan(data.data);
                } else if (data.type === "complete") {
                  setIsRunning(false);
                }
              } catch (e) {
                console.error("SSE parse error:", e);
              }
            }
          }
        }
      }
    } catch (err) {
      setError(
        err.message.includes("fetch") || err.message.includes("Failed")
          ? "Cannot connect to backend. Make sure the Python server is running: cd backend && python main.py"
          : err.message
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIntent("");
    setLogs([]);
    setPlan(null);
    setAgentStatuses({});
    setError(null);
    setShowFullPlan(false);
    inputRef.current?.focus();
  };

  const hasResults = logs.length > 0 || plan;

  return (
    <div className="bg-dark min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="heading-display text-white text-3xl sm:text-4xl lg:text-5xl">
            One Click AI
          </h1>
          <p className="text-white/40 mt-3 text-sm sm:text-base tracking-wide">
            Supply chain orchestration powered by autonomous AI agents
          </p>
        </motion.div>

        {/* ── Input Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <textarea
              ref={inputRef}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleRun();
                }
              }}
              placeholder="Describe what you want to procure... e.g. 'Buy all the parts required to assemble a Ferrari in one click'"
              rows={3}
              disabled={isRunning}
              className="w-full bg-dark-mid border border-white/10 text-white placeholder:text-white/20 px-5 py-4 text-base focus:outline-none focus:border-accent/50 transition-colors duration-300 resize-none font-sans"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {hasResults && !isRunning && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs tracking-wider transition-colors"
                >
                  <RotateCcw className="h-3 w-3" /> RESET
                </button>
              )}
              <button
                onClick={handleRun}
                disabled={!intent.trim() || isRunning}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:bg-white/5 disabled:text-white/20 text-white px-5 py-2 text-sm tracking-widest font-medium transition-all duration-300"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> RUNNING
                  </>
                ) : (
                  <>
                    EXECUTE <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick examples */}
          {!hasResults && (
            <div className="flex flex-wrap gap-2 mt-4">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setIntent(ex)}
                  className="text-white/25 hover:text-white/50 hover:border-white/20 text-xs border border-white/8 px-3 py-1.5 transition-all duration-300"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Error ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-sm flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Connection Error</p>
              <p className="text-red-400/70">{error}</p>
            </div>
          </motion.div>
        )}

        {/* ── Agent Cards ── */}
        {(isRunning || hasResults) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-4 w-4 text-white/30" />
              <span className="text-white/30 text-xs tracking-[0.2em] uppercase">
                Agents
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {AGENTS.map((agent) => {
                const status = agentStatuses[agent.id] || "idle";
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className={`relative border p-3 sm:p-4 transition-all duration-500 ${
                      status === "active"
                        ? `${agent.borderClass} ${agent.bgClass} shadow-lg ${agent.glowClass}`
                        : status === "complete"
                        ? `border-white/10 bg-white/[0.02]`
                        : "border-white/5 bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        className={`h-4 w-4 ${
                          status === "idle"
                            ? "text-white/20"
                            : agent.colorClass
                        }`}
                      />
                      <span
                        className={`text-xs font-medium tracking-wider ${
                          status === "idle"
                            ? "text-white/30"
                            : "text-white/80"
                        }`}
                      >
                        {agent.name.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/20 text-[10px] tracking-wider">
                      {agent.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {status === "active" && (
                        <span className="relative flex h-2 w-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agent.bgClass.replace(
                              "/10",
                              ""
                            )}`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${agent.bgClass.replace(
                              "/10",
                              ""
                            )}`}
                          />
                        </span>
                      )}
                      {status === "complete" && (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400/60" />
                      )}
                      <span
                        className={`text-[10px] tracking-wider ${
                          status === "idle"
                            ? "text-white/15"
                            : status === "active"
                            ? agent.colorClass
                            : "text-emerald-400/50"
                        }`}
                      >
                        {status === "idle"
                          ? "STANDBY"
                          : status === "active"
                          ? "ACTIVE"
                          : "DONE"}
                      </span>
                    </div>
                    <span className="absolute top-2 right-2 text-[8px] text-white/10 tracking-wider">
                      {agent.framework}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Coordination Log ── */}
        {(isRunning || logs.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-4 w-4 text-white/30" />
              <span className="text-white/30 text-xs tracking-[0.2em] uppercase">
                Coordination Log
              </span>
              <span className="text-white/15 text-xs">
                ({logs.length} events)
              </span>
            </div>

            <div
              ref={logRef}
              className="bg-[#0a0a0a] border border-white/5 p-4 max-h-[400px] overflow-y-auto font-mono text-xs leading-relaxed"
            >
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 py-1.5 border-b border-white/[0.03] last:border-0"
                  >
                    <span className="text-white/15 w-16 flex-shrink-0 text-right">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleTimeString("en-US", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : ""}
                    </span>
                    <span
                      className={`w-24 flex-shrink-0 font-medium ${
                        AGENT_COLOR_MAP[log.agent_id] || "text-gray-400"
                      }`}
                    >
                      [{log.agent_name || log.agent_id}]
                    </span>
                    <span className="text-white/60 flex-1">
                      <span className="text-white/30 mr-2">
                        {log.event?.replace(/_/g, " ")}
                      </span>
                      {log.details}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isRunning && logs.length > 0 && (
                <div className="flex items-center gap-2 pt-2 text-white/20">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Agents coordinating...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Execution Plan ── */}
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-white/30 text-xs tracking-[0.2em] uppercase">
                Execution Plan
              </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <SummaryCard
                icon={DollarSign}
                label="TOTAL COST"
                value={`$${Number(
                  plan.cost_summary?.total_cost_usd || 0
                ).toLocaleString()}`}
                color="text-accent"
              />
              <SummaryCard
                icon={Clock}
                label="TIMELINE"
                value={`${plan.timeline?.total_days || "—"} days`}
                color="text-cyan-400"
              />
              <SummaryCard
                icon={Package}
                label="COMPONENTS"
                value={plan.suppliers?.component_count || "—"}
                color="text-emerald-400"
              />
              <SummaryCard
                icon={Zap}
                label="AGENTS"
                value={plan.coordination_report?.agents_involved || 5}
                color="text-violet-400"
              />
            </div>

            {/* Timeline Bar */}
            <div className="bg-dark-mid border border-white/5 p-5 mb-6">
              <p className="text-white/30 text-xs tracking-[0.15em] uppercase mb-4">
                Project Timeline
              </p>
              <div className="flex items-center gap-1 h-8">
                {[
                  {
                    label: "Procurement",
                    days: plan.timeline?.parts_procurement_days,
                    color: "bg-orange-400",
                  },
                  {
                    label: "Assembly",
                    days: plan.timeline?.assembly_days,
                    color: "bg-emerald-400",
                  },
                  {
                    label: "Shipping",
                    days: plan.timeline?.shipping_days,
                    color: "bg-violet-400",
                  },
                  {
                    label: "Delivery",
                    days: plan.timeline?.delivery_days,
                    color: "bg-amber-400",
                  },
                ].map((phase, i) => {
                  const total = plan.timeline?.total_days || 1;
                  const days = Number(phase.days) || 0;
                  const pct = Math.max((days / total) * 100, 8);
                  return (
                    <div
                      key={i}
                      className={`${phase.color}/20 h-full flex items-center justify-center relative group`}
                      style={{ width: `${pct}%` }}
                    >
                      <div
                        className={`absolute inset-y-0 left-0 ${phase.color}/40`}
                        style={{ width: "100%" }}
                      />
                      <span className="relative text-[9px] text-white/60 tracking-wider font-medium">
                        {phase.label} ({days}d)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Supplier */}
              <DetailCard
                title="SUPPLIER QUOTES"
                icon={Package}
                colorClass="text-cyan-400"
                borderClass="border-cyan-400/20"
              >
                {plan.suppliers?.quotes?.slice(0, 6).map((q, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start py-2 border-b border-white/[0.03] last:border-0"
                  >
                    <div className="flex-1 mr-3">
                      <p className="text-white/70 text-xs font-medium">
                        {q.component_name || q.name}
                      </p>
                      <p className="text-white/25 text-[10px] mt-0.5 line-clamp-1">
                        {q.description || q.specifications || "—"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-cyan-400/80 text-xs font-medium">
                        ${Number(q.unit_cost_usd || 0).toLocaleString()}
                      </p>
                      <p className="text-white/20 text-[10px]">
                        {q.lead_time_days || "?"}d lead
                      </p>
                    </div>
                  </div>
                ))}
                {(plan.suppliers?.quotes?.length || 0) > 6 && (
                  <p className="text-white/20 text-[10px] pt-2">
                    +{plan.suppliers.quotes.length - 6} more components...
                  </p>
                )}
              </DetailCard>

              {/* Manufacturer */}
              <DetailCard
                title="ASSEMBLY PLAN"
                icon={Factory}
                colorClass="text-emerald-400"
                borderClass="border-emerald-400/20"
              >
                {plan.manufacturer?.assembly_plan?.steps
                  ?.slice(0, 5)
                  .map((step, i) => (
                    <div
                      key={i}
                      className="flex gap-3 py-2 border-b border-white/[0.03] last:border-0"
                    >
                      <span className="text-emerald-400/40 text-xs font-mono w-5 flex-shrink-0">
                        {step.step || i + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-white/70 text-xs">
                          {step.description}
                        </p>
                        <p className="text-white/20 text-[10px] mt-0.5">
                          {step.duration_hours}h
                        </p>
                      </div>
                    </div>
                  ))}
                <div className="pt-2 flex gap-3 text-[10px]">
                  <span className="text-white/25">
                    Facility:{" "}
                    <span className="text-white/50">
                      {plan.manufacturer?.assembly_plan?.facility || "—"}
                    </span>
                  </span>
                </div>
              </DetailCard>

              {/* Logistics */}
              <DetailCard
                title="LOGISTICS ROUTE"
                icon={Truck}
                colorClass="text-violet-400"
                borderClass="border-violet-400/20"
              >
                {plan.logistics?.route?.segments?.map((seg, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-1.5 text-xs"
                  >
                    <span className="text-violet-400/50">→</span>
                    <span className="text-white/60">
                      {seg.from} → {seg.to}
                    </span>
                    <span className="text-white/20 ml-auto">
                      {seg.duration_days}d
                    </span>
                  </div>
                ))}
                <div className="pt-2 flex flex-wrap gap-3 text-[10px]">
                  <span className="text-white/25">
                    Mode:{" "}
                    <span className="text-white/50">
                      {plan.logistics?.route?.mode || "—"}
                    </span>
                  </span>
                  <span className="text-white/25">
                    Cost:{" "}
                    <span className="text-violet-400/70">
                      ${Number(
                        plan.logistics?.shipping_cost_usd || 0
                      ).toLocaleString()}
                    </span>
                  </span>
                  <span className="text-white/25">
                    Risk:{" "}
                    <span className="text-white/50">
                      {plan.logistics?.route?.risk_level || "—"}
                    </span>
                  </span>
                </div>
              </DetailCard>

              {/* Retailer */}
              <DetailCard
                title="DELIVERY & SUPPORT"
                icon={Store}
                colorClass="text-amber-400"
                borderClass="border-amber-400/20"
              >
                <div className="space-y-2 text-xs">
                  <InfoRow
                    label="Packaging"
                    value={plan.retailer?.delivery_plan?.packaging}
                  />
                  <InfoRow
                    label="Method"
                    value={plan.retailer?.delivery_plan?.delivery_method}
                  />
                  <InfoRow
                    label="Warranty"
                    value={plan.retailer?.customer_experience?.warranty}
                  />
                  <InfoRow
                    label="Return Policy"
                    value={plan.retailer?.customer_experience?.return_policy}
                  />
                  <InfoRow
                    label="Support"
                    value={plan.retailer?.customer_experience?.support_channel}
                  />
                </div>
                {plan.retailer?.retail_price_usd > 0 && (
                  <div className="pt-3 mt-2 border-t border-white/[0.05]">
                    <span className="text-white/25 text-[10px]">
                      Retail Price:{" "}
                      <span className="text-amber-400/70 font-medium">
                        ${Number(
                          plan.retailer.retail_price_usd
                        ).toLocaleString()}
                      </span>
                    </span>
                  </div>
                )}
              </DetailCard>
            </div>

            {/* Coordination Report */}
            <div className="bg-dark-mid border border-white/5 p-5 mb-6">
              <button
                onClick={() => setShowFullPlan(!showFullPlan)}
                className="flex items-center justify-between w-full"
              >
                <span className="text-white/30 text-xs tracking-[0.15em] uppercase">
                  Network Coordination Report
                </span>
                {showFullPlan ? (
                  <ChevronUp className="h-4 w-4 text-white/20" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-white/20" />
                )}
              </button>

              {showFullPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">
                      Discovery Paths
                    </p>
                    <div className="space-y-1">
                      {plan.coordination_report?.discovery_paths?.map(
                        (path, i) => (
                          <p key={i} className="text-white/40 text-xs font-mono">
                            <span className="text-accent/50 mr-2">→</span>
                            {path}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">
                      Trust & Verification
                    </p>
                    <p className="text-white/40 text-xs">
                      {plan.coordination_report?.trust_verification}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">
                      Policy Enforcement
                    </p>
                    <p className="text-white/40 text-xs">
                      {plan.coordination_report?.policy_enforcement}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/25 text-[10px] tracking-wider uppercase mb-2">
                      Full Execution Plan (JSON)
                    </p>
                    <pre className="bg-[#0a0a0a] p-3 text-[10px] text-white/30 overflow-x-auto max-h-[300px] overflow-y-auto">
                      {JSON.stringify(plan, null, 2)}
                    </pre>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Empty State ── */}
        {!isRunning && !hasResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-6 border border-white/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-accent/50" />
            </div>
            <p className="text-white/20 text-sm tracking-wide mb-2">
              Enter a procurement request above to begin
            </p>
            <p className="text-white/10 text-xs tracking-wider">
              5 AI agents will coordinate to fulfill your order
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-dark-mid border border-white/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="text-white/25 text-[10px] tracking-[0.15em] uppercase">
          {label}
        </span>
      </div>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function DetailCard({ title, icon: Icon, colorClass, borderClass, children }) {
  return (
    <div className={`bg-dark-mid border ${borderClass} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
        <span className="text-white/30 text-[10px] tracking-[0.15em] uppercase">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/25">{label}</span>
      <span className="text-white/50">{value || "—"}</span>
    </div>
  );
}
