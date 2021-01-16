
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

inmateFunctions = function(){
   
    const inmateIdField = "inmateIdField";
    const inmateFirstNameField = "inmateFirstNameField";
    const inmateLastNameField = "inmateLastNameField";
    
    function findInmate(inmate_id){
        fetch(`http://localhost:8080/getInmate?id=${inmate_id}`, {
            method: 'get'
        }).then(function(response){
             if(response.status == 204){
                throw "204";
            } else if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){

            inmateHelperFunctions.displayInmate(data)
        }).catch(error => {

            if (error == "204"){
                addInmate(inmate_id)
            } else{
                displayError()
            }
    })
}

    function displayError(){
        const resultsContainer = helperFunctions.getAndClearSiteContent();
        const errorMessage = "Input not understood. Please check ID#."
        const messageElement = document.createElement('h3')
        messageElement.textContent = errorMessage
        resultsContainer.appendChild(messageElement)
    }
    
   
    function addInmate(idNumber){
        const resultsContainer = helperFunctions.getAndClearSiteContent();
        createInmateNotFoundMessage(resultsContainer, idNumber)
        createInmateInfoFields(resultsContainer, idNumber, "", "")
        createAddInmateButton(resultsContainer)
    }

    

    function createInmateNotFoundMessage(container, idNumber){
        const message = document.createElement("h3");
        message.textContent = `Inmate with ID # ${idNumber} is not found. Create a record for this inmate below.`
        
        container.appendChild(message)

        const br = document.createElement("br");

        container.appendChild(br)
        container.appendChild(br)
    }

   

    function createAddInmateButton(container){

        const button = document.createElement("button");
        button.textContent = "Create inmate record"
        
        container.appendChild(button)

        button.onclick = () => {
            createInmateRecord()
        }
    }

    function createInmateRecord(){
        var inmate_id = document.getElementById(inmateIdField).value;
        var firstName = document.getElementById(inmateFirstNameField).value;
        var lastName = document.getElementById(inmateLastNameField).value;

        fetch(`http://localhost:8080/addInmate?firstName=${firstName}&lastName=${lastName}&id=${inmate_id}`, {
            method: 'post'
        }).then(function(response){
            return response.json();
        }).then(function(data){
            inmateHelperFunctions.displayInmate(data)
        })
    }

    function createInmateInfoFields(container, id, firstName, lastName){
        container.appendChild(helperFunctions.createLabelAndField( "ID Number", inmateIdField, id, ""))
        container.appendChild(helperFunctions.createLabelAndField( "First Name", inmateFirstNameField, firstName, ""))
        container.appendChild(helperFunctions.createLabelAndField("Last Name", inmateLastNameField, lastName, ""))
    }

    function editInmate(inmateInfo){
        helperFunctions.displayModal()
        let modal = helperFunctions.getModalContainer()
        modal.innerHTML =""
        createInmateInfoFields(modal,inmateInfo.id, inmateInfo.firstName, inmateInfo.lastName)
        createEditInmateButton(modal, inmateInfo)
    }


    function createEditInmateButton(container, originalInmateInfo){

        const button = document.createElement("button");
        button.textContent = "Edit inmate record"
        
        container.appendChild(button)

        button.onclick = () => {
            editInmateRecord(originalInmateInfo)
        }
    }

    function editInmateRecord(originalInmateInfo){
        var inmate_id = document.getElementById(inmateIdField).value;
        var firstName = document.getElementById(inmateFirstNameField).value;
        var lastName = document.getElementById(inmateLastNameField).value;

        fetch(`http://localhost:8080/updateInmate?originalId=${originalInmateInfo.id}&firstName=${firstName}&lastName=${lastName}&id=${inmate_id}`, {
            method: 'put'
        }).then(function(response){
            return response.json();
        }).then(function(data){
            helperFunctions.hideModal()

            inmateHelperFunctions.displayInmate(data)
        })
    }

    return{
        findInmate:findInmate,
        editInmate:editInmate
    }

    
}();





