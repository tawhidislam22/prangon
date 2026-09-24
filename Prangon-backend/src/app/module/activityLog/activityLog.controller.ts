import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { activityLogService } from "./activityLog.service";

const listActivity = catchAsync(async (req, res) => {
    const workspaceId = String(req.params.workspaceId);
    const result = await activityLogService.listActivity(workspaceId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Activity logs fetched successfully",
        data: result,
    });
});

export const activityLogController = {
    listActivity,
};
