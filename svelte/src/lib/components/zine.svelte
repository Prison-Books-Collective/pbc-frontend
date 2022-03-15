<script lang="ts">
	import type { Zine } from '$lib/services/pbc-service/models/zine';

	export let zine: Zine = null;
</script>

{#if zine}
	<strong>{zine.threeLetterCode}</strong> &mdash; {zine.title}
{/if}
