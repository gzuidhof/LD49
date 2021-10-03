import {generateRandomToken} from "@sunder/kit/crypto"
import {base36} from "@sunder/kit/encoding";

export function generateClientId() {
    return generateRandomToken(32, base36)
}
