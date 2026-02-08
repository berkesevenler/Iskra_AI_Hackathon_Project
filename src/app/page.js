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

// ============================================
// Landing Page — One Click AI
// Full-bleed cinematic sections
// ============================================

const AGENT_FEATURES = [
  {
    icon: Zap,
    name: "Procurement Agent",
    desc: "CrewAI orchestrator that decomposes intent, discovers partners, and drives the entire coordination cascade",
    tag: "CrewAI · GPT-4o",
  },
  {
    icon: Package,
    name: "Supplier Agent",
    desc: "Evaluates 30+ global suppliers, generates real-time quotes, and validates certifications across jurisdictions",
    tag: "Python · A2A",
  },
  {
    icon: Factory,
    name: "Manufacturer Agent",
    desc: "Assesses facility capacity, builds assembly plans, and schedules production against live constraints",
    tag: "Python · A2A",
  },
  {
    icon: Truck,
    name: "Logistics Agent",
    desc: "Optimizes multi-modal routing, calculates landed costs, and flags risk across global shipping corridors",
    tag: "Python · A2A",
  },
  {
    icon: Store,
    name: "Retailer Agent",
    desc: "Finalizes pricing, configures packaging and warranty, and orchestrates last-mile delivery to the customer",
    tag: "Python · A2A",
  },
];

export default function HomePage() {
  return (
    <div className="bg-dark">
      {/* ===== HERO — Full viewport with video ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src="/one_click_ai_hero_video.mp4"
          />
          {/* Dark overlays for text legibility */}
          <div className="absolute inset-0 bg-dark/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 lg:px-16 pb-10 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="heading-display text-white text-5xl sm:text-7xl lg:text-8xl xl:text-9xl">
              Your supply chain,
              <br />
              <span className="whitespace-nowrap">one command away</span>
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
            className="body-large text-white/60 text-lg sm:text-xl max-w-2xl mt-8"
          >
            Five autonomous AI agents negotiate suppliers, schedule manufacturing,
            route logistics, and finalize delivery — coordinating an entire procurement
            pipeline from a single sentence.
          </motion.p>
        </div>
      </section>

      {/* ===== SECTION 2 — Two side-by-side photo panels ===== */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel — Decentralized Intelligence */}
        <div className="relative h-[70vh] md:h-screen overflow-hidden group cursor-pointer">
          {/* Photo background */}
          <img
            src="/nice_colorful_foto_1of2.jpg"
            alt="Global supply chain containers"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-dark/10" />

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Decentralized Intelligence
            </h3>
            <p className="text-white/60 text-base sm:text-lg mb-6 max-w-md">
              No central controller. Five specialized agents discover each other through
              a shared registry, negotiate directly, and converge on the optimal plan.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              See it in action
            </Link>
          </div>
        </div>

        {/* Right Panel — Live Coordination */}
        <div className="relative h-[70vh] md:h-screen overflow-hidden group cursor-pointer border-l border-white/5">
          {/* Photo background */}
          <img
            src="/nice_colorful_foto_2of2.jpg"
            alt="Shipping containers at port"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-dark/10" />

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Live Coordination Feed
            </h3>
            <p className="text-white/60 text-base sm:text-lg mb-6 max-w-md">
              Every agent message, decision, and verification streams to your dashboard
              in real time. Full transparency from intent to execution.
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

      {/* ===== SECTION 3 — Quote statement on cream (no media) ===== */}
      <section className="bg-cream py-28 sm:py-36 lg:py-44">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Quote block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <blockquote className="relative z-10 border-l-[3px] border-accent/60 pl-8 sm:pl-12">
              <p className="heading-section text-dark text-3xl sm:text-5xl lg:text-6xl max-w-4xl leading-[1.15] tracking-tight">
                Supply chains weren&apos;t built
                <br className="hidden sm:block" />
                for single points of control
              </p>
              <footer className="mt-6">
                <span className="text-accent text-sm sm:text-base font-medium tracking-wider uppercase">
                  — The One Click AI Thesis
                </span>
              </footer>
            </blockquote>
          </motion.div>

          {/* Body text — separated below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mt-16 sm:mt-20"
          >
            <p className="body-large text-dark-soft/70 text-lg sm:text-xl mb-6">
              Traditional procurement tools force linear workflows through a single
              orchestrator. One Click AI takes a different approach: a network of
              independent agents — each with its own data, reasoning, and domain
              expertise — that coordinate through direct Agent-to-Agent communication.
            </p>
            <p className="body-large text-dark-soft/70 text-lg sm:text-xl">
              Describe what you need in plain language. The agents handle the rest —
              sourcing from 90+ global partners, scoring by cost and proximity,
              verifying certifications, and assembling a complete execution plan with
              real pricing, real timelines, and full auditability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 4 — Two photo panels ===== */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left — A2A Protocol */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden group cursor-pointer">
          {/* Photo background — cargo plane at night */}
          <img
            src="/cool_plane_dark%20backgrodun.jpg"
            alt="Cargo aircraft at night"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-dark/10" />

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              A2A Protocol
            </h3>
            <p className="text-white/60 text-base sm:text-lg mb-6 max-w-md">
              Agents exchange structured messages over HTTP/JSON —
              availability checks, capacity confirmations, route proposals, and
              price negotiations — all logged and traceable.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Explore the protocol
            </Link>
          </div>
        </div>

        {/* Right — Audit Trail */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden group cursor-pointer border-l border-white/5">
          {/* Photo background — container yard */}
          <img
            src="/verx_nice_cinematic_container_hall.jpg"
            alt="Container yard operations"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-dark/10" />

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Complete Audit Trail
            </h3>
            <p className="text-white/60 text-base sm:text-lg mb-6 max-w-md">
              Every discovery path, trust verification, policy check, and cost
              decision is recorded. Review the full coordination report —
              who chose what, why, and at what price.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              View sample report
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5 — Agents showcase on cream ===== */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="heading-section text-dark text-2xl sm:text-3xl">
                The Agent Network
              </h2>
              <p className="text-dark-soft/50 text-sm mt-1.5 max-w-md">
                Five specialized agents. 90 global partners. One coordinated plan.
              </p>
            </div>
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

      {/* ===== CTA Section — with cinematic background ===== */}
      <section className="relative h-[70vh] sm:h-[80vh] w-full overflow-hidden">
        {/* Background image */}
        <img
          src="/cool_containers_blusih_color.jpg"
          alt="Container logistics"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/40" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl"
          >
            <h2 className="heading-section text-white text-3xl sm:text-5xl mb-4">
              Stop managing supply chains.
              <br />
              Start commanding them.
            </h2>
            <p className="text-white/50 text-base sm:text-lg mb-10 max-w-lg mx-auto">
              One sentence. Five agents. A complete execution plan —
              with real suppliers, real costs, and a real timeline.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 border border-accent text-accent hover:bg-accent hover:text-white text-sm tracking-widest font-medium px-8 py-4 transition-all duration-300 backdrop-blur-sm"
            >
              LAUNCH DASHBOARD <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
