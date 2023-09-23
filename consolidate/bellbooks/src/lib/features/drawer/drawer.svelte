<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { sineInOut } from 'svelte/easing'
  import { page } from '$app/stores'

  const dispatch = createEventDispatcher()

  type Direction = 'left' | 'right' | 'top' | 'bottom'

  export let direction: Direction = 'left'
  export let visible = true

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
        return { x: '300' }
      case 'top':
        return { y: -300 }
      case 'bottom':
        return { y: '300' }
    }
  }

  const getStyleProperties = (direction: Direction) => {
    switch (direction) {
      case 'left':
        return `top: 0rem; bottom: 0px; left: 0px`
      case 'right':
        return `top: 0px; bottom: 0px; right: 0px;`
      case 'top':
        return `top: 0rem; left: 0px; right: 0px`
      case 'bottom':
        return `bottom: 0px; left: 0px; right: 0px`
    }
  }

  const isVertical = (direction: Direction) => {
    switch (direction) {
      case 'left':
      case 'right':
        return false
      default:
        return true
    }
  }

  const isHorizontal = (direction: Direction) => {
    switch (direction) {
      case 'top':
      case 'bottom':
        return false
      default:
        return true
    }
  }

  page.subscribe((_) => {
    if (visible) close()
  })
</script>

<aside data-layout="drawer">
  {#if visible}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      data-layout="fullscreen"
      data-role="overlay"
      transition:fade={{ duration: 300, easing: sineInOut }}
      on:click={() => close()}
    />

    <section
      class="content grainy"
      class:vertical={isVertical(direction)}
      class:horizontal={isHorizontal(direction)}
      transition:fly={{ duration: 300, opacity: 1, ...getTransitionProperties(direction) }}
      style={getStyleProperties(direction)}
    >
      {#each Object.keys($$slots) as _}
        <slot />
      {/each}
    </section>
  {/if}
</aside>

<style>
  [data-layout='drawer'] {
    position: fixed;
    inset: 0;
    z-index: 100;
    pointer-events: none;
  }

  [data-role='overlay'] {
    z-index: -1;
    pointer-events: all;
  }

  .content {
    position: absolute;
    background: var(--color-bg-contrast);
    box-shadow: 2px 2px 10px rgb(0 0 0 / 0.3);
    pointer-events: all;
    background-image: url('../../assets/noise.png');
    background-blend-mode: multiply;
  }

  .content.horizontal {
    width: 100%;
    max-width: min(300px, 100vw);
    height: 100svh;
  }

  .content.vertical {
    height: 100%;
    max-height: min(300px, 100svh);
    width: 100svw;
  }
</style>
