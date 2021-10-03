import { Context, HttpStatus } from "sunder";
import { Env } from "../environment";
import {RateLimiterClient} from "../durableObjects/ratelimit/client";

const nameToLimiter: Map<string, RateLimiterClient> = new Map();

export function ratelimitByIP(name: string, maxFrequency: number) {
    return async (ctx: Context<Env>, next: Function) => {
        if (ctx.request.method === "OPTIONS") {
            await next();
            return;
        }

        const ip = ctx.request.get("CF-Connecting-IP");
        // We really don't have to be creating this every time..

        const limiterName = `LIMITER_${name}_${ip}`;
        const limiterId = ctx.env.RATE_LIMITER_DURABLE_OBJECT.idFromName(limiterName);

        let limiter = nameToLimiter.get(limiterName);
        if (limiter === undefined) {
            limiter = new RateLimiterClient(() => ctx.env.RATE_LIMITER_DURABLE_OBJECT.get(limiterId), (err) => console.error(err), maxFrequency);
            nameToLimiter.set(limiterName, limiter);
        }

        if (limiter.checkLimit()) {
            await next();
        } else {
            ctx.throw(HttpStatus.TooManyRequests, "You are being rate limited, please wait a while and try again.");
        }
    }
}
