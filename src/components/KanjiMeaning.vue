<template>
	<div :id="`meaning-node-${meaning}`" class="container">
		<div draggable=true @dragstart="onDrag">
			<div class="puzzle-hole-container">
				<div :class="puzzleHoleClasses">
					<div class="puzzle-hole-shadow-hider"></div>
				</div>
			</div>
			<div class="meaning">
				<span>{{ meaning }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { defineProps, computed } from 'vue'
	const props = defineProps({
		meaning: String,
		attachedCharacter: String
	});	
	const puzzleHoleClasses = computed(() => {
		const classes = ['puzzle-hole']
		if(props.attachedCharacter) {
			classes.push('no-shadow')
		}
		return classes.join(' ')
	})

	function onDrag(e) {
		e.dataTransfer.setData("text", JSON.stringify({ 
				meaning: props.meaning,
				attachedCharacter: props.attachedCharacter
			})
		) // Second property is character the meaning is currently attached to
	}
</script>

<style scoped>
	.container {
		margin: auto;
		width: 100px;
	}
	.meaning {
		margin-bottom: 20px;
		position: relative;
		padding: 10px;
		display: flex;
		justify-content: center;
		width: 100px;
		background-color: #81c8be;
		color: #232634;
		font-size: 20px;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		word-wrap: break-word;
		text-align: center;
		box-shadow: 2px 2px 2px #0004;
	}
	.meaning span {
		user-select: none;
	}
	.puzzle-hole-container {
		display: flex;
		justify-content: center;
	}
	.puzzle-hole {
		position: relative;
		width: 40px;
		height: 30px;
		background-color:	#81c8be;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		box-shadow: 2px 2px 2px #0004;
		z-index: 1;
	}
	.no-shadow {
		box-shadow: initial;
	}
	.puzzle-hole::before {
		position: absolute;
		content: "";
		left: 0;
		transform: translateX(-100%);
		border-bottom-right-radius: 10px;
		width: 30px;
		height: 30px;
		box-shadow: 0px 10px 0px #81c8be;
	}
	.puzzle-hole::after {
		position: absolute;
		content: "";
		right: 0;
		transform: translateX(100%);
		border-bottom-left-radius: 10px;
		width: 30px;
		height: 30px;
		box-shadow: 0px 10px 0px #81c8be;
	}
	.puzzle-hole-shadow-hider {
		position: absolute;
		width: 100%;
		height: 10px;
		bottom: -5px;
		background-color: #81c8be;
}
</style>
