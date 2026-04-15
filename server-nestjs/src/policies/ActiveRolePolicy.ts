import { ResourcePolicy } from '@agentcode-dev/agentcode-nestjs';

/**
 * Workaround for library bug BP-007 — SerializerService calls
 * policy.permittedAttributesForShow(user) without the `org` param, so the
 * library's hasRole() helper always returns false in serializer context.
 *
 * This subclass resolves the "active role" from `user.userRoles[0]` instead
 * of requiring `org`. Works correctly for single-org users (every seeded user
 * matches this). Multi-org users would need a per-request "active org" cookie
 * or header — which is a design gap the library needs to address.
 *
 * Override `resolveActiveRole(user)` if your app stores the active role
 * differently.
 */
export class ActiveRolePolicy extends ResourcePolicy {
  protected override hasRole(user: any, role: string, _organization?: any): boolean {
    const active = this.resolveActiveRole(user);
    return active === role;
  }

  protected resolveActiveRole(user: any): string | null {
    if (!user) return null;
    const userRoles = user.userRoles ?? [];
    return userRoles[0]?.role?.slug ?? null;
  }
}
