<script lang="ts">
  import { onMount } from 'svelte';
  import type { BeamerClient } from '../api/client';
  import Phaser from "phaser";

  export let client: BeamerClient;
	
  let game: Phaser.Game;

  client.onMessage = (msg => {
      if (msg.b) { // We use the beta value for the tilt
        rotationRate = msg.b;
      }
  })

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  $: rotationRate = 30;
  let player: any;
  let speed = 120;
  let frameNumber = 0;
  $: score = 0;
  $: bestScore = 0;

  let allPoints = [];
			
	onMount(() => {
        const config = {
            type: Phaser.AUTO,
            width: 840,
            height: 600,
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
            parent: "game-area"
        }

        game = new Phaser.Game(config);
        function preload ()
        {
            this.load.image("plane", "/plane.png");
            this.load.image("point", "/point.png");
            this.load.audio("yay", "/pointsound.wav");
            this.load.audio("music", "/music.wav");
        }

        function create ()
        {
            player = this.physics.add.sprite(200, 300, "plane");
            player.setGravity(0);

            const music = this.sound.play("music", {loop: -1});
        }

        function update ()
        {
            if (frameNumber % 200 === 0) {
                const p = this.physics.add.sprite(Phaser.Math.Between(0, this.game.config.width), Phaser.Math.Between(0, this.game.config.height), "point");
                allPoints.push(p);
                this.physics.add.collider(player, p, (player, point) => {
                    point.destroy();
                    score += 50;
                    try {
                    this.sound.play("yay");
                    } catch(e){}
                });
            }

            frameNumber ++;
            if (player.y < -10 || player.y > 610) {
                player.y = 300;
                player.x = 200;
                speed = 120;
                score = 0;
                if (score > bestScore) {
                    bestScore = score;
                }
                allPoints.forEach(p => {
                    p.destroy();
                })
            }
            if (player.x < -10 || player.x > 850) {
                player.y = 300;
                player.x = 200;
                speed = 120;
                score = 0;
                if (score > bestScore) {
                    bestScore = score;
                }
                allPoints.forEach(p => {
                    p.destroy();
                })
            }

            score += 0.01
            speed = speed + 0.06;

            player.angle = player.angle + clamp(rotationRate * 0.05 + speed / 100_000, -1.25, 1.25)
            const vec = this.physics.velocityFromAngle(player.angle, speed);
  
            player.body.setVelocity(vec.x, vec.y);        
    
        }
    });
</script>

<style>
</style>

<div id="game-area">

</div>
<h1>🌟 Score: {Math.round(score)}</h1>

<h2>💯 Your best score: {Math.round(bestScore)}</h2>

<code>Current rotation from phone: {rotationRate}</code>

<code>Speed: {Math.round(speed)}</code>

