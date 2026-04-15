import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import type { AgentCodeConfig } from '@agentcode-dev/agentcode-nestjs';

import { projectsRegistration } from './resources/ProjectResource';
import { tasksRegistration } from './resources/TaskResource';
import { commentsRegistration } from './resources/CommentResource';
import { labelsRegistration } from './resources/LabelResource';

import { TaskScope } from './scopes/TaskScope';

/**
 * Merged AgentCode configuration. Starts from blueprint-generated registrations
 * and layers on:
 *   - Title required (blueprint emits everything optional — see BP-003)
 *   - FK constraints that the blueprint YAML cannot express today (BP-004)
 *   - Per-model scopes (TaskScope)
 *   - Prisma client injection
 */
const projectStore = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  budget: z.number().optional(),
  internalNotes: z.string().optional(),
  startsAt: z.string().datetime({ offset: true }).or(z.date()).optional(),
  endsAt: z.string().datetime({ offset: true }).or(z.date()).optional(),
});
const projectUpdate = projectStore.partial();

const taskStore = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  estimatedHours: z.number().optional(),
  dueDate: z.string().datetime({ offset: true }).or(z.date()).optional(),
  projectId: z.number().int(),
  assignedTo: z.number().int().optional(),
});
const taskUpdate = taskStore.partial();

const commentStore = z.object({
  body: z.string().min(1),
  taskId: z.number().int(),
});
const commentUpdate = z.object({ body: z.string().min(1) });

const labelStore = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

export function buildAgentCodeConfig(prisma: PrismaClient): AgentCodeConfig {
  return {
    prismaClient: prisma as any,
    models: {
      projects: {
        ...projectsRegistration,
        model: 'project', // Prisma delegate is camelCase
        validation: projectStore, // required-title base
        validationStore: {
          owner: projectStore,
          admin: projectStore,
          manager: projectStore.omit({ budget: true, internalNotes: true }),
          '*': z.object({}),
        },
        validationUpdate: {
          owner: projectUpdate,
          admin: projectUpdate,
          manager: projectUpdate.omit({ budget: true, internalNotes: true } as any),
          '*': z.object({}),
        },
      },
      tasks: {
        ...tasksRegistration,
        model: 'task',
        owner: 'project',
        fkConstraints: [{ field: 'projectId', model: 'project' }],
        scopes: [TaskScope],
        validation: taskStore,
        validationStore: {
          owner: taskStore,
          admin: taskStore,
          manager: taskStore,
          member: taskStore.omit({ priority: true, assignedTo: true, estimatedHours: true }),
          '*': z.object({}),
        },
        validationUpdate: {
          owner: taskUpdate,
          admin: taskUpdate,
          manager: taskUpdate,
          member: taskUpdate.pick({ status: true, description: true }),
          '*': z.object({}),
        },
      },
      comments: {
        ...commentsRegistration,
        model: 'comment',
        hasUuid: true,
        owner: 'task.project', // Indirect tenancy — BP-005
        fkConstraints: [{ field: 'taskId', model: 'task' }],
        validation: commentStore,
        validationStore: {
          owner: commentStore,
          admin: commentStore,
          manager: commentStore,
          member: commentStore,
          '*': z.object({}),
        },
        validationUpdate: {
          owner: commentUpdate,
          admin: commentUpdate,
          manager: commentUpdate,
          member: commentUpdate,
          '*': z.object({}),
        },
      },
      labels: {
        ...labelsRegistration,
        model: 'label',
        exceptActions: ['forceDelete'],
        validation: labelStore,
        validationStore: {
          owner: labelStore,
          admin: labelStore,
          '*': z.object({}),
        },
        validationUpdate: {
          owner: labelStore.partial(),
          admin: labelStore.partial(),
          '*': z.object({}),
        },
      },
    },
    routeGroups: {
      auth: {
        prefix: 'auth',
        models: [],
        skipAuth: true,
      },
      tenant: {
        prefix: ':organization',
        models: '*',
      },
    },
    multiTenant: {
      enabled: true,
      organizationIdentifierColumn: 'slug',
      organizationModel: 'organization',
      userOrganizationModel: 'userRole',
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
      jwtExpiresIn: '7d',
      userModel: 'user',
    },
  };
}
