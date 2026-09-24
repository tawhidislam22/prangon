import { prisma } from "../../lib/prisma";

const addComment = async (content: string, taskId: string, authorId: string) => {
    const result = await prisma.taskComment.create({
        data: {
            content,
            taskId,
            authorId,
        }
    });
    return result;
};

const listComments = async (taskId: string) => {
    const result = await prisma.taskComment.findMany({
        where: { taskId },
        take: 50,
        include: {
            author: {
                select: { id: true, name: true, email: true, image: true }
            }
        },
        orderBy: { createdAt: "asc" }
    });
    return result;
};

export const taskCommentService = {
    addComment,
    listComments,
};
