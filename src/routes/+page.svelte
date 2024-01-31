<script lang="ts">
	import { SecondOrderDynamics } from '$lib/SecondOrderDynamics';
	import { onMount, onDestroy } from 'svelte';
	import text from '$assets/text.svg?raw';
	import star from '$assets/star.svg?raw';
	import circle from '$assets/circle.svg?raw';

	let x = 0;
	let y = 0;

	let animatedX = 0;
	let animatedY = 0;

	let prevTime: number;

	let requsetId: number | undefined;

	const xAnimation = new SecondOrderDynamics(0.1, 1, x);
	const yAnimation = new SecondOrderDynamics(0.1, 1, y);

	const strength = 0.5;
	const mouseStrength = 0.1;

	function rotate(event: DeviceMotionEvent) {
		if (event.rotationRate === null) return;
		if (event.rotationRate.alpha === null || event.rotationRate.beta === null) return;

		x = event.rotationRate.beta * strength;
		y = event.rotationRate.alpha * strength;
	}

	function bend(x: number) {
		return Math.sign(x) * Math.sqrt(Math.sign(x) * x);
	}

	function move(event: MouseEvent) {
		x = bend(event.clientX - window.innerWidth / 2) * mouseStrength;
		y = bend(event.clientY - window.innerHeight / 2) * mouseStrength;
	}
	function leave() {
		x = 0;
		y = 0;
	}

	function loop() {
		const currentTime = performance.now();
		const delta = currentTime - prevTime;

		animatedX = xAnimation.update(delta, x);
		animatedY = yAnimation.update(delta, y);
		requsetId = requestAnimationFrame(loop);
	}

	let mediaQuery: MediaQueryList;

	function setTouchScreen() {
		if (mediaQuery!.matches) {
			xAnimation.setFZ(0.1, 1);
			yAnimation.setFZ(0.1, 1);
		} else {
			xAnimation.setFZ(1, 1);
			yAnimation.setFZ(1, 1);
		}
	}

	onMount(() => {
		prevTime = performance.now();
		requsetId = requestAnimationFrame(loop);

		mediaQuery = window.matchMedia('(pointer: coarse)');
		mediaQuery.addEventListener('change', setTouchScreen);

		setTouchScreen();
	});

	onDestroy(() => {
		if (requsetId !== undefined) cancelAnimationFrame(requsetId);
		mediaQuery?.removeEventListener('change', setTouchScreen);
	});
</script>

<svelte:window on:devicemotion={rotate} on:mousemove={move} on:mouseout={leave} />

<div class="page">
	<div class="content">
		<div style="transform:translate({animatedX}px, {animatedY}px)">
			{@html text}
		</div>
		<div
			class="star first"
			style="transform:translate({animatedX * 4}px, {animatedY *
				4}px) scale(1.4); filter:blur(2px);"
		>
			{@html star}
		</div>
		<div
			class="star second"
			style="transform:translate({animatedX * 4}px, {animatedY *
				4}px) scale(1.4); filter:blur(2px);"
		>
			{@html star}
		</div>
		<div
			class="star third"
			style="transform:translate({animatedX * -0.5}px, {animatedY * -0.5}px); filter:blur(1px);"
		>
			{@html star}
		</div>

		<div
			class="circle first"
			style="transform:translate({animatedX * 2}px, {animatedY *
				3}px) scale(1.3); filter:blur(1px);"
		>
			{@html circle}
		</div>
		<div
			class="circle second"
			style="transform:translate({animatedX * 2}px, {animatedY *
				3}px) scale(1.3); filter:blur(1px);"
		>
			{@html circle}
		</div>
	</div>
</div>

<style lang="scss">
	.page {
		overflow: hidden;
		height: 100%;
		background: url('./background.png') no-repeat center center;
		background-size: cover;

		.content {
			max-width: 400px;
			margin: 0 auto;
			height: 100%;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			.star {
				position: absolute;
				&.first {
					top: 40px;
					left: 40px;
				}
				&.second {
					bottom: 40px;
					right: 40px;
				}
				&.third {
					bottom: 140px;
					left: 80px;
				}
			}
			.circle {
				position: absolute;
				&.first {
					top: 60px;
					right: 60px;
				}
				&.second {
					bottom: 80px;
					left: 50px;
				}
			}
		}
	}
</style>
