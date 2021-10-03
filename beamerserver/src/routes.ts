import { Router, compose } from "sunder";
import { Env } from "./environment";
import { homeHandler } from "./handlers/home";
import { getRoom, requestRoom } from "./handlers/matchMaking";
import { ratelimitByIP } from "./middleware/ratelimit";

export function registerRoutes(router: Router<Env>) {
    router.get("/", homeHandler);

    router.get("/v1/room/info/:roomCode", compose([ratelimitByIP("request_room_rate_limiter", 4), getRoom]));
    router.get("/v1/room/request", compose([ratelimitByIP("request_room_rate_limiter", 0.2), requestRoom]));

    router.get("/robots.txt", (ctx) => {
        // This disallows all bots/scrapers
        ctx.response.body = `Agent: *\nDisallow: /`;
    });
}
