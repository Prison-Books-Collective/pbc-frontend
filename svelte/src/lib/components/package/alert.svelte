<script lang="ts">
  import { createEventDispatcher } from 'svelte' 

  import { newPackage } from '$lib/stores/package'
  import { PackageService } from '$lib/services/pbc-service/package.service'

  const dispatch = createEventDispatcher()

  const saveAlert = async (pbcPackage) => {
    try {
      const packageUpdate = await PackageService.updatePackage({
        ...pbcPackage,
        existsInDatabase: undefined,
      })
      dispatch('update', packageUpdate)
    } catch(error) {
      dispatch('error', error)
      console.error('failed to save rejection log for package', error)
    }
  }
</script>


<section class="alert-container">
  <h1>Package Rejection Details</h1>
  <p>Enter details about the rejection to log below</p>
  <form on:submit|preventDefault={() => saveAlert($newPackage)}>
    <textarea 
      name="package-rejection"
      placeholder="Reason the package was rejected"
      cols="30" 
      rows="10"
      bind:value={$newPackage.alert.information}/>
    <button disabled={!$newPackage.alert || !$newPackage.alert.information || $newPackage.alert.information === ''}>Log Rejection for Package</button>
  </form>
</section>


<style lang="scss">
  .alert-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
  }

  textarea {
		padding: 0.5em;
		width: 95%;
		max-width: auto;
		font-size: 1rem;
		background: none;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;
	}

	button {
    margin: 0px;
		width: 100%;
	}
</style>