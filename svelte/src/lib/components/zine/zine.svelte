<script lang="ts">
	import type { Zine } from '$lib/services/pbc-service/models/zine';

	export let zine: Zine = null;
	export let formatForInvoice: boolean = false;
</script>

{#if zine}
	<strong>
		{#if formatForInvoice}
			ZINE
		{:else}
			{zine.threeLetterCode}
		{/if}
	</strong>
	&mdash;
	{zine.title}
{/if}
