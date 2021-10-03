import { Context, HttpStatus } from "sunder";
import { Env } from "../environment";
import {RateLimiterClient} from "../durableObjects/ratelimit/client";

export function ratelimitByIP(name: string, maxFrequency: number) {
    return async (ctx: Context<Env>, next: Function) => {
        const ip = ctx.request.get("CF-Connecting-IP");
        // We really don't have to be creating this every time..
        const limiterId = ctx.env.RATE_LIMITER_DURABLE_OBJECT.idFromName(`LIMITER_${name}_${ip}`);
        const client = new RateLimiterClient(() => ctx.env.RATE_LIMITER_DURABLE_OBJECT.get(limiterId), (err) => console.error(err), maxFrequency);

        if (client.checkLimit()) {
            await client.callLimiter()
            await next();
        } else {
            ctx.response.body = `You are being rate limited, wait a while before trying again.`
            ctx.response.status = HttpStatus.TooManyRequests;
            return;
        }
    }
}
