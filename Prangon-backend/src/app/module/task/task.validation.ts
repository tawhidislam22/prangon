import { z } from "zod";
import { TaskStatus } from "../../../generated/prisma/enums";

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    assigneeId: z.string().optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().optional(),
  }),
});

export const TaskValidation = {
  createTaskSchema,
  updateTaskSchema,
};
