"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';

const topics = [
  'Architecture Deep Dive',
  'Enterprise Pricing',
  'Security & Compliance Audit',
  'Technical Support',
];

export function ContactForm() {
  const [topic, setTopic] = useState('Architecture Deep Dive');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  if (status === 'success') {
    return (
      <div className="p-8 sm:p-10 border border-emerald-500/30 bg-emerald-950/20 rounded-2xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">Inquiry received</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          An enterprise solutions engineer will review your architecture specifications and get back to you within 1 business hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card/70 backdrop-blur-md p-8 sm:p-10 shadow-xl">
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What can we help you with?
        </label>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                topic === t
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="block text-xs font-semibold text-foreground">First Name *</label>
          <Input required id="firstName" placeholder="Alex" className="h-11 rounded-xl bg-background border-border text-sm focus-visible:ring-primary" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="lastName" className="block text-xs font-semibold text-foreground">Last Name *</label>
          <Input required id="lastName" placeholder="Rivers" className="h-11 rounded-xl bg-background border-border text-sm focus-visible:ring-primary" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-semibold text-foreground">Work Email *</label>
        <Input required type="email" id="email" placeholder="alex@company.com" className="h-11 rounded-xl bg-background border-border text-sm focus-visible:ring-primary" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-xs font-semibold text-foreground">Architecture Details &amp; Project Scope *</label>
        <textarea
          required
          id="message"
          rows={4}
          placeholder="Tell us about your multi-tenant requirements, expected volume, and compliance needs..."
          className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending inquiry...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
