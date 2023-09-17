<script lang="ts">
  import Modal from '$components/modal.svelte'
  import type { Recipient } from '$models/pbc/recipient'
    import { RecipientService } from '$services/pbc/recipient.service'

  let isVisible = false

  let title = 'Special Request'
  let previousButtonText = 'Cancel'
  let nextButtonText = 'Next'

  let recipientName: string
  let category: string
  let opusNumber: string
  let volunteer: string
  let dateFiled: string
  let dateMailed: string
  let request: string

  export function show(recipient: Recipient) {
    isVisible = true
    recipientName = `${recipient.firstName} ${recipient.lastName}`
    opusNumber = recipient.assignedId ?? ''
    dateFiled = (new Date()).toISOString().split('T')[0]
  }

  export function hide() {
    isVisible = false
  }

  const submitSpecialRequest = async () => {
    let specialRequest = await RecipientService.submitSpecialRequest(volunteer, request, dateMailed, dateFiled, category, "OPEN", opusNumber)
    alert("Your special request has been submitted.")
    hide()
  }
</script>

<Modal visible={isVisible} on:close={hide} width={'600px'} maxWidth={'100%'}>
  <main id="modal-content">
    <h2 id="title">{title}</h2>
     
      <form
      on:submit|preventDefault={submitSpecialRequest}>
        Please fill out this form to submit a Special Request for: 
        <br>
        <br>
        <strong>{recipientName}<br>ID#{opusNumber}</strong>
        <br>
        <label for="volunteer">
          What is your name? (Enter volunteer name):
          <input
            type="text"
            id="volunteer-name"
            name="volunteer-name"
            required
            bind:value={volunteer}
          />
        </label>

        <label for="request-category">What category do the book(s) in this special request fall under:</label>
        <select name="request-category" id="request-category" bind:value={category}>
          <option value={null} disabled selected>Please choose an option:</option>
          <option value="VOCATIONAL">Vocational</option>
          <option value="EDUCATIONAL">Educational</option>
          <option value="LEGAL">Legal</option>
          <option value="CAREER_GROWTH">Career growth</option>
          <option value="SPIRITUAL_RELIGIOUS">Spiritual/religious</option>
          <option value="FOREIGN_LANGUAGE">Foreign language</option>
          <option value="OTHER">Other</option>
        </select>

        <label for="request-text">
         Please provide details for this request:
          <input type="text" id="request-text" name="request-text" bind:value={request} />
        </label>


        <label for="date-mailed">
          When was this letter mailed to PBC? (click the icon to select a date):
          <input type="date" id="date-mailed" name="date-mailed" bind:value={dateMailed} />
        </label>

        <label for="date-filed">
            Date special request filed:
          <input type="date" id="date-filed" name="date-filed" bind:value={dateFiled} />
        </label>

        <button class="success">
          Submit Special Request
        </button>

      </form>
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
    text-align: center;
  }
  #request-category{
    margin-top: -20px;
  }
  #modal-controls {
    grid-area: modal-controls;

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
  }
</style>
