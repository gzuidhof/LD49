<script lang="ts">
import type { BeamerClient } from "../api/client";
import { askForDeviceOrientationPermission } from "../api/deviceMotionPermission";

export let client: BeamerClient;
export let current = {
    alpha: null,
    beta: null,
    gamma: null,
}

async function start() {
    await askForDeviceOrientationPermission();
    window.addEventListener("deviceorientation", (ev: DeviceOrientationEvent) => {
        current = {
            alpha: ev.alpha,
            beta: ev.beta,
            gamma: ev.gamma,
        }
    });

    let frameNumber = 0;
    const onFrame = () => {
        frameNumber++;
        if (frameNumber % 3 === 0) {
            client.sendJson({a: current.alpha, b: current.beta, g: current.gamma});
        }
        requestAnimationFrame(onFrame);
    }
    onFrame();
}



</script>

<style>
  
</style>

<div class="rotato">

    <button on:click={start}>Start!</button>

    <p>Current rotation:<br>
    <code>{current.alpha}</code><br>
    <code>{current.beta}</code><br>
    <code>{current.gamma}</code><br>
    </p>
    <br>
    After starting: play the game on your PC, you no longer have to look at this screen. Feel free to turn your phone upside down!

    <b>PROTIP:</b> Lock the screen rotation on your phone.

    <a href="/" style="font-size: 0.75em">Quit this room</a>
</div>

