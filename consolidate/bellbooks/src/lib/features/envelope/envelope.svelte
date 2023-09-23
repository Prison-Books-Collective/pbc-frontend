<script lang="ts">
  import { onMount } from 'svelte'

  let screenWidth: number, screenHeight: number

  onMount(() => {})
</script>

<main>
  <form>
    <section class="add-items" />

    <section class="package-list" />

    <section class="add-recipient">
      <div class="sticker">&plus; Add Recipient</div>
    </section>
  </form>

  <svg
    width="100%"
    height="100%"
    viewBox="0 0 239 369"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
  >
    <defs>
      <filter id="light-shadow">
        <feDropShadow dx="0.1" dy="0.1" stdDeviation="1.5" flood-opacity="0.2" />
      </filter>
      <filter id="shadow">
        <feDropShadow dx="0.1" dy="0.1" stdDeviation="2" flood-opacity="0.3" />
      </filter>
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.15"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
    </defs>
    <g>
      <clipPath id="_clip1">
        <path
          d="M0,45.977l7.062,-29.919c0.458,-1.938 1.203,-3.797 2.21,-5.516c2.665,-4.545 6.942,-8.068 14.057,-9.792c2.058,-0.497 4.168,-0.749 6.285,-0.749c9.411,-0 48.153,-0.001 89.834,-0.001c41.682,0 80.423,0.001 89.834,0.001c2.118,0 4.228,0.252 6.286,0.749c7.114,1.724 11.392,5.247 14.056,9.792c1.008,1.719 1.753,3.578 2.21,5.516l7.063,29.919l-0.447,312.265c0.016,0.302 0.024,0.605 0.024,0.909l-0,8.928l-238.474,0l-0,-8.928c0,-1.325 0.151,-2.633 0.442,-3.904l-0.442,-309.27Zm119.448,-36.9c-3.158,-0 -5.722,2.564 -5.722,5.722c-0,3.158 2.564,5.723 5.722,5.723c3.159,-0 5.723,-2.565 5.723,-5.723c-0,-3.158 -2.564,-5.722 -5.723,-5.722Z"
        />
      </clipPath>

      <g clip-path="url(#_clip1)">
        <path
          id="top-lip"
          d="M231.834,16.058l7.063,29.919l-13.287,32.164l-212.323,-0l-13.287,-32.164l7.062,-29.919c0.458,-1.938 1.203,-3.797 2.21,-5.516c2.665,-4.545 6.942,-8.068 14.057,-9.792c2.058,-0.497 4.168,-0.749 6.285,-0.749c9.411,-0 48.153,-0.001 89.834,-0.001c41.682,0 80.423,0.001 89.834,0.001c2.118,0 4.228,0.252 6.286,0.749c7.114,1.724 11.392,5.247 14.056,9.792c1.008,1.719 1.753,3.578 2.21,5.516Zm-112.386,-6.981c-3.158,-0 -5.722,2.564 -5.722,5.722c-0,3.158 2.564,5.723 5.722,5.723c3.159,-0 5.723,-2.565 5.723,-5.723c-0,-3.158 -2.564,-5.722 -5.723,-5.722Z"
          style="fill:#efb84e;"
        />
        <rect
          id="tape"
          x="25.916"
          y="-0"
          width="187.065"
          height="23.975"
          style="fill:#fff;fill-opacity:0.3;"
        />
        <g x="25.916" y="-0" width="187.065" height="23.975">
          <input placeholder="text" />
        </g>
        <path
          id="base"
          d="M238.876,45.89l0.021,0.087l-0.461,322.102l-237.976,0l-0.46,-322.102l0.02,-0.087l40.3,8.078l79.128,6.216l79.128,-6.216l40.3,-8.078Z"
          style="fill:#efb84e; filter:url(#shadow);"
        />
        <path
          id="over-base"
          d="M127.802,368.079l-127.342,0l-0.46,-322.102l0.02,-0.087l40.3,8.078l79.128,6.216l8.354,-0.656l-0,308.551Z"
          style="fill:#efb84e; filter:url(#light-shadow);"
        />
        <path
          id="bottom-lip"
          d="M238.474,368.079c-0,-14.569 -11.811,-26.38 -26.38,-26.38l-185.714,0c-14.569,0 -26.38,11.811 -26.38,26.38l-0,0l238.474,0l-0,0Z"
          style="fill:#efb84e; filter:url(#shadow);"
        />
        <path
          id="metal"
          d="M114.12,72.221l0,-2.121l10.656,-0l0,2.121l-2.91,0c-0.545,0 -0.987,0.442 -0.987,0.987c-0,0.545 0.442,0.986 0.987,0.986l10.063,0c0.545,0 0.987,0.442 0.987,0.987c-0,0.545 -0.442,0.987 -0.987,0.987l-7.153,-0l0,0.039l-2.91,-0c-0.545,-0 -0.987,0.441 -0.987,0.986c-0,0.545 0.442,0.987 0.987,0.987l2.91,-0l0,2.082l-10.656,0l0,-2.082l1.826,-0c0.545,-0 0.986,-0.442 0.986,-0.987c0,-0.545 -0.441,-0.986 -0.986,-0.986l-1.826,-0l0,-0.039l-7.153,-0c-0.545,-0 -0.986,-0.442 -0.986,-0.987c-0,-0.545 0.441,-0.987 0.986,-0.987l8.979,0c0.545,0 0.986,-0.441 0.986,-0.986c0,-0.545 -0.441,-0.987 -0.986,-0.987l-1.826,0Z"
          style="fill: #9C9C9C;"
        />
        <path
          id="mask"
          d="M0,45.977l7.062,-29.919c0.458,-1.938 1.203,-3.797 2.21,-5.516c2.665,-4.545 6.942,-8.068 14.057,-9.792c2.058,-0.497 4.168,-0.749 6.285,-0.749c9.411,-0 48.153,-0.001 89.834,-0.001c41.682,0 80.423,0.001 89.834,0.001c2.118,0 4.228,0.252 6.286,0.749c7.114,1.724 11.392,5.247 14.056,9.792c1.008,1.719 1.753,3.578 2.21,5.516l7.063,29.919l-0.447,312.265c0.016,0.302 0.024,0.605 0.024,0.909l-0,8.928l-238.474,0l0,-8.928c0,-1.325 0.151,-2.633 0.442,-3.904l-0.442,-309.27Zm119.448,-36.9c-3.158,-0 -5.722,2.564 -5.722,5.722c-0,3.158 2.564,5.723 5.722,5.723c3.159,-0 5.723,-2.565 5.723,-5.723c-0,-3.158 -2.564,-5.722 -5.723,-5.722Z"
          style="fill:#efb84e; filter:url(#noise); opacity: 0.15"
        />
      </g>
    </g>
  </svg>
</main>

<style>
  main {
    position: relative;
    aspect-ratio: 239 / 369;
    width: 100%;
    margin: 0px;
    padding: 0px;

    max-width: 800px;
    margin: auto;
  }

  form {
    position: absolute;
    aspect-ratio: 239 / 369;
    width: 100%;
    margin: 0px;
    padding: 0px;
  }

  .package-list {
    width: 100%;
  }

  .add-items {
    aspect-ratio: 239 / 60;
    width: 100%;
  }

  .add-recipient {
    aspect-ratio: 239/60;

    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;

    padding-top: 2rem;
    padding-left: 2rem;
  }

  .sticker {
    background-color: var(--brand-color-primary-white);
    padding: 1rem;
    width: 45%;
    border-radius: 10px;
    font-family: 'Work Sans';

    border: 4px inset rgb(0 0 255 / 0.3);
  }
</style>
