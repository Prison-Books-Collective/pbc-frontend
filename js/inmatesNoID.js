
  
inmateNoIDFunctions = function(){
    const firstNameFieldId = "firstNameField"
    const lastNameFieldId = "lastNameField"
    const searchButtonId = "searchButton"
    const locationFieldId = "locationField"

    function displaySearchForInmateNoID(){
        const container = helperFunctions.getAndClearSiteContent()
        let div = document.createElement("div")
        div.id = "inmate"
        
        div.appendChild(helperFunctions.createLabelAndField("First Name", firstNameFieldId, "", "Enter first name"))
        div.appendChild(helperFunctions.createLabelAndField("Last Name", lastNameFieldId, "", "Enter last name"))
        div.appendChild(createSearchButton())
        container.appendChild(div)
    }

    function createSearchButton(){
        let button = helperFunctions.createButton("Find Inmate")
        button.id = searchButtonId
        button.onclick = () => {
            findInmateNoID(document.getElementById(firstNameFieldId).value, document.getElementById(lastNameFieldId).value)
        }
        return button
    }


function displayAddInmateNoID(firstName, lastName){
    const container = helperFunctions.getAndClearSiteContent()
    let div = createCenteredInmateDiv()

    let explanation = document.createElement("p")
    explanation.innerHTML = `We could not find any inmates by the name of  <b>${firstName} ${lastName}</b>.<br>To add them to the database, please provide their location and click "Add Inmate".`
    div.appendChild(explanation)

    div.appendChild(helperFunctions.createLabelAndField("Location: ", locationFieldId, "", "Enter location"))
    let button = helperFunctions.createButton("Add Inmate")
    button.disabled = true
    div.appendChild(button)

    container.appendChild(div)

    let locationField =  document.getElementById(locationFieldId)
    locationField.addEventListener("keyup", function(event) {
            if (locationFieldId.value  ==  ""){
                button.disabled  = true
            } else  {
                button.disabled  =  false
            }
      });

    button.onclick = () =>  {
        createInmateNoIDRecord(firstName, lastName,  locationField.value)
    }

}

function createInmateNoIDRecord(firstName, lastName, location){
   
    fetch(`http://localhost:8080/addInmateNoID?firstName=${firstName}&lastName=${lastName}&location=${location}`, {
        method: 'post'
    }).then(function(response){
        return response.json();
    }).then(function(data){
        inmateHelperFunctions.displayInmate(data)
    })
}

function createCenteredInmateDiv(){
    let div = document.createElement("div")
    div.id = "inmate"
    return div
}

    function displayInmatesListNoID(inmateList){
        const container = helperFunctions.getAndClearSiteContent()
        let div = createCenteredInmateDiv()

        let explanation = document.createElement("p")
        explanation.textContent = "We found the following inmates:"
        div.appendChild(explanation)

        let listElement = document.createElement("ul")
        inmateList.forEach(inmate => {
            let item = document.createElement("li")
            let link = document.createElement("a")
            link.href = "#"
            link.textContent = `${inmate.firstName} ${inmate.lastName} - ${inmate.location}`
            link.onclick = () => {
                inmateHelperFunctions.displayInmate(inmate)
            }
            item.appendChild(link)
            listElement.appendChild(item)
        })
        div.appendChild(listElement)

        div.appendChild(document.createElement("br"))

        let addNewLink = document.createElement("a")
        addNewLink.href  = "#"
        addNewLink.style.fontSize =  "12px"
        addNewLink.textContent = "Click here to create a new inmate record."
        addNewLink.onclick =  () => {
            displayAddInmateNoID(inmateList[0].firstName,  inmateList[0].lastName)
        }
        div.appendChild(addNewLink)
        container.appendChild(div)
    }

    function findInmateNoIDByDatabaseID(databaseID){
        fetch(`http://localhost:8080/getInmateNoIDByDatabaseID?id=${databaseID}`, {
            method: 'get'
        }).then(function(response){
            return response.json();
        }).then(function(data){
            inmateHelperFunctions.displayInmate(data)
        })
    }

    function findInmateNoID(firstName, lastName){
        fetch(`http://localhost:8080/getInmateNoID?firstName=${firstName}&lastName=${lastName}`, {
            method: 'get'
        }).then(function(response){
            return response.json();
        }).then(function(data){
            if(data.length == 0){
                displayAddInmateNoID(firstName, lastName)
            } else {
                displayInmatesListNoID(data)
            }
        })
}


    return{
        displaySearchForInmateNoID:displaySearchForInmateNoID,
        findInmateNoIDByDatabaseID:findInmateNoIDByDatabaseID
    }

    
}();





