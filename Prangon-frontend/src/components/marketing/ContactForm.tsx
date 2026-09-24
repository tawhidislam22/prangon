"use client";

import React, { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="p-8 border border-line bg-paper/50">
        <h3 className="font-display text-2xl text-ink mb-2">Message received.</h3>
        <p className="font-sans text-graphite">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block font-sans text-sm font-medium text-ink">First Name</label>
          <input required type="text" id="firstName" className="w-full h-12 px-4 border border-line bg-transparent font-sans text-ink focus:outline-none focus:border-ink transition-colors" />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="block font-sans text-sm font-medium text-ink">Last Name</label>
          <input required type="text" id="lastName" className="w-full h-12 px-4 border border-line bg-transparent font-sans text-ink focus:outline-none focus:border-ink transition-colors" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block font-sans text-sm font-medium text-ink">Work Email</label>
        <input required type="email" id="email" className="w-full h-12 px-4 border border-line bg-transparent font-sans text-ink focus:outline-none focus:border-ink transition-colors" />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="block font-sans text-sm font-medium text-ink">Message</label>
        <textarea required id="message" rows={5} className="w-full p-4 border border-line bg-transparent font-sans text-ink focus:outline-none focus:border-ink transition-colors resize-none" />
      </div>
      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="h-12 px-8 bg-ink text-paper font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
