"use client";

import React from "react";

export type AppWorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

interface RoleGateProps {
  currentRole: AppWorkspaceRole;
  allowedRoles: AppWorkspaceRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({
  currentRole,
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) {
  if (!allowedRoles.includes(currentRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}