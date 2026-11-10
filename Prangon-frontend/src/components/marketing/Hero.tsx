"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Section } from './Section';

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <Section variant="ink" className="py-12 md:py-16 lg:py-20 overflow-hidden relative bg-slate-950 text-slate-100 border-b border-border/40">
      {/* Subtle background glow effect using framer motion */}
      <motion.div 
        className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column - Text */}
        <motion.div 
          className="relative z-20 max-w-2xl lg:pr-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Next-Gen SaaS Platform
          </div>

          <motion.h1 variants={itemVariants} className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-tight">
            The workspace engineered for modern teams.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="font-sans text-lg text-slate-300 mb-8 leading-relaxed">
            Partition your projects. Secure your tenants. Scale your SaaS without messy migrations. Prangon gives you the foundational primitives for multi-tenant enterprise execution.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link href="/pricing" className="inline-flex h-11 items-center justify-center bg-primary text-primary-foreground px-6 rounded-lg font-medium hover:bg-primary/90 shadow-sm transition-all">
              Get Started Free
            </Link>
            <Link href="/contact" className="inline-flex h-11 items-center justify-center border border-slate-700 bg-slate-900/60 text-slate-200 px-6 rounded-lg font-medium hover:bg-slate-800 transition-all">
              Contact Sales
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - Image/UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="hidden lg:flex relative w-full h-[550px] items-center justify-center pointer-events-none"
        >
          {/* Custom Generated SaaS Dashboard Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src="/hero-dashboard.jpg" 
              alt="Prangon Workspace Dashboard"
              className="w-[110%] max-w-none h-auto object-contain translate-x-8 xl:translate-x-16 drop-shadow-2xl rounded-2xl border border-slate-800"
            />
            {/* Soft gradient overlay to blend edges into the dark ink background if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent opacity-40" />
          </div>
          
          {/* Floating UI Elements for depth */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-12 -left-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-800 flex items-center gap-4 z-20 pointer-events-auto"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              ✓
            </div>
            <div>
              <p className="text-white font-medium text-sm">Tenant Isolated</p>
              <p className="text-slate-400 text-xs">Zero cross-tenant leaks</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
