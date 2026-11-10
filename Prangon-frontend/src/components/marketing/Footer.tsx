"use client";

import Link from "next/link";
import React, { useState } from "react";
import { PrangonLogo } from "@/components/PrangonLogo";
import { Twitter, Github, Linkedin, ArrowRight, Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setEmail("");
    }, 3000);
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 pt-16 pb-10">
      <div className="container mx-auto px-4 sm:px-6 xl:px-12 max-w-[1400px]">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="mb-6">
              <PrangonLogo size={28} textClassName="text-xl font-bold tracking-tight text-white" />
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs text-slate-400">
              The collaborative workspace built on zero-trust primitives. Partition your projects and secure your tenants effortlessly.
            </p>
            <div className="w-full max-w-sm">
              <p className="text-sm font-medium text-white mb-3">Subscribe to our newsletter</p>
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  disabled={status === "success"}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-4 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-75"
                />
                <button 
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  disabled={status === "success"}
                  className="absolute right-1.5 p-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors flex items-center justify-center cursor-pointer disabled:bg-emerald-600 disabled:cursor-default"
                >
                  {status === "success" ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </form>
              {status === "success" && (
                <p className="text-xs text-emerald-400 mt-2">Thank you for subscribing!</p>
              )}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-white">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-white">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-white">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-white">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Prangon Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <a href="https://twitter.com" className="hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com" className="hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" className="hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
