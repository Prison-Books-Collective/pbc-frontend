

inmateHelperFunctions = function(){
   
    const idNumberAttribute = "data-id"
    const packageTableId = "packageTable"
    const inmateIdElementId = "inmateIdNumber"
 
    function getInmateId() {
        return document.getElementById(inmateIdElementId).textContent;
    }

    
    function displayInmate(inmateInfo){
        const resultsContainer = helperFunctions.getAndClearSiteContent();
        displayInmateInformation(inmateInfo, resultsContainer);

        displayAddPackageButton(resultsContainer);
        if(inmateInfo.packages.length > 0  ){
            createEditOrPrintPackageTable(resultsContainer, inmateInfo.packages);
        }
    }

    function displayAddPackageButton(container){
        const addPackageButton = helperFunctions.createButton(`Add a <b><u>new package</b></u> (books or zines)`)
        addPackageButton.style.background = "DarkSeaGreen"
        container.appendChild(addPackageButton)
        
        addPackageButton.onclick = () => {
            helperFunctions.displayModal()
            addPackageFunctions.setupAddPackageModal()
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
                editPackageFunctions.editPackage(package)
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
            package.noISBNBooks.forEach(noISBNBook => {
                let item = document.createElement("li")
                item.innerHTML = `<i>${noISBNBook.title}</i> - ${noISBNBook.authors[0]}`;
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


    function displayInmateInformation(inmateInfo, resultsContainer) {
        const div = document.createElement("div")
        const name = document.createElement('h1');
        name.style.display = "inline"

        if (inmateInfo.hasOwnProperty('location')){
            name.innerHTML = `${inmateInfo.firstName} ${inmateInfo.lastName}, <small style="color:DarkSlateGray">Location: <p style="display:inline" id="${inmateIdElementId}" ${idNumberAttribute}="${inmateInfo.id}">${inmateInfo.location}</p></small>`
        } else {
            name.innerHTML = `${inmateInfo.firstName} ${inmateInfo.lastName}, <small style="color:DarkSlateGray">ID#: <p style="display:inline" id="${inmateIdElementId}">${inmateInfo.id}</p></small>`
        }
        div.appendChild(name)
        
        createEditInmateIcon(div, inmateInfo)
        resultsContainer.appendChild(div);
    }

    function createEditInmateIcon(container, inmateInfo) {
        let editIcon = createEditBaseIcon()
        editIcon.style.marginLeft = "10px"
        editIcon.onclick = () => {
            if(inmateInfo.hasOwnProperty('location')){

            }else {
                inmateFunctions.editInmate(inmateInfo)
            }
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


    function inmateHasPrisonID(){
        let inmateInfo = document.getElementById(inmateIdElementId)
        if (inmateInfo.hasAttribute(idNumberAttribute)){
            return false
        } else {
            return true
        }
    }

    function getInmatePrisonID(){
        return document.getElementById(inmateIdElementId).textContent
    }

    function getDatabaseIDForInmateNoPrisonID(){
        return document.getElementById(inmateIdElementId).getAttribute(idNumberAttribute)
    }

    function getInmateDatabaseID(){
        if (inmateHasPrisonID()){
            return getInmatePrisonID()
        }else {
            return getDatabaseIDForInmateNoPrisonID()
        }
    }

    return{
        displayInmate:displayInmate,
        getInmatePrisonID:getInmatePrisonID,
        inmateHasPrisonID:inmateHasPrisonID,
        getDatabaseIDForInmateNoPrisonID:getDatabaseIDForInmateNoPrisonID,
        getInmateDatabaseID:getInmateDatabaseID
    }

    
}();





