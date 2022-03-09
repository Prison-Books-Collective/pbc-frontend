<script lang="ts">
	import { newPackage } from '$lib/stores/package';
</script>

<section class="package-overview">
	{JSON.stringify($newPackage)}

	<nav class="package-options">
		<button>Add Book</button>
		<button>Add Zine(s)</button>
	</nav>
</section>

<style lang="scss">
	.package-overview {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
	}

	.package-options {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		align-items: center;
	}
</style>
