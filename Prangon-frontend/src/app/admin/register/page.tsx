"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PrangonLogo } from "@/components/PrangonLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ShieldCheck, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import { submitAdminRequestAction } from "./_action";

export default function AdminRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!name || !email || !password) {
      setServerError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setServerError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitAdminRequestAction({
        name,
        email,
        password,
        reason,
      });

      if (!res.success) {
        setServerError(res.message);
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setServerError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cobalt/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-cobalt/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <Link href="/" className="mb-8 block">
          <PrangonLogo size={36} textClassName="text-3xl font-bold tracking-tight text-paper" />
        </Link>

        <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl border border-line bg-paper text-ink relative z-20">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-cobalt/10 text-cobalt text-xs font-semibold uppercase tracking-wider mx-auto mb-2 border border-cobalt/20">
              <ShieldCheck className="size-3.5" />
              <span>Privileged Access</span>
            </div>
            <CardTitle className="text-2xl font-bold">Request Admin Account</CardTitle>
            <CardDescription className="text-graphite text-sm mt-1">
              Submit an approval request to join as a System Administrator.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-ink">Request Submitted!</h3>
                <p className="text-sm text-graphite leading-relaxed">
                  Your administrator access request has been securely recorded. An existing administrator will review your application. Once accepted, your account will be activated.
                </p>
                <div className="pt-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full gap-2">
                      <ArrowLeft className="size-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Lock className="size-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    Admin accounts require manual verification. Once an administrator approves your request, you will be granted access.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Official / Corporate Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Desired Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-10">
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-graphite hover:text-ink cursor-pointer hover:bg-transparent"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reason">
                    Department / Justification <span className="text-graphite text-xs font-normal">(Optional)</span>
                  </Label>
                  <textarea
                    id="reason"
                    rows={2}
                    placeholder="e.g. Lead DevOps Engineer / Security Operations"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {serverError && (
                  <Alert variant="destructive">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Request..." : "Submit Admin Request"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}