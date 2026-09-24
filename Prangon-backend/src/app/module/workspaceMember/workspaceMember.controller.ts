import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { workspaceMemberService } from "./workspaceMember.service";

const addMember = catchAsync(async (req, res) => {
    const workspaceId = (req.params.workspaceId || req.body.workspaceId || req.body.workspaceSlug || req.query.workspaceId || req.query.workspaceSlug) as string;
    const { userId, role } = req.body;
    const result = await workspaceMemberService.addMember(workspaceId, userId, role);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Member added successfully",
        data: result,
    });
});

const listMembers = catchAsync(async (req, res) => {
    const workspaceId = (req.params.workspaceId || req.query.workspaceId || req.query.workspaceSlug) as string | undefined;
    const result = await workspaceMemberService.listMembers(workspaceId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Members fetched successfully",
        data: result,
    });
});

const updateRole = catchAsync(async (req, res) => {
    const memberId = (req.params.memberId || req.params.id) as string;
    const workspaceId = (req.params.workspaceId || req.body.workspaceId || req.body.workspaceSlug) as string | undefined;
    const { role } = req.body;
    const callerUserId = (req as any).user?.userId;
    const result = await workspaceMemberService.updateRole(workspaceId, memberId, role, callerUserId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Member role updated successfully",
        data: result,
    });
});

const removeMember = catchAsync(async (req, res) => {
    const memberId = (req.params.memberId || req.params.id) as string;
    const workspaceId = (req.params.workspaceId || req.body?.workspaceId || req.body?.workspaceSlug) as string | undefined;
    const callerUserId = (req as any).user?.userId;
    const result = await workspaceMemberService.removeMember(workspaceId, memberId, callerUserId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Member removed successfully",
        data: result,
    });
});

export const workspaceMemberController = {
    addMember,
    listMembers,
    updateRole,
    removeMember,
};
