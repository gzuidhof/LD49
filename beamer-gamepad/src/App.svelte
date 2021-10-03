<script lang="ts">
import { BeamerClient } from "./api/client";
import { generateClientId } from "./api/id";
import QRCode from "./components/QR.svelte";
import Rotato from "./components/Rotato.svelte";
import Game from "./components/Game.svelte";

export let beamerServerUrl: string;
let role: "peer" | "host" | "" = "";
export let roomCode = "";
export let quickJoin = false;

const clientId = generateClientId();


$: quickJoinUrl = document.location.origin + document.location.pathname + "?" + new URLSearchParams({room: roomCode}).toString();

let client: BeamerClient;

async function hostRoom() {
	role = "host";
	client = new BeamerClient(beamerServerUrl, role);
	const roomResponse = await client.requestRoom()

	if (roomResponse.ok) {
		roomCode = roomResponse.data.room.roomCode;
		await client.joinRoom("hostuser", roomCode, clientId)
	} else {
		console.error(roomResponse);
	}
}

async function joinRoom() {
	role = "peer";
	client = new BeamerClient(beamerServerUrl, role);
	await client.joinRoom("gamepad", roomCode, clientId)
}

if (quickJoin) {
	joinRoom();
}

</script>

<main>
	<h1>Full Tilt</h1>

	{#if role === "host" && roomCode}
		<h2>ROOM CODE: {roomCode}</h2>
		<span>Open this on your phone and then scroll down</span>
		<QRCode codeValue={quickJoinUrl} squareSize=200/>
		<a href="{quickJoinUrl}"><code>{quickJoinUrl}</code></a>

		<Game client={client}></Game>
	{/if}

	{#if (role === "")}
	<button on:click={hostRoom}>Click to host a game (on your laptop/desktop)</button>
	
	<p>After that, on your phone:</p>

	<form on:submit|preventDefault={joinRoom}>
		<input placeholder="Enter room code" type="text" pattern="[a-zA-Z0-9]*" maxlength="4" minlength="4" bind:value={roomCode}>
	</form>
	{/if}

	{#if role === "peer"}
	<Rotato client={client}></Rotato>
	{/if}
</main>

<style>
	main {
		display:flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		align-items: center;
		padding: 1em;
		margin: 0 auto;
	}

	input {
		max-width: 320px;
		text-align: center;
		font-size: 1.4em;
		font-weight: bold;
	}
	a {
		color: #d045dc
	}

	h1 {
		color: #d889f5;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 400;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>