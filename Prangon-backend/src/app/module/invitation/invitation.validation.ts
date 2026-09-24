import z from "zod";
import { WorkspaceRole } from "../../../generated/prisma/enums";

const createInvitationSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(WorkspaceRole).optional(),
  workspaceId: z.string().optional(),
  workspaceSlug: z.string().optional(),
});

const acceptInvitationSchema = z.object({
  token: z.string(),
});

export const invitationValidation = {
  createInvitationSchema,
  acceptInvitationSchema,
};
