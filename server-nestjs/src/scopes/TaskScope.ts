import type { AgentCodeScope } from '@agentcode-dev/agentcode-nestjs';

/**
 * Restrict task listings so that "member" role users only see tasks assigned
 * to them. PRD §4 / AC-5.
 */
export class TaskScope implements AgentCodeScope {
  apply(where: Record<string, any>, ctx: { user?: any; userRole?: string | null }) {
    if (ctx.userRole === 'member' && ctx.user?.id) {
      return { ...where, assignedTo: ctx.user.id };
    }
    return where;
  }
}
