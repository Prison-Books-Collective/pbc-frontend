<script lang="ts">
  import type { Package } from '$models/pbc/package'

  type Mode = 'only' | 'remove'
  const defaultFn = (packages: Package[]) => packages

  export let fn = defaultFn

  let mode: Mode = 'only'

  const getFilterFn = (mode: Mode) => {
    return mode === 'only'
      ? (packages: Package[]) => packages.filter((p) => p.alert)
      : (packages: Package[]) => packages.filter((p) => !p.alert)
  }

  $: fn = getFilterFn(mode)
</script>

<section class="form-options stretch one-line snug">
  <label for="only-rejected" class="outline text-normal">
    <input id="only-rejected" name="only-rejected" type="radio" value="only" bind:group={mode} />
    <strong>Only</strong> Rejected Packages
  </label>
  <label for="remove-rejected" class="outline text-normal">
    <input
      id="remove-rejected"
      name="remove-rejected"
      type="radio"
      value="remove"
      bind:group={mode}
    />
    <strong>Remove</strong> Rejected Packages
  </label>
</section>
