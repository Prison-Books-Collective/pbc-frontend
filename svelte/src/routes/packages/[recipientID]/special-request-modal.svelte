<script lang="ts">
  import Modal from '$components/modal.svelte'
  import type { Recipient } from '$models/pbc/recipient'

  enum Slide {
    ELIGIBILITY = 1,
    DETAILS = 2,
    CONFIRMATION = 3,
  }

  let isVisible = false
  let activeSlide: Slide = Slide.ELIGIBILITY

  let title = 'Special Request'
  let previousButtonText = 'Cancel'
  let nextButtonText = 'Next'

  let isHighPriority = false
  let canBeFulfilled = false
  let hasRecievedThisQuarter = false

  let recipientName: string
  let category: string
  let opusNumber: string
  let volunteer: string
  let dateFiled: string
  let dateMailed: string

  const nextSlide = () => {
    switch(activeSlide) {
      case Slide.ELIGIBILITY:
        showDetailsSlide()
        break
      case Slide.DETAILS:
        showConfirmSlide()
        break
      case Slide.CONFIRMATION:
        hide()
    }
  }

  const previousSlide = () => {
    switch(activeSlide) {
      case Slide.ELIGIBILITY:
        hide()
        break
      case Slide.DETAILS:
        showEligibilitySlide()
        break
      case Slide.CONFIRMATION:
        break
    }
  }

  export function show(recipient: Recipient) {
    isVisible = true
    recipientName = `${recipient.firstName} ${recipient.lastName}`
    opusNumber = recipient.assignedId ?? ''
    dateFiled = (new Date()).toISOString().split('T')[0]
  }

  export function hide() {
    showEligibilitySlide()
    isVisible = false
  }

  const showEligibilitySlide = () => {
    previousButtonText = 'Cancel'
    nextButtonText = 'Next'
    activeSlide = Slide.ELIGIBILITY
  }

  const showDetailsSlide = () => {
    previousButtonText = 'Previous'
    nextButtonText = 'Submit'
    activeSlide = Slide.DETAILS
  }

  const showConfirmSlide = () => {
    nextButtonText = 'Close'
    activeSlide = Slide.CONFIRMATION
  }
</script>

<Modal visible={isVisible} on:close={hide} width={'600px'} maxWidth={'100%'}>
  <main id="modal-content">
    <h2 id="title">{title}</h2>

    <section id="form-input">
      {#if activeSlide == Slide.ELIGIBILITY}
      <form data-form-page="eligibility">
        <label for="special-request-priority">
          <input
            name="special-request-priority"
            id="special-request-priority"
            type="checkbox"
            bind:checked={isHighPriority}
          />
          Is this a high priority for the letter writer?
        </label>

        <label for="special-request-stock">
          <input
            name="special-request-stock"
            id="special-request-stock"
            type="checkbox"
            bind:checked={canBeFulfilled}
          />
          Can this request not be fulfilled with our stock?
        </label>

        <label for="special-request-quarter">
          <input
            name="special-request-quarter"
            id="special-request-quarter"
            type="checkbox"
            bind:checked={hasRecievedThisQuarter}
          />
          Online enterer only: Person has not received another special request in this quarter.
        </label>
      </form>
      {/if}

      {#if activeSlide == Slide.DETAILS}
      <form data-form-page="details">
        <label for="request-category">Catetory/categories:</label>
        <select name="request-category" id="request-category" bind:value={category}>
          <option value={null} disabled selected>Please choose an option:</option>
          <option value="vocational">Vocational</option>
          <option value="educational">Educational</option>
          <option value="legal">Legal</option>
          <option value="career-growth">Career growth</option>
          <option value="spiritual-religious">Spiritual/religious</option>
          <option value="foreign-language">Foreign language</option>
          <option value="other">Other</option>
        </select>

        <label for="recipient-name">
          Requester Name:
          <input
            type="text"
            id="recipient-name"
            name="recipient-name"
            required
            bind:value={recipientName}
          />
        </label>

        <label for="opus-number">
          OPUS #:
          <input type="text" id="opus-number" name="opus-number" required bind:value={opusNumber} />
        </label>

        <label for="volunteer">
          Volunteer:
          <input
            type="text"
            id="volunteer-name"
            name="volunteer-name"
            required
            bind:value={volunteer}
          />
        </label>

        <label for="date-mailed">
          Date letter mailed:
          <input type="date" id="date-mailed" name="date-mailed" bind:value={dateMailed} />
        </label>

        <label for="date-filed">
          Date special request filed:
          <input type="date" id="date-filed" name="date-filed" bind:value={dateFiled} />
        </label>
      </form>
      {/if}

      {#if activeSlide == Slide.CONFIRMATION}
      <article data-form-page="confirmation" />
      {/if}
    </section>

    <section id="modal-controls">
      {#if activeSlide != Slide.CONFIRMATION}
      <button on:click={() => previousSlide()}>{previousButtonText}</button>
      {/if}
      <button on:click={() => nextSlide() }>{nextButtonText}</button>
    </section>
  </main>
</Modal>

<style lang="scss">
  #modal-content {
    display: grid;
    grid-template-areas:
      'title'
      'form-input'
      'modal-controls';
  }

  #title {
    grid-area: title;
  }

  #form-input {
    grid-area: form-input;
  }

  #modal-controls {
    grid-area: modal-controls;

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
  }
</style>
