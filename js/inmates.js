
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

inmateFunctions = function(){
   
    const siteContentId = "site_content"
    const inmateIdField = "inmateIdField";
    const inmateFirstNameField = "inmateFirstNameField";
    const inmateLastNameField = "inmateLastNameField";
   
    const packageTableId = "packageTable"
    const inmateIdElementId = "inmateIdNumber"
    
    function getInmateId() {
        return document.getElementById(inmateIdElementId).textContent;
    }

    
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
    function displaySearchButton(container){
        const div = document.createElement("div")
        div.style.textAlign = "left"
        div.style.paddingTop = "10px"
        div.style.paddingLeft = "10px"
        let search = document.createElement("img")
        search.src = "style/search.png"
        search.id = "searchIcon"
        search.width = "40"
        search.height = "40" 
        search.onclick = () => {
            homepageFunctions.displayHomepage()
        } 
        div.appendChild(search)
        container.appendChild(div)  
     }

    function displayAddPackageButton(container){
        const addPackageButton = document.createElement('button');
        addPackageButton.textContent = "Add a new package (books or zines)"
        container.appendChild(addPackageButton)
        
        addPackageButton.onclick = () => {
            helperFunctions.displayModal()
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
        const div = document.createElement("div")
        const name = document.createElement('h1');
        name.style.display = "inline"
        name.innerHTML = `${inmateInfo.firstName} ${inmateInfo.lastName}, <small style="color:DarkSlateGray">ID#: <p style="display:inline" id="${inmateIdElementId}">${inmateInfo.id}</p></small>`
        div.appendChild(name)
        
        createEditInmateIcon(div, inmateInfo)
        resultsContainer.appendChild(div);
    }

    function createEditInmateIcon(container, inmateInfo) {
        const editIcon = document.createElement("img")
        editIcon.src = "style/edit.png"
        editIcon.id = "editIcon"
        editIcon.width = "20"
        editIcon.height = "20" 
        editIcon.style.marginLeft = "10px"
        editIcon.onclick = () => {
            editInmate(inmateInfo)
        }
        
        container.appendChild(editIcon)
    }

    function addInmate(idNumber){
        const resultsContainer = getAndClearInmateResultsElement();
        createInmateNotFoundMessage(resultsContainer, idNumber)
        createInmateInfoFields(resultsContainer, idNumber, "", "")
        createAddInmateButton(resultsContainer)
    }

    function createInmateInfoFields(container, id, firstName, lastName){
        helperFunctions.createLabelAndField(container, "ID Number", inmateIdField, id, "")
        helperFunctions.createLabelAndField(container, "First Name", inmateFirstNameField, firstName, "")
        helperFunctions.createLabelAndField(container, "Last Name", inmateLastNameField, lastName, "")
    }
    function editInmate(inmateInfo){
        helperFunctions.displayModal()
        let modal = helperFunctions.getModalContainer()
        modal.innerHTML =""
        createInmateInfoFields(modal,inmateInfo.id, inmateInfo.firstName, inmateInfo.lastName)
        createEditInmateButton(modal, inmateInfo)
    }

    function createInmateNotFoundMessage(container, idNumber){
        const message = document.createElement("h3");
        message.textContent = `Inmate with ID # ${idNumber} is not found. Create a record for this inmate below.`
        
        container.appendChild(message)

        const br = document.createElement("br");

        container.appendChild(br)
        container.appendChild(br)
    }

    function createEditInmateButton(container, originalInmateInfo){

        const button = document.createElement("button");
        button.textContent = "Edit inmate record"
        
        container.appendChild(button)

        button.onclick = () => {
            editInmateRecord(originalInmateInfo)
        }
    }

    function createAddInmateButton(container){

        const button = document.createElement("button");
        button.textContent = "Create inmate record"
        
        container.appendChild(button)

        button.onclick = () => {
            createInmateRecord()
        }
    }

    function getAndClearInmateResultsElement(){
        const container = document.getElementById(siteContentId);
        container.innerHTML = ""
        displaySearchButton(container)
        return container;
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
            displayInmate(data)
        })
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

            displayInmate(data)
        })
    }

    return{
        findInmate:findInmate,
        getInmateId:getInmateId
    }

    
}();





