import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlCtx = ctx.getContext<{ req: FastifyRequest; res: FastifyReply }>();
    return { req: gqlCtx.req, res: gqlCtx.res };
  }

  protected async getTracker(
    req: FastifyRequest | Record<string, unknown>,
  ): Promise<string> {
    const r = req as { ip?: string; ips?: string[] };
    if (
      Array.isArray(r?.ips) &&
      r.ips.length > 0 &&
      typeof r.ips[0] === 'string'
    ) {
      return Promise.resolve(r.ips[0]);
    }
    if (typeof r?.ip === 'string') {
      return Promise.resolve(r.ip);
    }
    return '';
  }
}
