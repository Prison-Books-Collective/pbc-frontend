<script lang="ts">
  import FeatureGate from '$components/feature-gate.svelte'
</script>

<svelte:head>
  <title>BellBooks - Settings & Configuration</title>
</svelte:head>

<main data-layout="page">
  <h1>Settings</h1>

  <section data-layout="list">
    <a href="/admin/zines">
      <article class="list-item">
        <h2>Manage Zines</h2>
      </article>
    </a>

    <a href="/admin/facilities">
      <article class="list-item">
        <h2>Manage Facilities</h2>
      </article>
    </a>

    <FeatureGate gates={['any', 'search shipments by date', 'search shipments by content']}>
      <a href="/admin/shipments">
        <article class="list-item">
          <h2>Shipment Search & Analytics</h2>
        </article>
      </a>
    </FeatureGate>

    <a href="/admin/special-requests">
      <article class="list-item">
        <h2>Create & Manage Special Requests</h2>
      </article>
    </a>
  </section>
</main>

<style lang="scss">
  [data-layout='page'] {
    display: grid;
    grid-template-areas:
      'header'
      'content'
      'footer';
    grid-template-rows:
      7rem
      1fr
      7rem;

    max-width: 1200px;
    margin: auto;

    h1 {
      grid-area: header;
    }

    [data-layout='list'] {
      grid-area: content;
    }

    footer {
      grid-area: footer;
    }
  }

  h1 {
    line-height: 3rem;
    margin-block: 2rem;
  }

  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  [data-layout='list'] {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  .list-item {
    padding-block: 1rem;
    background: var(--color-bg);
    box-shadow: 0px 0px 10px rgb(0 0 0 / 0.3);
  }
</style>
