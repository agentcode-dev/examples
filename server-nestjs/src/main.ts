import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { applyAgentCodeRouting } from '@agentcode-dev/agentcode-nestjs';
import { PrismaClient } from '@prisma/client';

import { AppModule } from './app.module';

const tenantPrisma = new PrismaClient();
const orgCache = new Map<string, any>();

/**
 * Raw-Express tenant rewrite middleware.
 *
 * Workaround for library bug BP-001: `routeGroups.tenant.prefix: ':organization'`
 * is configured but the library never registers GlobalController routes under
 * that dynamic prefix. Nest sees routes as `/api/:modelSlug`, not
 * `/api/:organization/:modelSlug`.
 *
 * This must run BEFORE Nest's router picks the handler, so it's installed
 * via `app.use(...)` in bootstrap, NOT via NestModule.configure().
 *
 * Behavior: if URL matches `/api/<slug>/...` and `<slug>` is a known org slug,
 * attach req.organization and rewrite req.url to drop the slug so the
 * GlobalController still matches.
 */
async function tenantRewrite(req: any, _res: any, next: any) {
  const raw = String(req.url ?? '').split('?')[0];
  const query = String(req.url ?? '').slice(raw.length);

  const m = raw.match(/^\/api\/([^/]+)(\/.*)?$/);
  if (!m) return next();
  const first = m[1];
  if (['auth', 'invitations', 'nested'].includes(first)) return next();

  let org = orgCache.get(first);
  if (org === undefined) {
    org = (await tenantPrisma.organization.findUnique({ where: { slug: first } })) ?? null;
    orgCache.set(first, org);
  }
  if (!org) return next();

  req.organization = org;
  req.__orgSlug = first;
  req.url = `/api${m[2] ?? ''}` + query;
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(tenantRewrite);
  applyAgentCodeRouting(app, { prefix: 'api' });
  const port = Number(process.env.PORT ?? 8004);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`TaskFlow NestJS listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start:', err);
  process.exit(1);
});
