import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { AdminRequestController } from "./adminRequest.controller";

const router = Router();

// Public submission: from /admin/register
router.post("/", AdminRequestController.createAdminRequest);

// Protected: for existing admins to review and approve/delete
router.get("/", checkAuth(Role.SUPER_ADMIN), AdminRequestController.getAllAdminRequests);
router.patch("/:id/accept", checkAuth(Role.SUPER_ADMIN), AdminRequestController.acceptAdminRequest);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminRequestController.deleteAdminRequest);

export const AdminRequestRoutes = router;