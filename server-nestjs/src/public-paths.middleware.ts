import { Injectable, NestMiddleware } from '@nestjs/common';

/**
 * Workaround for library bug BP-006 (RouteGroupMiddleware reads req.url which
 * is stripped to the mount prefix). We set req.__skipAuth here by inspecting
 * req.originalUrl directly — this runs before the APP_GUARD.
 */
const PUBLIC_PREFIXES = ['/api/auth/', '/api/invitations/accept'];

@Injectable()
export class PublicPathsMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: any) {
    const url = String(req.originalUrl ?? req.url ?? '').split('?')[0];
    if (PUBLIC_PREFIXES.some((p) => url === p || url.startsWith(p))) {
      req.__skipAuth = true;
    }
    next();
  }
}
