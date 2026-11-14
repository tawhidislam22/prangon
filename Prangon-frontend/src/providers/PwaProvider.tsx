"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

interface PwaContextValue {
  /** True while the app is running in standalone (installed) mode */
  isStandalone: boolean;
  /** True when running on iOS Safari */
  isIOS: boolean;
  /** True when Chrome / Android install prompt is capturable */
  canInstall: boolean;
  /** Triggers the native install prompt */
  promptInstall: () => Promise<void>;
  /** True when a new service-worker version is waiting to activate */
  isUpdateAvailable: boolean;
  /** Posts SKIP_WAITING and reloads to activate the new SW */
  applyUpdate: () => void;
  /** True when the browser has network access */
  isOnline: boolean;
}

const PwaContext = createContext<PwaContextValue>({
  isStandalone: false,
  isIOS: false,
  canInstall: false,
  promptInstall: async () => {},
  isUpdateAvailable: false,
  applyUpdate: () => {},
  isOnline: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const waitingSwRef = useRef<ServiceWorker | null>(null);

  // ── Standalone & iOS detection ──────────────────────────────────────────────
  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const ua = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(iosDevice);
    setIsOnline(navigator.onLine);
  }, []);

  // ── Online / Offline ────────────────────────────────────────────────────────
  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  // ── Install prompt ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Hide canInstall once app is installed
    window.addEventListener("appinstalled", () => {
      setCanInstall(false);
      deferredPromptRef.current = null;
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPromptRef.current) return;
    await deferredPromptRef.current.prompt();
    const { outcome } = await deferredPromptRef.current.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
      deferredPromptRef.current = null;
    }
  }, []);

  // ── Service Worker registration & update detection ──────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Check for already-waiting worker (page refresh after update)
        if (registration.waiting) {
          waitingSwRef.current = registration.waiting;
          setIsUpdateAvailable(true);
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              waitingSwRef.current = newWorker;
              setIsUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => {
        // Non-fatal — app still works without SW
        console.warn("[PWA] Service worker registration failed:", err);
      });

    // When the SW controller changes (new SW activated), reload once
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!reloading) {
        reloading = true;
        window.location.reload();
      }
    });
  }, []);

  const applyUpdate = useCallback(() => {
    if (!waitingSwRef.current) return;
    waitingSwRef.current.postMessage({ type: "SKIP_WAITING" });
  }, []);

  return (
    <PwaContext.Provider
      value={{
        isStandalone,
        isIOS,
        canInstall,
        promptInstall,
        isUpdateAvailable,
        applyUpdate,
        isOnline,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePwa() {
  return useContext(PwaContext);
}
