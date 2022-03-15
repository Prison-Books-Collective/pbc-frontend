<script lang="ts" context="module">
	export function load({ params }) {
		const { packageID } = params;
		return { props: { packageID } };
	}
</script>

<script lang="ts">
	import { focusedPackage } from '$lib/stores/package';

	export let packageID: number;
	focusedPackage.fetch(packageID);
</script>

{JSON.stringify($focusedPackage)}
