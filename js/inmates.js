
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

inmateFunctions = function(){
   
    const id_field = "find_inmate_id_field"
    const results_container_div = "inmate_results"
    const addIdNumber = "addIdNumber";
    const addFirstName = "addFirstName";
    const addLastName = "addLastName";
   
    const packageTableId = "packageTable"
    
    function getInmateId() {
        return document.getElementById(id_field).value;

    }

    function findInmate(){
        var inmate_id = getInmateId();
        fetch(`http://localhost:8080/get?id=${inmate_id}`, {
            method: 'get'
        }).then(function(response){
             if(response.status == 204){
                throw "204";
            } else if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){

            displayInmate(data)
        }).catch(error => {

            if (error == "204"){
                addInmate(inmate_id)
            } else{
                displayError()
            }
    })

}

    function displayError(){
        const resultsContainer = getAndClearInmateResultsElement();
        const errorMessage = "Input not understood. Please check ID#."
        const messageElement = document.createElement('h3')
        messageElement.textContent = errorMessage
        resultsContainer.appendChild(messageElement)
    }
    
    function displayInmate(inmateInfo){
        const resultsContainer = getAndClearInmateResultsElement();
        displayNameAndId(inmateInfo, resultsContainer);

        displayAddPackageButton(resultsContainer);
        const tableElement = createPackageTable(resultsContainer)
        

        displayPackages(inmateInfo, tableElement);
    }

    function displayAddPackageButton(container){
        const addPackageButton = document.createElement('button');
        addPackageButton.textContent = "Add a new package (books or zines)"
        container.appendChild(addPackageButton)
        const modal = document.getElementById("modal")
        addPackageButton.onclick = () => {
            modal.style.display = "block"
            packageFunctions.setupAddPackageModal()
        }
    }

    function createPackageTable(resultsContainer){
        let tableElement = document.getElementById(packageTableId)
        if (tableElement == null){
            tableElement = document.createElement('table');
            tableElement.id = packageTableId
        }
       
        const headerRow = document.createElement('tr');

        const date = document.createElement('th');
        const title = document.createElement('th');
        const author = document.createElement('th');

        date.textContent = 'Date sent'
        title.textContent = 'Title'
        author.textContent = 'Author'

        headerRow.appendChild(date)
        headerRow.appendChild(title)
        headerRow.appendChild(author)

        tableElement.appendChild(headerRow)

        resultsContainer.appendChild(tableElement)
        return tableElement
    }

    function displayPackages(inmateInfo, tableElement){
        inmateInfo.packages.slice().reverse().forEach(package => {
            package.books.forEach(book => {
            
            const bookRow = document.createElement('tr');
            const date = document.createElement('td');
            const title = document.createElement('td');
            const author = document.createElement('td');

            date.textContent = package.date
            title.textContent = book.title
            author.textContent = book.authors[0]

            title.style.fontStyle = 'italic'

            bookRow.appendChild(date)
            bookRow.appendChild(title)
            bookRow.appendChild(author)
            tableElement.appendChild(bookRow)
        })

        package.zines.forEach(zine => {
            
            const zineRow = document.createElement('tr');
            const date = document.createElement('td');
            const title = document.createElement('td');
            const author = document.createElement('td');

            date.textContent = package.date
            title.innerHTML = `<b>${zine.threeLetterCode}</b>  - ${zine.title}`
            author.textContent = "ZINE"

            title.style.fontStyle = 'italic'

            zineRow.appendChild(date)
            zineRow.appendChild(title)
            zineRow.appendChild(author)
            tableElement.appendChild(zineRow)
        })

        package.resources.forEach(resource => {
            
                const resourceRow = document.createElement('tr');
                const date = document.createElement('td');
                const title = document.createElement('td');
                const author = document.createElement('td');
    
                date.textContent = package.date
                title.innerHTML = `${resource.title}`
                author.textContent = `${resource.authors[0]}`
    
                title.style.fontStyle = 'italic'
    
                resourceRow.appendChild(date)
                resourceRow.appendChild(title)
                resourceRow.appendChild(author)
                tableElement.appendChild(resourceRow)
            }

        )



        });

    }

    function displayNameAndId(inmateInfo, resultsContainer) {
        const name = document.createElement('h3');
        name.textContent = inmateInfo.firstName + " " + inmateInfo.lastName;
    
        const id = document.createElement('p');
        id.textContent = `ID #: ${inmateInfo.id}`;
    
        resultsContainer.appendChild(name);
        resultsContainer.appendChild(id);
    }

    function addInmate(idNumber){
        const resultsContainer = getAndClearInmateResultsElement();
        createInmateNotFoundMessage(resultsContainer, idNumber)
        helperFunctions.createLabelAndField(resultsContainer, "ID Number", addIdNumber, idNumber, "")
        helperFunctions.createLabelAndField(resultsContainer, "First Name", addFirstName, "", "")
        helperFunctions.createLabelAndField(resultsContainer, "Last Name", addLastName, "", "")
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
        button.textContent = "Create record"
        
        container.appendChild(button)

        button.onclick = () => {
            createInmateRecord()
        }
    }

    function getAndClearInmateResultsElement(){
        const container = document.getElementById(results_container_div);
        container.innerHTML = ""
        return container;
    }

    function createInmateRecord(){
        var inmate_id = document.getElementById(addIdNumber).value;
        var firstName = document.getElementById(addFirstName).value;
        var lastName = document.getElementById(addLastName).value;

        fetch(`http://localhost:8080/add?firstName=${firstName}&lastName=${lastName}&id=${inmate_id}`, {
            method: 'post'
        }).then(function(response){
            return response.json();
        }).then(function(data){
            displayInmate(data)
        })
    }

   

    return{
        findInmate:findInmate,
        getInmateId:getInmateId
    }

    
}();





