"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { resendOtpAction, verifyEmailAction } from "@/app/(auth)/verify-email/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, RotateCcw, MailCheck } from "lucide-react";
import { toast } from "sonner";

interface VerifyEmailFormProps {
  initialEmail?: string;
  redirectPath?: string;
}

export default function VerifyEmailForm({
  initialEmail = "",
  redirectPath,
}: VerifyEmailFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);

  // Sync initialEmail if it loads or changes
  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail, email]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (otpToVerify?: string) => {
    const code = (otpToVerify || otp).trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setServerError("Please enter your email address.");
      return;
    }

    if (code.length < 6) {
      setServerError("Please enter the complete 6-digit code.");
      return;
    }

    setServerError(null);
    setServerSuccess(null);

    startTransition(async () => {
      try {
        const res = await verifyEmailAction(
          { email: cleanEmail, otp: code },
          redirectPath
        ) as any;

        if (!res?.success) {
          setServerError(res?.message || "Invalid verification code. Please try again.");
          toast.error(res?.message || "Verification failed");
        } else {
          toast.success("Email verified successfully! Redirecting...");
        }
      } catch (err: any) {
        setServerError(err?.message || "Something went wrong. Please try again.");
        toast.error(err?.message || "Verification failed");
      }
    });
  };

  const handleResend = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setServerError("Please enter a valid email address to receive the code.");
      return;
    }

    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const res = await resendOtpAction(cleanEmail);
      if (res.success) {
        const msg = "A new 6-digit code has been sent to your email.";
        setServerSuccess(msg);
        toast.success(msg);
        setCountdown(60); // 60s cooldown after sending
      } else {
        setServerError(res.message);
        toast.error(res.message);
      }
    } catch (err: any) {
      const errMsg = err?.message || "Failed to resend code. Please try again later.";
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl border border-line relative z-20">
      <CardHeader className="text-center pb-2 pt-6">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
          <MailCheck className="size-7" />
        </div>
        
        <CardTitle className="text-2xl font-bold">
          Verify your email
        </CardTitle>

        {email ? (
          <div className="mt-2 space-y-1.5">
            <CardDescription>
              Enter the 6-digit verification code sent to
            </CardDescription>
            <div className="inline-block px-3 py-1 rounded-lg bg-muted text-foreground border border-border text-sm font-semibold break-all">
              {email}
            </div>
          </div>
        ) : (
          <CardDescription className="mt-1">
            Enter your email and the 6-digit verification code sent to your inbox.
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6 pt-2 px-6 sm:px-8">
        {/* Email input if email is not pre-filled */}
        {!initialEmail && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full h-11 px-3.5 border border-input bg-background rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        )}

        {/* Feedback alerts */}
        {serverError && (
          <Alert variant="destructive" className="rounded-xl py-2.5">
            <AlertCircle className="size-4 shrink-0" />
            <AlertDescription className="text-xs sm:text-sm font-medium">{serverError}</AlertDescription>
          </Alert>
        )}

        {serverSuccess && (
          <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl py-2.5">
            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            <AlertDescription className="text-xs sm:text-sm font-medium">{serverSuccess}</AlertDescription>
          </Alert>
        )}

        {/* 6-Digit OTP Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-6"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Verification Code
            </label>
            
            <div className="flex justify-center py-1">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                disabled={isPending}
                autoFocus
              >
                <InputOTPGroup className="gap-2 sm:gap-2.5">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="size-11 sm:size-12 rounded-xl border border-input bg-background text-foreground text-xl font-bold shadow-xs transition-all data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/15"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || otp.length < 6 || !email}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="size-4 animate-spin" /> Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        {/* Resend OTP Section */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-sm">
          <span className="text-muted-foreground text-xs sm:text-sm">Didn&apos;t receive the code?</span>
          
          {countdown > 0 ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || !email}
              className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isResending ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RotateCcw className="size-3.5" />
                  Resend Code
                </>
              )}
            </button>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="size-4" /> Back to Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
