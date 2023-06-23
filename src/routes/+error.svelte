<main data-layout="page">
  <h1>404</h1>
  <h2>The page you're looking for isn't here</h2>
</main>

<style lang="scss">
  [data-layout='page'] {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    grid-template-areas:
      '.'
      'header'
      'subheader'
      '.';
    grid-template-rows:
      1fr
      6rem
      3rem
      1fr;
  }

  h1 {
    font-size: 5rem;
    grid-area: header;
  }
  h2 {
    grid-area: subheader;
  }
</style>
