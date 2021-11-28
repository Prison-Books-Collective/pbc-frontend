addPackageFunctions = function(){
    const packageContentListId = "packageContentList"
    const searchIsbnField = "searchIsbn";
    const addBookISBNId = "addBookISBN"
    const addBookTitleId = "addBookTitle"
    const addBookAuthorId = "addBookAuthor"
    const packageContentContainerId = "modalCreatePackageContent"
    const packageId = "packageListId"
    const zineCheckboxesName = "zine"
    const zineAttribute = "data-zine"
    const bookAttribute = "data-book"
    const noISBNBookAttribute = "data-noISBNBook"
    let editingPackage = false 
    let editingPackageId

    function getAddPackageContentContainer() {
        let packageContainer = document.getElementById(packageContentContainerId)
        if (packageContainer == null) {
            packageContainer = document.createElement("div");
            const modalContentContainer = helperFunctions.getModalContainer()
            modalContentContainer.appendChild(packageContainer)
            packageContainer.id = packageContentContainerId;
    
        } else {
            packageContainer.innerHTML = ""
        }
        return packageContainer
    }

   
    function importPackageToAddItemsTo(package){
        let zines = package["zines"]
        let books = package["books"]
        let noISBNBooks = package["noISBNBooks"]
        books.forEach(book => {
            addBookToPackage(book)
        })
        addImportedZinesToPackage(zines)
    
        noISBNBooks.forEach(noISBNBook => {
            addNoISBNBookToPackage(noISBNBook)
        })
        displayPackage()
    }

    function setupEditPackageModal(package) {
        editingPackage = true
        editingPackageId = package["id"]

        helperFunctions.getAndClearModalContainer()
        initializePackageContentList()
        importPackageToAddItemsTo(package)
        step1_bookOrZine()
    }


    function setupAddPackageModal() {
        editingPackage = false
        editingPackageId = undefined

        helperFunctions.getAndClearModalContainer()
        initializePackageContentList()
        step1_bookOrZine()
    }

    function step1_bookOrZine(notFirstItem){

        const modalContentContainer = getAddPackageContentContainer()

        const explanation = document.createElement("p")

        modalContentContainer.appendChild(explanation)

        createAddBookButton(modalContentContainer, "Add <b>Book</b>")
        step1_AddZineButton(modalContentContainer)
        
        if(notFirstItem){
            explanation.innerHTML = `Would you like to add another book, or zine(s)? Or if you're done, click Complete Package (or Update Package)`
            createCompletePackageButton(modalContentContainer)
        } else{
            explanation.innerHTML = `Would you like to add a book, or zine(s)?`

        }
    }

    function createCancelButton_returnToStep1(container){
        const step1Button = helperFunctions.createButton("Cancel")
        step1Button.onclick = () => {
            if (getPackage().style.display == "block"){
                step1_bookOrZine(true)
            } else{
                step1_bookOrZine()
            }
        }

        container.appendChild(step1Button)
    }

    function createAddBookButton(container, textContent){

        const addBookButton = helperFunctions.createButton(textContent)
        addBookButton.onclick = () => {
            step2_addBook()
        }

        container.appendChild(addBookButton)
    }

    function step1_AddZineButton(container){

        const addZineButton = helperFunctions.createButton("Add <b>Zine(s)</b>")
        addZineButton.onclick = () => {
            step2_addZine()
        }

        container.appendChild(addZineButton)
    }

    function step2_addZine(){
        const container = getAddPackageContentContainer()
        getAndDisplayZines()
        createCancelButton_returnToStep1(container)

    }

    function displayZines(zines){
        const container = getAddPackageContentContainer()
        let explanationText = `<b>Select the zine(s) you are sending from the following list, then click the "Add zine(s) to package" button.</b>`
        helperFunctions.createAndAddParagraphElement(container, explanationText)

        zines = zines.sort((a,b) => a['threeLetterCode'].localeCompare(b['threeLetterCode']))
        addZineCheckboxes(container, zines)
        createAddZinesToPackageButton(container)
        createCancelButton_returnToStep1(container)
    }

    function createAddZinesToPackageButton(container){
        const addZinesToPackageButton = helperFunctions.createButton("Add zine(s) to package")
        addZinesToPackageButton.onclick = () =>{
            addCheckedZinesToPackage(getCheckedZines())
            displayPackage()
            step1_bookOrZine(true)
        }
        container.appendChild(addZinesToPackageButton)
    }
    



    function addZineCheckboxes(container, zines){
        const leftAlignDiv = document.createElement("div")
        leftAlignDiv.style.textAlign = "left"
        zines.forEach(zine => {
            const zineCheckbox = document.createElement("input")
            zineCheckbox.type = "checkbox"
            zineCheckbox.name = zineCheckboxesName
            zineCheckbox.value = JSON.stringify(zine)
            zineCheckbox.id = zine['threeLetterCode']
            const label = document.createElement("label")
            label.htmlFor = zineCheckbox.id
            label.textContent = zine['threeLetterCode'] + " - " + zine['title']

            leftAlignDiv.appendChild(zineCheckbox)
            leftAlignDiv.appendChild(label)
            leftAlignDiv.appendChild(document.createElement("br"))
        })
        container.appendChild(leftAlignDiv)

    }

    function getAndDisplayZines(){
        url = `http://localhost:8080/getZines`
        fetch(url, {
            method: 'get'
        }).then(function(response){
            if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){
            displayZines(data)
        }).catch(error => {
            if (error == "400"){
                console.log("error")
            }
    })
    }

    function step2_addBook(){
        const container = getAddPackageContentContainer()
        container.appendChild(helperFunctions.createLabelAndField("Scan book ISBN: ", searchIsbnField, "", "click here, then scan"))
        document.getElementById(searchIsbnField).focus()
        createSearchForBookButton(container)
        const noIsbnButton = helperFunctions.createButton("No ISBN?")
        noIsbnButton.style.background = "LightCoral"
        noIsbnButton.onclick = () => {
            createNoISBNBook()
        }
        container.appendChild(noIsbnButton)
        createCancelButton_returnToStep1(container)
    }

    function createNoISBNBook(){
        let resultsContainer =  getAddPackageContentContainer()
    
        helperFunctions.createAndAddParagraphElement(resultsContainer, "Fill out the information below and save book (or resource) <br><br>")
    
        resultsContainer.appendChild(helperFunctions.createLabelAndField("Title", addBookTitleId, "", "Type title"))
        resultsContainer.appendChild(helperFunctions.createLabelAndField("Author", addBookAuthorId, "", "Type author"))
    
        let saveNewBookButton = helperFunctions.createButton("Save book and add to package")
    
        saveNewBookButton.onclick = () =>{
            let author = document.getElementById(addBookAuthorId).value
            let title = document.getElementById(addBookTitleId).value
    
           
            let noISBNBook = `{"title": "${title}", "authors": ["${author}"]}`
            saveNoISBNBook(noISBNBook)
        }
    
        resultsContainer.appendChild(saveNewBookButton)
        createCancelButton_returnToStep1(resultsContainer)
    }

    
    function createSearchForBookButton(container){
        const searchButton = helperFunctions.createButton("Search for book")
        searchButton.style.background  =  "DarkSeaGreen"
        searchButton.onclick = () =>{
            const isbnField = document.getElementById(searchIsbnField)
            if (isbnField.value == "") {
                //error message to add isbn
            }else if (isbnField.value.length == 10 || isbnField.value.length == 13){
                searchForBook(isbnField.value)
            } else {
                let error =  document.getElementById("isbnError")
                if (error == null){
                    error = document.createElement("p")
                    error.id = "isbnError"
                    error.innerHTML = `Hmm..that number doesn't seem to be an ISBN. Find the ISBN either in the barcode area, or inside the first few pages of the book.`
                    error.style.background = "LightCoral"
                    container.appendChild(error)
                }
            }
        }
        container.appendChild(searchButton)
    }

    function searchForBook(isbnTarget){
        url = ''
        if (isbnTarget.length == 10){
            url = `http://localhost:8080/getIsbn10?isbn10=${isbnTarget}`
        } else if (isbnTarget.length == 13){
            url = `http://localhost:8080/getIsbn13?isbn13=${isbnTarget}`
        }
        fetch(url, {
            method: 'get'
        }).then(function(response){
            if(response.status == 204){
                throw "204";
            } else if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){
            bookInfo_confirmBook(data, isbnTarget)
        }).catch(error => {
            if (error == "204"){
                let notFoundText = `We could not find the book with <b>ISBN# ${isbnTarget}</b> in our database. Please add the title and author of the book and add it to the package. <br><br>`
                editOrCreateBook(notFoundText, isbnTarget,"","", true)
            } else{
                console.log("other error")
            }
    })

}

function editOrCreateBook(text, originalIsbn, originalTitle, originalAuthor, isNew){

    let resultsContainer =  getAddPackageContentContainer()

    helperFunctions.createAndAddParagraphElement(resultsContainer, text)

    resultsContainer.appendChild(helperFunctions.createLabelAndField( "ISBN", addBookISBNId, originalIsbn, ""))
    if(originalIsbn == ""){
        const isbnField = document.getElementById(addBookISBNId)
        isbnField.disabled = true
    }

    resultsContainer.appendChild(helperFunctions.createLabelAndField( "Book title", addBookTitleId, originalTitle, "Type title"))
    resultsContainer.appendChild(helperFunctions.createLabelAndField("Book author", addBookAuthorId, originalAuthor, "Type author"))

    let saveNewBookButton = helperFunctions.createButton("Save book and add to package")

    saveNewBookButton.onclick = () =>{
        let author = document.getElementById(addBookAuthorId).value
        let title = document.getElementById(addBookTitleId).value
        let isbn = document.getElementById(addBookISBNId).value

        let bothISBNs = ""
        if (isbn.length == 10){
            bothISBNs = `"isbn10": "${isbn}", "isbn13": "NO-13-${isbn}"`
        } 
        if (isbn.length == 13){
            bothISBNs = `"isbn10": "NO-10-${isbn}", "isbn13": "${isbn}"`
        }
        if (isbn.length == 0){
            bothISBNs = `"isbn10":"", "isbn13":""`
        }

        let book = `{"title": "${title}", "authors": ["${author}"], ${bothISBNs}}`
        if (isNew){
            saveBook(book)
        } else{ 
            updateBook(book)
        }
    }

    resultsContainer.appendChild(saveNewBookButton)
    createCancelButton_returnToStep1(resultsContainer)
}

    function saveBook(book){
        
        fetch(`http://localhost:8080/addBook`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: book
        }).then(function(response){
            if(response.status == 302){
                throw "302";
            } else if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){
            addBookToPackage(data)
            displayPackage()
            step1_bookOrZine(true)

        }).catch(error => {
            if (error == "302"){
                console.log("book already exists")
            } else{
                
            }
    })

}

function saveNoISBNBook(noISBNBook){
        
    fetch(`http://localhost:8080/addNoISBNBook`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: noISBNBook
    }).then(function(response){
        if(response.status == 302){
            throw "302";
        } else if(response.status == 400){
            throw "400";
        }
        return response.json();
    }).then(function(data){
        addNoISBNBookToPackage(data)
        displayPackage()
        step1_bookOrZine(true)

    }).catch(error => {
        if (error == "302"){
            console.log("book already exists")
        } else{
            
        }
})

}

function updateBook(book){
        
    fetch(`http://localhost:8080/updateBook`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: book
    }).then(function(response){
        if(response.status == 302){
            throw "302";
        } else if(response.status == 400){
            throw "400";
        }
        return response.json();
    }).then(function(data){
        addBookToPackage(data)
        displayPackage()
        step1_bookOrZine(true)

    }).catch(error => {
        if (error == "302"){
            console.log("book already exists")
        } else{
            
        }
})

}
function displayPackage(){
    let package = getPackage() 
    package.style.display = "block"
}

function getPackage(){
    return document.getElementById(packageId)
}

function addBookToPackage(bookData){
    let  packageContentList = getPackageContentListElement()
    bookListItem = document.createElement("li");
    bookListItem.innerHTML = `<b>${bookData.title}</b>, <i>${bookData.authors[0]}</i>`;
    bookListItem.setAttribute(bookAttribute, JSON.stringify(bookData));
    packageContentList.appendChild(bookListItem);
}

function addNoISBNBookToPackage(noISBNBookData){
    let  packageContentList = getPackageContentListElement()
    noISBNBookListItem = document.createElement("li");
    noISBNBookListItem.innerHTML = `<b>${noISBNBookData.title}</b>, <i>${noISBNBookData.authors[0]}</i>`;
    noISBNBookListItem.setAttribute(noISBNBookAttribute, JSON.stringify(noISBNBookData));
    packageContentList.appendChild(noISBNBookListItem);
}

function addCheckedZinesToPackage(checkedZines){
    let  packageContentList = getPackageContentListElement()
    checkedZines.forEach(zine => {
        zineListItem = document.createElement("li");
        const zineJson = JSON.parse(zine.value)
        zineListItem.innerHTML = `<b>${zine.id}</b> - ${zineJson['title']}`;
        zineListItem.setAttribute(zineAttribute, zine.value)
        console.log("checked zine \n" + zine)
        console.log("checked zine value \n" + zine.value)
        packageContentList.appendChild(zineListItem);  
    })
}

function addImportedZinesToPackage(zines){
    let  packageContentList = getPackageContentListElement()
    zines.forEach(zine => {
        zineListItem = document.createElement("li");
        zineListItem.innerHTML = `<b>${zine["threeLetterCode"]}</b> - ${zine['title']}`;
        zineListItem.setAttribute(zineAttribute, JSON.stringify(zine))
        console.log("imported zine \n" + zine)
        console.log("imported zine value \n" + zine.value)
        packageContentList.appendChild(zineListItem); 
    })

}

function getCheckedZines(){
    const checkboxes = document.getElementsByName(zineCheckboxesName)
    checkedZines = []
    checkboxes.forEach(checkbox => {
        if (checkbox.checked){
            checkedZines.push(checkbox)
        }
    })
    return checkedZines
}



function initializePackageContentList(){
    let modal = helperFunctions.getModalContainer()
    let container = document.createElement("div")
    container.id = packageId

    let labelText = `<font size="+1"><u>Package Contents</u></font>`
    helperFunctions.createAndAddParagraphElement(container, labelText)

    packageContentList = document.createElement("ol");
    packageContentList.id = packageContentListId;
    container.style.display = "none"
    container.appendChild(packageContentList)

    container.appendChild(document.createElement("hr"))
    modal.appendChild(container)
}

function getPackageContentListElement(){
    return document.getElementById(packageContentListId)
}

function createAddBookToPackageButton(container, bookData) {
    let addBookButton = helperFunctions.createButton("Add book to package");
    addBookButton.style.background= "DarkSeaGreen"
    addBookButton.onclick = () => {
        addBookToPackage(bookData)
        displayPackage()
        step1_bookOrZine(true)
    };

    container.appendChild(addBookButton);
    

}

function createCompletePackageButton(container){
    let buttonText = "Complete package"
    if (editingPackage){
        buttonText = "Update package"
    }
    const savePackageButton = helperFunctions.createButton(buttonText)
    savePackageButton.style.background =   "DarkSeaGreen"
    savePackageButton.onclick = () =>{
        if (editingPackage){
            updatePackage()
        } else {
            savePackage()
        }
    }
    container.appendChild(savePackageButton)
}

function generateBooksJson(){
    const packageContentListElement = document.getElementById(packageContentListId)
    let booksJson = `"books": [`
    let booksExist = false
    packageContentListElement.childNodes.forEach(bookItem => {
        if (bookItem.getAttribute(bookAttribute)!=null){
            booksExist = true
            booksJson = booksJson + bookItem.getAttribute(bookAttribute) + `, `
        }
    });
    if (booksExist){
        booksJson = booksJson.substring(0,booksJson.length - 2)
    }
    booksJson = booksJson + `]`
    return booksJson
}

function generateZinesJson(){
    const packageContentListElement = document.getElementById(packageContentListId)
    let zineJson = `"zines": [`
    let zineExists = false
    packageContentListElement.childNodes.forEach(zineItem => {
        if (zineItem.getAttribute(zineAttribute)!=null){
            zineExists = true
            zineJson = zineJson + zineItem.getAttribute(zineAttribute) + `, `
        }
    });
    if (zineExists){
        zineJson = zineJson.substring(0,zineJson.length - 2)

    }
    zineJson = zineJson + `]`
    return zineJson
}



function generateNoISBNBooksJson(){
    const packageContentListElement = document.getElementById(packageContentListId)
    let noISBNBooksJson = `"noISBNBooks": [`
    let noISBNBookExists = false
    packageContentListElement.childNodes.forEach(noISBNBookItem => {
        if (noISBNBookItem.getAttribute(noISBNBookAttribute)!=null){
            noISBNBookExists = true
            noISBNBooksJson = noISBNBooksJson + noISBNBookItem.getAttribute(noISBNBookAttribute) + `, `
        }
    });
    if (noISBNBookExists){
        noISBNBooksJson = noISBNBooksJson.substring(0,noISBNBooksJson.length - 2)

    }
    noISBNBooksJson = noISBNBooksJson + `]`
    return noISBNBooksJson
}

function updatePackage(){
    let packageJson = generatePackageJson()
    editPackageFunctions.updatePackage(packageJson)
}



function savePackage(){
    let packageJson = generatePackageJson()
    if (inmateHelperFunctions.inmateHasPrisonID()){
        savePackageToInmate(packageJson)

    } else {
        console.log(packageJson)
        savePackageToInmateNoId(packageJson)
    }
 }

function generatePackageJson(){
    let booksJson = generateBooksJson()
    let zinesJson = generateZinesJson()
    let noISBNBooksJson = generateNoISBNBooksJson()
    let date = helperFunctions.getDate()
    let inmateId = inmateHelperFunctions.getInmateDatabaseID()

    if(inmateHelperFunctions.inmateHasPrisonID()){
        if (editingPackage){
            return `{"id": ${editingPackageId}, ${booksJson}, ${zinesJson}, ${noISBNBooksJson}, "date": "${date}", "inmate": {"id":"${inmateId}"}}`
        } 
        return`{${booksJson}, ${zinesJson}, ${noISBNBooksJson}, "date": "${date}", "inmate": {"id":"${inmateId}"}}`
    } else {
        if (editingPackage){
            return `{"id": ${editingPackageId}, ${booksJson}, ${zinesJson}, ${noISBNBooksJson}, "date": "${date}","inmateNoId": {"id":${inmateId}}}`
        } 
        return`{${booksJson}, ${zinesJson}, ${noISBNBooksJson}, "date": "${date}",  "inmateNoId": {"id":${inmateId}}}`
    }

    
}

function savePackageToInmate(packageJson){
    console.log(packageJson)
    fetch(`http://localhost:8080/addPackage`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: packageJson
    }).then(function(response){
        if(response.status == 204){
            throw "204";
        } else if(response.status == 400){
            throw "400";
        }
        return response.json();
    }).then(function(data){
        let container = getAddPackageContentContainer()
        addPrintInvoiceButton(container, data)
        addDoneButton(container)
        
        
    })
}


function savePackageToInmateNoId(packageJson){
    console.log(packageJson)
    fetch(`http://localhost:8080/addPackageForInmateNoId`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: packageJson
    }).then(function(response){
        if(response.status == 204){
            throw "204";
        } else if(response.status == 400){
            throw "400";
        }
        return response.json();
    }).then(function(data){
        let container = getAddPackageContentContainer()
        addPrintInvoiceButton(container, data)
        addDoneButton(container)
        
        
    })
}


function addDoneButton(container){
    let done = helperFunctions.createButton("Done")
    done.onclick = () => {
        let inmateId = inmateHelperFunctions.getInmateDatabaseID()
        if(inmateHelperFunctions.inmateHasPrisonID()){
            inmateFunctions.findInmate(inmateId)
        } else {
           inmateNoIDFunctions.findInmateNoIDByDatabaseID(inmateId)        }
        helperFunctions.hideModal()
    }
    container.appendChild(done)
}
function addPrintInvoiceButton(container, data){
    let printButton = helperFunctions.createButton("Print invoice?")
    printButton.style.background = "DarkSeaGreen"
    printButton.onclick = () => {
        helperFunctions.generateInvoice(data)
        inmateFunctions.findInmate(inmateHelperFunctions.getInmateDatabaseID())
        helperFunctions.hideModal()
    }
    container.appendChild(printButton)
}

function createEditBookButton(container, isbn, title, author){
    const editButton = helperFunctions.createButton("Edit book info")
    editButton.style.background = "LightCoral"

    editButton.onclick = () => {
        let editText = `Edit the book information below, and then save book. <br><br>`
        editOrCreateBook(editText, isbn, title, author, false)
    }
    container.appendChild(editButton)

}

function bookInfo_confirmBook(bookData, isbnTarget) {
    let container = getAddPackageContentContainer()

    const bookTitle = bookData.title;
    const author = bookData.authors[0];


    let bookMatchText = `
        We found a book that matched ISBN10: <b>${bookData.isbn10}</b> and ISBN13: <b>${bookData.isbn13}</b>.
        <br>
        <br>
        
        <font size="+3"><b>${bookTitle}</b></font>
        <br>
        <font size="+1"><i>${author}</i></font>
<br>
<br>
        Add it to the package by clicking the button below, or search for another book instead.
        `;
    
        helperFunctions.createAndAddParagraphElement(container, bookMatchText)
    createAddBookToPackageButton(container, bookData);
    createEditBookButton(container, isbnTarget, bookTitle, author)
    createAddBookButton(container, "Nevermind, search for different book")
    createCancelButton_returnToStep1(container)

}

    return{
        setupAddPackageModal:setupAddPackageModal,
        setupEditPackageModal:setupEditPackageModal
        }

    
}();





