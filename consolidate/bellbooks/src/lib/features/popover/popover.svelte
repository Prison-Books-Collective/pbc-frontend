<script lang="ts">
  import { onMount } from 'svelte'

  type Corner = 'top left' | 'top right' | 'bottom left' | 'bottom right'
  type Edge = 'top' | 'bottom' | 'left' | 'right'
  type AnchorPoint = Corner | Edge | 'center'
  type Coordinates = { x: number; y: number }
  type Dimensions = { width: number; height: number }

  export let trackMouse = false
  export let anchor: HTMLElement | Coordinates = { x: 0, y: 0 }
  export let anchorOffset: Coordinates = { x: 0, y: 0 }
  export let anchorPoint: AnchorPoint = 'bottom'

  let card: HTMLElement

  let mouse = {
    x: 0,
    y: 0,
  }

  let viewport = {
    width: 0,
    height: 0,
  }

  onMount(() => {
    captureScreen(window)
  })

  function captureMouse(e: MouseEvent) {
    if (trackMouse) mouse = { x: e.clientX, y: e.clientY }
  }

  function captureScreen(w: Window) {
    viewport = { width: w.innerWidth, height: w.innerHeight }
  }

  function getFitPosition(
    { clientWidth: width, clientHeight: height }: HTMLElement, // element to fit, ie card
    { x, y }: Coordinates, // coordinates to anchor to
    fromAnchor: AnchorPoint,
    viewport: Dimensions,
    offsetBy: Coordinates = { x: 0, y: 0 },
  ) {
    // given the dimensions and my placement, where does it end up?
    let startX, endX, startY, endY
    if (fromAnchor.split(' ').length === 1) {
      // "single edge"/center case
      switch (fromAnchor) {
        case 'center':
          startX = x - width / 2
          endX = x + width / 2
          startY = y - height / 2
          endY = y + height / 2
          break
        case 'top':
          startX = x - width / 2
          endX = x + width / 2
          startY = y - offsetBy.y - height
          endY = y - offsetBy.y
          break
        case 'bottom':
          startX = x - width / 2
          endX = x + width / 2
          startY = y + offsetBy.y
          endY = y + offsetBy.y + height
          break
        case 'left':
          startX = x - offsetBy.x - width
          endX = x - offsetBy.x
          startY = y - height / 2
          endY = y + height / 2
          break
        case 'right':
          startX = x + offsetBy.x
          endX = x + offsetBy.x + width
          startY = y - height / 2
          endY = y + height / 2
          break
      }
    } else {
      if (fromAnchor.includes('top')) {
        startY = y - offsetBy.y - height
        endY = y - offsetBy.y
      } else if (fromAnchor.includes('bottom')) {
        startY = y + offsetBy.y
        endY = y + offsetBy.y + height
      }
      if (fromAnchor.includes('left')) {
        startX = x - offsetBy.x - width
        endX = x - offsetBy.x
      } else if (fromAnchor.includes('right')) {
        startX = x + offsetBy.x
        endX = x + offsetBy.x + width
      }
    }

    // if it goes off the top edge, rest it on the top edge
    // OR if it goes off the bottom edge, rest it on the bottom edge
    if (startY < 0) startY = 0
    if (endY > viewport.height) startY = viewport.height - height

    // if it goes off the left edge, rest it on the left edge
    // OR if it goes off the right edge, rest it on the right edge
    if (startX < 0) startX = 0
    if (endX > viewport.width) startX = viewport.width - width

    return `top: ${startY}px; left: ${startX}px`
  }

  function getAnchorCoordinates(element: HTMLElement, anchorPoint: AnchorPoint): Coordinates {
    switch (anchorPoint) {
      case 'top left':
        return { x: element.offsetLeft, y: element.offsetTop }
      case 'top right':
        return { x: element.offsetLeft + element.offsetWidth, y: element.offsetTop }
      case 'bottom left':
        return { x: element.offsetLeft, y: element.offsetTop + element.offsetHeight }
      case 'bottom right':
        return {
          x: element.offsetLeft + element.offsetWidth,
          y: element.offsetTop + element.offsetHeight,
        }

      case 'top':
        return { x: element.offsetLeft + element.offsetWidth / 2, y: element.offsetTop }
      case 'bottom':
        return {
          x: element.offsetLeft + element.offsetWidth / 2,
          y: element.offsetTop + element.offsetHeight,
        }
      case 'left':
        return { x: element.offsetLeft, y: element.offsetTop + element.offsetHeight / 2 }
      case 'right':
        return {
          x: element.offsetLeft + element.offsetWidth,
          y: element.offsetTop + element.offsetHeight / 2,
        }
      case 'center':
        return {
          x: element.offsetLeft + element.offsetWidth / 2,
          y: element.offsetTop + element.offsetHeight / 2,
        }
    }
  }

  $: getPosition = () => {
    if (!viewport || !card) return
    if (anchor) {
      if ('x' in anchor && 'y' in anchor)
        // anchor is type Coordinates
        return getFitPosition(card, anchor, anchorPoint, viewport, anchorOffset)
      // anchor is type HTMLElement
      else
        return getFitPosition(
          card,
          getAnchorCoordinates(anchor, anchorPoint),
          anchorPoint,
          viewport,
          anchorOffset,
        )
    }
    if (trackMouse) return getFitPosition(card, mouse, anchorPoint, viewport, anchorOffset)
  }
</script>

<svelte:window on:mousemove={captureMouse} on:resize={({ target }) => captureScreen(target)} />

<div data-layout="popover" style={getPosition()} bind:this={card}>
  <slot />
</div>

<style lang="scss">
  [data-layout='popover'] {
    position: absolute;
    z-index: 1;

    max-width: 100vw;
  }
</style>
