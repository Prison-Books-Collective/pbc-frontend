
  
inmateNoIDFunctions = function(){
    const firstNameFieldId = "firstNameField"
    const lastNameFieldId = "lastNameField"
    const searchButtonId = "searchButton"
    const addInmateButton = "addInmateButton"

    function displaySearchForInmateNoID(){
        const container = helperFunctions.getAndClearSiteContent()
        let div = document.createElement("div")
        div.id = "inmate"
        
        helperFunctions.createLabelAndField(div, "First Name", firstNameFieldId, "", "Enter first name")
        helperFunctions.createLabelAndField(div, "Last Name", lastNameFieldId, "", "Enter last name")
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

    function displayInmatesListNoID(inmateList){
        const container = helperFunctions.getAndClearSiteContent()
        let div = document.createElement("div")
        div.id = "inmate"

        let explanation = document.createElement("p")
        explanation.textContent = "We found the following inmates: "
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
        container.appendChild(div)
    }


    function findInmateNoID(firstName, lastName){
        fetch(`http://localhost:8080/getInmateNoID?firstName=${firstName}&lastName=${lastName}`, {
            method: 'get'
        }).then(function(response){
            return response.json();
        }).then(function(data){
            if(data.length == 0){
                displayAddInmateNoID()
            } else {
                displayInmatesListNoID(data)
            }
        })
}

    return{
        displaySearchForInmateNoID:displaySearchForInmateNoID
    }

    
}();





