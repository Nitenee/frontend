<template>
	<nav>
		<div class="app-name">
			<div>似</div>
			<div>て</div>
			<div>ね</div>
			<div>ー</div>
			<div>！</div>
		</div>
		<div class="settings-button-container">
			<button class="settings-button" @click.prevent="emit('togglesettings')">
				<CogWheelSVG />
			</button>
		</div>
	</nav>
</template>

<script setup lang='ts'>
	import CogWheelSVG from './CogWheelSVG.vue'

	const emit = defineEmits(['togglesettings'])
</script>

<style scoped>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 5px;
	}
	.app-name {
		margin-left: 10px;
		display: flex;
		user-select: none;
		font-family: 'MikanNoki';
		font-size: 50px;
		font-weight: bold;
		color: var(--color-text);
		-webkit-text-stroke: 1.5pt var(--color-base);
		text-shadow: 2px 2px 2px #0007;
		letter-spacing: -10px;
		transition: translate 0.3s, text-shadow 0.3s;
	}
	.app-name:hover {
		translate: -2px -2px;
		text-shadow: 4px 4px 8px #0007;
	}
	.app-name div:nth-child(odd) {
		translate: 0 -5px;
	}
	.app-name div:nth-child(even) {
		translate: 0 5px;
	}
	.settings-button-container {
		margin-right: 10px;
		display: flex;
		width: 80px;
		height: 50px;
		padding: 5px 10px;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface0);
		border-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.settings-button-container:hover {
		translate: 1px 1px;
		box-shadow: 1px 1px 1px #0007;
	}
	.settings-button {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
		width: 150px;
		height: 35px;
		border-radius: 5px;
		font-size: 20px;
		background-color: var(--color-overlay0);
		box-shadow: 2px 2px 2px #0004;
		transition: translate 0.3s, box-shadow 0.3s;
	}
	.settings-button:hover {
		translate: -2px -2px;
		box-shadow: 4px 4px 8px #0004;
		background-color: var(--color-overlay1);
		cursor: pointer;
	}
	.settings-button svg {
		fill: var(--color-text);
		transition: rotate 0.3s, fill 0.3s;
		filter: drop-shadow(1px 1px #0007);
	}
	.settings-button:hover svg {
		rotate: 90deg;
	}
</style>
