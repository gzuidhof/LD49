import App from './App.svelte';

const urlSearchParams = new URLSearchParams(window.location.search);

const roomCode = urlSearchParams.get("room") || "";
const beamerServerUrl = urlSearchParams.get("apiserver") || (urlSearchParams.has("l") || true) ? "http://localhost:8787": "https://beamerserver-a.guido.workers.dev";

const app = new App({
	target: document.body,
	props: {
		quickJoin: !!urlSearchParams.get("room"),
		roomCode: roomCode,
		beamerServerUrl: beamerServerUrl
	}
});

export default app;