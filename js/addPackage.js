packageFunctions = function(){
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

    function getAddPackageContentContainer() {
        let packageContainer = document.getElementById(packageContentContainerId)
        if (packageContainer == null) {
            packageContainer = document.createElement("div");
            const modalContentContainer = getModalContainer()
            modalContentContainer.appendChild(packageContainer)
            packageContainer.id = packageContentContainerId;
    
        } else {
            packageContainer.innerHTML = ""
        }
        return packageContainer
    }

    function getModalContainer(){
        return document.getElementById("modal-content")
    }

    function setupAddPackageModal() {
        const modalContentContainer = getModalContainer()
        modalContentContainer.innerHTML = ""
        const span = document.createElement("span")
        span.className = "close"
        span.innerHTML = "&times;"
        span.onclick = ()=> {
            modal.style.display = "none";
          }
        modalContentContainer.appendChild(span)
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
            explanation.innerHTML = `Would you like to add another book, or zine(s)? Or if you're done, click Complete Package`
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
        //seeAllZinesButton(container)
        //searchZinesByKeywordButton(container)
        createCancelButton_returnToStep1(container)

    }

    function seeAllZinesButton(container){
        const seeAllZinesButton = helperFunctions.createButton("Select from Full Zine List")
        seeAllZinesButton.onclick = () => {
            getAndDisplayZines()
        }
        container.appendChild(seeAllZinesButton)
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
            addZinesToPackage()
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
        helperFunctions.createLabelAndField(container, "Scan book ISBN: ", searchIsbnField, "", "click here, then scan")
        document.getElementById(searchIsbnField).focus()
        createSearchForBookButton(container)
        createCancelButton_returnToStep1(container)
    }

   

    function createSearchForBookButton(container){
        const searchButton = helperFunctions.createButton("Search for book")
        searchButton.onclick = () =>{
            const isbnField = document.getElementById(searchIsbnField)
            if (isbnField.value == "") {
                //error message to add isbn
            }else{
                searchForBook(isbnField.value)
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
            bookInfo_confirmBook(data)
        }).catch(error => {
            if (error == "204"){
                promptCreateBook(isbnTarget)
            } else{
                console.log("other error")
            }
    })

}



    function promptCreateBook(isbnTarget){

        let resultsContainer =  getAddPackageContentContainer()

        let notFoundText = `We could not find the book with <b>ISBN# ${isbnTarget}</b> in our database. Please add the title and author of the book and add it to the package. <br><br>`
        helperFunctions.createAndAddParagraphElement(resultsContainer, notFoundText)

        helperFunctions.createLabelAndField(resultsContainer, "ISBN", addBookISBNId, isbnTarget, "")
        helperFunctions.createLabelAndField(resultsContainer, "Book title", addBookTitleId, "", "Type title")
        helperFunctions.createLabelAndField(resultsContainer, "Book author", addBookAuthorId, "", "Type author")

        let saveNewBookButton = helperFunctions.createButton("Save book and add to package")

        saveNewBookButton.onclick = () =>{
            let author = document.getElementById(addBookAuthorId).value
            let title = document.getElementById(addBookTitleId).value
            let isbn = document.getElementById(addBookISBNId).value

            let bothISBNs = ""
            if (isbn.length == 10){
                bothISBNs = `"isbn10": "${isbn}", "isbn13": "978${isbn}"`
            } 
            if (isbn.length == 13){
                let isbn10 = isbn.substring(3)
                bothISBNs = `"isbn10": "${isbn10}", "isbn13": "${isbn}"`
            }

            let book = `{"title": "${title}", "authors": ["${author}"], ${bothISBNs}}`
            saveBook(book)
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
function addZinesToPackage(){
    let  packageContentList = getPackageContentListElement()

    const checkedZines = getCheckedZines()
    checkedZines.forEach(zine => {
        zineListItem = document.createElement("li");
        const zineJson = JSON.parse(zine.value)
        zineListItem.innerHTML = `<b>${zine.id}</b> - ${zineJson['title']}`;
        zineListItem.setAttribute(zineAttribute, zine.value)
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
    let modal = getModalContainer()
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
    addBookButton.onclick = () => {
        addBookToPackage(bookData)
        displayPackage()
        step1_bookOrZine(true)
    };

    container.appendChild(addBookButton);
    

}

function createCompletePackageButton(container){
    const savePackageButton = helperFunctions.createButton("Complete package")

    savePackageButton.onclick = () =>{
        savePackage()
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
        if (zineItem.getAttribute(bookAttribute)==null){
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


function savePackage(){
    let booksJson = generateBooksJson()
    let zinesJson = generateZinesJson()

    let packageJson = `{${booksJson}, ${zinesJson}}`
    console.log(packageJson)
    //BREAKPOINBT
    const inmateId = inmateFunctions.getInmateId()
    
    fetch(`http://localhost:8080/addPackage?id=${inmateId}`, {
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
        inmateFunctions.findInmate()
        modal.style.display = "none";
        
    }).catch(error => {
        if (error == "204"){
        } else{
            
        }
})

}

function bookInfo_confirmBook(bookData) {
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
    createAddBookButton(container, "Nevermind, search for different book")
    createCancelButton_returnToStep1(container)

}

    return{
        setupAddPackageModal:setupAddPackageModal
    }

    
}();





