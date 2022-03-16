<script lang="ts">
	import { PackageService } from '$lib/services/pbc-service/package.service';
	import { formatDate } from '$lib/util/time';

	const today = formatDate(new Date());
	let getPackageCount = PackageService.getPackageCount(today);
</script>

{#await getPackageCount then packageCount}
	<p>
		You have completed <span id="package-count">{packageCount}</span> packages on
		<date>{today}</date>
	</p>
{/await}

<style>
	#package-count {
		font-weight: 700;
	}
</style>
