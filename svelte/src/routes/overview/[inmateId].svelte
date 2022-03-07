<script lang="typescript" context="module">
  export enum INMATE_SEARCH_MODE { 
    CREATE = 'create', 
    DISAMBIGUATION = 'disambiguation'
  }

  export function load({ params }) {
    const { inmateId } = params
    return { props: { inmateId }}
  }
</script>

<script lang="typescript">
  import { InmateService } from '$lib/services/pbc-service'
  import type { Inmate, InmateNoID } from '$lib/services/pbc-service'

  export let inmateId: string
  export let getInmate: Promise<Inmate | InmateNoID> = new Promise(() => {})

  const findInmate = async () => {
    const inmateWithID = await InmateService.getInmate( inmateId )
    if( inmateWithID ) {
      getInmate = Promise.resolve(inmateWithID)
      return
    }

    const inmateWithoutID = await InmateService.getInmateNoIdByDatabaseID( inmateId )
    if( inmateWithoutID ) {
      getInmate = Promise.resolve(inmateWithoutID)
      return
    }
  }
  
  findInmate()

  const isInmateWithID = ( inmate: Partial<InmateNoID> ) => {
    return !!!( inmate.location )
  }
</script>


<main>
  
  {#await getInmate then inmate}
  { JSON.stringify( inmate ) }
  {#if isInmateWithID( inmate ) }
    <div id="inmate-name">
      <h1 id="" aria-label="Inmate's first and last name, and inmate ID if available">
        { inmate.firstName } { inmate.middleInitial ? inmate.middleInitial + '. ' : '' }{ inmate.lastName }&ensp;
        <span>ID#{ inmate.id }</span>
      </h1>
    </div>
  {:else}
    <div id="inmate-name">
      <h1 id="" aria-label="Inmate's first and last name, and inmate ID if available">
        { inmate.firstName } { inmate.middleInitial ? inmate.middleInitial + '. ' : '' }{ inmate.lastName }
        - <span>{ inmate.location }</span>
      </h1>
    </div>
  {/if}
  {/await}
</main>


<style lang="scss">
  main {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  #inmate-name {
    display: flex;
    flex-flow: row wrap;

    justify-content: space-between;
    align-items: center;

    h1 {
      font-size: 2rem;
    }

    span {
      color: darkslategray;
      font-weight: 700;
      font-size: 1.75rem;
    }
  }
</style>