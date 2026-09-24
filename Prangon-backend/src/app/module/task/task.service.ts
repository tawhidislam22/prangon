import { prisma } from "../../lib/prisma";
import { TaskStatus } from "../../../generated/prisma/enums";
import { activityLogService } from "../activityLog/activityLog.service";
import { notificationService } from "../notification/notification.service";

const createTask = async (userId: string, payload: {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  projectId: string;
  assigneeId?: string;
}) => {
  // Verify user is a member of the workspace that contains this project
  const project = await prisma.project.findUnique({
    where: { id: payload.projectId },
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

  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status || TaskStatus.TODO,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      projectId: payload.projectId,
      workspaceId: project.workspaceId,
      creatorId: userId,
      assigneeId: payload.assigneeId,
    },
  });

  await activityLogService.logActivity(
    "Created task",
    "Task",
    task.id,
    project.workspaceId,
    userId,
    `Created task ${task.title}`
  );

  if (task.assigneeId) {
    await notificationService.createNotification(
      `You have been assigned to task ${task.title}`,
      task.assigneeId,
      `You have been assigned to a new task in project ${project.name}`,
      undefined,
      project.workspaceId
    );
  }

  return task;
};

const getTasksByProject = async (userId: string, projectId: string) => {
  // Verify user is a member of the workspace that contains this project
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

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
    take: 50,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });

  return tasks;
};

const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: { userId }
              }
            }
          }
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          }
        }
      }
    }
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this task");
  }

  const activityLogs = await prisma.activityLog.findMany({
    where: {
      entityType: "Task",
      entityId: taskId,
    },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      }
    }
  });

  return {
    ...task,
    activityLogs,
  };
};


const updateTask = async (userId: string, taskId: string, payload: {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
}) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this task");
  }

  const updateData: any = {
    ...payload,
  };

  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  if (payload.status && payload.status !== task.status) {
    await activityLogService.logActivity(
      "Updated task status",
      "Task",
      updatedTask.id,
      task.project.workspaceId,
      userId,
      `Changed status of task ${updatedTask.title} to ${updatedTask.status}`
    );
  }

  if (payload.assigneeId && payload.assigneeId !== task.assigneeId) {
    await notificationService.createNotification(
      `You have been assigned to task ${updatedTask.title}`,
      payload.assigneeId,
      `You have been assigned to a task in project ${task.project.name}`,
      undefined,
      task.project.workspaceId
    );
  }

  return updatedTask;
};

const deleteTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.workspace.members.length === 0) {
    throw new Error("Unauthorized: User is not a member of the workspace containing this task");
  }

  const deletedTask = await prisma.task.delete({
    where: { id: taskId },
  });

  return deletedTask;
};

export const TaskService = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};
