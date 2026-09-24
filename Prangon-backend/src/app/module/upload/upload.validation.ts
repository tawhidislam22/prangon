import { z } from "zod";

const deleteFileZodSchema = z.object({
    body: z.object({
        url: z.string().url("Must be a valid URL")
    })
});

export const UploadValidation = {
    deleteFileZodSchema
};
