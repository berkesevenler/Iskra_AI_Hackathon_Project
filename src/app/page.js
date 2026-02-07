"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IskraLogoMark } from "@/components/IskraLogo";

// ============================================
// Landing Page — Iskra AI
// Full-bleed cinematic sections
// ============================================

export default function HomePage() {
  return (
    <div className="bg-dark">
      {/* ===== HERO — Full viewport, single video/image ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video / Image Background */}
        <div className="absolute inset-0">
          {/*
            REPLACE with your video:
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          */}
          <div className="w-full h-full bg-gradient-to-br from-dark via-dark-mid to-dark-soft" />
          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-transparent to-dark/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 lg:px-16 pb-20 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="heading-display text-white text-5xl sm:text-7xl lg:text-8xl xl:text-9xl max-w-5xl">
              Powering the
              <br />
              next frontier
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="body-large text-white/60 text-lg sm:text-xl max-w-xl mt-8"
          >
            Iskra AI builds intelligent systems that transform how
            organizations operate, decide, and scale.
          </motion.p>
        </div>
      </section>

      {/* ===== SECTION 2 — Two side-by-side panels ===== */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel */}
        <div className="relative h-[70vh] md:h-screen overflow-hidden group cursor-pointer">
          {/*
            REPLACE with video/image:
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/video-1.mp4" type="video/mp4" />
            </video>
          */}
          <div className="w-full h-full bg-gradient-to-br from-dark-mid via-dark to-[#0a1628]" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

          {/* Decorative element */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-700">
            <div className="w-48 h-48 border border-white/30 rotate-45" />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Intelligence
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              AI-driven insights at scale
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative h-[70vh] md:h-screen overflow-hidden group cursor-pointer border-l border-white/5">
          {/*
            REPLACE with video/image:
            <img src="/image-1.jpg" className="w-full h-full object-cover" />
          */}
          <div className="w-full h-full bg-gradient-to-br from-[#1a2810] via-dark-mid to-dark" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

          {/* Decorative element */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15 group-hover:opacity-25 transition-opacity duration-700">
            <div className="w-64 h-64 border border-white/20 rounded-full" />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Automation
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              Autonomous systems for real-world impact
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

      {/* ===== SECTION 3 — Text on cream ===== */}
      <section className="bg-cream py-24 sm:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="heading-section text-dark text-3xl sm:text-5xl lg:text-6xl max-w-4xl mb-12"
          >
            Iskra AI is a new kind
            <br className="hidden sm:block" />
            of technology company
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-2xl"
          >
            <p className="body-large text-dark-soft/70 text-lg sm:text-xl mb-6">
              We design and build AI-powered systems that work in the real
              world. Our technology connects data, decisions, and action into a
              seamless intelligent network.
            </p>
            <p className="body-large text-dark-soft/70 text-lg sm:text-xl">
              We are building responsibly — with transparency, ethical
              standards, and a commitment to meaningful impact at every level.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 4 — Two more panels ===== */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden group cursor-pointer">
          <div className="w-full h-full bg-gradient-to-tl from-[#2a1008] via-dark-mid to-dark" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/30" />

          {/* Abstract glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-1000" />

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-10">
            <h3 className="heading-section text-white text-2xl sm:text-3xl mb-2">
              Platform
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              End-to-end AI infrastructure
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center border border-white/30 text-white text-sm tracking-widest px-5 py-2.5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden group cursor-pointer border-l border-white/5">
          <div className="w-full h-full bg-gradient-to-br from-dark via-dark-mid to-[#0c1a10]" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/30" />

          {/* Particle-like dots (deterministic positions to avoid hydration mismatch) */}
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
              Research
            </h3>
            <p className="text-white/50 text-base sm:text-lg mb-6">
              Pushing the boundaries of AI
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

      {/* ===== SECTION 5 — Newsroom / Cards on cream ===== */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="heading-section text-dark text-2xl sm:text-3xl">
              Latest
            </h2>
            <Link
              href="/dashboard"
              className="text-dark-soft/50 hover:text-dark text-sm tracking-wider flex items-center gap-2 transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tag: "UPDATE",
                date: "FEB. 2026",
                title: "Iskra AI launches its next-generation platform",
              },
              {
                tag: "ANNOUNCEMENT",
                date: "FEB. 2026",
                title: "New partnerships driving AI innovation forward",
              },
              {
                tag: "RESEARCH",
                date: "JAN. 2026",
                title: "Advancing the state of autonomous intelligent systems",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="group block">
                  {/* Card image placeholder */}
                  <div className="aspect-[16/10] bg-dark-mid mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-dark-soft to-dark group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                      <IskraLogoMark size={28} color="white" className="opacity-20" />
                    </div>
                  </div>
                  <p className="text-dark-soft/40 text-xs tracking-wider mb-2">
                    {item.tag} | {item.date}
                  </p>
                  <h3 className="text-dark text-base sm:text-lg font-semibold leading-snug group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
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
            <h2 className="heading-section text-white text-3xl sm:text-5xl mb-8">
              Ready to build with
              <br />
              Iskra AI?
            </h2>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 border border-accent text-accent hover:bg-accent hover:text-white text-sm tracking-widest font-medium px-8 py-4 transition-all duration-300"
            >
              TRY PRODUCT <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
