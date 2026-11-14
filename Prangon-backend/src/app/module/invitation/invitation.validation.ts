import z from "zod";
import { WorkspaceRole } from "../../../generated/prisma/enums";

const createInvitationSchema = z.object({
  body: z.object({
    email: z.string().email().transform((val) => val.trim().toLowerCase()),
    role: z.nativeEnum(WorkspaceRole).nullish().default(WorkspaceRole.MEMBER),
    workspaceId: z.string().optional(),
    workspaceSlug: z.string().optional(),
  })
});

const acceptInvitationSchema = z.object({
  body: z.object({
    token: z.string(),
  })
});

export const invitationValidation = {
  createInvitationSchema,
  acceptInvitationSchema,
};
