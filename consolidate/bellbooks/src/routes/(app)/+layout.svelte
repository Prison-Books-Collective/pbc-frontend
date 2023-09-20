<script lang="ts">
  import LoadingScreen from '$features/loading/loading-screen.svelte'
  import NavBar from '$features/navigation/navbar.svelte'
</script>

<LoadingScreen />
<NavBar />

<slot />
