import z from "zod";
import { WorkspaceRole } from "../../../generated/prisma/enums";

const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(WorkspaceRole).optional(),
});

const updateRoleSchema = z.object({
  role: z.nativeEnum(WorkspaceRole),
});

export const workspaceMemberValidation = {
  addMemberSchema,
  updateRoleSchema,
};
