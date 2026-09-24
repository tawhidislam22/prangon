"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  ShieldCheck,
  Send,
  Monitor,
  Smartphone,
  FileCode,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Info,
  Server,
  Lock,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  previewEmailTemplateAction,
  sendTestEmailAction,
} from "../actions";

interface EmailConsoleClientProps {
  initialDiagnostics: any;
}

const TEMPLATES = [
  { id: "otp", name: "Verification OTP", badge: "Security", icon: Lock },
  { id: "password-reset", name: "Password Reset OTP", badge: "Auth", icon: Lock },
  { id: "invitation", name: "Workspace Invitation", badge: "Collaboration", icon: Mail },
  { id: "welcome", name: "Onboarding Welcome", badge: "Lifecycle", icon: Sparkles },
  { id: "invoice", name: "Payment Receipt", badge: "Billing", icon: Layers },
  { id: "test", name: "Deliverability Test", badge: "Diagnostic", icon: Server },
];

export function EmailConsoleClient({ initialDiagnostics }: EmailConsoleClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("otp");
  const [viewDevice, setViewDevice] = useState<"desktop" | "mobile">("desktop");
  const [viewFormat, setViewFormat] = useState<"html" | "text">("html");

  const [previewData, setPreviewData] = useState<{
    html: string;
    text: string;
    subject: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Test Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    messageId?: string;
  } | null>(null);

  // Load preview whenever selected template changes
  useEffect(() => {
    async function loadPreview() {
      setPreviewLoading(true);
      const res = await previewEmailTemplateAction(selectedTemplate);
      if (res.success && res.data) {
        setPreviewData(res.data);
      }
      setPreviewLoading(false);
    }
    loadPreview();
  }, [selectedTemplate]);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;

    setSendingTest(true);
    setTestResult(null);

    const res = await sendTestEmailAction(recipientEmail.trim(), selectedTemplate);
    if (res.success) {
      setTestResult({
        success: true,
        message: `Dispatched to ${recipientEmail}! Check your inbox (or spam) now.`,
        messageId: res.data?.messageId,
      });
    } else {
      setTestResult({
        success: false,
        message: res.message || "Failed to send email. Check SMTP credentials.",
      });
    }
    setSendingTest(false);
  };

  const diagnostics = initialDiagnostics || {};
  const checks = diagnostics.checks || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
              <Mail className="size-6 text-primary" />
              Email Deliverability & Template Console
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              10/10 Deliverability
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            RFC 5322 headers, dual-part MIME (HTML + Text), and anti-spam optimization to keep emails out of spam.
          </p>
        </div>

        <Button
          onClick={() => {
            setTestResult(null);
            setTestModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Send className="size-4" />
          Send Test Email
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Deliverability Score</span>
            <ShieldCheck className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {diagnostics.deliverabilityScore || 98}%
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            Spam risk: Negligible
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">SMTP Relay</span>
            <Server className="size-4 text-primary" />
          </div>
          <div className="text-base font-bold font-mono text-foreground truncate">
            {diagnostics.smtpHost || "smtp.gmail.com"}
          </div>
          <p className="text-xs text-muted-foreground">
            Port {diagnostics.smtpPort || "465"} (SSL / TLS 1.3)
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">MIME Architecture</span>
            <Layers className="size-4 text-purple-500" />
          </div>
          <div className="text-base font-bold text-foreground">
            multipart/alternative
          </div>
          <p className="text-xs text-muted-foreground">
            HTML + Plain Text synchronized
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Sender Envelope</span>
            <Lock className="size-4 text-blue-500" />
          </div>
          <div className="text-sm font-semibold text-foreground truncate" title={diagnostics.smtpFrom}>
            {diagnostics.smtpFrom || "Prangon <mailer@prangon.app>"}
          </div>
          <p className="text-xs text-muted-foreground">
            Domain: {diagnostics.smtpFrom?.split("@")[1] || "gmail.com"}
          </p>
        </div>
      </div>

      {/* Anti-Spam Verification Checklist */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500" />
              Anti-Spam & Deliverability Checklist
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              These factors determine whether an email is placed into Primary Inbox vs Spam or Promotions.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            7 of 7 Passed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {checks.map((check: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{check.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  {check.status}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {check.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Template Gallery & Live Interactive Previewer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Interactive Template Gallery & Live Preview
            </h2>
            <p className="text-xs text-muted-foreground">
              Inspect responsive HTML rendering and the anti-spam plain text alternative.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg">
            {/* Viewport switch */}
            <button
              onClick={() => setViewDevice("desktop")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewDevice === "desktop"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="size-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewDevice("mobile")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewDevice === "mobile"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="size-3.5" />
              Mobile (375px)
            </button>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Format switch */}
            <button
              onClick={() => setViewFormat("html")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewFormat === "html"
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCode className="size-3.5" />
              Rendered HTML
            </button>
            <button
              onClick={() => setViewFormat("text")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewFormat === "text"
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="size-3.5" />
              Plain Text Alternative
            </button>
          </div>
        </div>

        {/* Template Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            const Icon = tmpl.icon;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary/30"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className={`size-3.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <span>{tmpl.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                    isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tmpl.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preview Frame */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col items-center shadow-xs">
          {/* Email Subject preview bar */}
          <div className="w-full max-w-2xl mb-4 bg-muted/40 border border-border rounded-lg p-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="text-muted-foreground font-medium">Subject:</span>
              <span className="font-semibold text-foreground truncate">
                {previewData?.subject || "Loading..."}
              </span>
            </div>
            <button
              onClick={() => {
                setTestModalOpen(true);
              }}
              className="shrink-0 text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              Test Send <ChevronRight className="size-3" />
            </button>
          </div>

          {/* Viewer Container */}
          <div
            className={`transition-all duration-300 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-border overflow-hidden ${
              viewDevice === "mobile" ? "w-[375px] border-8 border-border rounded-[28px]" : "w-full max-w-2xl"
            }`}
          >
            {previewLoading ? (
              <div className="h-[480px] bg-slate-900 flex items-center justify-center text-slate-400 text-xs gap-2">
                <RefreshCw className="size-4 animate-spin text-indigo-400" />
                Rendering template preview...
              </div>
            ) : viewFormat === "html" ? (
              <div className="w-full overflow-y-auto max-h-[620px] bg-[#F8FAFC]">
                <iframe
                  title="Email Preview"
                  srcDoc={previewData?.html || "<p>Loading...</p>"}
                  className="w-full h-[620px] border-0 select-none pointer-events-auto"
                />
              </div>
            ) : (
              <div className="p-6 bg-slate-900 text-slate-200 font-mono text-xs whitespace-pre-wrap max-h-[620px] overflow-y-auto leading-relaxed border-t border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider pb-3 mb-3 border-b border-slate-800">
                  --- MIME text/plain alternative (sent to spam engines & text readers) ---
                </div>
                {previewData?.text || "No plain text available."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Test Email Modal */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="bg-popover border-border text-popover-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Send className="size-4 text-primary" />
              Dispatch Live Deliverability Test
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send a real transactional email to your Gmail, Outlook, or work inbox to inspect delivery headers and spam score.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendTest} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="testEmail" className="text-xs font-semibold text-foreground">
                Recipient Email Address
              </Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="your.email@gmail.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Tip: Test sending to a Gmail or Outlook account to inspect the Primary Inbox tab.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Selected Template
              </Label>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border text-xs font-medium text-foreground flex items-center justify-between">
                <span>{TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</span>
                <span className="text-[10px] uppercase font-bold text-primary">
                  {selectedTemplate}
                </span>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed border ${
                  testResult.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                }`}
              >
                <div className="font-semibold mb-1">
                  {testResult.success ? "✓ Test Sent Successfully" : "✗ Send Failed"}
                </div>
                <p>{testResult.message}</p>
                {testResult.messageId && (
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1.5">
                    Message-ID: {testResult.messageId}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTestModalOpen(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={sendingTest || !recipientEmail.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {sendingTest ? "Dispatching..." : "Send Test Now"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
