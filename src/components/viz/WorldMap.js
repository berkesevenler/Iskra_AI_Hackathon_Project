"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";
import { MapPin, Package, Factory, Truck, Plus, Minus, RotateCcw } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MARKER_COLORS = {
  supplier: { fill: "#22d3ee", stroke: "#0891b2", label: "Supplier" },
  manufacturer: { fill: "#34d399", stroke: "#059669", label: "Manufacturer" },
  logistics: { fill: "#a78bfa", stroke: "#7c3aed", label: "Logistics Hub" },
  customer: { fill: "#f97316", stroke: "#ea580c", label: "Customer" },
};

export default function WorldMap({ plan }) {
  const [tooltip, setTooltip] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([15, 30]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z * 1.5, 8)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z / 1.5, 0.5)), []);
  const handleReset = useCallback(() => { setZoom(1); setCenter([15, 30]); }, []);

  const { markers, routes } = useMemo(() => {
    if (!plan) return { markers: [], routes: [] };

    const m = [];
    const r = [];
    const supplierCoords = [];

    // Helper to extract [lon, lat] from coordinate object {x: lat, y: lon}
    const toCoords = (c) => {
      if (!c) return null;
      if (Array.isArray(c)) return c; // already [lon, lat]
      if (c.x !== undefined && c.y !== undefined) return [c.y, c.x]; // {x: lat, y: lon} → [lon, lat]
      return null;
    };

    // Supplier locations from selected_details
    if (plan.suppliers?.selected_details) {
      plan.suppliers.selected_details.forEach((d) => {
        const coords = toCoords(d.coordinates);
        if (coords) {
          m.push({
            type: "supplier",
            name: d.name,
            location: d.location,
            coords,
            role: "Supplier",
            reliability: d.reliability,
            specialization: d.specialization || "General parts",
            certifications: d.certifications,
            leadTime: d.lead_time_days ? `${d.lead_time_days} days` : null,
            costMultiplier: d.cost_multiplier,
          });
          supplierCoords.push(coords);
        }
      });
    }

    // Manufacturer location
    let mfgCoords = null;
    const mfg = plan.manufacturer?.selected_details;
    const mfgC = toCoords(mfg?.coordinates);
    if (mfgC) {
      mfgCoords = mfgC;
      m.push({
        type: "manufacturer",
        name: mfg.name || plan.manufacturer?.selected,
        location: mfg.location,
        coords: mfgCoords,
        role: "Manufacturer",
        reliability: mfg.reliability,
        specialization: mfg.specialization || "Assembly",
        facilitySize: mfg.facility_size,
        assemblyTime: plan.manufacturer?.assembly_plan?.total_assembly_time_days
          ? `${plan.manufacturer.assembly_plan.total_assembly_time_days} days`
          : null,
      });
    }

    // Logistics hub
    let logCoords = null;
    const log = plan.logistics?.selected_details;
    const logC = toCoords(log?.coordinates);
    if (logC) {
      logCoords = logC;
      m.push({
        type: "logistics",
        name: log.name || plan.logistics?.selected,
        location: log.hub || log.location,
        coords: logCoords,
        role: "Logistics Hub",
        reliability: log.reliability,
        modes: Array.isArray(log.modes) ? log.modes.join(", ") : log.modes,
        shippingCost: plan.logistics?.shipping_cost_usd
          ? `$${Number(plan.logistics.shipping_cost_usd).toLocaleString()}`
          : null,
        transitDays: plan.logistics?.route?.total_duration_days
          ? `${plan.logistics.route.total_duration_days} days`
          : null,
      });
    }

    // Customer (default: central location or destination)
    const customerCoords = [2.35, 48.85]; // Paris as default
    m.push({
      type: "customer",
      name: "Customer",
      location: "Delivery Destination",
      coords: customerCoords,
      role: "Final Delivery Point",
    });

    // Routes: suppliers → manufacturer → logistics → customer
    if (mfgCoords) {
      supplierCoords.forEach((sc) => {
        r.push({ from: sc, to: mfgCoords, type: "supply", label: "Parts" });
      });
    }
    if (mfgCoords && logCoords) {
      r.push({ from: mfgCoords, to: logCoords, type: "assembly", label: "Assembled" });
    }
    if (logCoords) {
      r.push({ from: logCoords, to: customerCoords, type: "delivery", label: "Delivery" });
    }

    return { markers: m, routes: r };
  }, [plan]);

  const routeColors = {
    supply: "#22d3ee",
    assembly: "#34d399",
    delivery: "#f97316",
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-white/15 text-sm">
        Run a project to see the supply chain map
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-dark/90 border border-white/[0.06] p-3 space-y-1.5">
        {Object.entries(MARKER_COLORS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: val.fill }}
            />
            <span className="text-white/40 text-[10px] tracking-wide uppercase">
              {val.label}
            </span>
          </div>
        ))}
        <div className="border-t border-white/[0.04] pt-1.5 mt-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-[1px] bg-cyan-400" />
            <span className="text-white/30 text-[9px]">Supply Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-[1px] bg-emerald-400" />
            <span className="text-white/30 text-[9px]">Assembly Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-[1px] bg-orange-400" />
            <span className="text-white/30 text-[9px]">Delivery Route</span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 z-10 bg-dark/90 border border-white/[0.06] p-3">
        <p className="text-white/20 text-[9px] tracking-[0.15em] uppercase mb-1">
          Network
        </p>
        <p className="text-white/50 text-xs">
          {markers.length} nodes · {routes.length} routes
        </p>
      </div>

      {/* Tooltip — bottom-positioned, wide, detailed */}
      {tooltip && (
        <div
          className="absolute z-20 bg-dark/95 border border-white/10 backdrop-blur-sm pointer-events-none px-5 py-3 max-w-[500px]"
          style={{ bottom: 20, left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: (MARKER_COLORS[tooltip.type] || MARKER_COLORS.supplier).fill }} />
            <div>
              <p className="text-white/90 text-xs font-semibold tracking-wide">{tooltip.name}</p>
              <p className="text-white/40 text-[10px]">{tooltip.location}</p>
            </div>
            <span className="ml-auto text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 border"
              style={{
                color: (MARKER_COLORS[tooltip.type] || MARKER_COLORS.supplier).fill,
                borderColor: (MARKER_COLORS[tooltip.type] || MARKER_COLORS.supplier).fill + "40",
              }}
            >
              {tooltip.role || tooltip.type}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px]">
            {tooltip.reliability && (
              <span className="text-white/30">Reliability: <span className="text-white/60">{tooltip.reliability}</span></span>
            )}
            {tooltip.specialization && (
              <span className="text-white/30">Specialization: <span className="text-white/60">{tooltip.specialization}</span></span>
            )}
            {tooltip.leadTime && (
              <span className="text-white/30">Lead Time: <span className="text-white/60">{tooltip.leadTime}</span></span>
            )}
            {tooltip.facilitySize && (
              <span className="text-white/30">Facility: <span className="text-white/60">{tooltip.facilitySize}</span></span>
            )}
            {tooltip.assemblyTime && (
              <span className="text-white/30">Assembly: <span className="text-white/60">{tooltip.assemblyTime}</span></span>
            )}
            {tooltip.modes && (
              <span className="text-white/30">Transport: <span className="text-white/60">{tooltip.modes}</span></span>
            )}
            {tooltip.shippingCost && (
              <span className="text-white/30">Shipping: <span className="text-white/60">{tooltip.shippingCost}</span></span>
            )}
            {tooltip.transitDays && (
              <span className="text-white/30">Transit: <span className="text-white/60">{tooltip.transitDays}</span></span>
            )}
            {tooltip.costMultiplier && (
              <span className="text-white/30">Cost factor: <span className="text-white/60">{tooltip.costMultiplier}×</span></span>
            )}
            {tooltip.certifications && (
              <span className="text-white/30">Certs: <span className="text-white/60">{Array.isArray(tooltip.certifications) ? tooltip.certifications.join(", ") : tooltip.certifications}</span></span>
            )}
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
        <button onClick={handleZoomIn} className="w-8 h-8 bg-dark-mid/90 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
          <Plus className="h-4 w-4 text-white/60" />
        </button>
        <button onClick={handleZoomOut} className="w-8 h-8 bg-dark-mid/90 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
          <Minus className="h-4 w-4 text-white/60" />
        </button>
        <button onClick={handleReset} className="w-8 h-8 bg-dark-mid/90 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors mt-1">
          <RotateCcw className="h-3.5 w-3.5 text-white/40" />
        </button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 130,
        }}
        className="w-full h-full"
        style={{ background: "#0f1419" }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: z }) => { setCenter(coordinates); setZoom(z); }}
          minZoom={0.5}
          maxZoom={8}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rpiKey || geo.id || geo.properties?.name}
                  geography={geo}
                  fill="#1a2332"
                  stroke="#253040"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#1f2d3d", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Route lines */}
          {routes.map((route, i) => (
            <Line
              key={`route-${i}`}
              from={route.from}
              to={route.to}
              stroke={routeColors[route.type] || "#666"}
              strokeWidth={1.5 / Math.sqrt(zoom)}
              strokeLinecap="round"
              strokeDasharray="4 3"
              className="animate-pulse"
              style={{ opacity: 0.6 }}
            />
          ))}

          {/* Markers — scale inversely with zoom */}
          {markers.map((marker, i) => {
            const colors = MARKER_COLORS[marker.type] || MARKER_COLORS.supplier;
            const baseR = marker.type === "customer" ? 5 : 4;
            const scaledR = baseR / Math.sqrt(zoom);
            const pulseR = 8 / Math.sqrt(zoom);
            const sw = 1.5 / Math.sqrt(zoom);
            return (
              <Marker
                key={`marker-${i}`}
                coordinates={marker.coords}
                onMouseEnter={() => setTooltip(marker)}
                onMouseLeave={() => setTooltip(null)}
              >
                <motion.circle
                  r={scaledR}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={sw}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  style={{ cursor: "pointer" }}
                />
                {/* Pulse ring */}
                <circle
                  r={pulseR}
                  fill="none"
                  stroke={colors.fill}
                  strokeWidth={0.5 / Math.sqrt(zoom)}
                  opacity={0.3}
                  className="animate-ping"
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
