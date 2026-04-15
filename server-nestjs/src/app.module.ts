import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import {
  AgentCodeModule,
  JwtAuthGuard,
  ResponseInterceptor,
} from '@agentcode-dev/agentcode-nestjs';

import { buildAgentCodeConfig } from './agentcode.config';
import { PublicPathsMiddleware } from './public-paths.middleware';
import { createExtendedPrisma } from './prisma-extensions';

const prisma = createExtendedPrisma();

@Module({
  imports: [
    AgentCodeModule.forRoot(buildAgentCodeConfig(prisma), {
      registerControllers: true,
      autoAuthGuard: false,
      autoPolicyGuard: true,
      autoRouteGroupMiddleware: false, // bug BP-006
      autoTenantMiddleware: false,     // bug BP-001 — using TenantRewriteMiddleware
    }),
  ],
  providers: [
    PublicPathsMiddleware,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicPathsMiddleware).forRoutes('*');
  }
}
