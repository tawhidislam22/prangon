import { z } from "zod";

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name cannot be empty"),
    description: z.string().optional(),
    workspaceId: z.string().min(1, "Workspace ID is required"),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
});

export const ProjectValidation = {
  createProjectSchema,
  updateProjectSchema,
};
