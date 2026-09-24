"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "destructive" | "default";
  typeToConfirmText?: string;
  requireConfirmationText?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "destructive",
  typeToConfirmText,
  requireConfirmationText,
}: ConfirmDialogProps) {
  const [typedValue, setTypedValue] = useState("");
  const expectedText = typeToConfirmText || requireConfirmationText;

  const isConfirmDisabled =
    isLoading ||
    (expectedText !== undefined && typedValue !== expectedText);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-ink">{title}</DialogTitle>
          <DialogDescription className="text-sm text-graphite mt-1.5">
            {description}
          </DialogDescription>
        </DialogHeader>

        {expectedText && (
          <div className="py-2 space-y-2">
            <p className="text-xs text-graphite">
              Please type <span className="font-mono font-bold text-ink">{expectedText}</span> to confirm.
            </p>
            <Input
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={expectedText}
              className="text-sm font-mono"
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={variant !== "destructive" ? "bg-cobalt hover:bg-cobalt/90 text-white" : ""}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}