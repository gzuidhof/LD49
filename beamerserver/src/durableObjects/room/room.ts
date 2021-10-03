import { Env } from "../../environment";

export class RoomDurableObject {
    constructor(state: DurableObjectState, env: Env) {

    }

    async fetch(request: Request) {
        return new Response('Hello World', );
    }

}