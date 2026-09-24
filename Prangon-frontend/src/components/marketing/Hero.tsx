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
    <Section variant="ink" className="py-6 md:py-8 lg:py-10 overflow-hidden relative">
      {/* Subtle background glow effect using framer motion */}
      <motion.div 
        className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-cobalt/20 rounded-full blur-[120px] pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
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
          <motion.h1 variants={itemVariants} className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-paper mb-6">
            The Workspace That Actually Works.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="font-sans text-xl text-paper/80 mb-10">
            Partition your projects. Secure your tenants. Scale your SaaS without the messy migrations. Prangon gives you the foundational primitives for multi-tenant architecture.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link href="/pricing" className="inline-flex h-12 items-center justify-center bg-paper text-ink px-8 font-medium hover:bg-paper/90 transition-colors">
              Get Started
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center justify-center border border-line-dark text-paper px-8 font-medium hover:bg-paper/10 transition-colors">
              Contact Sales
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - Image/UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="hidden lg:flex relative w-full h-[600px] items-center justify-center pointer-events-none"
        >
          {/* Custom Generated SaaS Dashboard Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src="/hero-dashboard.jpg" 
              alt="Prangon Workspace Dashboard"
              className="w-[110%] max-w-none h-auto object-contain translate-x-8 xl:translate-x-16 drop-shadow-2xl rounded-2xl"
            />
            {/* Soft gradient overlay to blend edges into the dark ink background if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-transparent opacity-30" />
          </div>
          
          {/* Floating UI Elements for depth */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-12 -left-6 p-4 bg-paper rounded-xl shadow-xl border border-line flex items-center gap-4 z-20"
          >
            <div className="w-10 h-10 rounded-full bg-cobalt flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <p className="text-ink font-medium text-sm">Tenant Isolated</p>
              <p className="text-graphite text-xs">Zero data leaks</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
