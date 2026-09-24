"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Section } from "./Section";
import { Layers, Shield, Zap } from "lucide-react";

const steps = [
  {
    icon: Layers,
    title: "1. Create Workspaces",
    description: "Launch isolated workspaces for each client or team. Data is segregated from day one with zero configuration.",
  },
  {
    icon: Shield,
    title: "2. Define Roles",
    description: "Assign Owner, Admin, and Member permissions. Granular RBAC ensures users only see what they are authorized to see.",
  },
  {
    icon: Zap,
    title: "3. Scale Instantly",
    description: "Connect Stripe to monetize your application. Add AI features and integrations without touching the core infrastructure.",
  }
];

export function HowItWorksSection() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  return (
    <Section variant="ink" className="py-10 md:py-12 relative overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="font-display text-4xl sm:text-5xl text-paper mb-6"
          >
            How it works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="font-sans text-xl text-paper/70 max-w-2xl mx-auto"
          >
            Three simple steps to transition from a chaotic monolithic architecture to a strictly isolated, multi-tenant workspace.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="relative p-8 rounded-2xl border border-line-dark bg-ink shadow-lg hover:border-cobalt transition-colors group"
            >
              {/* Subtle background highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cobalt/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              
              <div className="w-14 h-14 bg-line-dark rounded-xl flex items-center justify-center mb-6 text-paper group-hover:bg-cobalt group-hover:text-white transition-colors">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl text-paper mb-4">{step.title}</h3>
              <p className="text-paper/70 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
