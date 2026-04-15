import { PrismaClient } from '@prisma/client';

/**
 * Apply runtime extensions to the PrismaClient before handing it to
 * AgentCodeModule. Currently:
 *
 * - Parse JSON-encoded string columns (user.permissions,
 *   user_roles.permissions) into arrays on read. Workaround for library gap
 *   BP-008; unnecessary if your DB has native JSON/array support and your
 *   schema uses `Json`.
 */
function safeParseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function walk(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(walk);
  if ('permissions' in obj && typeof obj.permissions === 'string') {
    obj.permissions = safeParseArray(obj.permissions);
  }
  for (const k of Object.keys(obj)) {
    if (obj[k] && typeof obj[k] === 'object') obj[k] = walk(obj[k]);
  }
  return obj;
}

export function createExtendedPrisma(): any {
  const prisma = new PrismaClient();
  return prisma.$extends({
    name: 'taskflow-json-columns',
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          const result = await query(args);
          if (['findMany', 'findFirst', 'findUnique', 'findFirstOrThrow', 'findUniqueOrThrow'].includes(operation)) {
            return walk(result);
          }
          return result;
        },
      },
    },
  });
}
