<script lang="ts">
    import { onMount } from "svelte"

//need to get special requests that exist - ask recipient?
export let specialRequests: any[] = null

onMount(() => {
    console.log(specialRequests)
})

</script>

<!-- write html/css  to display special request -->

<!-- once we have component, add to recipient profile -->