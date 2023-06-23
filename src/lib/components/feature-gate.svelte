<script lang="ts">
  import { isFeatureEnabled } from '$util/app-config'

  const ALL_REQUIRED = 'all'
  const ANY_REQUIRED = 'any'

  export let gate: string | null = null
  export let gates: [typeof ANY_REQUIRED | typeof ALL_REQUIRED, ...string[]] | null = null
  export let enable = isFeatureEnabled(gate ?? '') || evaluateGates(gates) || false

  function evaluateGates(
    gates: readonly [typeof ANY_REQUIRED | typeof ALL_REQUIRED, ...string[]] | null,
  ) {
    const gateKeys = gates ? [...gates] : []
    if (gateKeys.length === 0) return false

    const mode = gateKeys.shift()
    if (mode !== ANY_REQUIRED && mode !== ALL_REQUIRED) return false

    const featureValues = gateKeys.map((key) => isFeatureEnabled(key)).filter((key) => !!key)

    return mode === ANY_REQUIRED
      ? featureValues.length > 0
      : featureValues.length === gateKeys.length
  }
</script>

{#if enable}
  {#each Object.keys($$slots) as _}
    <slot />
  {/each}
{/if}
