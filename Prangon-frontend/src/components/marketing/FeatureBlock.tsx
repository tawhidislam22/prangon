"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureBlockProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  reverse?: boolean;
}

export function FeatureBlock({ title, description, imageSrc, imageAlt = 'Feature illustration', reverse = false }: FeatureBlockProps) {
  return (
    <div className={`flex flex-col lg:flex-row gap-12 items-center py-16 md:py-24 border-b border-line ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <motion.div 
        className="flex-1 space-y-6"
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="font-display text-3xl sm:text-4xl text-ink">{title}</h2>
        <p className="font-sans text-xl text-graphite leading-relaxed">
          {description}
        </p>
      </motion.div>
      <motion.div 
        className="flex-1 w-full"
        initial={{ opacity: 0, x: reverse ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-line-dark">
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink/10 to-transparent pointer-events-none mix-blend-overlay" />
        </div>
      </motion.div>
    </div>
  );
}
