
  
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


async function getPackages(inmate_id){
    let data = await fetch(`http://localhost:8080/getPackages?id=${inmate_id}`, {
        method: 'get'
    }).then((response)=>response.json())
    .then(data => {
        return data
    })
    return data
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
        if (inmateInfo.packages.length > 0){
        displayEditOrPrintInvoiceButton(resultsContainer, inmateInfo.id)
        }
        const tableElement = createPackageTableElementAndHeader(resultsContainer)
        displayPackagesByBook(inmateInfo.packages, tableElement);
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

    function displayEditOrPrintInvoiceButton(container, id){
        const editOrPrintPackage = helperFunctions.createButton("Edit or print old package")
        editOrPrintPackage.id = editOrPrintButtonId
        editOrPrintPackage.style.background = "LightCoral"
        let buttonToDelete = document.getElementById(seeAllBooksButtonId)
        if (buttonToDelete != null){
             buttonToDelete.parentNode.replaceChild(editOrPrintPackage, buttonToDelete)
        } else {
            container.appendChild(editOrPrintPackage)
        }
        editOrPrintPackage.onclick = () => {
            let packages = getPackages(id)
            packages.then((data)=>{
                            createEditOrPrintPackageTable(container, data)

            })
            displaySeeAllBooksButton(container, id)  
        }
    }

    function displaySeeAllBooksButton(container, id){
        const seeAllBooks = helperFunctions.createButton("See all books/zines received")
        seeAllBooks.id = seeAllBooksButtonId

        let buttonToDelete = document.getElementById(editOrPrintButtonId)
        if (buttonToDelete != null){
             buttonToDelete.parentNode.replaceChild(seeAllBooks, buttonToDelete)
        }
        seeAllBooks.onclick = () => {
            const tableElement = createPackageTableElementAndHeader(container)
            let packages = getPackages(id)
            packages.then((data) => {
                displayPackagesByBook(data, tableElement);
            })
            displayEditOrPrintInvoiceButton(container, id)
        }
    }

    function createEditOrPrintPackageTable(container, packages){

        let tableElement = document.getElementById(packageTableId)
        tableElement.innerHTML = ""

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
            let packageElement = generatePackageContentText(package);

            const packageRow = document.createElement('tr')
            if (count%2 == 0){
                packageRow.style.background = "Gainsboro"
            }
            count++
            const packageCell = document.createElement('td')
          

            packageCell.appendChild(packageElement)
            packageRow.appendChild(packageCell)
 
            let editIcon = createEditBaseIcon()
            editIcon.onclick = ()  => {
                packageFunctions.editPackage(package)
            }

            const editElement = document.createElement('td')
            editElement.appendChild(editIcon)

            let printIcon = createPrintIcon()
            printIcon.onclick = () => {
                helperFunctions.generateInvoice(package)
            }
            const printElement = document.createElement('td')
            printElement.appendChild(printIcon)

            packageRow.appendChild(editElement)
            packageRow.appendChild(printElement)
            tableElement.appendChild(packageRow)
        })
        container.appendChild(tableElement)

      
    }
  function generatePackageContentText(package) {
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

    function createPackageTableElementAndHeader(resultsContainer){
        let tableElement = document.getElementById(packageTableId)
        if (tableElement == null){
            tableElement = document.createElement('table');
            tableElement.id = packageTableId
        } else {
            tableElement.innerHTML = ""
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

    function displayPackagesByBook(packages, tableElement){
        let count = 0
        packages.slice().reverse().forEach(package => {
            package.books.forEach(book => {
            
            const bookRow = document.createElement('tr');
            if (count %2 == 0){
                bookRow.style.background = "Gainsboro"
            }
            count++

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
            if(count%2 == 0){
                zineRow.style.background = "Gainsboro"
            }
            count++
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
                if (count%2 == 0){
                    resourceRow.style.background= "Gainsboro"
                }
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





