<script lang="ts">
    import type { Shipment } from "$models/pbc/shipment"
    import { ShipmentService } from "$services/pbc/shipment.service"
    import { onMount } from "svelte"

    let shipments:Shipment[] = []

    onMount( async () => {
        //numberOfShipments = length of list of shipments from Backend
        shipments = await ShipmentService.getShipmentsByDate(new Date().toISOString().split("T")[0])
        console.log(shipments)
  })

</script>

{#each shipments as shipment}
    {shipment.facility.name} 
{/each}
