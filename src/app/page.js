"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Package,
  Factory,
  Truck,
  Store,
} from "lucide-react";
import { IskraLogoMark } from "@/components/IskraLogo";

// ============================================
// Landing Page — Iskra AI / One Click AI
// Full-bleed cinematic sections
// ============================================

const AGENT_FEATURES = [
  {
    icon: Zap,
    name: "Procurement Agent",
    desc: "CrewAI-powered orchestrator that analyzes your request and coordinates all other agents",
    tag: "CrewAI",
  },
  {
    icon: Package,
    name: "Supplier Agent",
    desc: "Checks inventory, generates detailed quotes with real specifications and pricing",
    tag: "Python",
  },
  {
    icon: Factory,
    name: "Manufacturer Agent",
    desc: "Evaluates assembly capacity, creates production plans, and schedules facilities",
    tag: "Python",
  },
  {
    icon: Truck,
    name: "Logistics Agent",
    desc: "Plans optimal routes, calculates shipping costs, and assesses risk across modes",
    tag: "Python",
  },
  {
    icon: Store,
    name: "Retailer Agent",
    desc: "Manages final delivery, packaging, tracking, warranty, and customer experience",
    tag: "Python",
  },
];

export default function HomePage() {
  return (
    <div className="bg-dark">
      {/* ===== HERO — Full viewport ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-dark via-dark-mid to-dark-soft" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-transparent to-dark/80" />
        </div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 lg:px-16 pb-20 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="heading-display text-white text-5xl sm:text-7xl lg:text-8xl xl:text-9xl max-w-5xl">
              One click to
              <br />
              orchestrate it all
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="body-large text-white/60 text-lg sm:text-xl max-w-xl mt-8"
          >
            Autonomous AI agents that coordinate your entire supply chain —
            procurement, manufacturing, logistics, and delivery — in a single
            command.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-10"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 border border-accent text-accent hover:bg-accent hover:text-white text-sm tracking-widest font-medium px-8 py-4 transition-all duration-300"
            >
              TRY ONE CLICK AI <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 2 — Two side-by-side panels ===== */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel — Agents */}
        <div className="relative h-[70vh] md:h-screen overflow-hidden group cursor-pointer">
          <div className="w-full h-full bg-gradient-to-br from-dark-mid via-dark to-[#0a1628]" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

          {/* Decorative: network nodes */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="40" r="4" fill="white" />
              <circle cx="40" cy="100" r="4" fill="white" />
              <circle cx="160" cy="100" r="4" fill="white" />
              <circle cx="60" cy="160" r="4" fill="white" />
              <circle cx="140" cy="160" r="4" fill="white" />
              <line x1="100" y1="40" x2="40" y2="100" stroke="white" strokeWidth="0.5" />
              <line x1="100" y1="40" x2="160" y2="100" stroke="white" strokeWidth="0.5" />
              <line x1="40" y1="100" x2="60" y2="160" stroke="white" strokeWidth="0.5" />
              <line x1="160" y1="100" x2="140" y2="160" stroke="white" strokeWidth="0.5" />
              <line x1="40" y1="100" x2="160" y2="100" stroke="white" strokeWidth="0.3" />
              <line x1="60" y1="160" x2="140" y2="160" stroke="white" strokeWidth="0.3" />
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              5 Autonomous Agents
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              Independent AI agents that think, communicate, and coordinate
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              See it in action
            </Link>
          </div>
        </div>

        {/* Right Panel — Real-time */}
        <div className="relative h-[70vh] md:h-screen overflow-hidden group cursor-pointer border-l border-white/5">
          <div className="w-full h-full bg-gradient-to-br from-[#1a2810] via-dark-mid to-dark" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

          {/* Decorative: terminal lines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <div className="font-mono text-[10px] text-white/80 space-y-1 text-left">
              <p>{">"} [Procurement] Analyzing intent...</p>
              <p>{">"} [Supplier] Checking inventory...</p>
              <p>{">"} [Manufacturer] Evaluating capacity...</p>
              <p>{">"} [Logistics] Planning route...</p>
              <p>{">"} [Retailer] Preparing delivery...</p>
              <p className="text-emerald-400/60">{">"} Plan complete ✓</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Real-Time Coordination
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              Watch agents negotiate, verify, and execute live
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Try the demo
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3 — About text on cream ===== */}
      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="heading-section text-dark text-3xl sm:text-5xl lg:text-6xl max-w-4xl mb-12"
          >
            One Click AI is not
            <br className="hidden sm:block" />
            just automation
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-2xl"
          >
            <p className="body-large text-dark-soft/70 text-lg sm:text-xl mb-6">
              It&apos;s a network of independent AI agents that coordinate
              complex supply chains by talking to each other directly. No
              central controller. No rigid workflows. Just intelligent agents
              that discover, negotiate, and execute.
            </p>
            <p className="body-large text-dark-soft/70 text-lg sm:text-xl">
              Enter a single command — &quot;Buy all parts for a Ferrari&quot; —
              and watch as procurement, supplier, manufacturer, logistics, and
              retailer agents work together to make it happen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 4 — Two panels ===== */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left — Supply Chain */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden group cursor-pointer">
          <div className="w-full h-full bg-gradient-to-tl from-[#2a1008] via-dark-mid to-dark" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/30" />

          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-1000" />

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              A2A Protocol
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              Agent-to-Agent communication over HTTP/JSON
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right — Coordination */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden group cursor-pointer border-l border-white/5">
          <div className="w-full h-full bg-gradient-to-br from-dark via-dark-mid to-[#0c1a10]" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/30" />

          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {[
                [23,167],[142,34],[87,112],[56,78],[178,145],[31,23],[164,89],[95,156],[12,134],[148,67],
                [73,42],[119,178],[45,95],[189,12],[67,189],[134,56],[8,108],[156,134],[102,23],[38,162],
                [175,98],[61,45],[128,167],[84,8],[197,78],[15,56],[145,112],[52,189],[112,45],[168,156],
                [28,89],[92,134],[183,23],[47,67],[138,98],[76,156],[109,78],[162,45],[19,178],[85,112],
                [155,34],[42,145],[123,67],[68,23],[192,112],[34,98],[147,178],[58,56],[115,89],[172,134],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={1.5} fill="white" />
              ))}
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Full Transparency
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              Every decision logged, every message traced
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5 — Agents showcase on cream ===== */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="heading-section text-dark text-2xl sm:text-3xl">
              The Agent Network
            </h2>
            <Link
              href="/dashboard"
              className="text-dark-soft/50 hover:text-dark text-sm tracking-wider flex items-center gap-2 transition-colors"
            >
              Try it <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {AGENT_FEATURES.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="group block bg-white/60 border border-cream-dark/40 p-6 hover:bg-white transition-all duration-300 h-full">
                    <div className="w-10 h-10 bg-dark-mid flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-white/70" />
                    </div>
                    <p className="text-dark-soft/40 text-[10px] tracking-wider mb-2">
                      {agent.tag}
                    </p>
                    <h3 className="text-dark text-sm font-semibold mb-2">
                      {agent.name}
                    </h3>
                    <p className="text-dark-soft/50 text-xs leading-relaxed">
                      {agent.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="bg-dark py-24 sm:py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="heading-section text-white text-3xl sm:text-5xl mb-4">
              Ready to orchestrate
              <br />
              your supply chain?
            </h2>
            <p className="text-white/40 text-base sm:text-lg mb-10 max-w-lg mx-auto">
              Enter one command. Five agents. Complete execution plan.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 border border-accent text-accent hover:bg-accent hover:text-white text-sm tracking-widest font-medium px-8 py-4 transition-all duration-300"
            >
              TRY ONE CLICK AI <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
