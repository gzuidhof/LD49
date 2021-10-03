import { Context, HttpStatus } from "sunder";
import { Env } from "../../environment";
import {generateRandomToken} from "@sunder/kit/crypto/random"
import {base} from "@sunder/kit/encoding/baseX";

const DICTIONARY = "2345679ADEFGHJKLMNPQRSTUVWXYZ"; // 29 chars (no 0, O, I, 1, B, 8)
const baseNoConfusion = base(DICTIONARY);

// We use Base58 so we don't include I, l, 0 and O to prevent common human mistakes copying.

const ROOM_STATE_PREFIX = "ROOM_";
const MAX_ROOM_AGE = 60 * 60 * 24 * 3; // 3 days

interface RoomData {
    roomCode: string;
    createdAt: number;
    durableObjectId: string;
}

export function generateRoomCode() {
    return generateRandomToken(48, baseNoConfusion).substring(0, 4).toUpperCase();
}

export async function handleRoomRequest(ctx: Context<Env>) {
    const now = Date.now() / 1000;

    let roomCode!: string;
    let roomStorageKey!: string;

    // We make some attempts to find a room that is available..
    for (let i = 0; i < 6; i++) {
        roomCode = generateRoomCode();
        roomStorageKey = ROOM_STATE_PREFIX + roomCode;
        const room = await ctx.state.storage.get<RoomData>(roomStorageKey);
        if (room === undefined) {
            break;
        } else if (now - room.createdAt > MAX_ROOM_AGE) {
            await ctx.state.storage.delete(roomStorageKey);
        }
        if (i === 6-1) {
            return ctx.throw("Couldn't find available room code :(");
        }
    }

    const id = ctx.env.ROOM_DURABLE_OBJECT.newUniqueId();
    const roomData: RoomData = {
        roomCode: roomCode,
        durableObjectId: id.toString(),
        createdAt: now,
    }

    await ctx.state.storage.put<RoomData>(roomStorageKey, {
        roomCode: roomCode,
        durableObjectId: id.toString(),
        createdAt: now,
    });

    ctx.response.body = {
        room: roomData
    };
    ctx.response.status = HttpStatus.Created;
}

export async function handleRoomLookup(ctx: Context<Env, {roomCode: string}>) {
    const now = Date.now() / 1000;

    let roomStorageKey = ROOM_STATE_PREFIX + ctx.params.roomCode;
    const roomData = await ctx.state.storage.get<RoomData>(roomStorageKey);

    if (roomData === undefined) {
        ctx.throw(404, "Room not found");
        console.log("THROOW");
        return;
    }

    if (now - roomData.createdAt > MAX_ROOM_AGE) {
        // About time we cleaned it up.
        await ctx.state.storage.delete(roomStorageKey);
        ctx.response.status = HttpStatus.NotFound;
        return;
    }

    ctx.response.body = {
        room: roomData
    };
}
