<script lang="ts">
	import { fade } from 'svelte/transition';
	import loadingImage from '$assets/loading.svg';

	export let visible = true;
	export let text = 'Loading';
</script>

{#if visible}
	<div class="container" transition:fade>
		<h2>{text}</h2>
		<img class="image" src={loadingImage} alt="loading spinner, network request in progress" />
		{#each Object.keys($$slots) as _}
			<slot />
		{/each}
	</div>
{/if}

<style>
	h2 {
		color: #eaeaea;
	}

	.container {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;

		position: absolute;
		inset: 0px;
		background-color: rgba(0, 0, 0, 0.3);
		color: #eaeaea;

		z-index: 1000;
	}

	.image {
		max-height: 2rem;
		display: inline;
	}
</style>
