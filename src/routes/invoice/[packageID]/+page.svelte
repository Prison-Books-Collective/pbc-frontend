<script lang="ts">
  import { onMount } from 'svelte'
  import { focusedPackage } from '$stores/package'
  import { delay, formatDateForInvoice } from '$util/time'
  import logo from '$assets/invoice/invoice-logo.svg'
  import information from '$assets/invoice/invoice-information.svg'
  import Zine from '$components/zine/zine.svelte'
  import Book from '$components/book.svelte'

  export let data
  let invoiceDate

  $: {
    if (!data.date) {
      invoiceDate = formatDateForInvoice(new Date($focusedPackage.date))
    } else if (data.date.trim().toLowerCase() === 'today') {
      invoiceDate = formatDateForInvoice()
    } else {
      invoiceDate = formatDateForInvoice(new Date(data.date))
    }
  }

  onMount(() => {
    focusedPackage.fetch(data.packageID).then(async () => {
      if (data.print) {
        await delay(1000)
        window.focus()
        window.print()
      }
    })
  })
</script>

<svelte:head>
  <title>BellBooks - Invoice</title>
</svelte:head>

<div id="page-1" class="page-break">
  <header>
    <div id="logo-container">
      <img id="logo" src={logo} alt="Prison Books Collective Logo" width="150" height="150" />
    </div>

    <div id="header-text-container">
      <span id="pbc-header-title">Prison Books Collective</span>
      <span id="pbc-header-subtitle">Publishing and Distribution</span>
      <span id="address">PO Box 625, Carrboro, NC 27510</span>
    </div>
  </header>

  <div id="break-1" class="line-break" />

  <div id="name-date-container">
    <span id="name-container">______________________________________________________</span>
    <span id="date-container">{invoiceDate}</span>
  </div>

  <p id="information">
    Thank you for your letter, and our apologies for the delay! Due to the number of requests our
    group receives we are currently a month or two behind on filling requests. We are currently
    limited to sending <span class="underline">only 2 books and up to 5 zines</span> per package,
    and 1 package every 2 months.
    <br /><br />
    I've done my best to find the books you've requested, but since our selection is based on donations,
    we usually can't find specific titles. However, I've included books that I hope you'll enjoy!
  </p>

  <div id="break-2" class="line-break" />

  <div id="invoice-label-container">
    <span id="invoice-label">
      <strong class="underline">Invoice:</strong>
    </span>
  </div>

  <div id="package-list-container">
    <ol id="package-list">
      {#each $focusedPackage.content as book}
        <li>
          {#if book.type === 'book'}
            <Book {book} />
          {/if}
          {#if book.type === 'zine'}
            <Zine zine={book} />
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</div>

<img
  class="page-2"
  src={information}
  alt="Information about Prison Books Collective and instructions for requesting service"
/>

<style>
  .page-break {
    page-break-after: always;
  }

  header {
    display: flex;
    flex-flow: row nowrap;
  }

  * {
    font-family: gentium;
  }

  #page-1 {
    font-family: gentium;
  }

  #header-text-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  #logo {
    padding: 20px;
  }

  #pbc-header-title {
    font-size: 52px;
    font-weight: bold;
  }

  #pbc-header-subtitle {
    font-size: 42px;
  }

  #address {
    font-size: 16px;
    padding-top: 10px;
  }

  #name-date-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 35px 85px 25px 85px;

    font-family: Gentium;
    font-size: 10px;
  }

  /* #name-container {

  } */

  #date-container {
    font-size: 16px;
  }

  #information {
    padding: 0px 85px 10px 85px;
    font-size: 18px;
  }

  #invoice-label-container {
    padding-top: 20px;
    text-align: center;
  }

  #invoice-label {
    text-align: center;
    font-size: 20px;
  }

  #package-list-container {
    padding: 7px 0px 0px 95px;
  }

  /* #package-list {
	} */

  #break-1 {
    width: 100%;
    border-style: solid;
  }

  #break-2 {
    width: 50%;
    border-style: inset;
  }

  .line-break {
    border-width: 1px;
    margin: auto;
  }

  .underline {
    text-decoration: underline;
  }
</style>
