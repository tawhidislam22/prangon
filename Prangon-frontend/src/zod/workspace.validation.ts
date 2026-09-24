import { z } from 'zod';
export const createWorkspaceZodSchema = z.object({
  name: z.string().trim().min(1, 'Workspace name is required'),
  slug: z.string()
    .trim()
    .min(3, 'Workspace slug must be at least 3 characters')
    .max(50, 'Workspace slug cannot exceed 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and single hyphens only')
});
export type ICreateWorkspacePayload = z.infer<typeof createWorkspaceZodSchema>;

