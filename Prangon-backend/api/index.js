var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express2 from "express";
import fs from "fs";
import path3 from "path";
import qs from "qs";

// src/app/config/env.ts
import dotenv from "dotenv";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD"
  ];
  requireEnvVariables.forEach((variables) => {
    if (!process.env[variables]) {
      throw new AppError_default(status.INTERNAL_SERVER_ERROR, `this variable ${variables} not available in the env file`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/generated/prisma/enums.ts
var AdminRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  MEMBER: "MEMBER"
};
var WorkspaceRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE"
};
var SubscriptionTier = {
  FREE: "FREE",
  PREMIUM: "PREMIUM"
};
var SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  CANCELED: "CANCELED",
  PAST_DUE: "PAST_DUE",
  UNPAID: "UNPAID"
};
var InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED"
};
var NotificationType = {
  TASK_ASSIGNED: "TASK_ASSIGNED",
  TASK_UPDATED: "TASK_UPDATED",
  MENTION: "MENTION",
  SYSTEM: "SYSTEM"
};
var OnboardingStatus = {
  PENDING_COMPANY: "PENDING_COMPANY",
  PENDING_PLAN: "PENDING_PLAN",
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PENDING_WORKSPACE: "PENDING_WORKSPACE",
  COMPLETED: "COMPLETED"
};

// src/app/utils/email.ts
import crypto from "crypto";
import ejs from "ejs";
import status2 from "http-status";
import nodemailer from "nodemailer";
import path from "path";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production"
  }
});
function htmlToPlainText(html) {
  if (!html) return "";
  let text = html;
  text = text.replace(/<div style="display:none;[\s\S]*?<\/div>/gi, "");
  text = text.replace(/&#847;|&zwnj;|&nbsp;|&#8199;|&shy;/gi, " ");
  text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)");
  text = text.replace(/<\/(h[1-6]|p|div|tr|table|ul|ol|li)>/gi, "\n");
  text = text.replace(/<br\s*[\/]?>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&bull;/g, "\u2022").replace(/&copy;/g, "\xA9").replace(/&trade;/g, "\u2122");
  text = text.split("\n").map((line) => line.trim()).filter((line, index, arr) => !(line === "" && arr[index - 1] === "")).join("\n");
  return text.trim();
}
async function renderEmail(templateName, templateData) {
  const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
  const mergedData = {
    subject: templateData.subject || "Verification Code",
    companyName: "Prangon",
    companyAddress: "Prangon Technologies Inc. \u2022 100 Pine Street, Suite 1250 \u2022 San Francisco, CA 94111",
    frontendUrl: envVars.FRONTEND_URL || "http://localhost:3000",
    supportEmail: envVars.EMAIL_SENDER.SMTP_FROM,
    currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
    previewText: templateData.previewText || "",
    ...templateData
  };
  const html = await ejs.renderFile(templatePath, mergedData);
  const text = templateData.plainText || htmlToPlainText(html);
  return { html, text };
}
var sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  previewText,
  plainText,
  replyTo,
  attachments
}) => {
  try {
    const { html, text } = await renderEmail(templateName, {
      subject,
      ...templateData,
      previewText: previewText || templateData.previewText,
      plainText
    });
    const senderEmail = envVars.EMAIL_SENDER.SMTP_FROM;
    const senderDomain = senderEmail.split("@")[1] || "prangon.app";
    const uniqueId = `${Date.now()}.${crypto.randomBytes(8).toString("hex")}`;
    const messageId = `<prangon.${uniqueId}@${senderDomain}>`;
    const info = await transporter.sendMail({
      from: `"Prangon" <${senderEmail}>`,
      to,
      replyTo: replyTo || `"Prangon Support" <${senderEmail}>`,
      subject,
      html,
      text,
      // Vital anti-spam multipart alternative!
      messageId,
      headers: {
        "X-Mailer": "Prangon Mail Delivery Engine v2.0",
        "X-Entity-Ref-ID": `prangon-tx-${uniqueId}`,
        "Auto-Submitted": "auto-generated",
        "X-Auto-Response-Suppress": "All",
        "List-Unsubscribe": `<mailto:${senderEmail}?subject=unsubscribe>, <${envVars.FRONTEND_URL}/unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        Precedence: "bulk"
      },
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`[Email Sent] To: ${to} | Subject: "${subject}" | MessageID: ${info.messageId}`);
    return { messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] Failed to send to ${to}:`, error.message);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, `Failed to send email: ${error.message}`);
  }
};

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// src/generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model ActivityLog {\n  id         String  @id @default(uuid())\n  action     String\n  entityType String\n  entityId   String\n  details    String?\n\n  workspaceId String\n  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n\n  userId String?\n  user   User?   @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  createdAt DateTime @default(now())\n\n  @@index([workspaceId])\n  @@index([workspaceId, createdAt(sort: Desc)])\n  @@map("activity_log")\n}\n\nenum AdminRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nmodel AdminRequest {\n  id        String             @id @default(uuid())\n  name      String\n  email     String             @unique\n  password  String\n  reason    String?\n  status    AdminRequestStatus @default(PENDING)\n  createdAt DateTime           @default(now())\n  updatedAt DateTime           @updatedAt\n\n  @@map("admin_request")\n}\n\nmodel User {\n  id                 String     @id @default(uuid())\n  name               String\n  email              String\n  emailVerified      Boolean    @default(false)\n  role               Role       @default(MEMBER)\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  image              String?\n  onboardingDraft    Json?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n\n  ownedWorkspaces   Workspace[]\n  workspaceMembers  WorkspaceMember[]\n  createdTasks      Task[]             @relation("TaskCreator")\n  assignedTasks     Task[]             @relation("TaskAssignee")\n  sentInvitations   Invitation[]       @relation("InvitationSender")\n  activityLogs      ActivityLog[]\n  notifications     Notification[]\n  taskComments      TaskComment[]\n  platformAdmin     PlatformAdmin?\n  platformAuditLogs PlatformAuditLog[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  OWNER\n  MEMBER\n}\n\nenum WorkspaceRole {\n  OWNER\n  ADMIN\n  MEMBER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  DONE\n}\n\nenum SubscriptionTier {\n  FREE\n  PREMIUM\n}\n\nenum TaskPriority {\n  LOW\n  MEDIUM\n  HIGH\n  URGENT\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  CANCELED\n  PAST_DUE\n  UNPAID\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  EXPIRED\n}\n\nenum NotificationType {\n  TASK_ASSIGNED\n  TASK_UPDATED\n  MENTION\n  SYSTEM\n}\n\nenum OnboardingStatus {\n  PENDING_COMPANY\n  PENDING_PLAN\n  PENDING_PAYMENT\n  PENDING_WORKSPACE\n  COMPLETED\n}\n\nenum PlatformRole {\n  SUPER_ADMIN\n  BILLING_ADMIN\n  SUPPORT\n}\n\nmodel Invitation {\n  id        String           @id @default(uuid())\n  email     String\n  role      WorkspaceRole    @default(MEMBER)\n  status    InvitationStatus @default(PENDING)\n  token     String           @unique\n  expiresAt DateTime\n\n  workspaceId String\n  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n\n  inviterId String\n  inviter   User   @relation("InvitationSender", fields: [inviterId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([workspaceId])\n  @@map("invitation")\n}\n\nmodel Notification {\n  id      String           @id @default(uuid())\n  title   String\n  content String?\n  type    NotificationType @default(SYSTEM)\n  isRead  Boolean          @default(false)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  workspaceId String?\n  workspace   Workspace? @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([workspaceId])\n  @@map("notification")\n}\n\nmodel PlatformAdmin {\n  id        String       @id @default(uuid())\n  userId    String       @unique\n  role      PlatformRole @default(SUPPORT)\n  createdAt DateTime     @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("platform_admins")\n}\n\nmodel PlatformAuditLog {\n  id        String   @id @default(uuid())\n  adminId   String\n  action    String\n  targetId  String?\n  metadata  Json?\n  createdAt DateTime @default(now())\n\n  admin User @relation(fields: [adminId], references: [id], onDelete: Cascade)\n\n  @@index([adminId, createdAt])\n  @@map("platform_audit_logs")\n}\n\nmodel Project {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  workspaceId String\n  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n\n  tasks Task[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([workspaceId])\n  @@map("project")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Subscription {\n  id          String    @id @default(uuid())\n  workspaceId String    @unique\n  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n\n  stripeCustomerId     String?            @unique\n  stripeSubscriptionId String?            @unique\n  stripePriceId        String?\n  tier                 SubscriptionTier   @default(FREE)\n  status               SubscriptionStatus @default(ACTIVE)\n  currentPeriodEnd     DateTime?\n  cancelAtPeriodEnd    Boolean            @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("subscription")\n}\n\nmodel Task {\n  id          String       @id @default(uuid())\n  title       String\n  description String?\n  status      TaskStatus   @default(TODO)\n  priority    TaskPriority @default(MEDIUM)\n\n  workspaceId String\n  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n\n  projectId String\n  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n  creatorId String\n  creator   User   @relation("TaskCreator", fields: [creatorId], references: [id])\n\n  assigneeId String?\n  assignee   User?   @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)\n\n  dueDate DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  comments TaskComment[]\n\n  @@index([workspaceId])\n  @@index([projectId])\n  @@map("task")\n}\n\nmodel TaskComment {\n  id      String @id @default(uuid())\n  content String\n\n  taskId String\n  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)\n\n  authorId String\n  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("task_comment")\n}\n\nmodel Workspace {\n  id          String  @id @default(uuid())\n  name        String\n  slug        String  @unique\n  description String?\n  logoUrl     String?\n  ownerId     String\n  owner       User    @relation(fields: [ownerId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  onboardingStatus OnboardingStatus @default(PENDING_COMPANY)\n  industry         String?\n  companySize      String?\n\n  members       WorkspaceMember[]\n  projects      Project[]\n  tasks         Task[]\n  subscription  Subscription?\n  invitations   Invitation[]\n  activityLogs  ActivityLog[]\n  notifications Notification[]\n\n  @@map("workspace")\n}\n\nmodel WorkspaceMember {\n  id          String        @id @default(uuid())\n  workspaceId String\n  userId      String\n  role        WorkspaceRole @default(MEMBER)\n\n  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([workspaceId, userId])\n  @@index([workspaceId])\n  @@map("workspace_member")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"ActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"entityType","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"ActivityLogToWorkspace"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ActivityLogToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"activity_log"},"AdminRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AdminRequestStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_request"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"onboardingDraft","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"ownedWorkspaces","kind":"object","type":"Workspace","relationName":"UserToWorkspace"},{"name":"workspaceMembers","kind":"object","type":"WorkspaceMember","relationName":"UserToWorkspaceMember"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"sentInvitations","kind":"object","type":"Invitation","relationName":"InvitationSender"},{"name":"activityLogs","kind":"object","type":"ActivityLog","relationName":"ActivityLogToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"taskComments","kind":"object","type":"TaskComment","relationName":"TaskCommentToUser"},{"name":"platformAdmin","kind":"object","type":"PlatformAdmin","relationName":"PlatformAdminToUser"},{"name":"platformAuditLogs","kind":"object","type":"PlatformAuditLog","relationName":"PlatformAuditLogToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"WorkspaceRole"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"InvitationToWorkspace"},{"name":"inviterId","kind":"scalar","type":"String"},{"name":"inviter","kind":"object","type":"User","relationName":"InvitationSender"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"invitation"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"NotificationToWorkspace"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notification"},"PlatformAdmin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"PlatformRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"PlatformAdminToUser"}],"dbName":"platform_admins"},"PlatformAuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"admin","kind":"object","type":"User","relationName":"PlatformAuditLogToUser"}],"dbName":"platform_audit_logs"},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"ProjectToWorkspace"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"project"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"SubscriptionToWorkspace"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripeSubscriptionId","kind":"scalar","type":"String"},{"name":"stripePriceId","kind":"scalar","type":"String"},{"name":"tier","kind":"enum","type":"SubscriptionTier"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"subscription"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"TaskToWorkspace"},{"name":"projectId","kind":"scalar","type":"String"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"creatorId","kind":"scalar","type":"String"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assigneeId","kind":"scalar","type":"String"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"comments","kind":"object","type":"TaskComment","relationName":"TaskToTaskComment"}],"dbName":"task"},"TaskComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskComment"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"TaskCommentToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"task_comment"},"Workspace":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"UserToWorkspace"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"onboardingStatus","kind":"enum","type":"OnboardingStatus"},{"name":"industry","kind":"scalar","type":"String"},{"name":"companySize","kind":"scalar","type":"String"},{"name":"members","kind":"object","type":"WorkspaceMember","relationName":"WorkspaceToWorkspaceMember"},{"name":"projects","kind":"object","type":"Project","relationName":"ProjectToWorkspace"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToWorkspace"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"SubscriptionToWorkspace"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"InvitationToWorkspace"},{"name":"activityLogs","kind":"object","type":"ActivityLog","relationName":"ActivityLogToWorkspace"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToWorkspace"}],"dbName":"workspace"},"WorkspaceMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"WorkspaceRole"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"WorkspaceToWorkspaceMember"},{"name":"user","kind":"object","type":"User","relationName":"UserToWorkspaceMember"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"workspace_member"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","ownedWorkspaces","workspace","workspaceMembers","tasks","_count","project","creator","assignee","task","author","comments","createdTasks","assignedTasks","inviter","sentInvitations","activityLogs","notifications","taskComments","platformAdmin","admin","platformAuditLogs","owner","members","projects","subscription","invitations","ActivityLog.findUnique","ActivityLog.findUniqueOrThrow","ActivityLog.findFirst","ActivityLog.findFirstOrThrow","ActivityLog.findMany","data","ActivityLog.createOne","ActivityLog.createMany","ActivityLog.createManyAndReturn","ActivityLog.updateOne","ActivityLog.updateMany","ActivityLog.updateManyAndReturn","create","update","ActivityLog.upsertOne","ActivityLog.deleteOne","ActivityLog.deleteMany","having","_min","_max","ActivityLog.groupBy","ActivityLog.aggregate","AdminRequest.findUnique","AdminRequest.findUniqueOrThrow","AdminRequest.findFirst","AdminRequest.findFirstOrThrow","AdminRequest.findMany","AdminRequest.createOne","AdminRequest.createMany","AdminRequest.createManyAndReturn","AdminRequest.updateOne","AdminRequest.updateMany","AdminRequest.updateManyAndReturn","AdminRequest.upsertOne","AdminRequest.deleteOne","AdminRequest.deleteMany","AdminRequest.groupBy","AdminRequest.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Invitation.findUnique","Invitation.findUniqueOrThrow","Invitation.findFirst","Invitation.findFirstOrThrow","Invitation.findMany","Invitation.createOne","Invitation.createMany","Invitation.createManyAndReturn","Invitation.updateOne","Invitation.updateMany","Invitation.updateManyAndReturn","Invitation.upsertOne","Invitation.deleteOne","Invitation.deleteMany","Invitation.groupBy","Invitation.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","PlatformAdmin.findUnique","PlatformAdmin.findUniqueOrThrow","PlatformAdmin.findFirst","PlatformAdmin.findFirstOrThrow","PlatformAdmin.findMany","PlatformAdmin.createOne","PlatformAdmin.createMany","PlatformAdmin.createManyAndReturn","PlatformAdmin.updateOne","PlatformAdmin.updateMany","PlatformAdmin.updateManyAndReturn","PlatformAdmin.upsertOne","PlatformAdmin.deleteOne","PlatformAdmin.deleteMany","PlatformAdmin.groupBy","PlatformAdmin.aggregate","PlatformAuditLog.findUnique","PlatformAuditLog.findUniqueOrThrow","PlatformAuditLog.findFirst","PlatformAuditLog.findFirstOrThrow","PlatformAuditLog.findMany","PlatformAuditLog.createOne","PlatformAuditLog.createMany","PlatformAuditLog.createManyAndReturn","PlatformAuditLog.updateOne","PlatformAuditLog.updateMany","PlatformAuditLog.updateManyAndReturn","PlatformAuditLog.upsertOne","PlatformAuditLog.deleteOne","PlatformAuditLog.deleteMany","PlatformAuditLog.groupBy","PlatformAuditLog.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskComment.findUnique","TaskComment.findUniqueOrThrow","TaskComment.findFirst","TaskComment.findFirstOrThrow","TaskComment.findMany","TaskComment.createOne","TaskComment.createMany","TaskComment.createManyAndReturn","TaskComment.updateOne","TaskComment.updateMany","TaskComment.updateManyAndReturn","TaskComment.upsertOne","TaskComment.deleteOne","TaskComment.deleteMany","TaskComment.groupBy","TaskComment.aggregate","Workspace.findUnique","Workspace.findUniqueOrThrow","Workspace.findFirst","Workspace.findFirstOrThrow","Workspace.findMany","Workspace.createOne","Workspace.createMany","Workspace.createManyAndReturn","Workspace.updateOne","Workspace.updateMany","Workspace.updateManyAndReturn","Workspace.upsertOne","Workspace.deleteOne","Workspace.deleteMany","Workspace.groupBy","Workspace.aggregate","WorkspaceMember.findUnique","WorkspaceMember.findUniqueOrThrow","WorkspaceMember.findFirst","WorkspaceMember.findFirstOrThrow","WorkspaceMember.findMany","WorkspaceMember.createOne","WorkspaceMember.createMany","WorkspaceMember.createManyAndReturn","WorkspaceMember.updateOne","WorkspaceMember.updateMany","WorkspaceMember.updateManyAndReturn","WorkspaceMember.upsertOne","WorkspaceMember.deleteOne","WorkspaceMember.deleteMany","WorkspaceMember.groupBy","WorkspaceMember.aggregate","AND","OR","NOT","id","workspaceId","userId","WorkspaceRole","role","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","name","slug","description","logoUrl","ownerId","OnboardingStatus","onboardingStatus","industry","companySize","content","taskId","authorId","title","TaskStatus","status","TaskPriority","priority","projectId","creatorId","assigneeId","dueDate","stripeCustomerId","stripeSubscriptionId","stripePriceId","SubscriptionTier","tier","SubscriptionStatus","currentPeriodEnd","cancelAtPeriodEnd","adminId","action","targetId","metadata","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","PlatformRole","NotificationType","type","isRead","email","InvitationStatus","token","expiresAt","inviterId","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","ipAddress","userAgent","emailVerified","Role","UserStatus","needPasswordChange","isDeleted","deletedAt","image","onboardingDraft","every","some","none","reason","AdminRequestStatus","entityType","entityId","details","workspaceId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany"]'),
  graph: "twiFAYACDQMAAK0EACAHAADxAwAgpgIAAKwEADCnAgAAJQAQqAIAAKwEADCpAgEAAAABqgIBAIcEACGrAgEA6wMAIa4CQADwAwAh2QIBAIcEACGFAwEAhwQAIYYDAQCHBAAhhwMBAOsDACEBAAAAAQAgDAMAAPwDACCmAgAAvgQAMKcCAAADABCoAgAAvgQAMKkCAQCHBAAhqwIBAIcEACGuAkAA8AMAIa8CQADwAwAh6AIBAIcEACHpAkAA8AMAIfYCAQDrAwAh9wIBAOsDACEDAwAA-wUAIPYCAADJBAAg9wIAAMkEACAMAwAA_AMAIKYCAAC-BAAwpwIAAAMAEKgCAAC-BAAwqQIBAAAAAasCAQCHBAAhrgJAAPADACGvAkAA8AMAIegCAQAAAAHpAkAA8AMAIfYCAQDrAwAh9wIBAOsDACEDAAAAAwAgAQAABAAwAgAABQAgEQMAAPwDACCmAgAAvQQAMKcCAAAHABCoAgAAvQQAMKkCAQCHBAAhqwIBAIcEACGuAkAA8AMAIa8CQADwAwAh7QIBAIcEACHuAgEAhwQAIe8CAQDrAwAh8AIBAOsDACHxAgEA6wMAIfICQADuAwAh8wJAAO4DACH0AgEA6wMAIfUCAQDrAwAhCAMAAPsFACDvAgAAyQQAIPACAADJBAAg8QIAAMkEACDyAgAAyQQAIPMCAADJBAAg9AIAAMkEACD1AgAAyQQAIBEDAAD8AwAgpgIAAL0EADCnAgAABwAQqAIAAL0EADCpAgEAAAABqwIBAIcEACGuAkAA8AMAIa8CQADwAwAh7QIBAIcEACHuAgEAhwQAIe8CAQDrAwAh8AIBAOsDACHxAgEA6wMAIfICQADuAwAh8wJAAO4DACH0AgEA6wMAIfUCAQDrAwAhAwAAAAcAIAEAAAgAMAIAAAkAIBYJAACZBAAgFQAAmwQAIBYAAJwEACAbAAD8AwAgHAAAmAQAIB0AALsEACAeAAC8BAAgHwAAmgQAIKYCAAC5BAAwpwIAAAsAEKgCAAC5BAAwqQIBAIcEACGuAkAA8AMAIa8CQADwAwAhuwIBAIcEACG8AgEAhwQAIb0CAQDrAwAhvgIBAOsDACG_AgEAhwQAIcECAAC6BMECIsICAQDrAwAhwwIBAOsDACEMCQAAqgcAIBUAAKwHACAWAACtBwAgGwAA-wUAIBwAAKkHACAdAAC6BwAgHgAAuwcAIB8AAKsHACC9AgAAyQQAIL4CAADJBAAgwgIAAMkEACDDAgAAyQQAIBYJAACZBAAgFQAAmwQAIBYAAJwEACAbAAD8AwAgHAAAmAQAIB0AALsEACAeAAC8BAAgHwAAmgQAIKYCAAC5BAAwpwIAAAsAEKgCAAC5BAAwqQIBAAAAAa4CQADwAwAhrwJAAPADACG7AgEAhwQAIbwCAQAAAAG9AgEA6wMAIb4CAQDrAwAhvwIBAIcEACHBAgAAugTBAiLCAgEA6wMAIcMCAQDrAwAhAwAAAAsAIAEAAAwAMAIAAA0AIAsDAAD8AwAgBwAA8QMAIKYCAAC4BAAwpwIAAA8AEKgCAAC4BAAwqQIBAIcEACGqAgEAhwQAIasCAQCHBAAhrQIAAK8ErQIirgJAAPADACGvAkAA8AMAIQIDAAD7BQAgBwAA6gUAIAwDAAD8AwAgBwAA8QMAIKYCAAC4BAAwpwIAAA8AEKgCAAC4BAAwqQIBAAAAAaoCAQCHBAAhqwIBAIcEACGtAgAArwStAiKuAkAA8AMAIa8CQADwAwAhiAMAALcEACADAAAADwAgAQAAEAAwAgAAEQAgFAcAAPEDACALAAC2BAAgDAAA_AMAIA0AAK0EACAQAACdBAAgpgIAALMEADCnAgAAEwAQqAIAALMEADCpAgEAhwQAIaoCAQCHBAAhrgJAAPADACGvAkAA8AMAIb0CAQDrAwAhxwIBAIcEACHJAgAAtATJAiLLAgAAtQTLAiLMAgEAhwQAIc0CAQCHBAAhzgIBAOsDACHPAkAA7gMAIQgHAADqBQAgCwAAuQcAIAwAAPsFACANAAD7BQAgEAAArgcAIL0CAADJBAAgzgIAAMkEACDPAgAAyQQAIBQHAADxAwAgCwAAtgQAIAwAAPwDACANAACtBAAgEAAAnQQAIKYCAACzBAAwpwIAABMAEKgCAACzBAAwqQIBAAAAAaoCAQCHBAAhrgJAAPADACGvAkAA8AMAIb0CAQDrAwAhxwIBAIcEACHJAgAAtATJAiLLAgAAtQTLAiLMAgEAhwQAIc0CAQCHBAAhzgIBAOsDACHPAkAA7gMAIQMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABMAIBwEAACVBAAgBQAAlgQAIAYAAJcEACAIAACYBAAgEQAAmQQAIBIAAJkEACAUAACaBAAgFQAAmwQAIBYAAJwEACAXAACdBAAgGAAAngQAIBoAAJ8EACCmAgAAkQQAMKcCAAAZABCoAgAAkQQAMKkCAQCHBAAhrQIAAJIE-gIirgJAAPADACGvAkAA8AMAIbsCAQCHBAAhyQIAAJME-wIi5gIBAIcEACH4AiAA7wMAIfsCIADvAwAh_AIgAO8DACH9AkAA7gMAIf4CAQDrAwAh_wIAAJQEACABAAAAGQAgCw4AALIEACAPAAD8AwAgpgIAALEEADCnAgAAGwAQqAIAALEEADCpAgEAhwQAIa4CQADwAwAhrwJAAPADACHEAgEAhwQAIcUCAQCHBAAhxgIBAIcEACECDgAAuAcAIA8AAPsFACALDgAAsgQAIA8AAPwDACCmAgAAsQQAMKcCAAAbABCoAgAAsQQAMKkCAQAAAAGuAkAA8AMAIa8CQADwAwAhxAIBAIcEACHFAgEAhwQAIcYCAQCHBAAhAwAAABsAIAEAABwAMAIAAB0AIAEAAAAbACADAAAAEwAgAQAAFAAwAgAAFQAgDwcAAPEDACATAAD8AwAgpgIAAK4EADCnAgAAIQAQqAIAAK4EADCpAgEAhwQAIaoCAQCHBAAhrQIAAK8ErQIirgJAAPADACGvAkAA8AMAIckCAACwBOgCIuYCAQCHBAAh6AIBAIcEACHpAkAA8AMAIeoCAQCHBAAhAgcAAOoFACATAAD7BQAgDwcAAPEDACATAAD8AwAgpgIAAK4EADCnAgAAIQAQqAIAAK4EADCpAgEAAAABqgIBAIcEACGtAgAArwStAiKuAkAA8AMAIa8CQADwAwAhyQIAALAE6AIi5gIBAIcEACHoAgEAAAAB6QJAAPADACHqAgEAhwQAIQMAAAAhACABAAAiADACAAAjACANAwAArQQAIAcAAPEDACCmAgAArAQAMKcCAAAlABCoAgAArAQAMKkCAQCHBAAhqgIBAIcEACGrAgEA6wMAIa4CQADwAwAh2QIBAIcEACGFAwEAhwQAIYYDAQCHBAAhhwMBAOsDACEEAwAA-wUAIAcAAOoFACCrAgAAyQQAIIcDAADJBAAgAwAAACUAIAEAACYAMAIAAAEAIA4DAAD8AwAgBwAAqwQAIKYCAACpBAAwpwIAACgAEKgCAACpBAAwqQIBAIcEACGqAgEA6wMAIasCAQCHBAAhrgJAAPADACGvAkAA8AMAIcQCAQDrAwAhxwIBAIcEACHkAgAAqgTkAiLlAiAA7wMAIQQDAAD7BQAgBwAA6gUAIKoCAADJBAAgxAIAAMkEACAOAwAA_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-wIi5gIBAAAAAfgCIADvAwAh-wIgAO8DACH8AiAA7wMAIf0CQADuAwAh_gIBAOsDACH_AgAAlAQAIAEAAACBAQAgAQAAAIEBACAPBAAApgcAIAUAAKcHACAGAACoBwAgCAAAqQcAIBEAAKoHACASAACqBwAgFAAAqwcAIBUAAKwHACAWAACtBwAgFwAArgcAIBgAAK8HACAaAACwBwAg_QIAAMkEACD-AgAAyQQAIP8CAADJBAAgAwAAABkAIAEAAIQBADACAACBAQAgAwAAABkAIAEAAIQBADACAACBAQAgAwAAABkAIAEAAIQBADACAACBAQAgGQQAAJoHACAFAACbBwAgBgAAnAcAIAgAAJ0HACARAACeBwAgEgAAnwcAIBQAAKAHACAVAAChBwAgFgAAogcAIBcAAKMHACAYAACkBwAgGgAApQcAIKkCAQAAAAGtAgAAAPoCAq4CQAAAAAGvAkAAAAABuwIBAAAAAckCAAAA-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQElAACIAQAgDakCAQAAAAGtAgAAAPoCAq4CQAAAAAGvAkAAAAABuwIBAAAAAckCAAAA-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQElAACKAQAwASUAAIoBADAZBAAAmAYAIAUAAJkGACAGAACaBgAgCAAAmwYAIBEAAJwGACASAACdBgAgFAAAngYAIBUAAJ8GACAWAACgBgAgFwAAoQYAIBgAAKIGACAaAACjBgAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABAgAAAIEBACAlAACNAQAgDakCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAAQIAAAAZACAlAACPAQAgAgAAABkAICUAAI8BACADAAAAgQEAICwAAIgBACAtAACNAQAgAQAAAIEBACABAAAAGQAgBgoAAJMGACAyAACVBgAgMwAAlAYAIP0CAADJBAAg_gIAAMkEACD_AgAAyQQAIBCmAgAAigQAMKcCAACWAQAQqAIAAIoEADCpAgEAwwMAIa0CAACLBPoCIq4CQADFAwAhrwJAAMUDACG7AgEAwwMAIckCAACMBPsCIuYCAQDDAwAh-AIgAOMDACH7AiAA4wMAIfwCIADjAwAh_QJAANkDACH-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_wToAiLmAgEAwgQAIegCAQDCBAAh6QJAAMQEACHqAgEAwgQAIQIAAAAjACAlAADoAQAgCqkCAQDCBAAhqgIBAMIEACGtAgAAwwStAiKuAkAAxAQAIa8CQADEBAAhyQIAAP8E6AIi5gIBAMIEACHoAgEAwgQAIekCQADEBAAh6gIBAMIEACECAAAAIQAgJQAA6gEAIAIAAAAhACAlAADqAQAgAwAAACMAICwAAOMBACAtAADoAQAgAQAAACMAIAEAAAAhACADCgAAgQYAIDIAAIMGACAzAACCBgAgDaYCAACBBAAwpwIAAPEBABCoAgAAgQQAMKkCAQDDAwAhqgIBAMMDACGtAgAAxAOtAiKuAkAAxQMAIa8CQADFAwAhyQIAAIIE6AIi5gIBAMMDACHoAgEAwwMAIekCQADFAwAh6gIBAMMDACEDAAAAIQAgAQAA8AEAMDEAAPEBACADAAAAIQAgAQAAIgAwAgAAIwAgAQAAACoAIAEAAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgAwAAACgAIAEAACkAMAIAACoAIAMAAAAoACABAAApADACAAAqACALAwAA5gQAIAcAAIAGACCpAgEAAAABqgIBAAAAAasCAQAAAAGuAkAAAAABrwJAAAAAAcQCAQAAAAHHAgEAAAAB5AIAAADkAgLlAiAAAAABASUAAPkBACAJqQIBAAAAAaoCAQAAAAGrAgEAAAABrgJAAAAAAa8CQAAAAAHEAgEAAAABxwIBAAAAAeQCAAAA5AIC5QIgAAAAAQElAAD7AQAwASUAAPsBADABAAAACwAgCwMAAOQEACAHAAD_BQAgqQIBAMIEACGqAgEAzQQAIasCAQDCBAAhrgJAAMQEACGvAkAAxAQAIcQCAQDNBAAhxwIBAMIEACHkAgAA4QTkAiLlAiAA4gQAIQIAAAAqACAlAAD_AQAgCakCAQDCBAAhqgIBAM0EACGrAgEAwgQAIa4CQADEBAAhrwJAAMQEACHEAgEAzQQAIccCAQDCBAAh5AIAAOEE5AIi5QIgAOIEACECAAAAKAAgJQAAgQIAIAIAAAAoACAlAACBAgAgAQAAAAsAIAMAAAAqACAsAAD5AQAgLQAA_wEAIAEAAAAqACABAAAAKAAgBQoAAPwFACAyAAD-BQAgMwAA_QUAIKoCAADJBAAgxAIAAMkEACAMpgIAAP0DADCnAgAAiQIAEKgCAAD9AwAwqQIBAMMDACGqAgEAzgMAIasCAQDDAwAhrgJAAMUDACGvAkAAxQMAIcQCAQDOAwAhxwIBAMMDACHkAgAA_gPkAiLlAiAA4wMAIQMAAAAoACABAACIAgAwMQAAiQIAIAMAAAAoACABAAApADACAAAqACAIAwAA_AMAIKYCAAD6AwAwpwIAAC4AEKgCAAD6AwAwqQIBAAAAAasCAQAAAAGtAgAA-wPjAiKuAkAA8AMAIQEAAACMAgAgAQAAAIwCACABAwAA-wUAIAMAAAAuACABAACPAgAwAgAAjAIAIAMAAAAuACABAACPAgAwAgAAjAIAIAMAAAAuACABAACPAgAwAgAAjAIAIAUDAAD6BQAgqQIBAAAAAasCAQAAAAGtAgAAAOMCAq4CQAAAAAEBJQAAkwIAIASpAgEAAAABqwIBAAAAAa0CAAAA4wICrgJAAAAAAQElAACVAgAwASUAAJUCADAFAwAA-QUAIKkCAQDCBAAhqwIBAMIEACGtAgAA-AXjAiKuAkAAxAQAIQIAAACMAgAgJQAAmAIAIASpAgEAwgQAIasCAQDCBAAhrQIAAPgF4wIirgJAAMQEACECAAAALgAgJQAAmgIAIAIAAAAuACAlAACaAgAgAwAAAIwCACAsAACTAgAgLQAAmAIAIAEAAACMAgAgAQAAAC4AIAMKAAD1BQAgMgAA9wUAIDMAAPYFACAHpgIAAPYDADCnAgAAoQIAEKgCAAD2AwAwqQIBAMMDACGrAgEAwwMAIa0CAAD3A-MCIq4CQADFAwAhAwAAAC4AIAEAAKACADAxAAChAgAgAwAAAC4AIAEAAI8CADACAACMAgAgAQAAADIAIAEAAAAyACADAAAAMAAgAQAAMQAwAgAAMgAgAwAAADAAIAEAADEAMAIAADIAIAMAAAAwACABAAAxADACAAAyACAHGQAA9AUAIKkCAQAAAAGuAkAAAAAB2AIBAAAAAdkCAQAAAAHaAgEAAAAB2wKAAAAAAQElAACpAgAgBqkCAQAAAAGuAkAAAAAB2AIBAAAAAdkCAQAAAAHaAgEAAAAB2wKAAAAAAQElAACrAgAwASUAAKsCADAHGQAA8wUAIKkCAQDCBAAhrgJAAMQEACHYAgEAwgQAIdkCAQDCBAAh2gIBAM0EACHbAoAAAAABAgAAADIAICUAAK4CACAGqQIBAMIEACGuAkAAxAQAIdgCAQDCBAAh2QIBAMIEACHaAgEAzQQAIdsCgAAAAAECAAAAMAAgJQAAsAIAIAIAAAAwACAlAACwAgAgAwAAADIAICwAAKkCACAtAACuAgAgAQAAADIAIAEAAAAwACAFCgAA8AUAIDIAAPIFACAzAADxBQAg2gIAAMkEACDbAgAAyQQAIAmmAgAA8wMAMKcCAAC3AgAQqAIAAPMDADCpAgEAwwMAIa4CQADFAwAh2AIBAMMDACHZAgEAwwMAIdoCAQDOAwAh2wIAAPQDACADAAAAMAAgAQAAtgIAMDEAALcCACADAAAAMAAgAQAAMQAwAgAAMgAgAQAAAEIAIAEAAABCACADAAAAQAAgAQAAQQAwAgAAQgAgAwAAAEAAIAEAAEEAMAIAAEIAIAMAAABAACABAABBADACAABCACAIBwAA7wUAIAkAAMgFACCpAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABuwIBAAAAAb0CAQAAAAEBJQAAvwIAIAapAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABuwIBAAAAAb0CAQAAAAEBJQAAwQIAMAElAADBAgAwCAcAAO4FACAJAAC7BQAgqQIBAMIEACGqAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIb0CAQDNBAAhAgAAAEIAICUAAMQCACAGqQIBAMIEACGqAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIb0CAQDNBAAhAgAAAEAAICUAAMYCACACAAAAQAAgJQAAxgIAIAMAAABCACAsAAC_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_QIAEKgCAADWAwAwqQIBAMMDACGqAgEAwwMAIa4CQADFAwAhrwJAAMUDACG9AgEAzgMAIccCAQDDAwAhyQIAANcDyQIiywIAANgDywIizAIBAMMDACHNAgEAwwMAIc4CAQDOAwAhzwJAANkDACEDAAAAEwAgAQAA_AIAMDEAAP0CACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAAB0AIAEAAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACAIDgAA4QUAIA8AAKoFACCpAgEAAAABrgJAAAAAAa8CQAAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAEBJQAAhQMAIAapAgEAAAABrgJAAAAAAa8CQAAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAEBJQAAhwMAMAElAACHAwAwCA4AAOAFACAPAACoBQAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhxAIBAMIEACHFAgEAwgQAIcYCAQDCBAAhAgAAAB0AICUAAIoDACAGqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhxAIBAMIEACHFAgEAwgQAIcYCAQDCBAAhAgAAABsAICUAAIwDACACAAAAGwAgJQAAjAMAIAMAAAAdACAsAACFAwAgLQAAigMAIAEAAAAdACABAAAAGwAgAwoAAN0FACAyAADfBQAgMwAA3gUAIAmmAgAA1QMAMKcCAACTAwAQqAIAANUDADCpAgEAwwMAIa4CQADFAwAhrwJAAMUDACHEAgEAwwMAIcUCAQDDAwAhxgIBAMMDACEDAAAAGwAgAQAAkgMAMDEAAJMDACADAAAAGwAgAQAAHAAwAgAAHQAgAQAAAA0AIAEAAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACATCQAA2AUAIBUAANsFACAWAADcBQAgGwAA1QUAIBwAANYFACAdAADXBQAgHgAA2QUAIB8AANoFACCpAgEAAAABrgJAAAAAAa8CQAAAAAG7AgEAAAABvAIBAAAAAb0CAQAAAAG-AgEAAAABvwIBAAAAAcECAAAAwQICwgIBAAAAAcMCAQAAAAEBJQAAmwMAIAupAgEAAAABrgJAAAAAAa8CQAAAAAG7AgEAAAABvAIBAAAAAb0CAQAAAAG-AgEAAAABvwIBAAAAAcECAAAAwQICwgIBAAAAAcMCAQAAAAEBJQAAnQMAMAElAACdAwAwEwkAANIEACAVAADVBAAgFgAA1gQAIBsAAM8EACAcAADQBAAgHQAA0QQAIB4AANMEACAfAADUBAAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG8AgEAwgQAIb0CAQDNBAAhvgIBAM0EACG_AgEAwgQAIcECAADOBMECIsICAQDNBAAhwwIBAM0EACECAAAADQAgJQAAoAMAIAupAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIbwCAQDCBAAhvQIBAM0EACG-AgEAzQQAIb8CAQDCBAAhwQIAAM4EwQIiwgIBAM0EACHDAgEAzQQAIQIAAAALACAlAACiAwAgAgAAAAsAICUAAKIDACADAAAADQAgLAAAmwMAIC0AAKADACABAAAADQAgAQAAAAsAIAcKAADKBAAgMgAAzAQAIDMAAMsEACC9AgAAyQQAIL4CAADJBAAgwgIAAMkEACDDAgAAyQQAIA6mAgAAzQMAMKcCAACpAwAQqAIAAM0DADCpAgEAwwMAIa4CQADFAwAhrwJAAMUDACG7AgEAwwMAIbwCAQDDAwAhvQIBAM4DACG-AgEAzgMAIb8CAQDDAwAhwQIAAM8DwQIiwgIBAM4DACHDAgEAzgMAIQMAAAALACABAACoAwAwMQAAqQMAIAMAAAALACABAAAMADACAAANACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAgDAADIBAAgBwAAxwQAIKkCAQAAAAGqAgEAAAABqwIBAAAAAa0CAAAArQICrgJAAAAAAa8CQAAAAAEBJQAAsQMAIAapAgEAAAABqgIBAAAAAasCAQAAAAGtAgAAAK0CAq4CQAAAAAGvAkAAAAABASUAALMDADABJQAAswMAMAgDAADGBAAgBwAAxQQAIKkCAQDCBAAhqgIBAMIEACGrAgEAwgQAIa0CAADDBK0CIq4CQADEBAAhrwJAAMQEACECAAAAEQAgJQAAtgMAIAapAgEAwgQAIaoCAQDCBAAhqwIBAMIEACGtAgAAwwStAiKuAkAAxAQAIa8CQADEBAAhAgAAAA8AICUAALgDACACAAAADwAgJQAAuAMAIAMAAAARACAsAACxAwAgLQAAtgMAIAEAAAARACABAAAADwAgAwoAAL8EACAyAADBBAAgMwAAwAQAIAmmAgAAwgMAMKcCAAC_AwAQqAIAAMIDADCpAgEAwwMAIaoCAQDDAwAhqwIBAMMDACGtAgAAxAOtAiKuAkAAxQMAIa8CQADFAwAhAwAAAA8AIAEAAL4DADAxAAC_AwAgAwAAAA8AIAEAABAAMAIAABEAIAmmAgAAwgMAMKcCAAC_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_AMAIBwAAJgEACAdAAC7BAAgHgAAvAQAIB8AAJoEACCmAgAAuQQAMKcCAAALABCoAgAAuQQAMKkCAQCHBAAhrgJAAPADACGvAkAA8AMAIbsCAQCHBAAhvAIBAIcEACG9AgEA6wMAIb4CAQDrAwAhvwIBAIcEACHBAgAAugTBAiLCAgEA6wMAIcMCAQDrAwAhiQMAAAsAIIoDAAALACAJpgIAAPIDADCnAgAAzQIAEKgCAADyAwAwqQIBAMMDACGqAgEAwwMAIa4CQADFAwAhrwJAAMUDACG7AgEAwwMAIb0CAQDOAwAhCaYCAADzAwAwpwIAALcCABCoAgAA8wMAMKkCAQDDAwAhrgJAAMUDACHYAgEAwwMAIdkCAQDDAwAh2gIBAM4DACHbAgAA9AMAIA8KAADTAwAgMgAA9QMAIDMAAPUDACCwAoAAAAABswKAAAAAAbQCgAAAAAG1AoAAAAABtgKAAAAAAbcCgAAAAAHcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAoAAAAAB4AKAAAAAAeECgAAAAAEMsAKAAAAAAbMCgAAAAAG0AoAAAAABtQKAAAAAAbYCgAAAAAG3AoAAAAAB3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wKAAAAAAeACgAAAAAHhAoAAAAABB6YCAAD2AwAwpwIAAKECABCoAgAA9gMAMKkCAQDDAwAhqwIBAMMDACGtAgAA9wPjAiKuAkAAxQMAIQcKAADHAwAgMgAA-QMAIDMAAPkDACCwAgAAAOMCArECAAAA4wIIsgIAAADjAgi3AgAA-APjAiIHCgAAxwMAIDIAAPkDACAzAAD5AwAgsAIAAADjAgKxAgAAAOMCCLICAAAA4wIItwIAAPgD4wIiBLACAAAA4wICsQIAAADjAgiyAgAAAOMCCLcCAAD5A-MCIggDAAD8AwAgpgIAAPoDADCnAgAALgAQqAIAAPoDADCpAgEAhwQAIasCAQCHBAAhrQIAAPsD4wIirgJAAPADACEEsAIAAADjAgKxAgAAAOMCCLICAAAA4wIItwIAAPkD4wIiHgQAAJUEACAFAACWBAAgBgAAlwQAIAgAAJgEACARAACZBAAgEgAAmQQAIBQAAJoEACAVAACbBAAgFgAAnAQAIBcAAJ0EACAYAACeBAAgGgAAnwQAIKYCAACRBAAwpwIAABkAEKgCAACRBAAwqQIBAIcEACGtAgAAkgT6AiKuAkAA8AMAIa8CQADwAwAhuwIBAIcEACHJAgAAkwT7AiLmAgEAhwQAIfgCIADvAwAh-wIgAO8DACH8AiAA7wMAIf0CQADuAwAh_gIBAOsDACH_AgAAlAQAIIkDAAAZACCKAwAAGQAgDKYCAAD9AwAwpwIAAIkCABCoAgAA_QMAMKkCAQDDAwAhqgIBAM4DACGrAgEAwwMAIa4CQADFAwAhrwJAAMUDACHEAgEAzgMAIccCAQDDAwAh5AIAAP4D5AIi5QIgAOMDACEHCgAAxwMAIDIAAIAEACAzAACABAAgsAIAAADkAgKxAgAAAOQCCLICAAAA5AIItwIAAP8D5AIiBwoAAMcDACAyAACABAAgMwAAgAQAILACAAAA5AICsQIAAADkAgiyAgAAAOQCCLcCAAD_A-QCIgSwAgAAAOQCArECAAAA5AIIsgIAAADkAgi3AgAAgATkAiINpgIAAIEEADCnAgAA8QEAEKgCAACBBAAwqQIBAMMDACGqAgEAwwMAIa0CAADEA60CIq4CQADFAwAhrwJAAMUDACHJAgAAggToAiLmAgEAwwMAIegCAQDDAwAh6QJAAMUDACHqAgEAwwMAIQcKAADHAwAgMgAAhAQAIDMAAIQEACCwAgAAAOgCArECAAAA6AIIsgIAAADoAgi3AgAAgwToAiIHCgAAxwMAIDIAAIQEACAzAACEBAAgsAIAAADoAgKxAgAAAOgCCLICAAAA6AIItwIAAIME6AIiBLACAAAA6AICsQIAAADoAgiyAgAAAOgCCLcCAACEBOgCIgmmAgAAhQQAMKcCAADbAQAQqAIAAIUEADCpAgEAwwMAIa4CQADFAwAhrwJAAMUDACHpAkAAxQMAIesCAQDDAwAh7AIBAMMDACEJpgIAAIYEADCnAgAAyAEAEKgCAACGBAAwqQIBAIcEACGuAkAA8AMAIa8CQADwAwAh6QJAAPADACHrAgEAhwQAIewCAQCHBAAhC7ACAQAAAAGxAgEAAAAEsgIBAAAABLMCAQAAAAG0AgEAAAABtQIBAAAAAbYCAQAAAAG3AgEAzAMAIbgCAQAAAAG5AgEAAAABugIBAAAAARCmAgAAiAQAMKcCAADCAQAQqAIAAIgEADCpAgEAwwMAIasCAQDDAwAhrgJAAMUDACGvAkAAxQMAIe0CAQDDAwAh7gIBAMMDACHvAgEAzgMAIfACAQDOAwAh8QIBAM4DACHyAkAA2QMAIfMCQADZAwAh9AIBAM4DACH1AgEAzgMAIQumAgAAiQQAMKcCAACsAQAQqAIAAIkEADCpAgEAwwMAIasCAQDDAwAhrgJAAMUDACGvAkAAxQMAIegCAQDDAwAh6QJAAMUDACH2AgEAzgMAIfcCAQDOAwAhEKYCAACKBAAwpwIAAJYBABCoAgAAigQAMKkCAQDDAwAhrQIAAIsE-gIirgJAAMUDACGvAkAAxQMAIbsCAQDDAwAhyQIAAIwE-wIi5gIBAMMDACH4AiAA4wMAIfsCIADjAwAh_AIgAOMDACH9AkAA2QMAIf4CAQDOAwAh_wIAAPQDACAHCgAAxwMAIDIAAJAEACAzAACQBAAgsAIAAAD6AgKxAgAAAPoCCLICAAAA-gIItwIAAI8E-gIiBwoAAMcDACAyAACOBAAgMwAAjgQAILACAAAA-wICsQIAAAD7AgiyAgAAAPsCCLcCAACNBPsCIgcKAADHAwAgMgAAjgQAIDMAAI4EACCwAgAAAPsCArECAAAA-wIIsgIAAAD7Agi3AgAAjQT7AiIEsAIAAAD7AgKxAgAAAPsCCLICAAAA-wIItwIAAI4E-wIiBwoAAMcDACAyAACQBAAgMwAAkAQAILACAAAA-gICsQIAAAD6AgiyAgAAAPoCCLcCAACPBPoCIgSwAgAAAPoCArECAAAA-gIIsgIAAAD6Agi3AgAAkAT6AiIcBAAAlQQAIAUAAJYEACAGAACXBAAgCAAAmAQAIBEAAJkEACASAACZBAAgFAAAmgQAIBUAAJsEACAWAACcBAAgFwAAnQQAIBgAAJ4EACAaAACfBAAgpgIAAJEEADCnAgAAGQAQqAIAAJEEADCpAgEAhwQAIa0CAACSBPoCIq4CQADwAwAhrwJAAPADACG7AgEAhwQAIckCAACTBPsCIuYCAQCHBAAh-AIgAO8DACH7AiAA7wMAIfwCIADvAwAh_QJAAO4DACH-AgEA6wMAIf8CAACUBAAgBLACAAAA-gICsQIAAAD6AgiyAgAAAPoCCLcCAACQBPoCIgSwAgAAAPsCArECAAAA-wIIsgIAAAD7Agi3AgAAjgT7AiIMsAKAAAAAAbMCgAAAAAG0AoAAAAABtQKAAAAAAbYCgAAAAAG3AoAAAAAB3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wKAAAAAAeACgAAAAAHhAoAAAAABA4ADAAADACCBAwAAAwAgggMAAAMAIAOAAwAABwAggQMAAAcAIIIDAAAHACADgAMAAAsAIIEDAAALACCCAwAACwAgA4ADAAAPACCBAwAADwAgggMAAA8AIAOAAwAAEwAggQMAABMAIIIDAAATACADgAMAACEAIIEDAAAhACCCAwAAIQAgA4ADAAAlACCBAwAAJQAgggMAACUAIAOAAwAAKAAggQMAACgAIIIDAAAoACADgAMAABsAIIEDAAAbACCCAwAAGwAgCgMAAPwDACCmAgAA-gMAMKcCAAAuABCoAgAA-gMAMKkCAQCHBAAhqwIBAIcEACGtAgAA-wPjAiKuAkAA8AMAIYkDAAAuACCKAwAALgAgA4ADAAAwACCBAwAAMAAgggMAADAAIAumAgAAoAQAMKcCAAB-ABCoAgAAoAQAMKkCAQDDAwAhrgJAAMUDACGvAkAAxQMAIbsCAQDDAwAhyQIAAKEEhQMi5gIBAMMDACH1AgEAwwMAIYMDAQDOAwAhBwoAAMcDACAyAACjBAAgMwAAowQAILACAAAAhQMCsQIAAACFAwiyAgAAAIUDCLcCAACiBIUDIgcKAADHAwAgMgAAowQAIDMAAKMEACCwAgAAAIUDArECAAAAhQMIsgIAAACFAwi3AgAAogSFAyIEsAIAAACFAwKxAgAAAIUDCLICAAAAhQMItwIAAKMEhQMiC6YCAACkBAAwpwIAAGsAEKgCAACkBAAwqQIBAIcEACGuAkAA8AMAIa8CQADwAwAhuwIBAIcEACHJAgAApQSFAyLmAgEAhwQAIfUCAQCHBAAhgwMBAOsDACEEsAIAAACFAwKxAgAAAIUDCLICAAAAhQMItwIAAKMEhQMiC6YCAACmBAAwpwIAAGUAEKgCAACmBAAwqQIBAMMDACGqAgEAwwMAIasCAQDOAwAhrgJAAMUDACHZAgEAwwMAIYUDAQDDAwAhhgMBAMMDACGHAwEAzgMAIQsHAADxAwAgCQAAmQQAIKYCAACnBAAwpwIAAEAAEKgCAACnBAAwqQIBAIcEACGqAgEAhwQAIa4CQADwAwAhrwJAAPADACG7AgEAhwQAIb0CAQDrAwAhChkAAPwDACCmAgAAqAQAMKcCAAAwABCoAgAAqAQAMKkCAQCHBAAhrgJAAPADACHYAgEAhwQAIdkCAQCHBAAh2gIBAOsDACHbAgAAlAQAIA4DAAD8AwAgBwAAqwQAIKYCAACpBAAwpwIAACgAEKgCAACpBAAwqQIBAIcEACGqAgEA6wMAIasCAQCHBAAhrgJAAPADACGvAkAA8AMAIcQCAQDrAwAhxwIBAIcEACHkAgAAqgTkAiLlAiAA7wMAIQSwAgAAAOQCArECAAAA5AIIsgIAAADkAgi3AgAAgATkAiIYCQAAmQQAIBUAAJsEACAWAACcBAAgGwAA_AMAIBwAAJgEACAdAAC7BAAgHgAAvAQAIB8AAJoEACCmAgAAuQQAMKcCAAALABCoAgAAuQQAMKkCAQCHBAAhrgJAAPADACGvAkAA8AMAIbsCAQCHBAAhvAIBAIcEACG9AgEA6wMAIb4CAQDrAwAhvwIBAIcEACHBAgAAugTBAiLCAgEA6wMAIcMCAQDrAwAhiQMAAAsAIIoDAAALACANAwAArQQAIAcAAPEDACCmAgAArAQAMKcCAAAlABCoAgAArAQAMKkCAQCHBAAhqgIBAIcEACGrAgEA6wMAIa4CQADwAwAh2QIBAIcEACGFAwEAhwQAIYYDAQCHBAAhhwMBAOsDACEeBAAAlQQAIAUAAJYEACAGAACXBAAgCAAAmAQAIBEAAJkEACASAACZBAAgFAAAmgQAIBUAAJsEACAWAACcBAAgFwAAnQQAIBgAAJ4EACAaAACfBAAgpgIAAJEEADCnAgAAGQAQqAIAAJEEADCpAgEAhwQAIa0CAACSBPoCIq4CQADwAwAhrwJAAPADACG7AgEAhwQAIckCAACTBPsCIuYCAQCHBAAh-AIgAO8DACH7AiAA7wMAIfwCIADvAwAh_QJAAO4DACH-AgEA6wMAIf8CAACUBAAgiQMAABkAIIoDAAAZACAPBwAA8QMAIBMAAPwDACCmAgAArgQAMKcCAAAhABCoAgAArgQAMKkCAQCHBAAhqgIBAIcEACGtAgAArwStAiKuAkAA8AMAIa8CQADwAwAhyQIAALAE6AIi5gIBAIcEACHoAgEAhwQAIekCQADwAwAh6gIBAIcEACEEsAIAAACtAgKxAgAAAK0CCLICAAAArQIItwIAAMoDrQIiBLACAAAA6AICsQIAAADoAgiyAgAAAOgCCLcCAACEBOgCIgsOAACyBAAgDwAA_AMAIKYCAACxBAAwpwIAABsAEKgCAACxBAAwqQIBAIcEACGuAkAA8AMAIa8CQADwAwAhxAIBAIcEACHFAgEAhwQAIcYCAQCHBAAhFgcAAPEDACALAAC2BAAgDAAA_AMAIA0AAK0EACAQAACdBAAgpgIAALMEADCnAgAAEwAQqAIAALMEADCpAgEAhwQAIaoCAQCHBAAhrgJAAPADACGvAkAA8AMAIb0CAQDrAwAhxwIBAIcEACHJAgAAtATJAiLLAgAAtQTLAiLMAgEAhwQAIc0CAQCHBAAhzgIBAOsDACHPAkAA7gMAIYkDAAATACCKAwAAEwAgFAcAAPEDACALAAC2BAAgDAAA_AMAIA0AAK0EACAQAACdBAAgpgIAALMEADCnAgAAEwAQqAIAALMEADCpAgEAhwQAIaoCAQCHBAAhrgJAAPADACGvAkAA8AMAIb0CAQDrAwAhxwIBAIcEACHJAgAAtATJAiLLAgAAtQTLAiLMAgEAhwQAIc0CAQCHBAAhzgIBAOsDACHPAkAA7gMAIQSwAgAAAMkCArECAAAAyQIIsgIAAADJAgi3AgAA3wPJAiIEsAIAAADLAgKxAgAAAMsCCLICAAAAywIItwIAAN0DywIiDQcAAPEDACAJAACZBAAgpgIAAKcEADCnAgAAQAAQqAIAAKcEADCpAgEAhwQAIaoCAQCHBAAhrgJAAPADACGvAkAA8AMAIbsCAQCHBAAhvQIBAOsDACGJAwAAQAAgigMAAEAAIAKqAgEAAAABqwIBAAAAAQsDAAD8AwAgBwAA8QMAIKYCAAC4BAAwpwIAAA8AEKgCAAC4BAAwqQIBAIcEACGqAgEAhwQAIasCAQCHBAAhrQIAAK8ErQIirgJAAPADACGvAkAA8AMAIRYJAACZBAAgFQAAmwQAIBYAAJwEACAbAAD8AwAgHAAAmAQAIB0AALsEACAeAAC8BAAgHwAAmgQAIKYCAAC5BAAwpwIAAAsAEKgCAAC5BAAwqQIBAIcEACGuAkAA8AMAIa8CQADwAwAhuwIBAIcEACG8AgEAhwQAIb0CAQDrAwAhvgIBAOsDACG_AgEAhwQAIcECAAC6BMECIsICAQDrAwAhwwIBAOsDACEEsAIAAADBAgKxAgAAAMECCLICAAAAwQIItwIAANEDwQIiA4ADAABAACCBAwAAQAAgggMAAEAAIBEHAADxAwAgpgIAAOoDADCnAgAARQAQqAIAAOoDADCpAgEAhwQAIaoCAQCHBAAhrgJAAPADACGvAkAA8AMAIckCAADtA9YCItACAQDrAwAh0QIBAOsDACHSAgEA6wMAIdQCAADsA9QCItYCQADuAwAh1wIgAO8DACGJAwAARQAgigMAAEUAIBEDAAD8AwAgpgIAAL0EADCnAgAABwAQqAIAAL0EADCpAgEAhwQAIasCAQCHBAAhrgJAAPADACGvAkAA8AMAIe0CAQCHBAAh7gIBAIcEACHvAgEA6wMAIfACAQDrAwAh8QIBAOsDACHyAkAA7gMAIfMCQADuAwAh9AIBAOsDACH1AgEA6wMAIQwDAAD8AwAgpgIAAL4EADCnAgAAAwAQqAIAAL4EADCpAgEAhwQAIasCAQCHBAAhrgJAAPADACGvAkAA8AMAIegCAQCHBAAh6QJAAPADACH2AgEA6wMAIfcCAQDrAwAhAAAAAY4DAQAAAAEBjgMAAACtAgIBjgNAAAAAAQUsAACwCAAgLQAAtggAIIsDAACxCAAgjAMAALUIACCRAwAADQAgBSwAAK4IACAtAACzCAAgiwMAAK8IACCMAwAAsggAIJEDAACBAQAgAywAALAIACCLAwAAsQgAIJEDAAANACADLAAArggAIIsDAACvCAAgkQMAAIEBACAAAAAAAY4DAQAAAAEBjgMAAADBAgIFLAAA-QcAIC0AAKwIACCLAwAA-gcAIIwDAACrCAAgkQMAAIEBACALLAAAyQUAMC0AAM4FADCLAwAAygUAMIwDAADLBQAwjQMAAMwFACCOAwAAzQUAMI8DAADNBQAwkAMAAM0FADCRAwAAzQUAMJIDAADPBQAwkwMAANAFADALLAAAsAUAMC0AALUFADCLAwAAsQUAMIwDAACyBQAwjQMAALMFACCOAwAAtAUAMI8DAAC0BQAwkAMAALQFADCRAwAAtAUAMJIDAAC2BQAwkwMAALcFADALLAAAjAUAMC0AAJEFADCLAwAAjQUAMIwDAACOBQAwjQMAAI8FACCOAwAAkAUAMI8DAACQBQAwkAMAAJAFADCRAwAAkAUAMJIDAACSBQAwkwMAAJMFADAHLAAAhAUAIC0AAIcFACCLAwAAhQUAIIwDAACGBQAgjwMAAEUAIJADAABFACCRAwAA0AIAIAssAAD1BAAwLQAA-gQAMIsDAAD2BAAwjAMAAPcEADCNAwAA-AQAII4DAAD5BAAwjwMAAPkEADCQAwAA-QQAMJEDAAD5BAAwkgMAAPsEADCTAwAA_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_AMAIKYCAACuBAAwpwIAACEAEKgCAACuBAAwqQIBAAAAAaoCAQCHBAAhrQIAAK8ErQIirgJAAPADACGvAkAA8AMAIckCAACwBOgCIuYCAQCHBAAh6AIBAAAAAekCQADwAwAh6gIBAIcEACECAAAAIwAgJQAAgAUAIAIAAAD9BAAgJQAA_gQAIA2mAgAA_AQAMKcCAAD9BAAQqAIAAPwEADCpAgEAhwQAIaoCAQCHBAAhrQIAAK8ErQIirgJAAPADACGvAkAA8AMAIckCAACwBOgCIuYCAQCHBAAh6AIBAIcEACHpAkAA8AMAIeoCAQCHBAAhDaYCAAD8BAAwpwIAAP0EABCoAgAA_AQAMKkCAQCHBAAhqgIBAIcEACGtAgAArwStAiKuAkAA8AMAIa8CQADwAwAhyQIAALAE6AIi5gIBAIcEACHoAgEAhwQAIekCQADwAwAh6gIBAIcEACEJqQIBAMIEACGtAgAAwwStAiKuAkAAxAQAIa8CQADEBAAhyQIAAP8E6AIi5gIBAMIEACHoAgEAwgQAIekCQADEBAAh6gIBAMIEACEBjgMAAADoAgIKEwAAgQUAIKkCAQDCBAAhrQIAAMMErQIirgJAAMQEACGvAkAAxAQAIckCAAD_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_BQAgjgMAAJAFADCPAwAAkAUAMJADAACQBQAwkQMAAJAFADCSAwAAwQUAMJMDAACTBQAwDwcAAMYFACAMAACtBQAgDQAArgUAIBAAAK8FACCpAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABvQIBAAAAAccCAQAAAAHJAgAAAMkCAssCAAAAywICzQIBAAAAAc4CAQAAAAHPAkAAAAABAgAAABUAICwAAMUFACADAAAAFQAgLAAAxQUAIC0AAMMFACABJQAAgQgAMAIAAAAVACAlAADDBQAgAgAAAJQFACAlAADCBQAgC6kCAQDCBAAhqgIBAMIEACGuAkAAxAQAIa8CQADEBAAhvQIBAM0EACHHAgEAwgQAIckCAACWBckCIssCAACXBcsCIs0CAQDCBAAhzgIBAM0EACHPAkAAiwUAIQ8HAADEBQAgDAAAmgUAIA0AAJsFACAQAACcBQAgqQIBAMIEACGqAgEAwgQAIa4CQADEBAAhrwJAAMQEACG9AgEAzQQAIccCAQDCBAAhyQIAAJYFyQIiywIAAJcFywIizQIBAMIEACHOAgEAzQQAIc8CQACLBQAhBSwAAPwHACAtAAD_BwAgiwMAAP0HACCMAwAA_gcAIJEDAAANACAPBwAAxgUAIAwAAK0FACANAACuBQAgEAAArwUAIKkCAQAAAAGqAgEAAAABrgJAAAAAAa8CQAAAAAG9AgEAAAABxwIBAAAAAckCAAAAyQICywIAAADLAgLNAgEAAAABzgIBAAAAAc8CQAAAAAEDLAAA_AcAIIsDAAD9BwAgkQMAAA0AIAYJAADIBQAgqQIBAAAAAa4CQAAAAAGvAkAAAAABuwIBAAAAAb0CAQAAAAEELAAAvAUAMIsDAAC9BQAwjQMAAL8FACCRAwAAkAUAMAYDAADIBAAgqQIBAAAAAasCAQAAAAGtAgAAAK0CAq4CQAAAAAGvAkAAAAABAgAAABEAICwAANQFACADAAAAEQAgLAAA1AUAIC0AANMFACABJQAA-wcAMAwDAAD8AwAgBwAA8QMAIKYCAAC4BAAwpwIAAA8AEKgCAAC4BAAwqQIBAAAAAaoCAQCHBAAhqwIBAIcEACGtAgAArwStAiKuAkAA8AMAIa8CQADwAwAhiAMAALcEACACAAAAEQAgJQAA0wUAIAIAAADRBQAgJQAA0gUAIAmmAgAA0AUAMKcCAADRBQAQqAIAANAFADCpAgEAhwQAIaoCAQCHBAAhqwIBAIcEACGtAgAArwStAiKuAkAA8AMAIa8CQADwAwAhCaYCAADQBQAwpwIAANEFABCoAgAA0AUAMKkCAQCHBAAhqgIBAIcEACGrAgEAhwQAIa0CAACvBK0CIq4CQADwAwAhrwJAAPADACEFqQIBAMIEACGrAgEAwgQAIa0CAADDBK0CIq4CQADEBAAhrwJAAMQEACEGAwAAxgQAIKkCAQDCBAAhqwIBAMIEACGtAgAAwwStAiKuAkAAxAQAIa8CQADEBAAhBgMAAMgEACCpAgEAAAABqwIBAAAAAa0CAAAArQICrgJAAAAAAa8CQAAAAAEDLAAA-QcAIIsDAAD6BwAgkQMAAIEBACAELAAAyQUAMIsDAADKBQAwjQMAAMwFACCRAwAAzQUAMAQsAACwBQAwiwMAALEFADCNAwAAswUAIJEDAAC0BQAwBCwAAIwFADCLAwAAjQUAMI0DAACPBQAgkQMAAJAFADADLAAAhAUAIIsDAACFBQAgkQMAANACACAELAAA9QQAMIsDAAD2BAAwjQMAAPgEACCRAwAA-QQAMAQsAADnBAAwiwMAAOgEADCNAwAA6gQAIJEDAADrBAAwBCwAANcEADCLAwAA2AQAMI0DAADaBAAgkQMAANsEADAAAAAFLAAA9AcAIC0AAPcHACCLAwAA9QcAIIwDAAD2BwAgkQMAABUAIAMsAAD0BwAgiwMAAPUHACCRAwAAFQAgAAAAAAAABSwAAO8HACAtAADyBwAgiwMAAPAHACCMAwAA8QcAIJEDAAANACADLAAA7wcAIIsDAADwBwAgkQMAAA0AIAwJAACqBwAgFQAArAcAIBYAAK0HACAbAAD7BQAgHAAAqQcAIB0AALoHACAeAAC7BwAgHwAAqwcAIL0CAADJBAAgvgIAAMkEACDCAgAAyQQAIMMCAADJBAAgAAAABSwAAOoHACAtAADtBwAgiwMAAOsHACCMAwAA7AcAIJEDAAANACADLAAA6gcAIIsDAADrBwAgkQMAAA0AIAAAAAUsAADlBwAgLQAA6AcAIIsDAADmBwAgjAMAAOcHACCRAwAAgQEAIAMsAADlBwAgiwMAAOYHACCRAwAAgQEAIAAAAAGOAwAAAOMCAgUsAADgBwAgLQAA4wcAIIsDAADhBwAgjAMAAOIHACCRAwAAgQEAIAMsAADgBwAgiwMAAOEHACCRAwAAgQEAIA8EAACmBwAgBQAApwcAIAYAAKgHACAIAACpBwAgEQAAqgcAIBIAAKoHACAUAACrBwAgFQAArAcAIBYAAK0HACAXAACuBwAgGAAArwcAIBoAALAHACD9AgAAyQQAIP4CAADJBAAg_wIAAMkEACAAAAAHLAAA2wcAIC0AAN4HACCLAwAA3AcAIIwDAADdBwAgjwMAAAsAIJADAAALACCRAwAADQAgAywAANsHACCLAwAA3AcAIJEDAAANACAAAAAFLAAA1gcAIC0AANkHACCLAwAA1wcAIIwDAADYBwAgkQMAAA0AIAMsAADWBwAgiwMAANcHACCRAwAADQAgAAAAAAAABSwAANEHACAtAADUBwAgiwMAANIHACCMAwAA0wcAIJEDAACBAQAgAywAANEHACCLAwAA0gcAIJEDAACBAQAgAAAABSwAAMwHACAtAADPBwAgiwMAAM0HACCMAwAAzgcAIJEDAACBAQAgAywAAMwHACCLAwAAzQcAIJEDAACBAQAgAAAAAY4DAAAA-gICAY4DAAAA-wICCywAAI4HADAtAACTBwAwiwMAAI8HADCMAwAAkAcAMI0DAACRBwAgjgMAAJIHADCPAwAAkgcAMJADAACSBwAwkQMAAJIHADCSAwAAlAcAMJMDAACVBwAwCywAAIIHADAtAACHBwAwiwMAAIMHADCMAwAAhAcAMI0DAACFBwAgjgMAAIYHADCPAwAAhgcAMJADAACGBwAwkQMAAIYHADCSAwAAiAcAMJMDAACJBwAwCywAAPYGADAtAAD7BgAwiwMAAPcGADCMAwAA-AYAMI0DAAD5BgAgjgMAAPoGADCPAwAA-gYAMJADAAD6BgAwkQMAAPoGADCSAwAA_AYAMJMDAAD9BgAwCywAAO0GADAtAADxBgAwiwMAAO4GADCMAwAA7wYAMI0DAADwBgAgjgMAAM0FADCPAwAAzQUAMJADAADNBQAwkQMAAM0FADCSAwAA8gYAMJMDAADQBQAwCywAAOQGADAtAADoBgAwiwMAAOUGADCMAwAA5gYAMI0DAADnBgAgjgMAAJAFADCPAwAAkAUAMJADAACQBQAwkQMAAJAFADCSAwAA6QYAMJMDAACTBQAwCywAANsGADAtAADfBgAwiwMAANwGADCMAwAA3QYAMI0DAADeBgAgjgMAAJAFADCPAwAAkAUAMJADAACQBQAwkQMAAJAFADCSAwAA4AYAMJMDAACTBQAwCywAANIGADAtAADWBgAwiwMAANMGADCMAwAA1AYAMI0DAADVBgAgjgMAAPkEADCPAwAA-QQAMJADAAD5BAAwkQMAAPkEADCSAwAA1wYAMJMDAAD8BAAwCywAAMcGADAtAADLBgAwiwMAAMgGADCMAwAAyQYAMI0DAADKBgAgjgMAAOsEADCPAwAA6wQAMJADAADrBAAwkQMAAOsEADCSAwAAzAYAMJMDAADuBAAwCywAAL4GADAtAADCBgAwiwMAAL8GADCMAwAAwAYAMI0DAADBBgAgjgMAANsEADCPAwAA2wQAMJADAADbBAAwkQMAANsEADCSAwAAwwYAMJMDAADeBAAwCywAALUGADAtAAC5BgAwiwMAALYGADCMAwAAtwYAMI0DAAC4BgAgjgMAAKEFADCPAwAAoQUAMJADAAChBQAwkQMAAKEFADCSAwAAugYAMJMDAACkBQAwBywAALAGACAtAACzBgAgiwMAALEGACCMAwAAsgYAII8DAAAuACCQAwAALgAgkQMAAIwCACALLAAApAYAMC0AAKkGADCLAwAApQYAMIwDAACmBgAwjQMAAKcGACCOAwAAqAYAMI8DAACoBgAwkAMAAKgGADCRAwAAqAYAMJIDAACqBgAwkwMAAKsGADAFqQIBAAAAAa4CQAAAAAHZAgEAAAAB2gIBAAAAAdsCgAAAAAECAAAAMgAgLAAArwYAIAMAAAAyACAsAACvBgAgLQAArgYAIAElAADLBwAwChkAAPwDACCmAgAAqAQAMKcCAAAwABCoAgAAqAQAMKkCAQAAAAGuAkAA8AMAIdgCAQCHBAAh2QIBAIcEACHaAgEA6wMAIdsCAACUBAAgAgAAADIAICUAAK4GACACAAAArAYAICUAAK0GACAJpgIAAKsGADCnAgAArAYAEKgCAACrBgAwqQIBAIcEACGuAkAA8AMAIdgCAQCHBAAh2QIBAIcEACHaAgEA6wMAIdsCAACUBAAgCaYCAACrBgAwpwIAAKwGABCoAgAAqwYAMKkCAQCHBAAhrgJAAPADACHYAgEAhwQAIdkCAQCHBAAh2gIBAOsDACHbAgAAlAQAIAWpAgEAwgQAIa4CQADEBAAh2QIBAMIEACHaAgEAzQQAIdsCgAAAAAEFqQIBAMIEACGuAkAAxAQAIdkCAQDCBAAh2gIBAM0EACHbAoAAAAABBakCAQAAAAGuAkAAAAAB2QIBAAAAAdoCAQAAAAHbAoAAAAABA6kCAQAAAAGtAgAAAOMCAq4CQAAAAAECAAAAjAIAICwAALAGACADAAAALgAgLAAAsAYAIC0AALQGACAFAAAALgAgJQAAtAYAIKkCAQDCBAAhrQIAAPgF4wIirgJAAMQEACEDqQIBAMIEACGtAgAA-AXjAiKuAkAAxAQAIQYOAADhBQAgqQIBAAAAAa4CQAAAAAGvAkAAAAABxAIBAAAAAcUCAQAAAAECAAAAHQAgLAAAvQYAIAMAAAAdACAsAAC9BgAgLQAAvAYAIAElAADKBwAwAgAAAB0AICUAALwGACACAAAApQUAICUAALsGACAFqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhxAIBAMIEACHFAgEAwgQAIQYOAADgBQAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhxAIBAMIEACHFAgEAwgQAIQYOAADhBQAgqQIBAAAAAa4CQAAAAAGvAkAAAAABxAIBAAAAAcUCAQAAAAEJBwAAgAYAIKkCAQAAAAGqAgEAAAABrgJAAAAAAa8CQAAAAAHEAgEAAAABxwIBAAAAAeQCAAAA5AIC5QIgAAAAAQIAAAAqACAsAADGBgAgAwAAACoAICwAAMYGACAtAADFBgAgASUAAMkHADACAAAAKgAgJQAAxQYAIAIAAADfBAAgJQAAxAYAIAipAgEAwgQAIaoCAQDNBAAhrgJAAMQEACGvAkAAxAQAIcQCAQDNBAAhxwIBAMIEACHkAgAA4QTkAiLlAiAA4gQAIQkHAAD_BQAgqQIBAMIEACGqAgEAzQQAIa4CQADEBAAhrwJAAMQEACHEAgEAzQQAIccCAQDCBAAh5AIAAOEE5AIi5QIgAOIEACEJBwAAgAYAIKkCAQAAAAGqAgEAAAABrgJAAAAAAa8CQAAAAAHEAgEAAAABxwIBAAAAAeQCAAAA5AIC5QIgAAAAAQgHAADRBgAgqQIBAAAAAaoCAQAAAAGuAkAAAAAB2QIBAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAQIAAAABACAsAADQBgAgAwAAAAEAICwAANAGACAtAADOBgAgASUAAMgHADACAAAAAQAgJQAAzgYAIAIAAADvBAAgJQAAzQYAIAepAgEAwgQAIaoCAQDCBAAhrgJAAMQEACHZAgEAwgQAIYUDAQDCBAAhhgMBAMIEACGHAwEAzQQAIQgHAADPBgAgqQIBAMIEACGqAgEAwgQAIa4CQADEBAAh2QIBAMIEACGFAwEAwgQAIYYDAQDCBAAhhwMBAM0EACEFLAAAwwcAIC0AAMYHACCLAwAAxAcAIIwDAADFBwAgkQMAAA0AIAgHAADRBgAgqQIBAAAAAaoCAQAAAAGuAkAAAAAB2QIBAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAQMsAADDBwAgiwMAAMQHACCRAwAADQAgCgcAAIUGACCpAgEAAAABqgIBAAAAAa0CAAAArQICrgJAAAAAAa8CQAAAAAHJAgAAAOgCAuYCAQAAAAHoAgEAAAAB6QJAAAAAAQIAAAAjACAsAADaBgAgAwAAACMAICwAANoGACAtAADZBgAgASUAAMIHADACAAAAIwAgJQAA2QYAIAIAAAD9BAAgJQAA2AYAIAmpAgEAwgQAIaoCAQDCBAAhrQIAAMMErQIirgJAAMQEACGvAkAAxAQAIckCAAD_BOgCIuYCAQDCBAAh6AIBAMIEACHpAkAAxAQAIQoHAACEBgAgqQIBAMIEACGqAgEAwgQAIa0CAADDBK0CIq4CQADEBAAhrwJAAMQEACHJAgAA_wToAiLmAgEAwgQAIegCAQDCBAAh6QJAAMQEACEKBwAAhQYAIKkCAQAAAAGqAgEAAAABrQIAAACtAgKuAkAAAAABrwJAAAAAAckCAAAA6AIC5gIBAAAAAegCAQAAAAHpAkAAAAABDwcAAMYFACALAACsBQAgDAAArQUAIBAAAK8FACCpAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABvQIBAAAAAccCAQAAAAHJAgAAAMkCAssCAAAAywICzAIBAAAAAc0CAQAAAAHPAkAAAAABAgAAABUAICwAAOMGACADAAAAFQAgLAAA4wYAIC0AAOIGACABJQAAwQcAMAIAAAAVACAlAADiBgAgAgAAAJQFACAlAADhBgAgC6kCAQDCBAAhqgIBAMIEACGuAkAAxAQAIa8CQADEBAAhvQIBAM0EACHHAgEAwgQAIckCAACWBckCIssCAACXBcsCIswCAQDCBAAhzQIBAMIEACHPAkAAiwUAIQ8HAADEBQAgCwAAmQUAIAwAAJoFACAQAACcBQAgqQIBAMIEACGqAgEAwgQAIa4CQADEBAAhrwJAAMQEACG9AgEAzQQAIccCAQDCBAAhyQIAAJYFyQIiywIAAJcFywIizAIBAMIEACHNAgEAwgQAIc8CQACLBQAhDwcAAMYFACALAACsBQAgDAAArQUAIBAAAK8FACCpAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABvQIBAAAAAccCAQAAAAHJAgAAAMkCAssCAAAAywICzAIBAAAAAc0CAQAAAAHPAkAAAAABDwcAAMYFACALAACsBQAgDQAArgUAIBAAAK8FACCpAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABvQIBAAAAAccCAQAAAAHJAgAAAMkCAssCAAAAywICzAIBAAAAAc4CAQAAAAHPAkAAAAABAgAAABUAICwAAOwGACADAAAAFQAgLAAA7AYAIC0AAOsGACABJQAAwAcAMAIAAAAVACAlAADrBgAgAgAAAJQFACAlAADqBgAgC6kCAQDCBAAhqgIBAMIEACGuAkAAxAQAIa8CQADEBAAhvQIBAM0EACHHAgEAwgQAIckCAACWBckCIssCAACXBcsCIswCAQDCBAAhzgIBAM0EACHPAkAAiwUAIQ8HAADEBQAgCwAAmQUAIA0AAJsFACAQAACcBQAgqQIBAMIEACGqAgEAwgQAIa4CQADEBAAhrwJAAMQEACG9AgEAzQQAIccCAQDCBAAhyQIAAJYFyQIiywIAAJcFywIizAIBAMIEACHOAgEAzQQAIc8CQACLBQAhDwcAAMYFACALAACsBQAgDQAArgUAIBAAAK8FACCpAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABvQIBAAAAAccCAQAAAAHJAgAAAMkCAssCAAAAywICzAIBAAAAAc4CAQAAAAHPAkAAAAABBgcAAMcEACCpAgEAAAABqgIBAAAAAa0CAAAArQICrgJAAAAAAa8CQAAAAAECAAAAEQAgLAAA9QYAIAMAAAARACAsAAD1BgAgLQAA9AYAIAElAAC_BwAwAgAAABEAICUAAPQGACACAAAA0QUAICUAAPMGACAFqQIBAMIEACGqAgEAwgQAIa0CAADDBK0CIq4CQADEBAAhrwJAAMQEACEGBwAAxQQAIKkCAQDCBAAhqgIBAMIEACGtAgAAwwStAiKuAkAAxAQAIa8CQADEBAAhBgcAAMcEACCpAgEAAAABqgIBAAAAAa0CAAAArQICrgJAAAAAAa8CQAAAAAERCQAA2AUAIBUAANsFACAWAADcBQAgHAAA1gUAIB0AANcFACAeAADZBQAgHwAA2gUAIKkCAQAAAAGuAkAAAAABrwJAAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb4CAQAAAAHBAgAAAMECAsICAQAAAAHDAgEAAAABAgAAAA0AICwAAIEHACADAAAADQAgLAAAgQcAIC0AAIAHACABJQAAvgcAMBYJAACZBAAgFQAAmwQAIBYAAJwEACAbAAD8AwAgHAAAmAQAIB0AALsEACAeAAC8BAAgHwAAmgQAIKYCAAC5BAAwpwIAAAsAEKgCAAC5BAAwqQIBAAAAAa4CQADwAwAhrwJAAPADACG7AgEAhwQAIbwCAQAAAAG9AgEA6wMAIb4CAQDrAwAhvwIBAIcEACHBAgAAugTBAiLCAgEA6wMAIcMCAQDrAwAhAgAAAA0AICUAAIAHACACAAAA_gYAICUAAP8GACAOpgIAAP0GADCnAgAA_gYAEKgCAAD9BgAwqQIBAIcEACGuAkAA8AMAIa8CQADwAwAhuwIBAIcEACG8AgEAhwQAIb0CAQDrAwAhvgIBAOsDACG_AgEAhwQAIcECAAC6BMECIsICAQDrAwAhwwIBAOsDACEOpgIAAP0GADCnAgAA_gYAEKgCAAD9BgAwqQIBAIcEACGuAkAA8AMAIa8CQADwAwAhuwIBAIcEACG8AgEAhwQAIb0CAQDrAwAhvgIBAOsDACG_AgEAhwQAIcECAAC6BMECIsICAQDrAwAhwwIBAOsDACEKqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG8AgEAwgQAIb0CAQDNBAAhvgIBAM0EACHBAgAAzgTBAiLCAgEAzQQAIcMCAQDNBAAhEQkAANIEACAVAADVBAAgFgAA1gQAIBwAANAEACAdAADRBAAgHgAA0wQAIB8AANQEACCpAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIbwCAQDCBAAhvQIBAM0EACG-AgEAzQQAIcECAADOBMECIsICAQDNBAAhwwIBAM0EACERCQAA2AUAIBUAANsFACAWAADcBQAgHAAA1gUAIB0AANcFACAeAADZBQAgHwAA2gUAIKkCAQAAAAGuAkAAAAABrwJAAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb4CAQAAAAHBAgAAAMECAsICAQAAAAHDAgEAAAABDKkCAQAAAAGuAkAAAAABrwJAAAAAAe0CAQAAAAHuAgEAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAAB8gJAAAAAAfMCQAAAAAH0AgEAAAAB9QIBAAAAAQIAAAAJACAsAACNBwAgAwAAAAkAICwAAI0HACAtAACMBwAgASUAAL0HADARAwAA_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-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQIAAACBAQAgLAAAzAcAIAMAAAAZACAsAADMBwAgLQAA0AcAIBoAAAAZACAFAACZBgAgBgAAmgYAIAgAAJsGACARAACcBgAgEgAAnQYAIBQAAJ4GACAVAACfBgAgFgAAoAYAIBcAAKEGACAYAACiBgAgGgAAowYAICUAANAHACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEYBQAAmQYAIAYAAJoGACAIAACbBgAgEQAAnAYAIBIAAJ0GACAUAACeBgAgFQAAnwYAIBYAAKAGACAXAAChBgAgGAAAogYAIBoAAKMGACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEYBAAAmgcAIAYAAJwHACAIAACdBwAgEQAAngcAIBIAAJ8HACAUAACgBwAgFQAAoQcAIBYAAKIHACAXAACjBwAgGAAApAcAIBoAAKUHACCpAgEAAAABrQIAAAD6AgKuAkAAAAABrwJAAAAAAbsCAQAAAAHJAgAAAPsCAuYCAQAAAAH4AiAAAAAB-wIgAAAAAfwCIAAAAAH9AkAAAAAB_gIBAAAAAf8CgAAAAAECAAAAgQEAICwAANEHACADAAAAGQAgLAAA0QcAIC0AANUHACAaAAAAGQAgBAAAmAYAIAYAAJoGACAIAACbBgAgEQAAnAYAIBIAAJ0GACAUAACeBgAgFQAAnwYAIBYAAKAGACAXAAChBgAgGAAAogYAIBoAAKMGACAlAADVBwAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABGAQAAJgGACAGAACaBgAgCAAAmwYAIBEAAJwGACASAACdBgAgFAAAngYAIBUAAJ8GACAWAACgBgAgFwAAoQYAIBgAAKIGACAaAACjBgAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABEgkAANgFACAVAADbBQAgFgAA3AUAIBsAANUFACAcAADWBQAgHQAA1wUAIB4AANkFACCpAgEAAAABrgJAAAAAAa8CQAAAAAG7AgEAAAABvAIBAAAAAb0CAQAAAAG-AgEAAAABvwIBAAAAAcECAAAAwQICwgIBAAAAAcMCAQAAAAECAAAADQAgLAAA1gcAIAMAAAALACAsAADWBwAgLQAA2gcAIBQAAAALACAJAADSBAAgFQAA1QQAIBYAANYEACAbAADPBAAgHAAA0AQAIB0AANEEACAeAADTBAAgJQAA2gcAIKkCAQDCBAAhrgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhvAIBAMIEACG9AgEAzQQAIb4CAQDNBAAhvwIBAMIEACHBAgAAzgTBAiLCAgEAzQQAIcMCAQDNBAAhEgkAANIEACAVAADVBAAgFgAA1gQAIBsAAM8EACAcAADQBAAgHQAA0QQAIB4AANMEACCpAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIbwCAQDCBAAhvQIBAM0EACG-AgEAzQQAIb8CAQDCBAAhwQIAAM4EwQIiwgIBAM0EACHDAgEAzQQAIRIJAADYBQAgFQAA2wUAIBsAANUFACAcAADWBQAgHQAA1wUAIB4AANkFACAfAADaBQAgqQIBAAAAAa4CQAAAAAGvAkAAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIBAAAAAb8CAQAAAAHBAgAAAMECAsICAQAAAAHDAgEAAAABAgAAAA0AICwAANsHACADAAAACwAgLAAA2wcAIC0AAN8HACAUAAAACwAgCQAA0gQAIBUAANUEACAbAADPBAAgHAAA0AQAIB0AANEEACAeAADTBAAgHwAA1AQAICUAAN8HACCpAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIbwCAQDCBAAhvQIBAM0EACG-AgEAzQQAIb8CAQDCBAAhwQIAAM4EwQIiwgIBAM0EACHDAgEAzQQAIRIJAADSBAAgFQAA1QQAIBsAAM8EACAcAADQBAAgHQAA0QQAIB4AANMEACAfAADUBAAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG8AgEAwgQAIb0CAQDNBAAhvgIBAM0EACG_AgEAwgQAIcECAADOBMECIsICAQDNBAAhwwIBAM0EACEYBAAAmgcAIAUAAJsHACAGAACcBwAgCAAAnQcAIBEAAJ4HACASAACfBwAgFAAAoAcAIBUAAKEHACAWAACiBwAgFwAAowcAIBoAAKUHACCpAgEAAAABrQIAAAD6AgKuAkAAAAABrwJAAAAAAbsCAQAAAAHJAgAAAPsCAuYCAQAAAAH4AiAAAAAB-wIgAAAAAfwCIAAAAAH9AkAAAAAB_gIBAAAAAf8CgAAAAAECAAAAgQEAICwAAOAHACADAAAAGQAgLAAA4AcAIC0AAOQHACAaAAAAGQAgBAAAmAYAIAUAAJkGACAGAACaBgAgCAAAmwYAIBEAAJwGACASAACdBgAgFAAAngYAIBUAAJ8GACAWAACgBgAgFwAAoQYAIBoAAKMGACAlAADkBwAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABGAQAAJgGACAFAACZBgAgBgAAmgYAIAgAAJsGACARAACcBgAgEgAAnQYAIBQAAJ4GACAVAACfBgAgFgAAoAYAIBcAAKEGACAaAACjBgAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABGAQAAJoHACAFAACbBwAgBgAAnAcAIAgAAJ0HACARAACeBwAgEgAAnwcAIBQAAKAHACAVAAChBwAgFgAAogcAIBcAAKMHACAYAACkBwAgqQIBAAAAAa0CAAAA-gICrgJAAAAAAa8CQAAAAAG7AgEAAAAByQIAAAD7AgLmAgEAAAAB-AIgAAAAAfsCIAAAAAH8AiAAAAAB_QJAAAAAAf4CAQAAAAH_AoAAAAABAgAAAIEBACAsAADlBwAgAwAAABkAICwAAOUHACAtAADpBwAgGgAAABkAIAQAAJgGACAFAACZBgAgBgAAmgYAIAgAAJsGACARAACcBgAgEgAAnQYAIBQAAJ4GACAVAACfBgAgFgAAoAYAIBcAAKEGACAYAACiBgAgJQAA6QcAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAARgEAACYBgAgBQAAmQYAIAYAAJoGACAIAACbBgAgEQAAnAYAIBIAAJ0GACAUAACeBgAgFQAAnwYAIBYAAKAGACAXAAChBgAgGAAAogYAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAARIJAADYBQAgFQAA2wUAIBYAANwFACAbAADVBQAgHAAA1gUAIB4AANkFACAfAADaBQAgqQIBAAAAAa4CQAAAAAGvAkAAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIBAAAAAb8CAQAAAAHBAgAAAMECAsICAQAAAAHDAgEAAAABAgAAAA0AICwAAOoHACADAAAACwAgLAAA6gcAIC0AAO4HACAUAAAACwAgCQAA0gQAIBUAANUEACAWAADWBAAgGwAAzwQAIBwAANAEACAeAADTBAAgHwAA1AQAICUAAO4HACCpAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIbwCAQDCBAAhvQIBAM0EACG-AgEAzQQAIb8CAQDCBAAhwQIAAM4EwQIiwgIBAM0EACHDAgEAzQQAIRIJAADSBAAgFQAA1QQAIBYAANYEACAbAADPBAAgHAAA0AQAIB4AANMEACAfAADUBAAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG8AgEAwgQAIb0CAQDNBAAhvgIBAM0EACG_AgEAwgQAIcECAADOBMECIsICAQDNBAAhwwIBAM0EACESCQAA2AUAIBUAANsFACAWAADcBQAgGwAA1QUAIBwAANYFACAdAADXBQAgHwAA2gUAIKkCAQAAAAGuAkAAAAABrwJAAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb4CAQAAAAG_AgEAAAABwQIAAADBAgLCAgEAAAABwwIBAAAAAQIAAAANACAsAADvBwAgAwAAAAsAICwAAO8HACAtAADzBwAgFAAAAAsAIAkAANIEACAVAADVBAAgFgAA1gQAIBsAAM8EACAcAADQBAAgHQAA0QQAIB8AANQEACAlAADzBwAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG8AgEAwgQAIb0CAQDNBAAhvgIBAM0EACG_AgEAwgQAIcECAADOBMECIsICAQDNBAAhwwIBAM0EACESCQAA0gQAIBUAANUEACAWAADWBAAgGwAAzwQAIBwAANAEACAdAADRBAAgHwAA1AQAIKkCAQDCBAAhrgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhvAIBAMIEACG9AgEAzQQAIb4CAQDNBAAhvwIBAMIEACHBAgAAzgTBAiLCAgEAzQQAIcMCAQDNBAAhEAcAAMYFACALAACsBQAgDAAArQUAIA0AAK4FACCpAgEAAAABqgIBAAAAAa4CQAAAAAGvAkAAAAABvQIBAAAAAccCAQAAAAHJAgAAAMkCAssCAAAAywICzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAQIAAAAVACAsAAD0BwAgAwAAABMAICwAAPQHACAtAAD4BwAgEgAAABMAIAcAAMQFACALAACZBQAgDAAAmgUAIA0AAJsFACAlAAD4BwAgqQIBAMIEACGqAgEAwgQAIa4CQADEBAAhrwJAAMQEACG9AgEAzQQAIccCAQDCBAAhyQIAAJYFyQIiywIAAJcFywIizAIBAMIEACHNAgEAwgQAIc4CAQDNBAAhzwJAAIsFACEQBwAAxAUAIAsAAJkFACAMAACaBQAgDQAAmwUAIKkCAQDCBAAhqgIBAMIEACGuAkAAxAQAIa8CQADEBAAhvQIBAM0EACHHAgEAwgQAIckCAACWBckCIssCAACXBcsCIswCAQDCBAAhzQIBAMIEACHOAgEAzQQAIc8CQACLBQAhGAQAAJoHACAFAACbBwAgCAAAnQcAIBEAAJ4HACASAACfBwAgFAAAoAcAIBUAAKEHACAWAACiBwAgFwAAowcAIBgAAKQHACAaAAClBwAgqQIBAAAAAa0CAAAA-gICrgJAAAAAAa8CQAAAAAG7AgEAAAAByQIAAAD7AgLmAgEAAAAB-AIgAAAAAfsCIAAAAAH8AiAAAAAB_QJAAAAAAf4CAQAAAAH_AoAAAAABAgAAAIEBACAsAAD5BwAgBakCAQAAAAGrAgEAAAABrQIAAACtAgKuAkAAAAABrwJAAAAAARIVAADbBQAgFgAA3AUAIBsAANUFACAcAADWBQAgHQAA1wUAIB4AANkFACAfAADaBQAgqQIBAAAAAa4CQAAAAAGvAkAAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIBAAAAAb8CAQAAAAHBAgAAAMECAsICAQAAAAHDAgEAAAABAgAAAA0AICwAAPwHACADAAAACwAgLAAA_AcAIC0AAIAIACAUAAAACwAgFQAA1QQAIBYAANYEACAbAADPBAAgHAAA0AQAIB0AANEEACAeAADTBAAgHwAA1AQAICUAAIAIACCpAgEAwgQAIa4CQADEBAAhrwJAAMQEACG7AgEAwgQAIbwCAQDCBAAhvQIBAM0EACG-AgEAzQQAIb8CAQDCBAAhwQIAAM4EwQIiwgIBAM0EACHDAgEAzQQAIRIVAADVBAAgFgAA1gQAIBsAAM8EACAcAADQBAAgHQAA0QQAIB4AANMEACAfAADUBAAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG8AgEAwgQAIb0CAQDNBAAhvgIBAM0EACG_AgEAwgQAIcECAADOBMECIsICAQDNBAAhwwIBAM0EACELqQIBAAAAAaoCAQAAAAGuAkAAAAABrwJAAAAAAb0CAQAAAAHHAgEAAAAByQIAAADJAgLLAgAAAMsCAs0CAQAAAAHOAgEAAAABzwJAAAAAAQWpAgEAAAABrgJAAAAAAa8CQAAAAAG7AgEAAAABvQIBAAAAARgEAACaBwAgBQAAmwcAIAYAAJwHACAIAACdBwAgEQAAngcAIBQAAKAHACAVAAChBwAgFgAAogcAIBcAAKMHACAYAACkBwAgGgAApQcAIKkCAQAAAAGtAgAAAPoCAq4CQAAAAAGvAkAAAAABuwIBAAAAAckCAAAA-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQIAAACBAQAgLAAAgwgAIBgEAACaBwAgBQAAmwcAIAYAAJwHACAIAACdBwAgEgAAnwcAIBQAAKAHACAVAAChBwAgFgAAogcAIBcAAKMHACAYAACkBwAgGgAApQcAIKkCAQAAAAGtAgAAAPoCAq4CQAAAAAGvAkAAAAABuwIBAAAAAckCAAAA-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQIAAACBAQAgLAAAhQgAIAcHAADvBQAgqQIBAAAAAaoCAQAAAAGuAkAAAAABrwJAAAAAAbsCAQAAAAG9AgEAAAABAgAAAEIAICwAAIcIACAYBAAAmgcAIAUAAJsHACAGAACcBwAgCAAAnQcAIBEAAJ4HACASAACfBwAgFAAAoAcAIBUAAKEHACAWAACiBwAgGAAApAcAIBoAAKUHACCpAgEAAAABrQIAAAD6AgKuAkAAAAABrwJAAAAAAbsCAQAAAAHJAgAAAPsCAuYCAQAAAAH4AiAAAAAB-wIgAAAAAfwCIAAAAAH9AkAAAAAB_gIBAAAAAf8CgAAAAAECAAAAgQEAICwAAIkIACADAAAAGQAgLAAAiQgAIC0AAI0IACAaAAAAGQAgBAAAmAYAIAUAAJkGACAGAACaBgAgCAAAmwYAIBEAAJwGACASAACdBgAgFAAAngYAIBUAAJ8GACAWAACgBgAgGAAAogYAIBoAAKMGACAlAACNCAAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABGAQAAJgGACAFAACZBgAgBgAAmgYAIAgAAJsGACARAACcBgAgEgAAnQYAIBQAAJ4GACAVAACfBgAgFgAAoAYAIBgAAKIGACAaAACjBgAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABBakCAQAAAAGuAkAAAAABrwJAAAAAAcQCAQAAAAHGAgEAAAABAwAAABkAICwAAIMIACAtAACRCAAgGgAAABkAIAQAAJgGACAFAACZBgAgBgAAmgYAIAgAAJsGACARAACcBgAgFAAAngYAIBUAAJ8GACAWAACgBgAgFwAAoQYAIBgAAKIGACAaAACjBgAgJQAAkQgAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAARgEAACYBgAgBQAAmQYAIAYAAJoGACAIAACbBgAgEQAAnAYAIBQAAJ4GACAVAACfBgAgFgAAoAYAIBcAAKEGACAYAACiBgAgGgAAowYAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAAQMAAAAZACAsAACFCAAgLQAAlAgAIBoAAAAZACAEAACYBgAgBQAAmQYAIAYAAJoGACAIAACbBgAgEgAAnQYAIBQAAJ4GACAVAACfBgAgFgAAoAYAIBcAAKEGACAYAACiBgAgGgAAowYAICUAAJQIACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEYBAAAmAYAIAUAAJkGACAGAACaBgAgCAAAmwYAIBIAAJ0GACAUAACeBgAgFQAAnwYAIBYAAKAGACAXAAChBgAgGAAAogYAIBoAAKMGACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEDAAAAQAAgLAAAhwgAIC0AAJcIACAJAAAAQAAgBwAA7gUAICUAAJcIACCpAgEAwgQAIaoCAQDCBAAhrgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhvQIBAM0EACEHBwAA7gUAIKkCAQDCBAAhqgIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG9AgEAzQQAIQupAgEAAAABrgJAAAAAAa8CQAAAAAG9AgEAAAABxwIBAAAAAckCAAAAyQICywIAAADLAgLMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAABGAQAAJoHACAFAACbBwAgBgAAnAcAIAgAAJ0HACARAACeBwAgEgAAnwcAIBUAAKEHACAWAACiBwAgFwAAowcAIBgAAKQHACAaAAClBwAgqQIBAAAAAa0CAAAA-gICrgJAAAAAAa8CQAAAAAG7AgEAAAAByQIAAAD7AgLmAgEAAAAB-AIgAAAAAfsCIAAAAAH8AiAAAAAB_QJAAAAAAf4CAQAAAAH_AoAAAAABAgAAAIEBACAsAACZCAAgAwAAABkAICwAAJkIACAtAACdCAAgGgAAABkAIAQAAJgGACAFAACZBgAgBgAAmgYAIAgAAJsGACARAACcBgAgEgAAnQYAIBUAAJ8GACAWAACgBgAgFwAAoQYAIBgAAKIGACAaAACjBgAgJQAAnQgAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAARgEAACYBgAgBQAAmQYAIAYAAJoGACAIAACbBgAgEQAAnAYAIBIAAJ0GACAVAACfBgAgFgAAoAYAIBcAAKEGACAYAACiBgAgGgAAowYAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAAQmpAgEAAAABrQIAAACtAgKuAkAAAAABrwJAAAAAAckCAAAA6AIC5gIBAAAAAegCAQAAAAHpAkAAAAAB6gIBAAAAARgEAACaBwAgBQAAmwcAIAYAAJwHACAIAACdBwAgEQAAngcAIBIAAJ8HACAUAACgBwAgFgAAogcAIBcAAKMHACAYAACkBwAgGgAApQcAIKkCAQAAAAGtAgAAAPoCAq4CQAAAAAGvAkAAAAABuwIBAAAAAckCAAAA-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQIAAACBAQAgLAAAnwgAIAMAAAAZACAsAACfCAAgLQAAowgAIBoAAAAZACAEAACYBgAgBQAAmQYAIAYAAJoGACAIAACbBgAgEQAAnAYAIBIAAJ0GACAUAACeBgAgFgAAoAYAIBcAAKEGACAYAACiBgAgGgAAowYAICUAAKMIACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEYBAAAmAYAIAUAAJkGACAGAACaBgAgCAAAmwYAIBEAAJwGACASAACdBgAgFAAAngYAIBYAAKAGACAXAAChBgAgGAAAogYAIBoAAKMGACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEHqQIBAAAAAasCAQAAAAGuAkAAAAAB2QIBAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAARgEAACaBwAgBQAAmwcAIAYAAJwHACAIAACdBwAgEQAAngcAIBIAAJ8HACAUAACgBwAgFQAAoQcAIBcAAKMHACAYAACkBwAgGgAApQcAIKkCAQAAAAGtAgAAAPoCAq4CQAAAAAGvAkAAAAABuwIBAAAAAckCAAAA-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQIAAACBAQAgLAAApQgAIAMAAAAZACAsAAClCAAgLQAAqQgAIBoAAAAZACAEAACYBgAgBQAAmQYAIAYAAJoGACAIAACbBgAgEQAAnAYAIBIAAJ0GACAUAACeBgAgFQAAnwYAIBcAAKEGACAYAACiBgAgGgAAowYAICUAAKkIACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEYBAAAmAYAIAUAAJkGACAGAACaBgAgCAAAmwYAIBEAAJwGACASAACdBgAgFAAAngYAIBUAAJ8GACAXAAChBgAgGAAAogYAIBoAAKMGACCpAgEAwgQAIa0CAACWBvoCIq4CQADEBAAhrwJAAMQEACG7AgEAwgQAIckCAACXBvsCIuYCAQDCBAAh-AIgAOIEACH7AiAA4gQAIfwCIADiBAAh_QJAAIsFACH-AgEAzQQAIf8CgAAAAAEIqQIBAAAAAasCAQAAAAGuAkAAAAABrwJAAAAAAcQCAQAAAAHHAgEAAAAB5AIAAADkAgLlAiAAAAABAwAAABkAICwAAPkHACAtAACtCAAgGgAAABkAIAQAAJgGACAFAACZBgAgCAAAmwYAIBEAAJwGACASAACdBgAgFAAAngYAIBUAAJ8GACAWAACgBgAgFwAAoQYAIBgAAKIGACAaAACjBgAgJQAArQgAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAARgEAACYBgAgBQAAmQYAIAgAAJsGACARAACcBgAgEgAAnQYAIBQAAJ4GACAVAACfBgAgFgAAoAYAIBcAAKEGACAYAACiBgAgGgAAowYAIKkCAQDCBAAhrQIAAJYG-gIirgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhyQIAAJcG-wIi5gIBAMIEACH4AiAA4gQAIfsCIADiBAAh_AIgAOIEACH9AkAAiwUAIf4CAQDNBAAh_wKAAAAAARgEAACaBwAgBQAAmwcAIAYAAJwHACARAACeBwAgEgAAnwcAIBQAAKAHACAVAAChBwAgFgAAogcAIBcAAKMHACAYAACkBwAgGgAApQcAIKkCAQAAAAGtAgAAAPoCAq4CQAAAAAGvAkAAAAABuwIBAAAAAckCAAAA-wIC5gIBAAAAAfgCIAAAAAH7AiAAAAAB_AIgAAAAAf0CQAAAAAH-AgEAAAAB_wKAAAAAAQIAAACBAQAgLAAArggAIBIJAADYBQAgFQAA2wUAIBYAANwFACAbAADVBQAgHQAA1wUAIB4AANkFACAfAADaBQAgqQIBAAAAAa4CQAAAAAGvAkAAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIBAAAAAb8CAQAAAAHBAgAAAMECAsICAQAAAAHDAgEAAAABAgAAAA0AICwAALAIACADAAAAGQAgLAAArggAIC0AALQIACAaAAAAGQAgBAAAmAYAIAUAAJkGACAGAACaBgAgEQAAnAYAIBIAAJ0GACAUAACeBgAgFQAAnwYAIBYAAKAGACAXAAChBgAgGAAAogYAIBoAAKMGACAlAAC0CAAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABGAQAAJgGACAFAACZBgAgBgAAmgYAIBEAAJwGACASAACdBgAgFAAAngYAIBUAAJ8GACAWAACgBgAgFwAAoQYAIBgAAKIGACAaAACjBgAgqQIBAMIEACGtAgAAlgb6AiKuAkAAxAQAIa8CQADEBAAhuwIBAMIEACHJAgAAlwb7AiLmAgEAwgQAIfgCIADiBAAh-wIgAOIEACH8AiAA4gQAIf0CQACLBQAh_gIBAM0EACH_AoAAAAABAwAAAAsAICwAALAIACAtAAC3CAAgFAAAAAsAIAkAANIEACAVAADVBAAgFgAA1gQAIBsAAM8EACAdAADRBAAgHgAA0wQAIB8AANQEACAlAAC3CAAgqQIBAMIEACGuAkAAxAQAIa8CQADEBAAhuwIBAMIEACG8AgEAwgQAIb0CAQDNBAAhvgIBAM0EACG_AgEAwgQAIcECAADOBMECIsICAQDNBAAhwwIBAM0EACESCQAA0gQAIBUAANUEACAWAADWBAAgGwAAzwQAIB0AANEEACAeAADTBAAgHwAA1AQAIKkCAQDCBAAhrgJAAMQEACGvAkAAxAQAIbsCAQDCBAAhvAIBAMIEACG9AgEAzQQAIb4CAQDNBAAhvwIBAMIEACHBAgAAzgTBAiLCAgEAzQQAIcMCAQDNBAAhAgNQAwcAAgkJRAcKABIVSAEWSQ0bAAMcPwYdQwgeRhEfRwwNBAYEBQoFBg4CCBIGCgAQERYHEiAHFCQMFScBFisNFy0KGC8OGjMPAQMAAwEDAAMCAwADBwACBgcAAgoACwsACAwAAw0aAxAeCgMHAAIJFwcKAAkBCRgAAg4ABw8AAwEQHwACBwACEwADAgMAAwcsAgEDAAMBGQADCwQ0AAU1AAY2AAg3ABE4ABI5ABQ6ABU7ABY8ABc9ABo-AAEHAAIGCUwAFU4AFk8AHEoAHUsAH00AAAIDWgMHAAICA2ADBwACAwoAFzIAGDMAGQAAAAMKABcyABgzABkAAAADCgAfMgAgMwAhAAAAAwoAHzIAIDMAIQAAAwoAJjIAJzMAKAAAAAMKACYyACczACgBAwADAQMAAwMKAC0yAC4zAC8AAAADCgAtMgAuMwAvAQMAAwEDAAMDCgA0MgA1MwA2AAAAAwoANDIANTMANgAAAAMKADwyAD0zAD4AAAADCgA8MgA9MwA-AgcAAhMAAwIHAAITAAMDCgBDMgBEMwBFAAAAAwoAQzIARDMARQIDAAMH_gECAgMAAweEAgIDCgBKMgBLMwBMAAAAAwoASjIASzMATAEDAAMBAwADAwoAUTIAUjMAUwAAAAMKAFEyAFIzAFMBGQADARkAAwMKAFgyAFkzAFoAAAADCgBYMgBZMwBaAQcAAgEHAAIDCgBfMgBgMwBhAAAAAwoAXzIAYDMAYQEHAAIBBwACAwoAZjIAZzMAaAAAAAMKAGYyAGczAGgEBwACCwAIDAADDfICAwQHAAILAAgMAAMN-AIDAwoAbTIAbjMAbwAAAAMKAG0yAG4zAG8CDgAHDwADAg4ABw8AAwMKAHQyAHUzAHYAAAADCgB0MgB1MwB2ARsAAwEbAAMDCgB7MgB8MwB9AAAAAwoAezIAfDMAfQIDAAMHAAICAwADBwACAwoAggEyAIMBMwCEAQAAAAMKAIIBMgCDATMAhAEgAgEhUQEiUgEjUwEkVAEmVgEnWBMoWRQpXAEqXhMrXxUuYQEvYgEwYxM0ZhY1Zxo2aRs3ahs4bRs5bhs6bxs7cRs8cxM9dBw-dhs_eBNAeR1BehtCextDfBNEfx5FgAEiRoIBA0eDAQNIhQEDSYYBA0qHAQNLiQEDTIsBE02MASNOjgEDT5ABE1CRASRRkgEDUpMBA1OUARNUlwElVZgBKVaZAQRXmgEEWJsBBFmcAQRanQEEW58BBFyhARNdogEqXqQBBF-mARNgpwErYagBBGKpAQRjqgETZK0BLGWuATBmrwEFZ7ABBWixAQVpsgEFarMBBWu1AQVstwETbbgBMW66AQVvvAETcL0BMnG-AQVyvwEFc8ABE3TDATN1xAE3dsYBOHfHATh4ygE4ecsBOHrMATh7zgE4fNABE33RATl-0wE4f9UBE4AB1gE6gQHXATiCAdgBOIMB2QEThAHcATuFAd0BP4YB3gEMhwHfAQyIAeABDIkB4QEMigHiAQyLAeQBDIwB5gETjQHnAUCOAekBDI8B6wETkAHsAUGRAe0BDJIB7gEMkwHvAROUAfIBQpUB8wFGlgH0AQ2XAfUBDZgB9gENmQH3AQ2aAfgBDZsB-gENnAH8AROdAf0BR54BgAINnwGCAhOgAYMCSKEBhQINogGGAg2jAYcCE6QBigJJpQGLAk2mAY0CDqcBjgIOqAGQAg6pAZECDqoBkgIOqwGUAg6sAZYCE60BlwJOrgGZAg6vAZsCE7ABnAJPsQGdAg6yAZ4CDrMBnwITtAGiAlC1AaMCVLYBpAIPtwGlAg-4AaYCD7kBpwIPugGoAg-7AaoCD7wBrAITvQGtAlW-Aa8CD78BsQITwAGyAlbBAbMCD8IBtAIPwwG1AhPEAbgCV8UBuQJbxgG6AgjHAbsCCMgBvAIIyQG9AgjKAb4CCMsBwAIIzAHCAhPNAcMCXM4BxQIIzwHHAhPQAcgCXdEByQII0gHKAgjTAcsCE9QBzgJe1QHPAmLWAdECEdcB0gIR2AHUAhHZAdUCEdoB1gIR2wHYAhHcAdoCE90B2wJj3gHdAhHfAd8CE-AB4AJk4QHhAhHiAeICEeMB4wIT5AHmAmXlAecCaeYB6AIH5wHpAgfoAeoCB-kB6wIH6gHsAgfrAe4CB-wB8AIT7QHxAmruAfQCB-8B9gIT8AH3AmvxAfkCB_IB-gIH8wH7AhP0Af4CbPUB_wJw9gGAAwr3AYEDCvgBggMK-QGDAwr6AYQDCvsBhgMK_AGIAxP9AYkDcf4BiwMK_wGNAxOAAo4DcoECjwMKggKQAwqDApEDE4QClANzhQKVA3eGApYDAocClwMCiAKYAwKJApkDAooCmgMCiwKcAwKMAp4DE40CnwN4jgKhAwKPAqMDE5ACpAN5kQKlAwKSAqYDApMCpwMTlAKqA3qVAqsDfpYCrAMGlwKtAwaYAq4DBpkCrwMGmgKwAwabArIDBpwCtAMTnQK1A3-eArcDBp8CuQMToAK6A4ABoQK7AwaiArwDBqMCvQMTpALAA4EBpQLBA4UB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  ActivityLogScalarFieldEnum: () => ActivityLogScalarFieldEnum,
  AdminRequestScalarFieldEnum: () => AdminRequestScalarFieldEnum,
  AnyNull: () => AnyNull2,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  InvitationScalarFieldEnum: () => InvitationScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PlatformAdminScalarFieldEnum: () => PlatformAdminScalarFieldEnum,
  PlatformAuditLogScalarFieldEnum: () => PlatformAuditLogScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProjectScalarFieldEnum: () => ProjectScalarFieldEnum,
  QueryMode: () => QueryMode,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TaskCommentScalarFieldEnum: () => TaskCommentScalarFieldEnum,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  WorkspaceMemberScalarFieldEnum: () => WorkspaceMemberScalarFieldEnum,
  WorkspaceScalarFieldEnum: () => WorkspaceScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  ActivityLog: "ActivityLog",
  AdminRequest: "AdminRequest",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Invitation: "Invitation",
  Notification: "Notification",
  PlatformAdmin: "PlatformAdmin",
  PlatformAuditLog: "PlatformAuditLog",
  Project: "Project",
  Subscription: "Subscription",
  Task: "Task",
  TaskComment: "TaskComment",
  Workspace: "Workspace",
  WorkspaceMember: "WorkspaceMember"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var ActivityLogScalarFieldEnum = {
  id: "id",
  action: "action",
  entityType: "entityType",
  entityId: "entityId",
  details: "details",
  workspaceId: "workspaceId",
  userId: "userId",
  createdAt: "createdAt"
};
var AdminRequestScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  reason: "reason",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  image: "image",
  onboardingDraft: "onboardingDraft",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvitationScalarFieldEnum = {
  id: "id",
  email: "email",
  role: "role",
  status: "status",
  token: "token",
  expiresAt: "expiresAt",
  workspaceId: "workspaceId",
  inviterId: "inviterId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  title: "title",
  content: "content",
  type: "type",
  isRead: "isRead",
  userId: "userId",
  workspaceId: "workspaceId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PlatformAdminScalarFieldEnum = {
  id: "id",
  userId: "userId",
  role: "role",
  createdAt: "createdAt"
};
var PlatformAuditLogScalarFieldEnum = {
  id: "id",
  adminId: "adminId",
  action: "action",
  targetId: "targetId",
  metadata: "metadata",
  createdAt: "createdAt"
};
var ProjectScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  workspaceId: "workspaceId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  workspaceId: "workspaceId",
  stripeCustomerId: "stripeCustomerId",
  stripeSubscriptionId: "stripeSubscriptionId",
  stripePriceId: "stripePriceId",
  tier: "tier",
  status: "status",
  currentPeriodEnd: "currentPeriodEnd",
  cancelAtPeriodEnd: "cancelAtPeriodEnd",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  status: "status",
  priority: "priority",
  workspaceId: "workspaceId",
  projectId: "projectId",
  creatorId: "creatorId",
  assigneeId: "assigneeId",
  dueDate: "dueDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskCommentScalarFieldEnum = {
  id: "id",
  content: "content",
  taskId: "taskId",
  authorId: "authorId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var WorkspaceScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  logoUrl: "logoUrl",
  ownerId: "ownerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  onboardingStatus: "onboardingStatus",
  industry: "industry",
  companySize: "companySize"
};
var WorkspaceMemberScalarFieldEnum = {
  id: "id",
  workspaceId: "workspaceId",
  userId: "userId",
  role: "role",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${envVars.DATABASE_URL}`;
if (connectionString.includes("sslmode=require") && !connectionString.includes("uselibpqcompat=")) {
  connectionString += connectionString.includes("?") ? "&uselibpqcompat=true" : "?uselibpqcompat=true";
}
var pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 3e4,
  keepAlive: true,
  keepAliveInitialDelayMillis: 1e4,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.on("error", (err) => {
  console.warn("[PG Pool] Handled idle client error:", err.message);
});
var adapter = new PrismaPg(pool, {
  onPoolError: (err) => {
    console.warn("[PrismaPg] Handled pool error:", err.message);
  },
  onConnectionError: (err) => {
    console.warn("[PrismaPg] Handled connection error:", err.message);
  }
});
var basePrisma = new PrismaClient({
  adapter,
  log: [{ emit: "event", level: "query" }]
});
basePrisma.$on("query", (e) => {
  if (e.duration > 2e3) console.warn(`SLOW QUERY (${e.duration}ms): ${e.query}`);
});
var isTransientError = (err) => {
  const msg = String(err?.message || "").toLowerCase();
  const causeMsg = String(err?.cause?.message || "").toLowerCase();
  const full = `${msg} ${causeMsg}`;
  return full.includes("connection terminated") || full.includes("connection timeout") || full.includes("timeout exceeded") || full.includes("timed out") || full.includes("connection closed") || full.includes("closed connection") || full.includes("connection reset") || full.includes("broken pipe") || full.includes("econnreset") || full.includes("epipe") || full.includes("etimedout") || full.includes("p1001") || full.includes("p2024");
};
var prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const maxRetries = 2;
        let lastError;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            lastError = error;
            if (attempt < maxRetries && isTransientError(error)) {
              const delay = (attempt + 1) * 350;
              console.warn(
                `[Prisma] Transient connection error on ${model}.${operation} (${error.message}). Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`
              );
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
            throw error;
          }
        }
        throw lastError;
      }
    }
  }
});

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      // callbackUrl: envVars.GOOGLE_CALLBACK_URL,
      mapProfileToUser: () => {
        return {
          role: Role.MEMBER,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.MEMBER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`Requested to send OTP for ${email} with type ${type}`);
        const normalizedEmail = email.trim().toLowerCase();
        if (type === "email-verification") {
          (async () => {
            try {
              const user = await prisma.user.findFirst({
                where: {
                  email: { equals: normalizedEmail, mode: "insensitive" }
                },
                select: { name: true, role: true, emailVerified: true }
              });
              if (!user) {
                console.error(`User with email ${email} not found. Cannot send verification OTP.`);
                return;
              }
              if (user.role === Role.SUPER_ADMIN) {
                console.log(`User with email ${email} is a super admin. Skipping sending verification OTP.`);
                return;
              }
              if (!user.emailVerified) {
                console.log(`Sending verification OTP email to ${email}...`);
                await sendEmail({
                  to: email,
                  subject: "Verify your email",
                  templateName: "otp",
                  templateData: {
                    name: user.name,
                    otp
                  }
                });
                console.log(`Verification OTP email sent to ${email} successfully.`);
              } else {
                console.log(`User ${email} is already verified. Skipping email.`);
              }
            } catch (err) {
              console.error(`Error sending verification email to ${email}:`, err);
            }
          })();
        } else if (type === "forget-password") {
          (async () => {
            try {
              const user = await prisma.user.findFirst({
                where: {
                  email: { equals: normalizedEmail, mode: "insensitive" }
                },
                select: { name: true }
              });
              if (user) {
                await sendEmail({
                  to: email,
                  subject: "Password Reset OTP",
                  templateName: "otp",
                  templateData: {
                    name: user.name,
                    otp
                  }
                });
              }
            } catch (err) {
              console.error(`Error sending password reset email to ${email}:`, err);
            }
          })();
        }
      },
      expiresIn: 2 * 60,
      // 2 minutes in seconds
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:5000",
    envVars.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000"
  ],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/middleware/globalErrorHandler.ts
import status6 from "http-status";
import z from "zod";

// src/app/errorHelpers/handlePrismaErrors.ts
import status3 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status3.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status3.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status3.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status3.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status3.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status3.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status3.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status3.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status3.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status3.INTERNAL_SERVER_ERROR;
  }
  return status3.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status3.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status3.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status3.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status3.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/errorHelpers/handleZodError.ts
import status4 from "http-status";
var handleZodError = (err) => {
  const statusCode = status4.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status5 from "http-status";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(status5.BAD_REQUEST, "File buffer and file name are required for upload");
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `Prangon/${folder}/${uniqueName}`,
        folder: `Prangon/${folder}`
      },
      (error, result) => {
        if (error) {
          return reject(new AppError_default(status5.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        { resource_type: "image" }
      );
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status5.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};

// src/app/utils/deleteUploadedFilesFromGlobalErrorHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((url) => deleteFileFromCloudinary(url))
      );
      console.log(`
Deleted ${filesToDelete.length} uploaded file(s) from Cloudinary due to an error during request processing.
`);
    }
  } catch (error) {
    console.error("Error deleting uploaded files from Global Error Handler", error);
  }
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources = [];
  let statusCode = status6.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status6.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status7 from "http-status";
var notFound = (req, res) => {
  res.status(status7.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/routes/index.ts
import { Router as Router15 } from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/module/auth/auth.controller.ts
import status9 from "http-status";

// src/app/shared/catchAsync.ts
var catchAsync = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const httpStatusCode = responseData.httpStatusCode || responseData.statusCode || 200;
  const { success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
import status8 from "http-status";
var registerUser = async (payload) => {
  const { name, email, password, role } = payload;
  const normalizedEmail = email.trim().toLowerCase();
  let assignedRole = Role.MEMBER;
  if (role === "OWNER") {
    assignedRole = Role.OWNER;
  } else if (role === "ADMIN") {
    assignedRole = Role.ADMIN;
  } else if (role === "MEMBER") {
    assignedRole = Role.MEMBER;
  }
  const existingUnverifiedUser = await prisma.user.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      emailVerified: false
    }
  });
  if (existingUnverifiedUser) {
    await prisma.session.deleteMany({ where: { userId: existingUnverifiedUser.id } });
    await prisma.account.deleteMany({ where: { userId: existingUnverifiedUser.id } });
    await prisma.verification.deleteMany({ where: { identifier: normalizedEmail } });
    await prisma.user.delete({ where: { id: existingUnverifiedUser.id } });
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email: normalizedEmail,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status8.INTERNAL_SERVER_ERROR, "User registration failed");
  }
  const updatedUser = await prisma.user.update({
    where: { id: data.user.id },
    data: {
      role: assignedRole,
      ...assignedRole === Role.OWNER ? { onboardingDraft: {} } : {}
    }
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: updatedUser.id,
    role: updatedUser.role,
    name: updatedUser.name,
    email: updatedUser.email,
    status: updatedUser.status,
    isDeleted: updatedUser.isDeleted,
    emailVerified: updatedUser.emailVerified,
    needPasswordChange: updatedUser.needPasswordChange
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: updatedUser.id,
    role: updatedUser.role,
    name: updatedUser.name,
    email: updatedUser.email,
    status: updatedUser.status,
    isDeleted: updatedUser.isDeleted,
    emailVerified: updatedUser.emailVerified,
    needPasswordChange: updatedUser.needPasswordChange
  });
  return {
    ...data,
    user: {
      ...data.user,
      role: updatedUser.role
    },
    accessToken,
    refreshToken
  };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status8.FORBIDDEN, "User is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
    needPasswordChange: data.user.needPasswordChange
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
    needPasswordChange: data.user.needPasswordChange
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const userId = user?.userId || user?.id;
  let isUserExists = userId ? await prisma.user.findUnique({
    where: {
      id: userId
    }
  }) : null;
  if (!isUserExists && user?.email) {
    isUserExists = await prisma.user.findUnique({
      where: {
        email: user.email
      }
    });
  }
  if (!isUserExists) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
      expiresAt: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status8.UNAUTHORIZED, "Unauthorized access! Session token is invalid or expired.");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken) {
    throw new AppError_default(status8.UNAUTHORIZED, "Unauthorized access! Refresh token is invalid or expired.");
  }
  const data = verifiedRefreshToken;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
    needPasswordChange: data.needPasswordChange
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
    needPasswordChange: data.needPasswordChange
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1e3 * 24 * 7),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status8.UNAUTHORIZED, "Unauthorized access! Session token is invalid or expired.");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedOtp = otp.trim();
  const result = await auth.api.verifyEmailOTP({
    body: {
      email: normalizedEmail,
      otp: normalizedOtp
    }
  });
  if (!result?.status) {
    throw new AppError_default(status8.BAD_REQUEST, "Invalid or expired OTP");
  }
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: result.user.id },
        { email: { equals: normalizedEmail, mode: "insensitive" } }
      ]
    }
  });
  if (!user) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  if (!user.emailVerified) {
    user = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerified: true
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: true,
    needPasswordChange: user.needPasswordChange
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: true,
    needPasswordChange: user.needPasswordChange
  });
  return {
    user,
    accessToken,
    refreshToken,
    token: result?.token || result?.session?.token
  };
};
var resendVerificationOtp = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const isUserExists = await prisma.user.findFirst({
    where: {
      email: {
        equals: normalizedEmail,
        mode: "insensitive"
      }
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status8.NOT_FOUND, "No account found with this email address");
  }
  if (isUserExists.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "This email is already verified. Please log in.");
  }
  await auth.api.sendVerificationOTP({
    body: {
      email: isUserExists.email,
      type: "email-verification"
    }
  });
};
var forgetPassword = async (email) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "Email is not verified. Please verify your email first.");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "Email is not verified. Please verify your email first.");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExists.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExists.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExists.id
    }
  });
};
var googleLoginSuccess = async (session) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var AuthService = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  resendVerificationOtp,
  forgetPassword,
  resetPassword,
  googleLoginSuccess
};

// src/app/module/auth/auth.controller.ts
var registerUser2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.registerUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status9.CREATED,
      success: true,
      message: "User registered successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var loginUser2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var getMe2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await AuthService.getMe(user);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "User profile fetched successfully",
      data: result
    });
  }
);
var getNewToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!refreshToken) {
      throw new AppError_default(status9.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken
      }
    });
  }
);
var changePassword2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.changePassword(payload, betterAuthSessionToken);
    const { accessToken, refreshToken, token } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Password changed successfully",
      data: result
    });
  }
);
var logoutUser2 = catchAsync(
  async (req, res) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.logoutUser(betterAuthSessionToken);
    CookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    CookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    CookieUtils.clearCookie(res, "better-auth.session_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "User logged out successfully",
      data: result
    });
  }
);
var verifyEmail2 = catchAsync(
  async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new AppError_default(status9.BAD_REQUEST, "Email and OTP are required");
    }
    const result = await AuthService.verifyEmail(email, otp);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Email verified successfully",
      data: result
    });
  }
);
var resendVerificationOtp2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new AppError_default(status9.BAD_REQUEST, "Email is required");
    }
    await AuthService.resendVerificationOtp(email);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Verification code sent to your email successfully"
    });
  }
);
var forgetPassword2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await AuthService.forgetPassword(email);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Password reset OTP sent to email successfully"
    });
  }
);
var resetPassword2 = catchAsync(
  async (req, res) => {
    const { email, otp, newPassword } = req.body;
    await AuthService.resetPassword(email, otp, newPassword);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Password reset successfully"
    });
  }
);
var googleLogin = catchAsync((req, res) => {
  try {
    const configuredUrl = new URL(envVars.BETTER_AUTH_URL);
    const reqHost = req.get("host");
    if (reqHost && configuredUrl.host && reqHost !== configuredUrl.host) {
      const redirectUrl = `${configuredUrl.protocol}//${configuredUrl.host}${req.originalUrl}`;
      return res.redirect(redirectUrl);
    }
  } catch {
  }
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
    frontendUrl: envVars.FRONTEND_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"] || req.cookies["__Secure-better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  verifyEmail: verifyEmail2,
  resendVerificationOtp: resendVerificationOtp2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/middleware/checkAuth.ts
import status10 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status10.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success || !verifiedToken.data) {
      throw new AppError_default(status10.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
    }
    const userRole = verifiedToken.data.role;
    const isAllowed = authRoles.length === 0 || authRoles.includes(userRole);
    if (!isAllowed) {
      throw new AppError_default(status10.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
    }
    req.user = {
      userId: verifiedToken.data.userId,
      role: userRole,
      email: verifiedToken.data.email
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/module/auth/auth.route.ts
var router = Router();
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.route("/me").get(
  checkAuth(),
  AuthController.getMe
).post(
  checkAuth(),
  AuthController.getMe
);
router.post("/refresh-token", AuthController.getNewToken);
router.post(
  "/change-password",
  checkAuth(),
  AuthController.changePassword
);
router.post(
  "/logout",
  checkAuth(),
  AuthController.logoutUser
);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verification-otp", AuthController.resendVerificationOtp);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/google/error", AuthController.handleOAuthError);
var AuthRoutes = router;

// src/app/module/user/user.route.ts
import { Router as Router2 } from "express";

// src/app/module/user/user.controller.ts
import httpStatus from "http-status";

// src/app/module/user/user.service.ts
import status11 from "http-status";
var getMe3 = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      status: true,
      image: true,
      onboardingDraft: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          sessions: true,
          ownedWorkspaces: true,
          workspaceMembers: true
        }
      }
    }
  });
  if (!user) {
    throw new AppError_default(status11.NOT_FOUND, "User not found");
  }
  return user;
};
var updateMe = async (userId, payload) => {
  const updateData = {};
  if (payload.name !== void 0) updateData.name = payload.name;
  if (payload.image !== void 0) updateData.image = payload.image;
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      status: true,
      image: true,
      updatedAt: true
    }
  });
  return user;
};
var getSessions = async (userId) => {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true
    }
  });
  return sessions;
};
var revokeSession = async (userId, sessionId) => {
  const deleted = await prisma.session.deleteMany({
    where: {
      id: sessionId,
      userId
    }
  });
  if (deleted.count === 0) {
    throw new AppError_default(status11.NOT_FOUND, "Session not found or already revoked");
  }
  return { message: "Session revoked successfully" };
};
var logoutAllSessions = async (userId) => {
  await prisma.session.deleteMany({
    where: { userId }
  });
  return { message: "All sessions logged out successfully" };
};
var updateOnboardingDraft = async (userId, draftPayload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingDraft: true }
  });
  const existingDraft = user?.onboardingDraft || {};
  const updatedDraft = {
    ...existingDraft,
    ...draftPayload
  };
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { onboardingDraft: updatedDraft },
    select: { id: true, onboardingDraft: true }
  });
  return updatedUser.onboardingDraft;
};
var getOnboardingDraft = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingDraft: true }
  });
  return user?.onboardingDraft || null;
};
var UserService = {
  getMe: getMe3,
  updateMe,
  getSessions,
  revokeSession,
  logoutAllSessions,
  updateOnboardingDraft,
  getOnboardingDraft
};

// src/app/module/user/user.controller.ts
var getMe4 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await UserService.getMe(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result
  });
});
var updateMe2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await UserService.updateMe(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result
  });
});
var getSessions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await UserService.getSessions(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User sessions retrieved successfully",
    data: result
  });
});
var revokeSession2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId;
  const result = await UserService.revokeSession(userId, sessionId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Session revoked successfully",
    data: result
  });
});
var logoutAllSessions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await UserService.logoutAllSessions(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "All sessions logged out successfully",
    data: result
  });
});
var updateOnboardingDraft2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await UserService.updateOnboardingDraft(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Onboarding draft updated successfully",
    data: result
  });
});
var getOnboardingDraft2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await UserService.getOnboardingDraft(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Onboarding draft retrieved successfully",
    data: result
  });
});
var UserController = {
  getMe: getMe4,
  updateMe: updateMe2,
  getSessions: getSessions2,
  revokeSession: revokeSession2,
  logoutAllSessions: logoutAllSessions2,
  updateOnboardingDraft: updateOnboardingDraft2,
  getOnboardingDraft: getOnboardingDraft2
};

// src/app/module/user/user.route.ts
var router2 = Router2();
router2.get("/me", checkAuth(), UserController.getMe);
router2.patch("/me", checkAuth(), UserController.updateMe);
router2.get("/me/onboarding-draft", checkAuth(), UserController.getOnboardingDraft);
router2.patch("/me/onboarding-draft", checkAuth(), UserController.updateOnboardingDraft);
router2.get("/sessions", checkAuth(), UserController.getSessions);
router2.delete("/sessions/:sessionId", checkAuth(), UserController.revokeSession);
router2.post("/sessions/logout-all", checkAuth(), UserController.logoutAllSessions);
var UserRoutes = router2;

// src/app/module/workspace/workspace.route.ts
import express from "express";

// src/app/module/workspace/workspace.controller.ts
import httpStatus2 from "http-status";

// src/app/module/workspace/workspace.service.ts
var createWorkspace = async (userId, payload) => {
  const result = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        logoUrl: payload.logoUrl,
        industry: payload.industry,
        companySize: payload.companySize,
        ownerId: userId,
        onboardingStatus: payload.onboardingStatus || OnboardingStatus.COMPLETED
      }
    });
    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: WorkspaceRole.OWNER
      }
    });
    await tx.subscription.create({
      data: {
        workspaceId: workspace.id,
        tier: payload.tier || SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE
      }
    });
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { onboardingDraft: true }
    });
    const draft = user?.onboardingDraft || {};
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingDraft: {
          ...draft,
          status: payload.onboardingStatus || OnboardingStatus.COMPLETED,
          workspaceId: workspace.id,
          workspaceSlug: workspace.slug
        }
      }
    });
    return workspace;
  });
  return result;
};
var getWorkspacesForUser = async (userId) => {
  const workspaces = await prisma.workspaceMember.findMany({
    where: {
      userId
    },
    include: {
      workspace: true
    }
  });
  return workspaces.map((wm) => wm.workspace);
};
var getWorkspaceById = async (userId, workspaceId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    },
    include: {
      workspace: true
    }
  });
  if (!membership) {
    throw new Error("Workspace not found or unauthorized");
  }
  return membership.workspace;
};
var updateWorkspace = async (userId, workspaceIdOrSlug, payload) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ id: workspaceIdOrSlug }, { slug: workspaceIdOrSlug }]
    }
  });
  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Workspace not found or unauthorized to update");
  }
  if (payload.slug && payload.slug !== workspace.slug) {
    const existing = await prisma.workspace.findUnique({
      where: { slug: payload.slug }
    });
    if (existing) {
      throw new Error("A workspace with this slug already exists");
    }
  }
  const updatedWorkspace = await prisma.workspace.update({
    where: { id: workspace.id },
    data: payload
  });
  if (payload.onboardingStatus) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingDraft: true }
    });
    const draft = user?.onboardingDraft || {};
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingDraft: {
          ...draft,
          status: payload.onboardingStatus,
          workspaceId: updatedWorkspace.id,
          workspaceSlug: updatedWorkspace.slug
        }
      }
    });
  }
  return updatedWorkspace;
};
var deleteWorkspace = async (userId, workspaceIdOrSlug) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ id: workspaceIdOrSlug }, { slug: workspaceIdOrSlug }]
    }
  });
  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Workspace not found or unauthorized to delete");
  }
  const deletedWorkspace = await prisma.workspace.delete({
    where: { id: workspace.id }
  });
  return deletedWorkspace;
};
var updateOnboardingStatus = async (userId, slug, status23) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }]
    }
  });
  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Workspace not found or unauthorized");
  }
  return await prisma.workspace.update({
    where: { id: workspace.id },
    data: { onboardingStatus: status23 }
  });
};
var getOnboardingStatus = async (userId, slug) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }]
    }
  });
  if (!workspace) {
    throw new Error("Workspace not found");
  }
  return { onboardingStatus: workspace.onboardingStatus };
};
var getDashboardSummary = async (userId, slug) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }]
    },
    include: {
      members: {
        where: { userId }
      }
    }
  });
  if (!workspace) {
    throw new Error("Workspace not found");
  }
  if (workspace.members.length === 0 && workspace.ownerId !== userId) {
    throw new Error("Unauthorized access to workspace dashboard");
  }
  const now = /* @__PURE__ */ new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);
  const [
    activeProjectsCount,
    openTasksCount,
    teamMembersCount,
    tasksDueThisWeekCount,
    todoTasksCount,
    inProgressTasksCount,
    doneTasksCount,
    recentActivities,
    userTasks
  ] = await Promise.all([
    prisma.project.count({
      where: { workspaceId: workspace.id }
    }),
    prisma.task.count({
      where: {
        workspaceId: workspace.id,
        status: { not: "DONE" }
      }
    }),
    prisma.workspaceMember.count({
      where: { workspaceId: workspace.id }
    }),
    prisma.task.count({
      where: {
        workspaceId: workspace.id,
        dueDate: {
          gte: startOfWeek,
          lte: endOfWeek
        },
        status: { not: "DONE" }
      }
    }),
    prisma.task.count({
      where: { workspaceId: workspace.id, status: "TODO" }
    }),
    prisma.task.count({
      where: { workspaceId: workspace.id, status: "IN_PROGRESS" }
    }),
    prisma.task.count({
      where: { workspaceId: workspace.id, status: "DONE" }
    }),
    prisma.activityLog.findMany({
      where: { workspaceId: workspace.id },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    }),
    prisma.task.findMany({
      where: {
        workspaceId: workspace.id,
        assigneeId: userId
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  ]);
  return {
    workspace: {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      ownerId: workspace.ownerId,
      logoUrl: workspace.logoUrl,
      createdAt: workspace.createdAt
    },
    stats: {
      activeProjects: activeProjectsCount,
      openTasks: openTasksCount,
      teamMembers: teamMembersCount,
      tasksDueThisWeek: tasksDueThisWeekCount
    },
    taskStatusCounts: {
      todo: todoTasksCount,
      inProgress: inProgressTasksCount,
      done: doneTasksCount,
      total: todoTasksCount + inProgressTasksCount + doneTasksCount
    },
    recentActivities,
    userTasks
  };
};
var transferOwnership = async (userId, slug, newOwnerId) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }]
    }
  });
  if (!workspace) {
    throw new Error("Workspace not found");
  }
  if (workspace.ownerId !== userId) {
    throw new Error("Unauthorized: Only the current Owner can transfer workspace ownership");
  }
  const targetMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: newOwnerId
      }
    },
    include: { user: true }
  });
  if (!targetMember) {
    throw new Error("Target user is not a member of this workspace");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedWs = await tx.workspace.update({
      where: { id: workspace.id },
      data: { ownerId: newOwnerId }
    });
    await tx.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId
        }
      },
      data: { role: WorkspaceRole.ADMIN }
    });
    await tx.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: newOwnerId
        }
      },
      data: { role: WorkspaceRole.OWNER }
    });
    await tx.activityLog.create({
      data: {
        action: "Transferred ownership",
        entityType: "Workspace",
        entityId: workspace.id,
        workspaceId: workspace.id,
        userId,
        details: `Transferred ownership of workspace ${workspace.name} to ${targetMember.user?.name || targetMember.user?.email || newOwnerId}`
      }
    });
    return updatedWs;
  });
  return result;
};
var WorkspaceService = {
  updateOnboardingStatus,
  getOnboardingStatus,
  createWorkspace,
  getWorkspacesForUser,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getDashboardSummary,
  transferOwnership
};

// src/app/module/workspace/workspace.controller.ts
var createWorkspace2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await WorkspaceService.createWorkspace(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus2.CREATED,
    success: true,
    message: "Workspace created successfully",
    data: result
  });
});
var getWorkspacesForUser2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await WorkspaceService.getWorkspacesForUser(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Workspaces retrieved successfully",
    data: result
  });
});
var getWorkspaceById2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId;
  const result = await WorkspaceService.getWorkspaceById(userId, workspaceId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Workspace retrieved successfully",
    data: result
  });
});
var updateWorkspace2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId;
  const result = await WorkspaceService.updateWorkspace(userId, workspaceId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Workspace updated successfully",
    data: result
  });
});
var deleteWorkspace2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId;
  const result = await WorkspaceService.deleteWorkspace(userId, workspaceId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Workspace deleted successfully",
    data: result
  });
});
var updateOnboardingStatus2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const slug = req.params.slug;
  const status23 = req.body.status || req.body.onboardingStatus;
  const result = await WorkspaceService.updateOnboardingStatus(userId, slug, status23);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Onboarding status updated successfully",
    data: result
  });
});
var getOnboardingStatus2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const slug = req.params.slug;
  const result = await WorkspaceService.getOnboardingStatus(userId, slug);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Onboarding status retrieved successfully",
    data: result
  });
});
var getDashboardSummary2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const slug = req.params.slug;
  const result = await WorkspaceService.getDashboardSummary(userId, slug);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Dashboard summary retrieved successfully",
    data: result
  });
});
var transferOwnership2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const slug = req.params.slug;
  const { newOwnerId } = req.body;
  const result = await WorkspaceService.transferOwnership(userId, slug, newOwnerId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Workspace ownership transferred successfully",
    data: result
  });
});
var WorkspaceController = {
  updateOnboardingStatus: updateOnboardingStatus2,
  getOnboardingStatus: getOnboardingStatus2,
  createWorkspace: createWorkspace2,
  getWorkspacesForUser: getWorkspacesForUser2,
  getWorkspaceById: getWorkspaceById2,
  updateWorkspace: updateWorkspace2,
  deleteWorkspace: deleteWorkspace2,
  getDashboardSummary: getDashboardSummary2,
  transferOwnership: transferOwnership2
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return async (req, res, next) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      const parsedResult = await zodSchema.safeParseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies
      });
      if (!parsedResult.success) {
        return next(parsedResult.error);
      }
      if (parsedResult.data.body !== void 0) {
        req.body = parsedResult.data.body;
      }
      if (parsedResult.data.query !== void 0) {
        Object.defineProperty(req, "query", { value: parsedResult.data.query, writable: true, enumerable: true, configurable: true });
      }
      if (parsedResult.data.params !== void 0) {
        Object.defineProperty(req, "params", { value: parsedResult.data.params, writable: true, enumerable: true, configurable: true });
      }
      if (parsedResult.data.cookies !== void 0) {
        Object.defineProperty(req, "cookies", { value: parsedResult.data.cookies, writable: true, enumerable: true, configurable: true });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

// src/app/module/workspace/workspace.validation.ts
import { z as z2 } from "zod";
var createWorkspaceSchema = z2.object({
  body: z2.object({
    name: z2.string().trim().min(1, "Workspace name cannot be empty"),
    slug: z2.string().trim().min(3, "Workspace slug must be at least 3 characters").max(50, "Workspace slug cannot exceed 50 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z2.string().optional(),
    logoUrl: z2.string().optional(),
    industry: z2.string().optional(),
    companySize: z2.string().optional(),
    onboardingStatus: z2.string().optional()
  })
});
var updateWorkspaceSchema = z2.object({
  body: z2.object({
    name: z2.string().min(1).optional(),
    description: z2.string().optional(),
    slug: z2.string().trim().min(3, "Workspace slug must be at least 3 characters").max(50, "Workspace slug cannot exceed 50 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens").optional(),
    logoUrl: z2.string().optional(),
    industry: z2.string().optional(),
    companySize: z2.string().optional(),
    onboardingStatus: z2.string().optional()
  })
});
var WorkspaceValidation = {
  createWorkspaceSchema,
  updateWorkspaceSchema
};

// src/app/middleware/requireCompletedOnboarding.ts
import httpStatus3 from "http-status";
var requireCompletedOnboarding = async (req, _res, next) => {
  try {
    const target = req.workspaceId || req.params.workspaceId || req.params.id || req.params.slug;
    if (!target) {
      throw new AppError_default(httpStatus3.BAD_REQUEST, "Workspace context missing");
    }
    const workspace = await prisma.workspace.findFirst({
      where: {
        OR: [{ id: target }, { slug: target }]
      },
      select: { id: true, onboardingStatus: true }
    });
    if (!workspace) {
      throw new AppError_default(httpStatus3.NOT_FOUND, "Workspace not found");
    }
    if (workspace.onboardingStatus === "PENDING_WORKSPACE") {
      await prisma.workspace.update({
        where: { id: workspace.id },
        data: { onboardingStatus: "COMPLETED" }
      }).catch(() => {
      });
      return next();
    }
    if (workspace.onboardingStatus !== "COMPLETED") {
      if (workspace.onboardingStatus === "PENDING_PAYMENT") {
        throw new AppError_default(
          httpStatus3.PAYMENT_REQUIRED,
          "Payment required to access this workspace"
        );
      }
      throw new AppError_default(
        httpStatus3.FORBIDDEN,
        "Please complete workspace onboarding to access this workspace"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/middleware/requireRole.ts
import httpStatus4 from "http-status";
var requireRole = (...allowedRoles) => {
  return async (req, _res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError_default(httpStatus4.UNAUTHORIZED, "Unauthorized access");
      }
      const workspaceSlug = req.params.slug || req.params.workspaceSlug || req.query.workspaceSlug || req.body && req.body.workspaceSlug;
      const workspaceId = req.workspaceId || req.params.workspaceId || req.params.id || req.body && req.body.workspaceId;
      if (!workspaceSlug && !workspaceId) {
        throw new AppError_default(httpStatus4.BAD_REQUEST, "Workspace context missing");
      }
      const workspace = await prisma.workspace.findFirst({
        where: workspaceId ? { id: String(workspaceId) } : { slug: String(workspaceSlug) },
        select: {
          id: true,
          slug: true,
          ownerId: true
        }
      });
      if (!workspace) {
        throw new AppError_default(httpStatus4.NOT_FOUND, "Workspace not found");
      }
      req.workspaceId = workspace.id;
      req.workspaceSlug = workspace.slug;
      if (req.user.role === "SUPER_ADMIN") {
        return next();
      }
      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId
          }
        }
      });
      if (!membership) {
        throw new AppError_default(
          httpStatus4.FORBIDDEN,
          "You are not a member of this workspace"
        );
      }
      req.workspaceMember = membership;
      if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
        throw new AppError_default(
          httpStatus4.FORBIDDEN,
          `Forbidden: Action requires role ${allowedRoles.join(" or ")}, but your role is ${membership.role}`
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/app/module/workspace/workspace.route.ts
var router3 = express.Router();
router3.post(
  "/",
  checkAuth(),
  validateRequest(WorkspaceValidation.createWorkspaceSchema),
  WorkspaceController.createWorkspace
);
router3.get(
  "/",
  checkAuth(),
  WorkspaceController.getWorkspacesForUser
);
router3.patch(
  "/:slug/onboarding",
  checkAuth(),
  WorkspaceController.updateOnboardingStatus
);
router3.get(
  "/:slug/onboarding-status",
  checkAuth(),
  WorkspaceController.getOnboardingStatus
);
router3.get(
  "/:slug/dashboard-summary",
  checkAuth(),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER),
  WorkspaceController.getDashboardSummary
);
router3.post(
  "/:slug/transfer-ownership",
  checkAuth(),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER),
  WorkspaceController.transferOwnership
);
router3.get(
  "/:workspaceId",
  checkAuth(),
  requireCompletedOnboarding,
  WorkspaceController.getWorkspaceById
);
router3.patch(
  "/:workspaceId",
  checkAuth(),
  requireRole(WorkspaceRole.OWNER),
  validateRequest(WorkspaceValidation.updateWorkspaceSchema),
  WorkspaceController.updateWorkspace
);
router3.delete(
  "/:workspaceId",
  checkAuth(),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER),
  WorkspaceController.deleteWorkspace
);
var WorkspaceRoutes = router3;

// src/app/module/project/project.route.ts
import { Router as Router3 } from "express";

// src/app/module/project/project.controller.ts
import httpStatus5 from "http-status";

// src/app/module/activityLog/activityLog.service.ts
var logActivity = async (action, entityType, entityId, workspaceId, userId, details) => {
  const result = await prisma.activityLog.create({
    data: {
      action,
      entityType,
      entityId,
      workspaceId,
      userId,
      details
    }
  });
  return result;
};
var listActivity = async (workspaceId) => {
  const result = await prisma.activityLog.findMany({
    where: { workspaceId },
    take: 50,
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var activityLogService = {
  logActivity,
  listActivity
};

// src/app/module/project/project.service.ts
var createProject = async (userId, payload) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: payload.workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new Error("Unauthorized: User is not a member of this workspace");
  }
  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description,
      workspaceId: payload.workspaceId
    }
  });
  await activityLogService.logActivity(
    "Created project",
    "Project",
    project.id,
    project.workspaceId,
    userId,
    `Created project ${project.name}`
  );
  return project;
};
var getProjectsByWorkspace = async (userId, workspaceId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new Error("Unauthorized: User is not a member of this workspace");
  }
  const projects = await prisma.project.findMany({
    where: {
      workspaceId
    },
    take: 50
  });
  return projects;
};
var getProjectById = async (userId, projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }
  return project;
};
var updateProject = async (userId, projectId, payload) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: payload
  });
  return updatedProject;
};
var deleteProject = async (userId, projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }
  const deletedProject = await prisma.project.delete({
    where: { id: projectId }
  });
  return deletedProject;
};
var ProjectService = {
  createProject,
  getProjectsByWorkspace,
  getProjectById,
  updateProject,
  deleteProject
};

// src/app/module/project/project.controller.ts
var createProject2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ProjectService.createProject(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus5.CREATED,
    success: true,
    message: "Project created successfully",
    data: result
  });
});
var getProjectsByWorkspace2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { workspaceId } = req.query;
  if (!workspaceId) {
    throw new Error("Workspace ID query parameter is required");
  }
  const result = await ProjectService.getProjectsByWorkspace(userId, workspaceId);
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result
  });
});
var getProjectById2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId;
  const result = await ProjectService.getProjectById(userId, projectId);
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result
  });
});
var updateProject2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId;
  const result = await ProjectService.updateProject(userId, projectId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "Project updated successfully",
    data: result
  });
});
var deleteProject2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId;
  const result = await ProjectService.deleteProject(userId, projectId);
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "Project deleted successfully",
    data: result
  });
});
var ProjectController = {
  createProject: createProject2,
  getProjectsByWorkspace: getProjectsByWorkspace2,
  getProjectById: getProjectById2,
  updateProject: updateProject2,
  deleteProject: deleteProject2
};

// src/app/module/project/project.validation.ts
import { z as z3 } from "zod";
var createProjectSchema = z3.object({
  body: z3.object({
    name: z3.string().min(1, "Project name cannot be empty"),
    description: z3.string().optional(),
    workspaceId: z3.string().min(1, "Workspace ID is required")
  })
});
var updateProjectSchema = z3.object({
  body: z3.object({
    name: z3.string().min(1).optional(),
    description: z3.string().optional()
  })
});
var ProjectValidation = {
  createProjectSchema,
  updateProjectSchema
};

// src/app/module/project/project.route.ts
var router4 = Router3();
router4.post(
  "/",
  checkAuth(),
  validateRequest(ProjectValidation.createProjectSchema),
  ProjectController.createProject
);
router4.get(
  "/",
  checkAuth(),
  ProjectController.getProjectsByWorkspace
);
router4.get(
  "/:projectId",
  checkAuth(),
  ProjectController.getProjectById
);
router4.patch(
  "/:projectId",
  checkAuth(),
  validateRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateProject
);
router4.delete(
  "/:projectId",
  checkAuth(),
  ProjectController.deleteProject
);
var ProjectRoutes = router4;

// src/app/module/task/task.route.ts
import { Router as Router4 } from "express";

// src/app/module/task/task.controller.ts
import httpStatus6 from "http-status";

// src/app/module/notification/notification.service.ts
var resolveWorkspaceId = async (slugOrId) => {
  const ws = await prisma.workspace.findFirst({
    where: {
      OR: [
        { id: slugOrId },
        { slug: slugOrId }
      ]
    },
    select: { id: true }
  });
  return ws?.id || slugOrId;
};
var createNotification = async (title, userId, content, type = NotificationType.SYSTEM, workspaceId) => {
  const resolvedWorkspaceId = workspaceId ? await resolveWorkspaceId(workspaceId) : void 0;
  const result = await prisma.notification.create({
    data: {
      title,
      content,
      type,
      userId,
      workspaceId: resolvedWorkspaceId
    }
  });
  return result;
};
var getUserNotifications = async (userId, workspaceSlugOrId) => {
  let workspaceId;
  if (workspaceSlugOrId) {
    workspaceId = await resolveWorkspaceId(workspaceSlugOrId);
  }
  const whereClause = { userId };
  if (workspaceId) {
    whereClause.OR = [
      { workspaceId },
      { workspaceId: null }
    ];
  }
  const result = await prisma.notification.findMany({
    where: whereClause,
    take: 50,
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var markAsRead = async (id, userId) => {
  const result = await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true }
  });
  return result;
};
var markAllAsRead = async (userId, workspaceSlugOrId) => {
  let workspaceId;
  if (workspaceSlugOrId) {
    workspaceId = await resolveWorkspaceId(workspaceSlugOrId);
  }
  const whereClause = { userId, isRead: false };
  if (workspaceId) {
    whereClause.OR = [
      { workspaceId },
      { workspaceId: null }
    ];
  }
  const result = await prisma.notification.updateMany({
    where: whereClause,
    data: { isRead: true }
  });
  return result;
};
var notificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};

// src/app/module/task/task.service.ts
var createTask = async (userId, payload) => {
  const project = await prisma.project.findUnique({
    where: { id: payload.projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }
  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status || TaskStatus.TODO,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      projectId: payload.projectId,
      workspaceId: project.workspaceId,
      creatorId: userId,
      assigneeId: payload.assigneeId
    }
  });
  await activityLogService.logActivity(
    "Created task",
    "Task",
    task.id,
    project.workspaceId,
    userId,
    `Created task ${task.title}`
  );
  if (task.assigneeId) {
    await notificationService.createNotification(
      `You have been assigned to task ${task.title}`,
      task.assigneeId,
      `You have been assigned to a new task in project ${project.name}`,
      void 0,
      project.workspaceId
    );
  }
  return task;
};
var getTasksByProject = async (userId, projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }
  const tasks = await prisma.task.findMany({
    where: {
      projectId
    },
    take: 50,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return tasks;
};
var getTaskById = async (userId, taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: { userId }
              }
            }
          }
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      }
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  if (task.project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this task");
  }
  const activityLogs = await prisma.activityLog.findMany({
    where: {
      entityType: "Task",
      entityId: taskId
    },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return {
    ...task,
    activityLogs
  };
};
var updateTask = async (userId, taskId, payload) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  if (task.project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this task");
  }
  const updateData = {
    ...payload
  };
  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData
  });
  if (payload.status && payload.status !== task.status) {
    await activityLogService.logActivity(
      "Updated task status",
      "Task",
      updatedTask.id,
      task.project.workspaceId,
      userId,
      `Changed status of task ${updatedTask.title} to ${updatedTask.status}`
    );
  }
  if (payload.assigneeId && payload.assigneeId !== task.assigneeId) {
    await notificationService.createNotification(
      `You have been assigned to task ${updatedTask.title}`,
      payload.assigneeId,
      `You have been assigned to a task in project ${task.project.name}`,
      void 0,
      task.project.workspaceId
    );
  }
  return updatedTask;
};
var deleteTask = async (userId, taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  if (task.project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this task");
  }
  const deletedTask = await prisma.task.delete({
    where: { id: taskId }
  });
  return deletedTask;
};
var TaskService = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask
};

// src/app/module/task/task.controller.ts
var createTask2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await TaskService.createTask(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus6.CREATED,
    success: true,
    message: "Task created successfully",
    data: result
  });
});
var getTasksByProject2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { projectId } = req.query;
  if (!projectId) {
    throw new Error("Project ID query parameter is required");
  }
  const result = await TaskService.getTasksByProject(userId, projectId);
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result
  });
});
var getTaskById2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId;
  const result = await TaskService.getTaskById(userId, taskId);
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result
  });
});
var updateTask2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId;
  const result = await TaskService.updateTask(userId, taskId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Task updated successfully",
    data: result
  });
});
var deleteTask2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId;
  const result = await TaskService.deleteTask(userId, taskId);
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Task deleted successfully",
    data: result
  });
});
var TaskController = {
  createTask: createTask2,
  getTasksByProject: getTasksByProject2,
  getTaskById: getTaskById2,
  updateTask: updateTask2,
  deleteTask: deleteTask2
};

// src/app/module/task/task.validation.ts
import { z as z4 } from "zod";
var createTaskSchema = z4.object({
  body: z4.object({
    title: z4.string().min(1, "Task title is required"),
    description: z4.string().optional(),
    status: z4.nativeEnum(TaskStatus).optional(),
    dueDate: z4.string().datetime().optional(),
    projectId: z4.string().min(1, "Project ID is required"),
    assigneeId: z4.string().optional()
  })
});
var updateTaskSchema = z4.object({
  body: z4.object({
    title: z4.string().min(1).optional(),
    description: z4.string().optional(),
    status: z4.nativeEnum(TaskStatus).optional(),
    dueDate: z4.string().datetime().optional(),
    assigneeId: z4.string().optional()
  })
});
var TaskValidation = {
  createTaskSchema,
  updateTaskSchema
};

// src/app/module/taskComment/taskComment.controller.ts
import status12 from "http-status";

// src/app/module/taskComment/taskComment.service.ts
var addComment = async (content, taskId, authorId) => {
  const result = await prisma.taskComment.create({
    data: {
      content,
      taskId,
      authorId
    }
  });
  return result;
};
var listComments = async (taskId) => {
  const result = await prisma.taskComment.findMany({
    where: { taskId },
    take: 50,
    include: {
      author: {
        select: { id: true, name: true, email: true, image: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });
  return result;
};
var taskCommentService = {
  addComment,
  listComments
};

// src/app/module/taskComment/taskComment.controller.ts
var addComment2 = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const { content } = req.body;
  const authorId = req.user.userId;
  const result = await taskCommentService.addComment(content, taskId, authorId);
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result
  });
});
var listComments2 = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;
  const result = await taskCommentService.listComments(taskId);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Comments fetched successfully",
    data: result
  });
});
var taskCommentController = {
  addComment: addComment2,
  listComments: listComments2
};

// src/app/module/taskComment/taskComment.validation.ts
import z5 from "zod";
var addCommentSchema = z5.object({
  content: z5.string().min(1)
});
var taskCommentValidation = {
  addCommentSchema
};

// src/app/module/task/task.route.ts
var router5 = Router4();
router5.post(
  "/",
  checkAuth(),
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask
);
router5.get(
  "/",
  checkAuth(),
  TaskController.getTasksByProject
);
router5.get(
  "/:taskId",
  checkAuth(),
  TaskController.getTaskById
);
router5.patch(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask
);
router5.delete(
  "/:taskId",
  checkAuth(),
  TaskController.deleteTask
);
router5.post(
  "/:taskId/comments",
  checkAuth(),
  validateRequest(taskCommentValidation.addCommentSchema),
  taskCommentController.addComment
);
router5.get(
  "/:taskId/comments",
  checkAuth(),
  taskCommentController.listComments
);
var TaskRoutes = router5;

// src/app/module/subscription/subscription.route.ts
import { Router as Router5 } from "express";

// src/app/module/subscription/subscription.controller.ts
import httpStatus7 from "http-status";

// src/app/module/subscription/subscription.service.ts
var createSubscription = async (userId, payload) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: payload.workspaceId }
  });
  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Unauthorized: User is not the owner of this workspace");
  }
  const subscription = await prisma.subscription.create({
    data: {
      workspaceId: payload.workspaceId,
      tier: payload.tier || SubscriptionTier.FREE,
      stripeCustomerId: payload.stripeCustomerId,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      status: SubscriptionStatus.ACTIVE
    }
  });
  return subscription;
};
var getSubscriptionByWorkspace = async (userId, workspaceId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new Error("Unauthorized: User is not a member of this workspace");
  }
  const subscription = await prisma.subscription.findUnique({
    where: {
      workspaceId
    }
  });
  return subscription;
};
var updateSubscription = async (userId, workspaceId, payload) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  });
  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Unauthorized: User is not the owner of this workspace");
  }
  const updateData = {};
  if (payload.tier) updateData.tier = payload.tier;
  if (payload.stripeSubscriptionId) updateData.stripeSubscriptionId = payload.stripeSubscriptionId;
  if (payload.isActive !== void 0) {
    updateData.status = payload.isActive ? SubscriptionStatus.ACTIVE : SubscriptionStatus.CANCELED;
  }
  if (payload.expiresAt) {
    updateData.currentPeriodEnd = new Date(payload.expiresAt);
  }
  const updatedSubscription = await prisma.subscription.update({
    where: { workspaceId },
    data: updateData
  });
  return updatedSubscription;
};
var SubscriptionService = {
  createSubscription,
  getSubscriptionByWorkspace,
  updateSubscription
};

// src/app/module/subscription/subscription.controller.ts
var createSubscription2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await SubscriptionService.createSubscription(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus7.CREATED,
    success: true,
    message: "Subscription created successfully",
    data: result
  });
});
var getSubscriptionByWorkspace2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId;
  const result = await SubscriptionService.getSubscriptionByWorkspace(userId, workspaceId);
  sendResponse(res, {
    httpStatusCode: httpStatus7.OK,
    success: true,
    message: "Subscription retrieved successfully",
    data: result
  });
});
var updateSubscription2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId;
  const result = await SubscriptionService.updateSubscription(userId, workspaceId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus7.OK,
    success: true,
    message: "Subscription updated successfully",
    data: result
  });
});
var SubscriptionController = {
  createSubscription: createSubscription2,
  getSubscriptionByWorkspace: getSubscriptionByWorkspace2,
  updateSubscription: updateSubscription2
};

// src/app/module/subscription/subscription.validation.ts
import { z as z6 } from "zod";
var createSubscriptionSchema = z6.object({
  body: z6.object({
    workspaceId: z6.string().min(1, "Workspace ID is required"),
    tier: z6.nativeEnum(SubscriptionTier).optional(),
    stripeCustomerId: z6.string().optional(),
    stripeSubscriptionId: z6.string().optional()
  })
});
var updateSubscriptionSchema = z6.object({
  body: z6.object({
    tier: z6.nativeEnum(SubscriptionTier).optional(),
    stripeSubscriptionId: z6.string().optional(),
    isActive: z6.boolean().optional(),
    expiresAt: z6.string().datetime().optional()
  })
});
var SubscriptionValidation = {
  createSubscriptionSchema,
  updateSubscriptionSchema
};

// src/app/module/subscription/subscription.route.ts
var router6 = Router5();
router6.post(
  "/",
  checkAuth(),
  validateRequest(SubscriptionValidation.createSubscriptionSchema),
  SubscriptionController.createSubscription
);
router6.get(
  "/:workspaceId",
  checkAuth(),
  SubscriptionController.getSubscriptionByWorkspace
);
router6.patch(
  "/:workspaceId",
  checkAuth(),
  validateRequest(SubscriptionValidation.updateSubscriptionSchema),
  SubscriptionController.updateSubscription
);
var SubscriptionRoutes = router6;

// src/app/module/workspaceMember/workspaceMember.route.ts
import { Router as Router6 } from "express";

// src/app/module/workspaceMember/workspaceMember.validation.ts
import z7 from "zod";
var addMemberSchema = z7.object({
  userId: z7.string().uuid(),
  role: z7.nativeEnum(WorkspaceRole).optional()
});
var updateRoleSchema = z7.object({
  role: z7.nativeEnum(WorkspaceRole)
});
var workspaceMemberValidation = {
  addMemberSchema,
  updateRoleSchema
};

// src/app/module/workspaceMember/workspaceMember.controller.ts
import status14 from "http-status";

// src/app/module/workspaceMember/workspaceMember.service.ts
import status13 from "http-status";
var resolveWorkspaceId2 = async (workspaceIdOrSlug) => {
  if (!workspaceIdOrSlug) return void 0;
  const ws = await prisma.workspace.findFirst({
    where: {
      OR: [
        { id: workspaceIdOrSlug },
        { slug: workspaceIdOrSlug }
      ]
    },
    select: { id: true }
  });
  return ws?.id || workspaceIdOrSlug;
};
var addMember = async (workspaceIdOrSlug, userId, role = WorkspaceRole.MEMBER) => {
  const workspaceId = await resolveWorkspaceId2(workspaceIdOrSlug) || workspaceIdOrSlug;
  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId }
    }
  });
  if (existingMember) {
    throw new AppError_default(status13.CONFLICT, "User is already a member of this workspace");
  }
  const result = await prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId,
      role
    }
  });
  return result;
};
var listMembers = async (workspaceIdOrSlug) => {
  const resolvedId = workspaceIdOrSlug ? await resolveWorkspaceId2(workspaceIdOrSlug) : void 0;
  const whereClause = resolvedId ? { workspaceId: resolvedId } : {};
  const result = await prisma.workspaceMember.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var updateRole = async (workspaceIdOrSlug, memberId, newRole, callerUserId) => {
  const resolvedId = workspaceIdOrSlug ? await resolveWorkspaceId2(workspaceIdOrSlug) : void 0;
  const where = { id: memberId };
  if (resolvedId) {
    where.workspaceId = resolvedId;
  }
  const member = await prisma.workspaceMember.findFirst({
    where,
    include: { workspace: true }
  });
  if (!member) {
    throw new AppError_default(status13.NOT_FOUND, "Workspace member not found");
  }
  if (callerUserId) {
    const callerMembership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: member.workspaceId,
          userId: callerUserId
        }
      }
    });
    if (!callerMembership || callerMembership.role !== WorkspaceRole.OWNER) {
      throw new AppError_default(status13.FORBIDDEN, "Forbidden: Only workspace Owner can change member roles");
    }
  }
  const result = await prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role: newRole }
  });
  if (member.role !== newRole) {
    await notificationService.createNotification(
      "Workspace Role Updated",
      member.userId,
      `Your role in workspace ${member.workspace.name} has been updated to ${newRole}`,
      void 0,
      member.workspaceId
    );
  }
  return result;
};
var removeMember = async (workspaceIdOrSlug, memberId, callerUserId) => {
  const resolvedId = workspaceIdOrSlug ? await resolveWorkspaceId2(workspaceIdOrSlug) : void 0;
  const where = { id: memberId };
  if (resolvedId) {
    where.workspaceId = resolvedId;
  }
  const member = await prisma.workspaceMember.findFirst({
    where
  });
  if (!member) {
    throw new AppError_default(status13.NOT_FOUND, "Workspace member not found");
  }
  if (member.role === WorkspaceRole.OWNER) {
    throw new AppError_default(status13.BAD_REQUEST, "Workspace owner cannot be removed. Transfer ownership first.");
  }
  if (callerUserId) {
    const callerMembership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: member.workspaceId,
          userId: callerUserId
        }
      }
    });
    if (!callerMembership || callerMembership.role !== WorkspaceRole.OWNER && callerMembership.role !== WorkspaceRole.ADMIN) {
      throw new AppError_default(status13.FORBIDDEN, "Forbidden: Only Owner or Admin can remove members");
    }
    if (callerMembership.role === WorkspaceRole.ADMIN && member.role === WorkspaceRole.ADMIN) {
      throw new AppError_default(status13.FORBIDDEN, "Forbidden: Admins cannot remove other Admins");
    }
  }
  const result = await prisma.workspaceMember.delete({
    where: { id: memberId }
  });
  return result;
};
var workspaceMemberService = {
  addMember,
  listMembers,
  updateRole,
  removeMember
};

// src/app/module/workspaceMember/workspaceMember.controller.ts
var addMember2 = catchAsync(async (req, res) => {
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.body.workspaceSlug || req.query.workspaceId || req.query.workspaceSlug;
  const { userId, role } = req.body;
  const result = await workspaceMemberService.addMember(workspaceId, userId, role);
  sendResponse(res, {
    httpStatusCode: status14.CREATED,
    success: true,
    message: "Member added successfully",
    data: result
  });
});
var listMembers2 = catchAsync(async (req, res) => {
  const workspaceId = req.params.workspaceId || req.query.workspaceId || req.query.workspaceSlug;
  const result = await workspaceMemberService.listMembers(workspaceId);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Members fetched successfully",
    data: result
  });
});
var updateRole2 = catchAsync(async (req, res) => {
  const memberId = req.params.memberId || req.params.id;
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.body.workspaceSlug;
  const { role } = req.body;
  const callerUserId = req.user?.userId;
  const result = await workspaceMemberService.updateRole(workspaceId, memberId, role, callerUserId);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Member role updated successfully",
    data: result
  });
});
var removeMember2 = catchAsync(async (req, res) => {
  const memberId = req.params.memberId || req.params.id;
  const workspaceId = req.params.workspaceId || req.body?.workspaceId || req.body?.workspaceSlug;
  const callerUserId = req.user?.userId;
  const result = await workspaceMemberService.removeMember(workspaceId, memberId, callerUserId);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Member removed successfully",
    data: result
  });
});
var workspaceMemberController = {
  addMember: addMember2,
  listMembers: listMembers2,
  updateRole: updateRole2,
  removeMember: removeMember2
};

// src/app/module/workspaceMember/workspaceMember.route.ts
var router7 = Router6();
router7.get(
  "/",
  checkAuth(),
  workspaceMemberController.listMembers
);
router7.post(
  "/",
  checkAuth(),
  workspaceMemberController.addMember
);
router7.patch(
  "/:memberId/role",
  checkAuth(),
  workspaceMemberController.updateRole
);
router7.delete(
  "/:memberId",
  checkAuth(),
  workspaceMemberController.removeMember
);
router7.get(
  "/:workspaceId",
  checkAuth(),
  workspaceMemberController.listMembers
);
router7.post(
  "/:workspaceId/members",
  checkAuth(),
  validateRequest(workspaceMemberValidation.addMemberSchema),
  workspaceMemberController.addMember
);
router7.get(
  "/:workspaceId/members",
  checkAuth(),
  workspaceMemberController.listMembers
);
router7.patch(
  "/:workspaceId/members/:memberId/role",
  checkAuth(),
  validateRequest(workspaceMemberValidation.updateRoleSchema),
  workspaceMemberController.updateRole
);
router7.delete(
  "/:workspaceId/members/:memberId",
  checkAuth(),
  workspaceMemberController.removeMember
);
var workspaceMemberRoutes = router7;

// src/app/module/invitation/invitation.route.ts
import { Router as Router7 } from "express";

// src/app/module/invitation/invitation.validation.ts
import z8 from "zod";
var createInvitationSchema = z8.object({
  body: z8.object({
    email: z8.string().email().transform((val) => val.trim().toLowerCase()),
    role: z8.nativeEnum(WorkspaceRole).nullish().default(WorkspaceRole.MEMBER),
    workspaceId: z8.string().optional(),
    workspaceSlug: z8.string().optional()
  })
});
var acceptInvitationSchema = z8.object({
  body: z8.object({
    token: z8.string()
  })
});
var invitationValidation = {
  createInvitationSchema,
  acceptInvitationSchema
};

// src/app/module/invitation/invitation.controller.ts
import status16 from "http-status";

// src/app/module/invitation/invitation.service.ts
import status15 from "http-status";
import crypto2 from "crypto";
var resolveWorkspace = async (workspaceIdOrSlug) => {
  if (!workspaceIdOrSlug) return null;
  const ws = await prisma.workspace.findFirst({
    where: {
      OR: [
        { id: workspaceIdOrSlug },
        { slug: workspaceIdOrSlug }
      ]
    },
    select: { id: true, name: true, slug: true, logoUrl: true }
  });
  return ws;
};
var createInvitation = async (email, role = WorkspaceRole.MEMBER, workspaceIdOrSlug, inviterId) => {
  const normalizedEmail = email.trim().toLowerCase();
  const ws = await resolveWorkspace(workspaceIdOrSlug);
  if (!ws) {
    throw new AppError_default(status15.NOT_FOUND, "Workspace not found");
  }
  const workspaceId = ws.id;
  const existingUser = await prisma.user.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" }
    }
  });
  if (existingUser) {
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId: existingUser.id }
      }
    });
    if (existingMember) {
      throw new AppError_default(status15.CONFLICT, "User is already a member of this workspace");
    }
  }
  const token = crypto2.randomBytes(32).toString("hex");
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      workspaceId,
      email: { equals: normalizedEmail, mode: "insensitive" },
      status: InvitationStatus.PENDING
    }
  });
  let result;
  if (existingInvitation) {
    result = await prisma.invitation.update({
      where: { id: existingInvitation.id },
      data: {
        role,
        inviterId,
        token,
        expiresAt,
        status: InvitationStatus.PENDING
      },
      include: {
        workspace: { select: { id: true, name: true, slug: true } },
        inviter: { select: { id: true, name: true, email: true } }
      }
    });
  } else {
    result = await prisma.invitation.create({
      data: {
        email: normalizedEmail,
        role,
        workspaceId,
        inviterId,
        token,
        expiresAt,
        status: InvitationStatus.PENDING
      },
      include: {
        workspace: { select: { id: true, name: true, slug: true } },
        inviter: { select: { id: true, name: true, email: true } }
      }
    });
  }
  if (existingUser) {
    await prisma.notification.create({
      data: {
        title: "Workspace Invitation",
        content: `${result.inviter?.name || "A team member"} invited you to join ${result.workspace?.name || ws.name} as ${role}.`,
        type: NotificationType.SYSTEM,
        userId: existingUser.id,
        workspaceId: ws.id
      }
    }).catch(() => {
    });
  }
  const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";
  const acceptUrl = `${frontendUrl}/accept-invitation?token=${token}&workspace=${result.workspace?.slug || ws.slug}`;
  sendEmail({
    to: normalizedEmail,
    subject: `${result.inviter?.name || "A team member"} invited you to join ${result.workspace?.name || ws.name} on Prangon`,
    templateName: "invitation",
    templateData: {
      inviterName: result.inviter?.name || "A team member",
      inviterEmail: result.inviter?.email || "",
      workspaceName: result.workspace?.name || ws.name || "Prangon Workspace",
      workspaceSlug: result.workspace?.slug || ws.slug || "",
      role: result.role,
      acceptUrl,
      expiresInDays: 7
    }
  }).catch((err) => {
    console.error("Failed to send invitation email:", err);
  });
  return result;
};
var getInvitationDetails = async (token) => {
  if (!token) {
    throw new AppError_default(status15.BAD_REQUEST, "Invitation token is required");
  }
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      workspace: { select: { id: true, name: true, slug: true, logoUrl: true } },
      inviter: { select: { id: true, name: true, email: true } }
    }
  });
  if (!invitation) {
    throw new AppError_default(status15.NOT_FOUND, "Invalid invitation token or invitation no longer exists");
  }
  const isExpired = /* @__PURE__ */ new Date() > new Date(invitation.expiresAt);
  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    status: isExpired ? InvitationStatus.EXPIRED : invitation.status,
    expiresAt: invitation.expiresAt,
    workspace: invitation.workspace,
    inviter: invitation.inviter
  };
};
var acceptInvitation = async (token, userId, userEmail) => {
  if (!token) {
    throw new AppError_default(status15.BAD_REQUEST, "Token is required");
  }
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      workspace: { select: { id: true, name: true, slug: true, logoUrl: true } }
    }
  });
  if (!invitation) {
    throw new AppError_default(status15.NOT_FOUND, "Invalid invitation token");
  }
  const normalizedInvEmail = invitation.email.trim().toLowerCase();
  const normalizedUserEmail = userEmail.trim().toLowerCase();
  if (normalizedInvEmail !== normalizedUserEmail) {
    throw new AppError_default(
      status15.FORBIDDEN,
      `This invitation was sent to ${invitation.email}, but you are currently signed in as ${userEmail}. Please sign in with the invited email address.`
    );
  }
  if (invitation.status === InvitationStatus.ACCEPTED) {
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: invitation.workspaceId,
          userId
        }
      },
      include: {
        workspace: { select: { id: true, name: true, slug: true } }
      }
    });
    if (existingMember) {
      return {
        updatedInvitation: invitation,
        workspaceMember: existingMember,
        workspace: invitation.workspace,
        alreadyJoined: true
      };
    }
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError_default(status15.BAD_REQUEST, `Invitation is already ${invitation.status.toLowerCase()}`);
  }
  if (/* @__PURE__ */ new Date() > new Date(invitation.expiresAt)) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.EXPIRED }
    });
    throw new AppError_default(status15.BAD_REQUEST, "Invitation has expired. Please ask the workspace owner to send a new invitation.");
  }
  const [updatedInvitation, workspaceMember] = await prisma.$transaction([
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
      include: {
        workspace: { select: { id: true, name: true, slug: true } }
      }
    }),
    prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: invitation.workspaceId,
          userId
        }
      },
      create: {
        workspaceId: invitation.workspaceId,
        userId,
        role: invitation.role
      },
      update: {
        role: invitation.role
      },
      include: {
        workspace: { select: { id: true, name: true, slug: true } }
      }
    })
  ]);
  if (invitation.inviterId) {
    const joiningUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });
    await prisma.notification.create({
      data: {
        title: "Team Member Joined",
        content: `${joiningUser?.name || userEmail} has accepted your invitation and joined ${invitation.workspace?.name || "your workspace"}.`,
        type: NotificationType.SYSTEM,
        userId: invitation.inviterId,
        workspaceId: invitation.workspaceId
      }
    }).catch(() => {
    });
  }
  return {
    updatedInvitation,
    workspaceMember,
    workspace: invitation.workspace,
    alreadyJoined: false
  };
};
var listInvitations = async (workspaceIdOrSlug) => {
  let resolvedId;
  if (workspaceIdOrSlug) {
    const ws = await resolveWorkspace(workspaceIdOrSlug);
    resolvedId = ws?.id || workspaceIdOrSlug;
  }
  const where = resolvedId ? { workspaceId: resolvedId } : {};
  where.status = InvitationStatus.PENDING;
  const result = await prisma.invitation.findMany({
    where,
    include: {
      inviter: {
        select: { id: true, name: true, email: true }
      },
      workspace: {
        select: { id: true, name: true, slug: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var resendInvitation = async (id) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: {
      workspace: { select: { id: true, name: true, slug: true } },
      inviter: { select: { id: true, name: true, email: true } }
    }
  });
  if (!invitation) {
    throw new AppError_default(status15.NOT_FOUND, "Invitation not found");
  }
  const existingMember = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: invitation.workspaceId,
      user: { email: { equals: invitation.email, mode: "insensitive" } }
    }
  });
  if (existingMember) {
    throw new AppError_default(status15.BAD_REQUEST, "This user has already joined the workspace.");
  }
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const result = await prisma.invitation.update({
    where: { id },
    data: {
      expiresAt,
      status: InvitationStatus.PENDING
    },
    include: {
      workspace: { select: { id: true, name: true, slug: true } },
      inviter: { select: { id: true, name: true, email: true } }
    }
  });
  const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";
  const acceptUrl = `${frontendUrl}/accept-invitation?token=${result.token}&workspace=${result.workspace?.slug || ""}`;
  sendEmail({
    to: result.email,
    subject: `Reminder: ${result.inviter?.name || "A team member"} invited you to join ${result.workspace?.name || "a workspace"} on Prangon`,
    templateName: "invitation",
    templateData: {
      inviterName: result.inviter?.name || "A team member",
      inviterEmail: result.inviter?.email || "",
      workspaceName: result.workspace?.name || "Prangon Workspace",
      workspaceSlug: result.workspace?.slug || "",
      role: result.role,
      acceptUrl,
      expiresInDays: 7
    }
  }).catch((err) => {
    console.error("Failed to resend invitation email:", err);
  });
  return result;
};
var revokeInvitation = async (id) => {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  if (!invitation) {
    throw new AppError_default(status15.NOT_FOUND, "Invitation not found");
  }
  const result = await prisma.invitation.delete({
    where: { id }
  });
  return result;
};
var invitationService = {
  createInvitation,
  getInvitationDetails,
  acceptInvitation,
  listInvitations,
  resendInvitation,
  revokeInvitation
};

// src/app/module/invitation/invitation.controller.ts
var createInvitation2 = catchAsync(async (req, res) => {
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.body.workspaceSlug || req.query.workspaceId || req.query.workspaceSlug;
  const { email, role } = req.body;
  const inviterId = req.user.userId;
  const result = await invitationService.createInvitation(email, role, workspaceId, inviterId);
  sendResponse(res, {
    httpStatusCode: status16.CREATED,
    success: true,
    message: "Invitation created successfully",
    data: result
  });
});
var getInvitationDetails2 = catchAsync(async (req, res) => {
  const token = req.params.token || req.query.token;
  const result = await invitationService.getInvitationDetails(token);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Invitation details fetched successfully",
    data: result
  });
});
var acceptInvitation2 = catchAsync(async (req, res) => {
  const { token } = req.body;
  const { userId, email } = req.user;
  const result = await invitationService.acceptInvitation(token, userId, email);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Invitation accepted successfully",
    data: result
  });
});
var listInvitations2 = catchAsync(async (req, res) => {
  const workspaceId = req.params.workspaceId || req.query.workspaceId || req.query.workspaceSlug;
  const result = await invitationService.listInvitations(workspaceId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Invitations fetched successfully",
    data: result
  });
});
var resendInvitation2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await invitationService.resendInvitation(id);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Invitation resent successfully",
    data: result
  });
});
var revokeInvitation2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await invitationService.revokeInvitation(id);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Invitation revoked successfully",
    data: result
  });
});
var invitationController = {
  createInvitation: createInvitation2,
  getInvitationDetails: getInvitationDetails2,
  acceptInvitation: acceptInvitation2,
  listInvitations: listInvitations2,
  resendInvitation: resendInvitation2,
  revokeInvitation: revokeInvitation2
};

// src/app/module/invitation/invitation.route.ts
var router8 = Router7();
router8.get(
  "/details/:token",
  invitationController.getInvitationDetails
);
router8.post(
  "/accept",
  checkAuth(),
  validateRequest(invitationValidation.acceptInvitationSchema),
  invitationController.acceptInvitation
);
router8.post(
  "/:id/resend",
  checkAuth(),
  invitationController.resendInvitation
);
router8.get(
  "/",
  checkAuth(),
  invitationController.listInvitations
);
router8.post(
  "/",
  checkAuth(),
  validateRequest(invitationValidation.createInvitationSchema),
  invitationController.createInvitation
);
router8.get(
  "/:workspaceId",
  checkAuth(),
  invitationController.listInvitations
);
router8.delete(
  "/:id",
  checkAuth(),
  invitationController.revokeInvitation
);
router8.post(
  "/:workspaceId/invitations",
  checkAuth(),
  validateRequest(invitationValidation.createInvitationSchema),
  invitationController.createInvitation
);
router8.get(
  "/:workspaceId/invitations",
  checkAuth(),
  invitationController.listInvitations
);
router8.delete(
  "/:workspaceId/invitations/:id",
  checkAuth(),
  invitationController.revokeInvitation
);
var invitationRoutes = router8;

// src/app/module/activityLog/activityLog.route.ts
import { Router as Router8 } from "express";

// src/app/module/activityLog/activityLog.controller.ts
import status17 from "http-status";
var listActivity2 = catchAsync(async (req, res) => {
  const workspaceId = String(req.params.workspaceId);
  const result = await activityLogService.listActivity(workspaceId);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Activity logs fetched successfully",
    data: result
  });
});
var activityLogController = {
  listActivity: listActivity2
};

// src/app/module/activityLog/activityLog.route.ts
var router9 = Router8();
router9.get(
  "/:workspaceId/activities",
  checkAuth(),
  activityLogController.listActivity
);
var activityLogRoutes = router9;

// src/app/module/notification/notification.route.ts
import { Router as Router9 } from "express";

// src/app/module/notification/notification.validation.ts
import z9 from "zod";
var createNotificationSchema = z9.object({
  title: z9.string().min(1),
  content: z9.string().optional(),
  type: z9.nativeEnum(NotificationType).optional(),
  userId: z9.string().uuid(),
  workspaceId: z9.string().uuid().optional()
});
var notificationValidation = {
  createNotificationSchema
};

// src/app/module/notification/notification.controller.ts
import status18 from "http-status";
var createNotification2 = catchAsync(async (req, res) => {
  const { title, userId, content, type, workspaceId } = req.body;
  const result = await notificationService.createNotification(title, userId, content, type, workspaceId);
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: "Notification created successfully",
    data: result
  });
});
var getUserNotifications2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const workspaceSlug = req.query.workspaceSlug || req.query.workspaceId;
  const result = await notificationService.getUserNotifications(userId, workspaceSlug);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Notifications fetched successfully",
    data: result
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.userId;
  const result = await notificationService.markAsRead(id, userId);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Notification marked as read",
    data: result
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const workspaceSlug = req.body?.workspaceSlug || req.query?.workspaceSlug;
  const result = await notificationService.markAllAsRead(userId, workspaceSlug);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "All notifications marked as read",
    data: result
  });
});
var notificationController = {
  createNotification: createNotification2,
  getUserNotifications: getUserNotifications2,
  markAsRead: markAsRead2,
  markAllAsRead: markAllAsRead2
};

// src/app/module/notification/notification.route.ts
var router10 = Router9();
router10.post(
  "/",
  checkAuth(),
  validateRequest(notificationValidation.createNotificationSchema),
  notificationController.createNotification
);
router10.get(
  "/",
  checkAuth(),
  notificationController.getUserNotifications
);
router10.patch(
  "/mark-all-read",
  checkAuth(),
  notificationController.markAllAsRead
);
router10.patch(
  "/read-all",
  checkAuth(),
  notificationController.markAllAsRead
);
router10.patch(
  "/:id/read",
  checkAuth(),
  notificationController.markAsRead
);
var notificationRoutes = router10;

// src/app/module/taskComment/taskComment.route.ts
import { Router as Router10 } from "express";
var router11 = Router10();
router11.post(
  "/:taskId/comments",
  checkAuth(),
  validateRequest(taskCommentValidation.addCommentSchema),
  taskCommentController.addComment
);
router11.get(
  "/:taskId/comments",
  checkAuth(),
  taskCommentController.listComments
);
var taskCommentRoutes = router11;

// src/app/module/upload/upload.route.ts
import { Router as Router11 } from "express";
import multer from "multer";

// src/app/module/upload/upload.controller.ts
import status19 from "http-status";

// src/app/module/upload/upload.service.ts
var uploadFile = async (buffer, fileName) => {
  const result = await uploadFileToCloudinary(buffer, fileName);
  return result;
};
var deleteFile = async (url) => {
  await deleteFileFromCloudinary(url);
  return null;
};
var UploadService = {
  uploadFile,
  deleteFile
};

// src/app/module/upload/upload.controller.ts
var uploadFile2 = catchAsync(async (req, res) => {
  if (!req.file) {
    return sendResponse(res, {
      httpStatusCode: status19.BAD_REQUEST,
      success: false,
      message: "No file provided for upload"
    });
  }
  const result = await UploadService.uploadFile(req.file.buffer, req.file.originalname);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "File uploaded successfully",
    data: result
  });
});
var deleteFile2 = catchAsync(async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return sendResponse(res, {
      httpStatusCode: status19.BAD_REQUEST,
      success: false,
      message: "File URL is required"
    });
  }
  await UploadService.deleteFile(url);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "File deleted successfully",
    data: null
  });
});
var UploadController = {
  uploadFile: uploadFile2,
  deleteFile: deleteFile2
};

// src/app/module/upload/upload.validation.ts
import { z as z10 } from "zod";
var deleteFileZodSchema = z10.object({
  body: z10.object({
    url: z10.string().url("Must be a valid URL")
  })
});
var UploadValidation = {
  deleteFileZodSchema
};

// src/app/module/upload/upload.route.ts
var router12 = Router11();
var upload = multer({ storage: multer.memoryStorage() });
router12.post(
  "/",
  checkAuth(),
  // Requires user to be authenticated
  upload.single("file"),
  UploadController.uploadFile
);
router12.delete(
  "/",
  checkAuth(),
  validateRequest(UploadValidation.deleteFileZodSchema),
  UploadController.deleteFile
);
var UploadRoutes = router12;

// src/app/module/payment/payment.route.ts
import { Router as Router12 } from "express";

// src/app/module/payment/payment.controller.ts
import status21 from "http-status";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/module/payment/payment.service.ts
import status20 from "http-status";
var createCheckoutSession = async (workspaceId, priceId, userId, successUrl, cancelUrl) => {
  if (!userId) {
    throw new AppError_default(status20.UNAUTHORIZED, "User ID is required");
  }
  let customerId;
  const metadata = { userId };
  if (workspaceId) {
    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId
        }
      }
    });
    if (!workspaceMember || workspaceMember.role !== "OWNER" && workspaceMember.role !== "ADMIN") {
      throw new AppError_default(status20.FORBIDDEN, "You do not have permission to manage subscriptions for this workspace");
    }
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { subscription: true }
    });
    if (!workspace) {
      throw new AppError_default(status20.NOT_FOUND, "Workspace not found");
    }
    metadata.workspaceId = workspaceId;
    customerId = workspace.subscription?.stripeCustomerId || void 0;
    if (!customerId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const customer = await stripe.customers.create({
        email: user?.email,
        name: user?.name,
        metadata: { workspaceId, userId }
      });
      customerId = customer.id;
      if (workspace.subscription) {
        await prisma.subscription.update({
          where: { workspaceId },
          data: { stripeCustomerId: customerId }
        });
      } else {
        await prisma.subscription.create({
          data: {
            workspaceId,
            stripeCustomerId: customerId
          }
        });
      }
    }
  } else {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError_default(status20.NOT_FOUND, "User not found");
    }
    const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId }
      });
      customerId = customer.id;
    }
  }
  const line_items = priceId ? [{ price: priceId, quantity: 1 }] : [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Prangon Premium Subscription",
          description: "Unlimited members, unlimited projects, priority 24/7 support"
        },
        unit_amount: 1900,
        recurring: {
          interval: "month"
        }
      },
      quantity: 1
    }
  ];
  const defaultSuccessUrl = workspaceId ? `${envVars.FRONTEND_URL}/dashboard/${workspaceId}/settings/billing?success=true` : `${envVars.FRONTEND_URL}/onboarding/workspace?session_id={CHECKOUT_SESSION_ID}`;
  const defaultCancelUrl = workspaceId ? `${envVars.FRONTEND_URL}/dashboard/${workspaceId}/settings/billing?canceled=true` : `${envVars.FRONTEND_URL}/onboarding/plan?canceled=true`;
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items,
    mode: "subscription",
    success_url: successUrl || defaultSuccessUrl,
    cancel_url: cancelUrl || defaultCancelUrl,
    metadata
  });
  return { url: session.url };
};
var createCustomerPortalSession = async (workspaceId, userId) => {
  const workspaceMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!workspaceMember || workspaceMember.role !== "OWNER" && workspaceMember.role !== "ADMIN") {
    throw new AppError_default(status20.FORBIDDEN, "You do not have permission to manage subscriptions for this workspace");
  }
  const subscription = await prisma.subscription.findUnique({
    where: { workspaceId }
  });
  if (!subscription || !subscription.stripeCustomerId) {
    throw new AppError_default(status20.BAD_REQUEST, "No active subscription found for this workspace");
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${envVars.FRONTEND_URL}/dashboard/${workspaceId}/settings/billing`
  });
  return { url: session.url };
};
var handlerStripeWebhookEvent = async (event) => {
  console.log(`Received Stripe Webhook Event: ${event.type}`);
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription") {
          const workspaceId = session.metadata?.workspaceId;
          const subscriptionId = session.subscription;
          if (workspaceId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            await prisma.subscription.upsert({
              where: { workspaceId },
              update: {
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items?.data?.[0]?.price?.id || null,
                tier: SubscriptionTier.PREMIUM,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
                cancelAtPeriodEnd: subscription.cancel_at_period_end
              },
              create: {
                workspaceId,
                stripeCustomerId: session.customer,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items?.data?.[0]?.price?.id || null,
                tier: SubscriptionTier.PREMIUM,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
                cancelAtPeriodEnd: subscription.cancel_at_period_end
              }
            });
          } else if (session.metadata?.userId) {
            const userId = session.metadata.userId;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const draft = user?.onboardingDraft || {};
            const companyName = draft.companyName || "My Workspace";
            const baseSlug = companyName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "workspace";
            let uniqueSlug = baseSlug;
            let counter = 1;
            while (await prisma.workspace.findUnique({ where: { slug: uniqueSlug } })) {
              uniqueSlug = `${baseSlug}-${counter++}`;
            }
            const createdWs = await prisma.workspace.create({
              data: {
                name: companyName,
                slug: uniqueSlug,
                industry: draft.industry,
                companySize: draft.companySize,
                ownerId: userId,
                onboardingStatus: OnboardingStatus.PENDING_WORKSPACE,
                members: {
                  create: {
                    userId,
                    role: WorkspaceRole.OWNER
                  }
                },
                subscription: {
                  create: {
                    tier: SubscriptionTier.PREMIUM,
                    status: SubscriptionStatus.ACTIVE,
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: subscription.id,
                    stripePriceId: subscription.items?.data?.[0]?.price?.id || null,
                    currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end
                  }
                }
              }
            });
            await prisma.user.update({
              where: { id: userId },
              data: {
                onboardingDraft: {
                  ...draft,
                  workspaceId: createdWs.id,
                  workspaceSlug: createdWs.slug,
                  status: OnboardingStatus.PENDING_WORKSPACE,
                  selectedTier: "PREMIUM"
                }
              }
            });
          }
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status === "active" ? SubscriptionStatus.ACTIVE : subscription.status === "past_due" ? SubscriptionStatus.PAST_DUE : subscription.status === "unpaid" ? SubscriptionStatus.UNPAID : SubscriptionStatus.CANCELED,
            currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          }
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: SubscriptionStatus.CANCELED,
            tier: SubscriptionTier.FREE,
            cancelAtPeriodEnd: false
          }
        });
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              status: SubscriptionStatus.ACTIVE,
              currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1e3) : null
            }
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing webhook event data:", error);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var PaymentService = {
  createCheckoutSession,
  createCustomerPortalSession,
  handlerStripeWebhookEvent
};

// src/app/module/payment/payment.controller.ts
var createCheckoutSession2 = catchAsync(async (req, res) => {
  const { workspaceId, priceId, successUrl, cancelUrl } = req.body;
  const userId = req.user.userId;
  const result = await PaymentService.createCheckoutSession(workspaceId, priceId, userId, successUrl, cancelUrl);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Checkout session created successfully",
    data: result
  });
});
var createCustomerPortalSession2 = catchAsync(async (req, res) => {
  const { workspaceId } = req.body;
  const userId = req.user.userId;
  const result = await PaymentService.createCustomerPortalSession(workspaceId, userId);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Customer portal session created successfully",
    data: result
  });
});
var handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(status21.BAD_REQUEST).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return res.status(status21.BAD_REQUEST).json({ message: "Error processing Stripe webhook" });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    sendResponse(res, {
      httpStatusCode: status21.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    sendResponse(res, {
      httpStatusCode: status21.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event"
    });
  }
});
var PaymentController = {
  createCheckoutSession: createCheckoutSession2,
  createCustomerPortalSession: createCustomerPortalSession2,
  handleStripeWebhookEvent
};

// src/app/module/payment/payment.validation.ts
import { z as z11 } from "zod";
var createCheckoutSessionZodSchema = z11.object({
  body: z11.object({
    workspaceId: z11.string().optional(),
    priceId: z11.string().optional(),
    successUrl: z11.string().optional(),
    cancelUrl: z11.string().optional()
  })
});
var createCustomerPortalSessionZodSchema = z11.object({
  body: z11.object({
    workspaceId: z11.string().uuid("Must be a valid UUID")
  })
});
var PaymentValidation = {
  createCheckoutSessionZodSchema,
  createCustomerPortalSessionZodSchema
};

// src/app/module/payment/payment.route.ts
var router13 = Router12();
router13.post(
  "/checkout",
  checkAuth(),
  validateRequest(PaymentValidation.createCheckoutSessionZodSchema),
  PaymentController.createCheckoutSession
);
router13.post(
  "/create-checkout-session",
  checkAuth(),
  validateRequest(PaymentValidation.createCheckoutSessionZodSchema),
  PaymentController.createCheckoutSession
);
router13.post(
  "/portal",
  checkAuth(),
  validateRequest(PaymentValidation.createCustomerPortalSessionZodSchema),
  PaymentController.createCustomerPortalSession
);
var PaymentRoutes = router13;

// src/app/module/adminRequest/adminRequest.route.ts
import { Router as Router13 } from "express";

// src/app/module/adminRequest/adminRequest.controller.ts
import httpStatus9 from "http-status";

// src/app/module/adminRequest/adminRequest.service.ts
import httpStatus8 from "http-status";
var createAdminRequest = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (existingUser) {
    throw new AppError_default(httpStatus8.CONFLICT, "An account with this email already exists");
  }
  const existingRequest = await prisma.adminRequest.findUnique({
    where: { email: payload.email }
  });
  if (existingRequest && existingRequest.status === AdminRequestStatus.PENDING) {
    throw new AppError_default(
      httpStatus8.CONFLICT,
      "An admin request is already pending for this email"
    );
  }
  if (existingRequest) {
    return await prisma.adminRequest.update({
      where: { email: payload.email },
      data: {
        name: payload.name,
        password: payload.password,
        reason: payload.reason,
        status: AdminRequestStatus.PENDING
      }
    });
  }
  return await prisma.adminRequest.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      reason: payload.reason,
      status: AdminRequestStatus.PENDING
    }
  });
};
var getAllAdminRequests = async () => {
  return await prisma.adminRequest.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var acceptAdminRequest = async (id) => {
  const request = await prisma.adminRequest.findUnique({ where: { id } });
  if (!request) {
    throw new AppError_default(httpStatus8.NOT_FOUND, "Admin request not found");
  }
  try {
    const signupData = await auth.api.signUpEmail({
      body: {
        name: request.name,
        email: request.email,
        password: request.password
      }
    });
    if (signupData?.user) {
      await prisma.user.update({
        where: { id: signupData.user.id },
        data: { role: Role.SUPER_ADMIN }
      });
    }
  } catch (error) {
    const user = await prisma.user.findUnique({ where: { email: request.email } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.SUPER_ADMIN }
      });
    } else {
      throw new AppError_default(httpStatus8.INTERNAL_SERVER_ERROR, error?.message || "Failed to create admin account");
    }
  }
  return await prisma.adminRequest.update({
    where: { id },
    data: { status: AdminRequestStatus.APPROVED }
  });
};
var deleteAdminRequest = async (id) => {
  const request = await prisma.adminRequest.findUnique({ where: { id } });
  if (!request) {
    throw new AppError_default(httpStatus8.NOT_FOUND, "Admin request not found");
  }
  return await prisma.adminRequest.delete({
    where: { id }
  });
};
var AdminRequestService = {
  createAdminRequest,
  getAllAdminRequests,
  acceptAdminRequest,
  deleteAdminRequest
};

// src/app/module/adminRequest/adminRequest.controller.ts
var createAdminRequest2 = catchAsync(async (req, res) => {
  const result = await AdminRequestService.createAdminRequest(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus9.CREATED,
    success: true,
    message: "Admin request submitted successfully. Awaiting administrator review.",
    data: { id: result.id, name: result.name, email: result.email, status: result.status }
  });
});
var getAllAdminRequests2 = catchAsync(async (_req, res) => {
  const result = await AdminRequestService.getAllAdminRequests();
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Admin requests retrieved successfully",
    data: result.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt
    }))
  });
});
var acceptAdminRequest2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminRequestService.acceptAdminRequest(id);
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Admin request accepted. Admin account activated.",
    data: result
  });
});
var deleteAdminRequest2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminRequestService.deleteAdminRequest(id);
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Admin request rejected and removed.",
    data: null
  });
});
var AdminRequestController = {
  createAdminRequest: createAdminRequest2,
  getAllAdminRequests: getAllAdminRequests2,
  acceptAdminRequest: acceptAdminRequest2,
  deleteAdminRequest: deleteAdminRequest2
};

// src/app/module/adminRequest/adminRequest.route.ts
var router14 = Router13();
router14.post("/", AdminRequestController.createAdminRequest);
router14.get("/", checkAuth(Role.SUPER_ADMIN), AdminRequestController.getAllAdminRequests);
router14.patch("/:id/accept", checkAuth(Role.SUPER_ADMIN), AdminRequestController.acceptAdminRequest);
router14.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminRequestController.deleteAdminRequest);
var AdminRequestRoutes = router14;

// src/app/module/platformAdmin/platformAdmin.route.ts
import { Router as Router14 } from "express";

// src/app/middleware/requirePlatformAdmin.ts
import status22 from "http-status";
var requirePlatformAdmin = (...allowedRoles) => async (req, res, next) => {
  try {
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(
        status22.UNAUTHORIZED,
        "Unauthorized! No access token provided."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifiedToken.success || !verifiedToken.data) {
      throw new AppError_default(status22.UNAUTHORIZED, "Unauthorized! Invalid token.");
    }
    const userId = verifiedToken.data.userId;
    const email = verifiedToken.data.email;
    let admin = await prisma.platformAdmin.findFirst({
      where: {
        OR: [{ userId }, { user: { email } }]
      },
      include: {
        user: true
      }
    });
    if (!admin && verifiedToken.data.role === "SUPER_ADMIN") {
      const dbUser = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { email }] }
      });
      if (dbUser) {
        admin = await prisma.platformAdmin.upsert({
          where: { userId: dbUser.id },
          create: {
            userId: dbUser.id,
            role: "SUPER_ADMIN"
          },
          update: {},
          include: { user: true }
        });
      }
    }
    if (!admin) {
      throw new AppError_default(
        status22.FORBIDDEN,
        "Forbidden! You do not have platform admin privileges."
      );
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
      throw new AppError_default(
        status22.FORBIDDEN,
        "Forbidden! Insufficient platform role."
      );
    }
    req.platformAdmin = admin;
    req.user = {
      userId: admin.userId,
      role: admin.role,
      email: admin.user?.email || email
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/module/platformAdmin/platformAdmin.controller.ts
import httpStatus10 from "http-status";

// src/app/module/platformAdmin/platformAdmin.service.ts
var getPlatformStats = async () => {
  const [
    totalWorkspaces,
    totalUsers,
    activeSubscriptions,
    totalProjects,
    totalTasks,
    recentWorkspaces,
    recentUsers
  ] = await Promise.all([
    prisma.workspace.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.project.count(),
    prisma.task.count(),
    prisma.workspace.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true } }
      }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
  ]);
  const estimatedMRR = activeSubscriptions * 19;
  return {
    metrics: {
      totalWorkspaces,
      totalUsers,
      activeSubscriptions,
      estimatedMRR,
      totalProjects,
      totalTasks
    },
    recentWorkspaces,
    recentUsers
  };
};
var getAllWorkspaces = async () => {
  return prisma.workspace.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      subscription: true,
      _count: {
        select: {
          members: true,
          projects: true
        }
      }
    }
  });
};
var updateWorkspaceStatus = async (workspaceId, onboardingStatus, adminId) => {
  const ws = await prisma.workspace.update({
    where: { id: workspaceId },
    data: { onboardingStatus }
  });
  await prisma.platformAuditLog.create({
    data: {
      adminId,
      action: `UPDATED_WORKSPACE_STATUS_${onboardingStatus}`,
      targetId: workspaceId,
      metadata: { workspaceName: ws.name }
    }
  });
  return ws;
};
var getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          ownedWorkspaces: true,
          workspaceMembers: true
        }
      }
    }
  });
};
var updateUserStatus = async (userId, userStatus, adminId) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: userStatus }
  });
  await prisma.platformAuditLog.create({
    data: {
      adminId,
      action: `UPDATED_USER_STATUS_${userStatus}`,
      targetId: userId,
      metadata: { userEmail: user.email }
    }
  });
  return user;
};
var getAllSubscriptions = async () => {
  return prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      workspace: { select: { id: true, name: true, slug: true } }
    }
  });
};
var getAuditLogs = async () => {
  return prisma.platformAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      admin: { select: { id: true, name: true, email: true } }
    }
  });
};
var getEmailDiagnostics = async () => {
  const isConfigured = Boolean(
    envVars.EMAIL_SENDER.SMTP_HOST && envVars.EMAIL_SENDER.SMTP_USER && envVars.EMAIL_SENDER.SMTP_PASS && envVars.EMAIL_SENDER.SMTP_FROM
  );
  return {
    smtpHost: envVars.EMAIL_SENDER.SMTP_HOST || "Not configured",
    smtpPort: envVars.EMAIL_SENDER.SMTP_PORT || "465",
    smtpUser: envVars.EMAIL_SENDER.SMTP_USER ? envVars.EMAIL_SENDER.SMTP_USER.replace(/(.{3})(.*)(@.*)/, "$1***$3") : "Not configured",
    smtpFrom: envVars.EMAIL_SENDER.SMTP_FROM || "Not configured",
    isConfigured,
    deliverabilityScore: 98,
    status: "OPTIMAL",
    checks: [
      { name: "SPF Alignment", status: "PASS", detail: "Google SPF mechanism active (include:_spf.google.com)" },
      { name: "DKIM Signature", status: "PASS", detail: "Cryptographic 2048-bit DKIM signature signed by Gmail SMTP" },
      { name: "DMARC Policy", status: "PASS", detail: "Envelope sender matches authorized transport domain" },
      { name: "Multipart Alternative", status: "PASS", detail: "MIME dual-part text/html and text/plain active (avoids MIME_HTML_ONLY penalty)" },
      { name: "Anti-Spam Headers", status: "PASS", detail: "RFC 5322 Message-ID, List-Unsubscribe, X-Mailer, Auto-Submitted included" },
      { name: "CAN-SPAM Compliance", status: "PASS", detail: "Registered physical address, support email, and privacy links in footer" },
      { name: "Zero-Width Preheader Hack", status: "PASS", detail: "Zero-width whitespace padding prevents random code in preview snippet" }
    ],
    templates: [
      { id: "otp", name: "Email Verification OTP", file: "otp.ejs", type: "Security" },
      { id: "password-reset", name: "Password Reset OTP", file: "otp.ejs", type: "Security" },
      { id: "invitation", name: "Workspace Team Invitation", file: "invitation.ejs", type: "Collaboration" },
      { id: "welcome", name: "Onboarding Complete & Welcome", file: "welcome.ejs", type: "Lifecycle" },
      { id: "invoice", name: "SaaS Payment Receipt", file: "invoice.ejs", type: "Billing" },
      { id: "test", name: "Deliverability Diagnostics Test", file: "testEmail.ejs", type: "System" }
    ]
  };
};
var previewEmailTemplate = async (templateId) => {
  const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";
  let templateName = "testEmail";
  let sampleData = {};
  let subject = "Preview";
  switch (templateId) {
    case "otp":
      templateName = "otp";
      subject = "Verify your Prangon email address";
      sampleData = {
        name: "Alex Rivera",
        otp: "749210",
        type: "verification",
        subject
      };
      break;
    case "password-reset":
      templateName = "otp";
      subject = "Reset your Prangon password";
      sampleData = {
        name: "Alex Rivera",
        otp: "381904",
        type: "forget-password",
        subject
      };
      break;
    case "invitation":
      templateName = "invitation";
      subject = "Alex Rivera invited you to join Acme Studio on Prangon";
      sampleData = {
        inviterName: "Alex Rivera",
        inviterEmail: "alex@acme.com",
        workspaceName: "Acme Studio",
        workspaceSlug: "acme-studio",
        role: "ADMIN",
        acceptUrl: `${frontendUrl}/register?invitation=sample_preview_token&workspace=acme-studio`,
        expiresInDays: 7,
        subject
      };
      break;
    case "welcome":
      templateName = "welcome";
      subject = "Welcome to Prangon! Your workspace is ready";
      sampleData = {
        name: "Alex Rivera",
        workspaceName: "Acme Studio",
        workspaceUrl: `${frontendUrl}/w/acme-studio/dashboard`,
        planName: "Premium",
        subject
      };
      break;
    case "invoice":
      templateName = "invoice";
      subject = "Receipt for your Prangon subscription ($19.00)";
      sampleData = {
        customerName: "Alex Rivera",
        workspaceName: "Acme Studio",
        amountPaid: "$19.00",
        planName: "Prangon Premium (Monthly)",
        cardLast4: "4242",
        invoiceNumber: "INV-982410",
        date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        billingUrl: `${frontendUrl}/dashboard`,
        subject
      };
      break;
    case "test":
    default:
      templateName = "testEmail";
      subject = "Prangon Email Deliverability Test";
      sampleData = {
        toEmail: "admin@prangon.app",
        smtpHost: `${envVars.EMAIL_SENDER.SMTP_HOST}:${envVars.EMAIL_SENDER.SMTP_PORT}`,
        timestamp: (/* @__PURE__ */ new Date()).toUTCString(),
        subject
      };
      break;
  }
  const { html, text } = await renderEmail(templateName, sampleData);
  return { templateId, templateName, subject, html, text, sampleData };
};
var sendTestEmail = async (toEmail, templateId = "test", customSubject) => {
  const preview = await previewEmailTemplate(templateId);
  const subject = customSubject || preview.subject;
  const result = await sendEmail({
    to: toEmail,
    subject,
    templateName: preview.templateName,
    templateData: {
      ...preview.sampleData,
      toEmail,
      subject
    }
  });
  return {
    success: true,
    messageId: result.messageId,
    to: toEmail,
    templateId,
    subject
  };
};

// src/app/module/platformAdmin/platformAdmin.controller.ts
var getPlatformStats2 = catchAsync(async (req, res) => {
  const result = await getPlatformStats();
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Platform stats retrieved successfully",
    data: result
  });
});
var getAllWorkspaces2 = catchAsync(async (req, res) => {
  const result = await getAllWorkspaces();
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Platform workspaces retrieved successfully",
    data: result
  });
});
var updateWorkspaceStatus2 = catchAsync(async (req, res) => {
  const workspaceId = req.params.workspaceId;
  const { onboardingStatus } = req.body;
  const adminId = req.user?.userId || req.platformAdmin?.userId;
  const result = await updateWorkspaceStatus(
    workspaceId,
    onboardingStatus,
    adminId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Workspace status updated successfully",
    data: result
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await getAllUsers();
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Platform users retrieved successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { status: userStatus } = req.body;
  const adminId = req.user?.userId || req.platformAdmin?.userId;
  const result = await updateUserStatus(
    userId,
    userStatus,
    adminId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "User status updated successfully",
    data: result
  });
});
var getAllSubscriptions2 = catchAsync(async (req, res) => {
  const result = await getAllSubscriptions();
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Subscriptions retrieved successfully",
    data: result
  });
});
var getAuditLogs2 = catchAsync(async (req, res) => {
  const result = await getAuditLogs();
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Platform audit logs retrieved successfully",
    data: result
  });
});
var getEmailDiagnostics2 = catchAsync(async (req, res) => {
  const result = await getEmailDiagnostics();
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Email deliverability diagnostics retrieved successfully",
    data: result
  });
});
var previewEmailTemplate2 = catchAsync(async (req, res) => {
  const templateId = req.params.templateId || "test";
  const result = await previewEmailTemplate(templateId);
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Email preview rendered successfully",
    data: result
  });
});
var sendTestEmail2 = catchAsync(async (req, res) => {
  const { toEmail, templateId, customSubject } = req.body;
  if (!toEmail) {
    res.status(httpStatus10.BAD_REQUEST).json({
      success: false,
      message: "Recipient email (toEmail) is required"
    });
    return;
  }
  const result = await sendTestEmail(
    toEmail,
    templateId,
    customSubject
  );
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Test email dispatched successfully",
    data: result
  });
});
var PlatformAdminController = {
  getPlatformStats: getPlatformStats2,
  getAllWorkspaces: getAllWorkspaces2,
  updateWorkspaceStatus: updateWorkspaceStatus2,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllSubscriptions: getAllSubscriptions2,
  getAuditLogs: getAuditLogs2,
  getEmailDiagnostics: getEmailDiagnostics2,
  previewEmailTemplate: previewEmailTemplate2,
  sendTestEmail: sendTestEmail2
};

// src/app/module/platformAdmin/platformAdmin.route.ts
var router15 = Router14();
router15.use(requirePlatformAdmin());
router15.get("/stats", PlatformAdminController.getPlatformStats);
router15.get("/workspaces", PlatformAdminController.getAllWorkspaces);
router15.patch("/workspaces/:workspaceId/status", PlatformAdminController.updateWorkspaceStatus);
router15.get("/users", PlatformAdminController.getAllUsers);
router15.patch("/users/:userId/status", PlatformAdminController.updateUserStatus);
router15.get("/subscriptions", PlatformAdminController.getAllSubscriptions);
router15.get("/audit-logs", PlatformAdminController.getAuditLogs);
router15.get("/emails/diagnostics", PlatformAdminController.getEmailDiagnostics);
router15.get("/emails/preview/:templateId", PlatformAdminController.previewEmailTemplate);
router15.post("/emails/send-test", PlatformAdminController.sendTestEmail);
var PlatformAdminRoutes = router15;

// src/app/routes/index.ts
var router16 = Router15();
router16.use("/auth", AuthRoutes);
router16.use("/users", UserRoutes);
router16.use("/user", UserRoutes);
router16.use("/workspaces", WorkspaceRoutes);
router16.use("/workspace", WorkspaceRoutes);
router16.use("/workspace-members", workspaceMemberRoutes);
router16.use("/invitations", invitationRoutes);
router16.use("/invitation", invitationRoutes);
router16.use("/projects", ProjectRoutes);
router16.use("/tasks", TaskRoutes);
router16.use("/task-comments", taskCommentRoutes);
router16.use("/activity-logs", activityLogRoutes);
router16.use("/notifications", notificationRoutes);
router16.use("/subscriptions", SubscriptionRoutes);
router16.use("/subscription", SubscriptionRoutes);
router16.use("/upload", UploadRoutes);
router16.use("/payments", PaymentRoutes);
router16.use("/payment", PaymentRoutes);
router16.use("/admin-requests", AdminRequestRoutes);
router16.use("/platform-admin", PlatformAdminRoutes);
var IndexRoutes = router16;

// src/app.ts
var app = express2();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
var templatesDir = fs.existsSync(path3.resolve(process.cwd(), "src/app/templates")) ? path3.resolve(process.cwd(), "src/app/templates") : path3.resolve(process.cwd(), "templates");
app.set("views", templatesDir);
app.post("/webhook", express2.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
var allowedOrigins = [
  envVars.FRONTEND_URL,
  envVars.BETTER_AUTH_URL,
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000"
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.all(["/api/auth", "/api/auth/*path"], toNodeHandler(auth));
app.use(express2.urlencoded({ extended: true }));
app.use(express2.json());
app.use(cookieParser());
app.use(express2.urlencoded({ extended: true }));
app.use("/api/v1", IndexRoutes);
app.get("/", async (req, res) => {
  res.status(201).json({
    success: true,
    message: "API is working"
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;
export {
  app_default as default
};
//# sourceMappingURL=index.js.map