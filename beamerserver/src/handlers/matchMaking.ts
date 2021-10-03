import { Context } from "sunder";

import { Env } from "../environment";
import { buildRoomLookupUrl, REQUEST_ROOM_ENDPOINT } from "../durableObjects/hub/roomHub";

export async function getRoom(ctx: Context<Env, {roomCode: string}>) {
    const id = ctx.env.ROOM_HUB_DURABLE_OBJECT.idFromName("room_hub_v1");
    const hub = ctx.env.ROOM_HUB_DURABLE_OBJECT.get(id);

    const resp = await hub.fetch("https://dummy-url" + buildRoomLookupUrl(ctx.params.roomCode), {
        method: "GET"
    });

    ctx.response.body = resp.body!;
    ctx.response.status = resp.status;
}

export async function requestRoom(ctx: Context<Env>) {
    const id = ctx.env.ROOM_HUB_DURABLE_OBJECT.idFromName("room_hub_v1");
    const hub = ctx.env.ROOM_HUB_DURABLE_OBJECT.get(id);

    const resp = await hub.fetch("https://dummy-url" + REQUEST_ROOM_ENDPOINT, {
        method: "POST"
    });

    ctx.response.body = resp.body!;
    ctx.response.status = resp.status;
}
