<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  const dispatch = createEventDispatcher()

  const KEY_ESCAPE = 'Escape'

  export let visible = false
  export let width = 'auto'
  export let maxWidth = '90vw'
  export let height = 'fit-content'
  export let maxHeight = '100vh'

  export let closeSide: 'right' | 'left' | 'none' | false | null = false
  export let showConfirm = false
  export let confirmText = 'OK'
  export let cancelText = 'Cancel'

  export let confirmCancel = false
  export let confirmCancelText = `Are you sure you want to close this window?`

  export const close = () => {
    if (!confirmCancel) {
      visible = false
      dispatch('close')
      return
    }

    const shouldClose = confirm(confirmCancelText)
    if (shouldClose) {
      visible = false
      dispatch('close')
    }
  }

  export const confirmClicked = (value = null) => {
    close()

    if (!visible) {
      dispatch('confirm', value)
    }
  }
  export const cancelClicked = () => {
    close()

    if (!visible) {
      dispatch('cancel')
    }
  }
  const closeOnEscape = ({ key }: KeyboardEvent) => {
    if (key === KEY_ESCAPE) {
      cancelClicked()
    }
  }
</script>

<svelte:window on:keypress={closeOnEscape} />
{#if visible}
  <section id="modal-container" transition:fade={{ duration: 100 }}>
    <div id="background" on:click|self={close} />
    <div
      id="modal"
      style:width
      style:max-width={maxWidth}
      style:height
      style:max-height={maxHeight}
    >
      {#if !!closeSide && closeSide != 'none'}
        {#if closeSide === 'left'}
          <div class="close-left">
            <button class="button-close" on:click={close}> &times; </button>
          </div>
        {/if}
        <div class="space-top" />
        {#if closeSide === 'right'}
          <div class="close-right">
            <button class="button-close" on:click={close}> &times; </button>
          </div>
        {/if}
      {/if}

      <div class="content" class:content-extra-padding={!closeSide || closeSide === 'none'}>
        {#each Object.keys($$slots) as _}
          <slot />
        {/each}
      </div>

      {#if showConfirm}
        <div class="confirm">
          <button on:click={confirmClicked}>
            {confirmText}
          </button>
        </div>
        <div class="space-bottom" />
        <div class="cancel">
          <button on:click={cancelClicked}>
            {cancelText}
          </button>
        </div>
      {/if}
    </div>
  </section>
{/if}

<style lang="scss">
  button {
    margin: 0px;
    box-shadow: none;
    background: none;
    border-radius: 0px;
    border: none;
    color: #333;
    font-size: 1em;
    padding: 0.75em;
    text-decoration: none;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .button-close {
    padding-bottom: 0em;
    color: rgba(0, 0, 0, 0.3);
  }

  #modal-container {
    z-index: 999;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  #background {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
  }

  #modal {
    background-color: #eaeaea;
    z-index: 100;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.3);
    overflow: auto;
    border-radius: 3px;
    max-height: 90vh;

    transition-duration: 0.3s;
    display: grid;
    grid-template-areas:
      'close-left space-top close-right'
      'content content content'
      'confirm space-bottom cancel';

    .close-left {
      grid-area: close-left;
      text-align: left;
      font-size: 1.5em;
    }

    .close-right {
      grid-area: close-right;
      text-align: right;
      font-size: 1.5em;
    }

    .content {
      grid-area: content;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      padding: 1.5em;
      padding-top: 0.5em;
    }

    .content-extra-padding {
      padding: 1.5em;
    }

    .confirm {
      grid-area: confirm;
      padding: 0.5em;
    }

    .cancel {
      grid-area: cancel;
      padding: 0.5em;
      text-align: right;
    }

    .space-top,
    .space-bottom {
      width: 100%;
    }
  }

  @media (max-width: 500px) {
    #modal {
      position: absolute;
      top: 20px;
      left: 0px;
      right: 0px;
      bottom: 20px;
      border-radius: 0px;
      max-width: 100vw;
      width: 100vw;
      max-height: 100vh;
      overflow: auto;
    }
  }
</style>
