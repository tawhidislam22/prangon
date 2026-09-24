import z from "zod";

const addCommentSchema = z.object({
  content: z.string().min(1),
});

export const taskCommentValidation = {
  addCommentSchema,
};
