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

    Current rotation: {current.alpha} {current.beta} {current.gamma}
</div>

