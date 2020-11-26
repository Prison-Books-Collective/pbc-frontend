
  
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
    const editOrPrintButtonId = "editOrPrintButton"
    const seeAllBooksButtonId = "seeAllBooksButton"
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
        if(inmateInfo.packages.length > 0  ){
            createEditOrPrintPackageTable(resultsContainer, inmateInfo.packages);
        }
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
        const addPackageButton = helperFunctions.createButton(`Add a <b><u>new package</b></u> (books or zines)`)
        addPackageButton.style.background = "DarkSeaGreen"
        container.appendChild(addPackageButton)
        
        addPackageButton.onclick = () => {
            helperFunctions.displayModal()
            packageFunctions.setupAddPackageModal()
        }
    }

    function createEditOrPrintPackageTable(container, packages){
        
        let tableElement = getAndClearPackageTableElement()
        
        const headerRow = document.createElement('tr')

        const packageContents = document.createElement('th')
        const edit = document.createElement('th')
        const print = document.createElement('th')
        packageContents.textContent = 'Package'
        edit.textContent = 'Edit'
        print.textContent = 'Print'

        headerRow.appendChild(packageContents)
        headerRow.appendChild(edit)
        headerRow.appendChild(print)

        tableElement.appendChild(headerRow)        
        let count = 0;

        packages.slice().reverse().forEach(package => {
            let packageElement = generatePackageContentElement(package);

            const packageRow = document.createElement('tr')
            if (count%2 == 0){
                packageRow.style.background = "Gainsboro"
            }
            count++
            const packageCell = document.createElement('td')
            packageCell.style.paddingTop = "10px"
            packageCell.style.paddingBottom = "10px"
            packageCell.style.paddingRight = "15px"

            packageCell.appendChild(packageElement)
            packageRow.appendChild(packageCell)
 
            let editIcon = createEditBaseIcon()
            editIcon.onclick = ()  => {
                packageFunctions.editPackage(package)
            }

            const editElement = document.createElement('td')
            editElement.appendChild(editIcon)
            editElement.style.width = "40px"

            let printIcon = createPrintIcon()
            printIcon.onclick = () => {
                helperFunctions.generateInvoice(package)
            }
            const printElement = document.createElement('td')
            printElement.appendChild(printIcon)
            printElement.style.width = "40px"

            packageRow.appendChild(editElement)
            packageRow.appendChild(printElement)
            tableElement.appendChild(packageRow)
        })
        container.appendChild(tableElement)

      
    }
  function generatePackageContentElement(package) {
            let div = document.createElement("div")
            div.style.textAlign = "left"
            div.style.paddingLeft = "20px"
            let date = document.createElement("span")
            date.innerHTML = `<b>${package.date}</b>:`;
            div.appendChild(date)
            let list = document.createElement("ul")


            package.books.forEach(book => {
                let item = document.createElement("li")
                item.innerHTML = `<i>${book.title}</i> - ${book.authors[0]}`;
                list.appendChild(item)
            });
            package.zines.forEach(zine => {
                let item = document.createElement("li")
                item.innerHTML = `<b>${zine.threeLetterCode}</b> - ${zine.title}`;
                list.appendChild(item)
            });
            package.resources.forEach(resource => {
                let item = document.createElement("li")
                item.innerHTML = `<i>${resource.title}</i> - ${resource.authors[0]}`;
                list.appendChild(item);
            })
            div.appendChild(list)
            return div
        }

    function getAndClearPackageTableElement(){
        let tableElement = document.getElementById(packageTableId)
        if (tableElement == null){
            tableElement = document.createElement('table');
            tableElement.id = packageTableId
        } 
        tableElement.innerHTML = ""
        return tableElement
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
        let editIcon = createEditBaseIcon()
        editIcon.style.marginLeft = "10px"
        editIcon.onclick = () => {
            editInmate(inmateInfo)
        }
        
        container.appendChild(editIcon)
    }

    function createEditBaseIcon(){
        const editIcon = document.createElement("img")
        editIcon.src = "style/edit.png"
        editIcon.id = "editIcon"
        editIcon.width = "20"
        editIcon.height = "20" 
        return editIcon
    }

    function createPrintIcon(){
        const printIcon = document.createElement("img")
        printIcon.src = "style/print.png"
        printIcon.id = "printIcon"
        printIcon.width = "20"
        printIcon.height = "20" 
        return printIcon
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





