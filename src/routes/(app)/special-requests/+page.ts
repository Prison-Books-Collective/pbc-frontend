/** @type {import('./$types').PageLoad} */ 
export async function load({ fetch }) {
  const response = await fetch('http://localhost:8080/getAllSpecialRequests')
    return {
    specialRequests: await response.json(),
  }
}
