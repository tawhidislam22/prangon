import z from "zod";
import { NotificationType } from "../../../generated/prisma/enums";

const createNotificationSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  type: z.nativeEnum(NotificationType).optional(),
  userId: z.string().uuid(),
  workspaceId: z.string().uuid().optional(),
});

export const notificationValidation = {
  createNotificationSchema,
};
