import { prisma } from "../../lib/prisma";
import { activityLogService } from "../activityLog/activityLog.service";

const createProject = async (userId: string, payload: { name: string; description?: string; workspaceId: string }) => {
  // Verify user is a member of the workspace
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: payload.workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error("Unauthorized: User is not a member of this workspace");
  }

  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description,
      workspaceId: payload.workspaceId,
    },
  });

  await activityLogService.logActivity(
    "Created project",
    "Project",
    project.id,
    project.workspaceId,
    userId,
    `Created project ${project.name}`
  );

  return project;
};

const getProjectsByWorkspace = async (userId: string, workspaceId: string) => {
  // Verify user is a member of the workspace
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error("Unauthorized: User is not a member of this workspace");
  }

  const projects = await prisma.project.findMany({
    where: {
      workspaceId,
    },
    take: 50,
  });

  return projects;
};

const getProjectById = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }

  return project;
};

const updateProject = async (userId: string, projectId: string, payload: { name?: string; description?: string }) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: payload,
  });

  return updatedProject;
};

const deleteProject = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId }
          }
        }
      }
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this project");
  }

  const deletedProject = await prisma.project.delete({
    where: { id: projectId },
  });

  return deletedProject;
};

export const ProjectService = {
  createProject,
  getProjectsByWorkspace,
  getProjectById,
  updateProject,
  deleteProject,
};
