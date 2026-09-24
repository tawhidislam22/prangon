export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-[85vh] w-full flex flex-col items-center justify-center p-6 select-none bg-paper/60 dark:bg-background/80"
    >
      <div className="relative flex flex-col items-center max-w-xs w-full text-center space-y-6">
        {/* Animated Brand Mark */}
        <div className="relative flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-cobalt/15 rounded-3xl blur-xl animate-pulse" />

          {/* Outer Spinner Track */}
          <div className="size-16 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800 border-t-cobalt dark:border-t-cobalt animate-spin" />

          {/* Center Monogram Emblem */}
          <div className="absolute inset-0 m-auto size-10 rounded-xl bg-cobalt flex items-center justify-center shadow-lg shadow-cobalt/25">
            <span className="font-display font-bold text-white text-lg tracking-tight">P</span>
          </div>
        </div>

        {/* Brand & Loading Status */}
        <div className="space-y-1.5">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white tracking-tight">
            Prangon
          </h2>
          <p className="text-xs text-graphite/80 dark:text-slate-400 font-medium">
            Loading your workspace, please wait...
          </p>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-200/90 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 w-1/2 bg-cobalt rounded-full animate-indeterminate" />
        </div>
      </div>
    </div>
  );
}

