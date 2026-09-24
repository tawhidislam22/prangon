import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { taskCommentService } from "./taskComment.service";

const addComment = catchAsync(async (req, res) => {
    const taskId = req.params.taskId as string;
    const { content } = req.body;
    const authorId = req.user.userId;

    const result = await taskCommentService.addComment(content, taskId, authorId);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Comment added successfully",
        data: result,
    });
});

const listComments = catchAsync(async (req, res) => {
    const taskId = req.params.taskId as string;
    const result = await taskCommentService.listComments(taskId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Comments fetched successfully",
        data: result,
    });
});

export const taskCommentController = {
    addComment,
    listComments,
};
