<script>
  import { onMount } from 'svelte';
	
	export let codeValue;
	export let squareSize; 
	
  let qrcode;
			
	onMount(() => {

	let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"
    document.head.append(script);
		script.onload = function() {

		qrcode = new QRCode(".room-qrcode", {
		text: codeValue,
		width: squareSize,
        height: squareSize,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
			});		
			
		};				
	  
	});
</script>

<style>
  .room-qrcode {
    margin-top:15px;
  }
</style>

<div class=".room-qrcode"></div>

