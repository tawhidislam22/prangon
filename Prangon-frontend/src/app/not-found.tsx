import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-paper text-ink px-4 py-12 selection:bg-cobalt/20">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-cobalt/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cobalt/10 border border-cobalt/20 text-cobalt text-xs font-semibold uppercase tracking-wider">
          <Compass className="size-3.5" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Huge 404 Display */}
        <div className="font-display text-8xl sm:text-9xl font-bold tracking-tight text-ink/90 select-none leading-none">
          4<span className="text-cobalt">0</span>4
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink">
            Lost in uncharted territory
          </h1>
          <p className="font-sans text-base sm:text-lg text-graphite max-w-xl mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been relocated, or is temporarily inaccessible.
          </p>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cobalt px-6 text-sm font-medium text-white shadow-sm hover:bg-cobalt/90 hover:shadow-md transition-all active:scale-[0.99]"
          >
            <Home className="size-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/features"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-6 text-sm font-medium text-ink shadow-xs hover:bg-paper/80 hover:border-line-dark/40 transition-all active:scale-[0.99]"
          >
            <Compass className="size-4 text-graphite" />
            <span>Explore Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
