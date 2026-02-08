"use client";

import { useMemo, useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Zap, Package, Factory, Truck, Store, Box, Globe, Users, Plus, Minus, RotateCcw } from "lucide-react";

// ─── Custom Node Types ───

function AgentNode({ data }) {
  const Icon = data.icon;
  return (
    <div
      className="relative px-4 py-3 border-2 min-w-[140px] text-center"
      style={{
        background: data.bg || "#1a1a2e",
        borderColor: data.borderColor || "#333",
        borderRadius: "2px",
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !w-2 !h-2 !border-0" />
      <Handle type="target" position={Position.Left} className="!bg-white/20 !w-2 !h-2 !border-0" id="left" />
      <Handle type="source" position={Position.Right} className="!bg-white/20 !w-2 !h-2 !border-0" id="right" />
      <div className="flex items-center justify-center gap-2 mb-1">
        {Icon && <Icon className="h-4 w-4" style={{ color: data.color }} />}
        <span className="text-xs font-semibold tracking-wide" style={{ color: data.color }}>
          {data.label}
        </span>
      </div>
      {data.sublabel && (
        <p className="text-[9px] text-white/30 tracking-wider">{data.sublabel}</p>
      )}
      {data.framework && (
        <span
          className="absolute -top-2 -right-2 text-[8px] px-1.5 py-0.5 font-medium tracking-wider"
          style={{
            background: data.frameworkColor || "#333",
            color: data.color,
          }}
        >
          {data.framework}
        </span>
      )}
    </div>
  );
}

function PartnerNode({ data }) {
  return (
    <div
      className="px-3 py-2 border min-w-[120px] text-center"
      style={{
        background: "#111827",
        borderColor: data.borderColor || "#1f2937",
        borderRadius: "2px",
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/10 !w-1.5 !h-1.5 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-white/10 !w-1.5 !h-1.5 !border-0" />
      <Handle type="target" position={Position.Left} className="!bg-white/10 !w-1.5 !h-1.5 !border-0" id="left" />
      <Handle type="source" position={Position.Right} className="!bg-white/10 !w-1.5 !h-1.5 !border-0" id="right" />
      <p className="text-[10px] font-medium" style={{ color: data.color || "#9ca3af" }}>
        {data.label}
      </p>
      {data.sublabel && (
        <p className="text-[8px] text-white/20 mt-0.5">{data.sublabel}</p>
      )}
    </div>
  );
}

const nodeTypes = {
  agent: AgentNode,
  partner: PartnerNode,
};

// ─── Build Graph ───

function buildGraph(plan, report) {
  if (!plan) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];
  let eid = 0;
  const edge = (src, tgt, opts = {}) => {
    edges.push({
      id: `e-${eid++}`,
      source: src,
      target: tgt,
      type: "smoothstep",
      animated: opts.animated || false,
      style: { stroke: opts.color || "#333", strokeWidth: opts.width || 1.2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: opts.color || "#333", width: 12, height: 12 },
      label: opts.label,
      labelStyle: { fill: "#666", fontSize: 9 },
      ...opts,
    });
  };

  // Calculate layout based on number of suppliers
  const suppliers = plan.suppliers?.selected_details || [];
  const numSuppliers = suppliers.length;
  // Total width needed for supplier row (each ~160px apart)
  const supplierSpacing = 180;
  const supplierRowWidth = Math.max(numSuppliers * supplierSpacing, 800);
  const centerX = supplierRowWidth / 2;
  // Agent row: evenly distribute 4 agents across the width
  const agentY = 220;
  const partnerY = 420;
  const agentSpacing = supplierRowWidth / 5;

  // ── Procurement Agent (center top) ──
  nodes.push({
    id: "procurement",
    type: "agent",
    position: { x: centerX - 80, y: 40 },
    data: {
      label: "Procurement Agent",
      sublabel: "Orchestrator",
      icon: Zap,
      color: "#f97316",
      borderColor: "#f97316",
      bg: "#1a1008",
      framework: "CrewAI",
      frameworkColor: "#2a1a08",
    },
  });

  // ── Supplier Agent ──
  nodes.push({
    id: "supplier_agent",
    type: "agent",
    position: { x: agentSpacing * 0.5, y: agentY },
    data: {
      label: "Supplier Agent",
      sublabel: "Parts & Materials",
      icon: Package,
      color: "#22d3ee",
      borderColor: "#0891b2",
      bg: "#0a1a1f",
      framework: "Python",
      frameworkColor: "#0a2025",
    },
  });
  edge("procurement", "supplier_agent", { color: "#22d3ee", animated: true, label: "A2A Request" });

  // ── Manufacturer Agent ──
  nodes.push({
    id: "mfg_agent",
    type: "agent",
    position: { x: agentSpacing * 1.7, y: agentY },
    data: {
      label: "Manufacturer Agent",
      sublabel: "Assembly",
      icon: Factory,
      color: "#34d399",
      borderColor: "#059669",
      bg: "#0a1a12",
      framework: "Python",
      frameworkColor: "#0a2515",
    },
  });
  edge("procurement", "mfg_agent", { color: "#34d399", animated: true, label: "A2A Request" });

  // ── Logistics Agent ──
  nodes.push({
    id: "log_agent",
    type: "agent",
    position: { x: agentSpacing * 2.9, y: agentY },
    data: {
      label: "Logistics Agent",
      sublabel: "Shipping & Routing",
      icon: Truck,
      color: "#a78bfa",
      borderColor: "#7c3aed",
      bg: "#120a1f",
      framework: "Python",
      frameworkColor: "#1a0a2a",
    },
  });
  edge("procurement", "log_agent", { color: "#a78bfa", animated: true, label: "A2A Request" });

  // ── Retailer Agent ──
  nodes.push({
    id: "ret_agent",
    type: "agent",
    position: { x: agentSpacing * 4.1, y: agentY },
    data: {
      label: "Retailer Agent",
      sublabel: "Delivery & CX",
      icon: Store,
      color: "#fbbf24",
      borderColor: "#d97706",
      bg: "#1a1508",
      framework: "Python",
      frameworkColor: "#2a2008",
    },
  });
  edge("procurement", "ret_agent", { color: "#fbbf24", animated: true, label: "A2A Request" });

  // ── Supplier Partners ──
  suppliers.forEach((s, i) => {
    const nid = `sup_${i}`;
    // Center the supplier row under the supplier agent
    const supplierRowStart = (agentSpacing * 0.5) - ((numSuppliers - 1) * supplierSpacing) / 2;
    nodes.push({
      id: nid,
      type: "partner",
      position: { x: supplierRowStart + i * supplierSpacing, y: partnerY },
      data: {
        label: s.name?.split(" ").slice(0, 2).join(" ") || `Supplier ${i + 1}`,
        sublabel: s.location,
        color: "#67e8f9",
        borderColor: "#164e63",
      },
    });
    edge("supplier_agent", nid, { color: "#22d3ee40" });
  });

  // ── Manufacturer Partner ──
  const mfg = plan.manufacturer?.selected_details;
  if (mfg?.name) {
    nodes.push({
      id: "mfg_partner",
      type: "partner",
      position: { x: agentSpacing * 1.7, y: partnerY },
      data: {
        label: mfg.name?.split(" ").slice(0, 3).join(" "),
        sublabel: mfg.location,
        color: "#6ee7b7",
        borderColor: "#064e3b",
      },
    });
    edge("mfg_agent", "mfg_partner", { color: "#34d39940" });
  }

  // ── Logistics Partner ──
  const log = plan.logistics?.selected_details;
  if (log?.name) {
    nodes.push({
      id: "log_partner",
      type: "partner",
      position: { x: agentSpacing * 2.9, y: partnerY },
      data: {
        label: log.name?.split(" ").slice(0, 3).join(" "),
        sublabel: log.hub || log.location,
        color: "#c4b5fd",
        borderColor: "#4c1d95",
      },
    });
    edge("log_agent", "log_partner", { color: "#a78bfa40" });
  }

  // ── Customer Node ──
  nodes.push({
    id: "customer",
    type: "partner",
    position: { x: agentSpacing * 4.1, y: partnerY },
    data: {
      label: "Customer",
      sublabel: "Final Delivery",
      color: "#fbbf24",
      borderColor: "#78350f",
    },
  });
  edge("ret_agent", "customer", { color: "#fbbf2440" });

  // ── Cross-agent data flows ──
  edge("supplier_agent", "mfg_agent", {
    color: "#22d3ee30",
    label: "Part Specs",
    sourceHandle: "right",
    targetHandle: "left",
    type: "smoothstep",
  });
  edge("mfg_agent", "log_agent", {
    color: "#34d39930",
    label: "Pickup Info",
    sourceHandle: "right",
    targetHandle: "left",
    type: "smoothstep",
  });
  edge("log_agent", "ret_agent", {
    color: "#a78bfa30",
    label: "Delivery Plan",
    sourceHandle: "right",
    targetHandle: "left",
    type: "smoothstep",
  });

  return { nodes, edges };
}

// Custom zoom controls that match WorldMap style
function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
      <button onClick={() => zoomIn()} className="w-8 h-8 bg-dark-mid/90 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
        <Plus className="h-4 w-4 text-white/60" />
      </button>
      <button onClick={() => zoomOut()} className="w-8 h-8 bg-dark-mid/90 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
        <Minus className="h-4 w-4 text-white/60" />
      </button>
      <button onClick={() => fitView({ padding: 0.3 })} className="w-8 h-8 bg-dark-mid/90 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors mt-1">
        <RotateCcw className="h-3.5 w-3.5 text-white/40" />
      </button>
    </div>
  );
}

function DependencyGraphInner({ plan, report }) {
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildGraph(plan, report),
    [plan, report]
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-white/15 text-sm">
        Run a project to see the dependency graph
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative" style={{ background: "#0a0a0f" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__panel.react-flow__attribution]:hidden"
      >
        <Background color="#1a1a2e" gap={30} size={1} />
        <CustomControls />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "agent") return n.data?.color || "#666";
            return "#333";
          }}
          className="!bg-dark/80 !border-white/[0.06]"
          maskColor="rgba(0,0,0,0.7)"
        />
      </ReactFlow>
    </div>
  );
}

export default function DependencyGraph({ plan, report }) {
  return (
    <ReactFlowProvider>
      <DependencyGraphInner plan={plan} report={report} />
    </ReactFlowProvider>
  );
}
