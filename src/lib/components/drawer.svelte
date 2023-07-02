<script lang="ts">
  import { page } from '$app/stores'

  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { sineInOut } from 'svelte/easing'

  const dispatch = createEventDispatcher()

  type Direction = 'left' | 'right' | 'top' | 'bottom'

  export let direction: Direction = 'left'
  export let visible = false

  export function open() {
    visible = true
    dispatch('open')
  }

  export function close() {
    visible = false
    dispatch('close')
  }

  export function toggle() {
    if (visible) return close()
    return open()
  }

  const getTransitionProperties = (direction: Direction) => {
    switch (direction) {
      case 'left':
        return { x: -300 }
      case 'right':
      case 'top':
      case 'bottom':
    }
  }

  const getStyleProperties = (direction: Direction) => {
    switch (direction) {
      case 'left':
        return `top: 5rem, bottom: 0, left: 0`
      case 'right':
        return `top: 5rem, bottom: 0, right: 0`
      case 'top':
        return `top: 5rem, left: 0, right: 0`
      case 'bottom':
        return `bottom: 0, left: 0, right: 0`
    }
  }

  page.subscribe((_) => {
    if (visible) close()
  })
</script>

<aside data-layout="drawer">
  {#if visible}
    <div
      data-layout="backdrop"
      transition:fade={{ duration: 300, easing: sineInOut }}
      on:click={() => close()}
    />

    <section
      class="content"
      transition:fly={{ duration: 300, opacity: 1, ...getTransitionProperties(direction) }}
      style={getStyleProperties(direction)}
    >
      {#each Object.keys($$slots) as _}
        <slot />
      {/each}
    </section>
  {/if}
</aside>

<style lang="scss">
  [data-layout='drawer'] {
    position: fixed;

    z-index: 100;
  }

  [data-layout='backdrop'] {
    background: rgb(0 0 0 / 0.7);
    position: fixed;
    inset: 0;
    z-index: -1;
  }

  .content {
    position: fixed;
    max-width: 60vw;
    width: 350px;
    top: 5rem;
    bottom: 0;
    left: 0;

    background-color: #f6efe9;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 0.3);

    z-index: 1;
  }
</style>
