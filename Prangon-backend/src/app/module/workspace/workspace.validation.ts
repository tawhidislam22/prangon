import { z } from "zod";

const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Workspace name cannot be empty"),
    slug: z.string()
      .trim()
      .min(3, "Workspace slug must be at least 3 characters")
      .max(50, "Workspace slug cannot exceed 50 characters")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z.string().optional(),
    logoUrl: z.string().optional(),
    industry: z.string().optional(),
    companySize: z.string().optional(),
    onboardingStatus: z.string().optional(),
  }),
});

const updateWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    slug: z.string()
      .trim()
      .min(3, "Workspace slug must be at least 3 characters")
      .max(50, "Workspace slug cannot exceed 50 characters")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens")
      .optional(),
    logoUrl: z.string().optional(),
    industry: z.string().optional(),
    companySize: z.string().optional(),
    onboardingStatus: z.string().optional(),
  }),
});

export const WorkspaceValidation = {
  createWorkspaceSchema,
  updateWorkspaceSchema,
};
