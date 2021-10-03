import { Context, HttpStatus } from "sunder";
import { Env } from "../environment";

export function cors() {
    return async (ctx: Context<Env>, next: Function) => {
        ctx.response.set("Access-Control-Allow-Origin", "*");
        ctx.response.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
        ctx.response.set("Access-Control-Allow-Methods", "Content-type");

        if (ctx.request.method === "OPTIONS") {
            return HttpStatus.Ok;
        }

        return next();
    }
}
