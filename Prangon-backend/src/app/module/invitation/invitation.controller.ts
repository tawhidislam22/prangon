import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { invitationService } from "./invitation.service";

const createInvitation = catchAsync(async (req, res) => {
    const workspaceId = (req.params.workspaceId || req.body.workspaceId || req.body.workspaceSlug || req.query.workspaceId || req.query.workspaceSlug) as string;
    const { email, role } = req.body;
    const inviterId = req.user.userId;

    const result = await invitationService.createInvitation(email, role, workspaceId, inviterId);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Invitation created successfully",
        data: result,
    });
});

const getInvitationDetails = catchAsync(async (req, res) => {
    const token = (req.params.token || req.query.token) as string;
    const result = await invitationService.getInvitationDetails(token);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitation details fetched successfully",
        data: result,
    });
});

const acceptInvitation = catchAsync(async (req, res) => {
    const { token } = req.body;
    const { userId, email } = req.user;

    const result = await invitationService.acceptInvitation(token, userId, email);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitation accepted successfully",
        data: result,
    });
});

const listInvitations = catchAsync(async (req, res) => {
    const workspaceId = (req.params.workspaceId || req.query.workspaceId || req.query.workspaceSlug) as string | undefined;
    const result = await invitationService.listInvitations(workspaceId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitations fetched successfully",
        data: result,
    });
});

const resendInvitation = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const result = await invitationService.resendInvitation(id);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitation resent successfully",
        data: result,
    });
});

const revokeInvitation = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const result = await invitationService.revokeInvitation(id);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Invitation revoked successfully",
        data: result,
    });
});

export const invitationController = {
    createInvitation,
    getInvitationDetails,
    acceptInvitation,
    listInvitations,
    resendInvitation,
    revokeInvitation,
};
