editPackageFunctions = function(){

    let addItemsButtonId = "addItemsButton"
    let editItemsButtonId = "editItemsButton"
    let deleteItemButtonId = "deleteItemsButton"
    let buttonsDivId =  "editPackageButtonsDiv"
    let noISBNCheckboxName = "noISBNBookCheckbox"
    let zineCheckboxName = "zineCheckbox"
    let bookCheckboxName =  "bookCheckbox"

    function editPackage(package){
        helperFunctions.displayModal()
        let container = helperFunctions.getAndClearModalContainer()
        container.appendChild(createEditOrDeleteInfo())
        container.appendChild(createPackageContentChecklist(package))

        let buttonsDiv = document.createElement("div")
        buttonsDiv.id = buttonsDivId
        createEditPackageButtonPanel(buttonsDiv, package)

        container.appendChild(buttonsDiv)
        
    }

    function createEditPackageButtonPanel(buttonsDiv, package){
        buttonsDiv.appendChild(createAddItemButton(package))
        buttonsDiv.appendChild(createEditItemButton())
        buttonsDiv.appendChild(createDeleteItemButton(package)) 
        buttonsDiv.appendChild(createDeletePackageButton(package["id"]))
    }

    function createDeleteItemButton(package){
        let deleteItemsButton = helperFunctions.createButton("Delete selected item(s)")
        deleteItemsButton.id = deleteItemButtonId
        deleteItemsButton.disabled = true
        deleteItemsButton.onclick = () =>{
            let zines = getZineCheckboxes(zineCheckboxName)
            let books = getBookCheckboxes(bookCheckboxName)
            let noISBNBooks =  getNoISBNBookCheckboxes(noISBNCheckboxName)

            zinesChecked = []
            booksChecked = []
            noISBNBooksChecked = []

            newZines = []
            newBooks = []
            newNoISBNBooks = []

            zines.forEach(checkbox =>{ 
                if(checkbox.checked){
                    zinesChecked.push(checkbox.id)
                }
            })
            
            books.forEach(checkbox =>{ 
                if(checkbox.checked){
                    booksChecked.push(checkbox.id)
                }
            })

            noISBNBooks.forEach(checkbox =>{ 
                if(checkbox.checked){
                    noISBNBooksChecked.push(checkbox.id)
                }
            })

            let packageZines = package["zines"]
            let packageBooks = package["books"]
            let packageNoISBNBooks = package["noISBNBooks"]

            
                zinesChecked.forEach(checked => {
                    for (i = 0; i < packageZines.length; i++){
                    if (packageZines[i]["id"] == checked){
                        packageZines.splice(i,1)
                    }
                } 
                })
                newZines = packageZines
            
                booksChecked.forEach(checked => {
                    for (i = 0; i <packageBooks.length; i++){
                        if (packageBooks[i]["id"] == checked){
                            packageBooks.splice(i,1)
                        }
                    }
                })
        
                newBooks = packageBooks


                noISBNBooksChecked.forEach(checked => {
                    for (i = 0; i <packageNoISBNBooks.length; i++){
                        if (packageNoISBNBooks[i]["id"] == checked){
                            packageNoISBNBooks.splice(i,1)
                        }
                    }
                })
        
                newNoISBNBooks = packageNoISBNBooks
            
              package["zines"] = newZines
              package["books"] = newBooks
              package["noISBNBooks"] = newNoISBNBooks
            package = JSON.stringify(package)
            updatePackage(package)
        }
        return deleteItemsButton
    }    

    function createAddItemButton(package){
        let addItemsButton = helperFunctions.createButton("Add items")
        addItemsButton.id = addItemsButtonId
        addItemsButton.onclick = () => {
            addPackageFunctions.setupEditPackageModal(package)
        }

        return addItemsButton
    }
    function createEditItemButton(){
        let editItemsButton = helperFunctions.createButton("Edit selected item(s)")
        editItemsButton.id = editItemsButtonId
        editItemsButton.disabled = true
        editItemsButton.onclick = () => {
            alert("This feature has not yet been implemented.")
        }
        return editItemsButton
    }    

    function createDeletePackageButton(packageId){
        let deletePackageButton = helperFunctions.createButton("Delete entire package")
        deletePackageButton.style.background = "LightCoral"
        deletePackageButton.onclick = () => {
            let buttonsDiv = getAndClearEditPackageButtonsDiv()
            buttonsDiv.appendChild(createConfirmDeletePackageButton(packageId))
            buttonsDiv.appendChild(createCancelDeletePackageButton())
        }
        return deletePackageButton
    }    

    function createConfirmDeletePackageButton(packageId){
        let confirmDeletePackageButton = helperFunctions.createButton("Yes, delete entire package")
        confirmDeletePackageButton.style.background = "LightCoral"
        confirmDeletePackageButton.onclick = () => {
         deletePackage(packageId)
        }
        return confirmDeletePackageButton
    }  

    function deletePackage(packageId){
        let inmateId = inmateHelperFunctions.getInmateDatabaseID()
        url = `http://localhost:8080/deletePackage?packageId=${packageId}`
        fetch(url, {
            method: 'delete'
        }).then(function(response){
            if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){
            helperFunctions.hideModal()
            setTimeout(1000)
            if (inmateHelperFunctions.inmateHasPrisonID()){
                inmateFunctions.findInmate(inmateId)
            } else {
                inmateNoIDFunctions.findInmateNoIDByDatabaseID(inmateId)
            }
        }).catch(error => {
            if (error == "400"){
                console.log("error")
            }
    })
}

    function updatePackage(package){
        let inmateId = inmateHelperFunctions.getInmateDatabaseID()

        url = `http://localhost:8080/updatePackage`
        fetch(url, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: package
        }).then(function(response){
            if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){
            helperFunctions.hideModal()
            setTimeout(1000)

            if (inmateHelperFunctions.inmateHasPrisonID()){
                inmateFunctions.findInmate(inmateId)
            } else {
                inmateNoIDFunctions.findInmateNoIDByDatabaseID(inmateId)
            }
        }).catch(error => {
            if (error == "400"){
                console.log("error")
            }
    })

    }

    function getAndClearEditPackageButtonsDiv(){
        let buttonsDiv = document.getElementById("editPackageButtonsDiv")
            buttonsDiv.innerHTML = ""
            return buttonsDiv
    }
    
    function createCancelDeletePackageButton(){
        let cancelDeletePackageButton = helperFunctions.createButton("Cancel")
        cancelDeletePackageButton.onclick = () => {
            createEditPackageButtonPanel(getAndClearEditPackageButtonsDiv())
        }
        return cancelDeletePackageButton
    }   

    function createEditOrDeleteInfo(){
        let div = document.createElement("div")
        div.style.textAlign = "center"

        let span = document.createElement("span")
        span.innerHTML = `Select the item(s) that you would like to either edit or delete (or delete the whole package). <br><small>Changes you make to the titles or authors of items will affect the entire database.</small>`
        span.style.fontSize = "20px"
        div.appendChild(span)
        div.appendChild(document.createElement("hr"))

        return div
    }

    function createPackageContentChecklist(package){
        const leftAlignDiv = document.createElement("div")
        leftAlignDiv.style.textAlign = "left"
        leftAlignDiv.style.paddingTop = "20px"
        leftAlignDiv.style.paddingLeft = "20px"

        addBooksToEditChecklist(package, leftAlignDiv);
        addZinesToEditChecklist(package, leftAlignDiv);
        addNoISBNBooksToEditChecklist(package, leftAlignDiv);
        return leftAlignDiv
    }
                    
               

    function addNoISBNBooksToEditChecklist(package, div) {
        package.noISBNBooks.forEach(noISBNBook => {
            const noISBNBookCheckbox = document.createElement("input");
            noISBNBookCheckbox.type = "checkbox";
            noISBNBookCheckbox.name = noISBNCheckboxName;
            noISBNBookCheckbox.value = JSON.stringify(noISBNBook);
            noISBNBookCheckbox.id = noISBNBook.id;
            noISBNBookCheckbox.addEventListener("click", onCheckboxClick)

            const label = document.createElement("label");
            label.style.paddingLeft = "5px"
            label.htmlFor = noISBNBookCheckbox.id;
            label.innerHTML = `<i>${noISBNBook.title}</i> - ${noISBNBook.authors[0]}`;

            div.appendChild(noISBNBookCheckbox);
            div.appendChild(label);
            div.appendChild(document.createElement("br"));
        });
    }

    function addZinesToEditChecklist(package, div) {
        package.zines.forEach(zine => {
            const zineCheckbox = document.createElement("input");
            zineCheckbox.type = "checkbox";
            zineCheckbox.name = zineCheckboxName;
            zineCheckbox.value = JSON.stringify(zine);
            zineCheckbox.id = zine.id;
            zineCheckbox.addEventListener("click", onCheckboxClick)

            const label = document.createElement("label");
            label.htmlFor = zineCheckbox.id;
            label.style.paddingLeft = "5px"

            label.innerHTML = `<b>${zine.threeLetterCode}</b> - ${zine.title}`;

            div.appendChild(zineCheckbox);
            div.appendChild(label);
            div.appendChild(document.createElement("br"));
        });
    }

    function addBooksToEditChecklist(package, div) {
        package.books.forEach(book => {
            const bookCheckbox = document.createElement("input");
            bookCheckbox.type = "checkbox";
            bookCheckbox.name = bookCheckboxName;
            bookCheckbox.value = JSON.stringify(book);
            bookCheckbox.id = book.id;
            bookCheckbox.addEventListener("click", onCheckboxClick)
            const label = document.createElement("label");
            label.htmlFor = bookCheckbox.id;
            label.style.paddingLeft = "5px"

            label.innerHTML = `<i>${book.title}</i> - ${book.authors[0]}`;

            div.appendChild(bookCheckbox);
            div.appendChild(label);
            div.appendChild(document.createElement("br"));
        });
    }
   

    function getZineCheckboxes() {
        return document.getElementsByName(zineCheckboxName);
    }
    

function getNoISBNBookCheckboxes() {
    return document.getElementsByName(noISBNCheckboxName);
}

function getBookCheckboxes() {
    return document.getElementsByName(bookCheckboxName);
}

function onCheckboxClick(event){
    let zines = getZineCheckboxes()
    let books = getBookCheckboxes()
    let noISBNBooks = getNoISBNBookCheckboxes()

    let zineChecked = false
    let bookChecked = false
    let noISBNBookChecked = false

    let addItemsButton = document.getElementById(addItemsButtonId)
    let editItemsButton = document.getElementById(editItemsButtonId)
    let deleteItemsButton = document.getElementById(deleteItemButtonId)

    zines.forEach(zineCheckbox => {
        if (zineCheckbox.checked == true){
            zineChecked = true
        }
    })

    books.forEach(bookCheckbox => {
        if (bookCheckbox.checked == true){
            bookChecked = true
        }
    })

    noISBNBooks.forEach(noISBNBookCheckbox => {
        if (noISBNBookCheckbox.checked == true){
            noISBNBookChecked = true
        }
    })
    
    if (zineChecked){
        addItemsButton.disabled = true
        editItemsButton.disabled = true
        deleteItemsButton.disabled = false
    } else if (bookChecked || noISBNBookChecked) {
        addItemsButton.disabled = true
        editItemsButton.disabled = false
        deleteItemsButton.disabled = false
    } else{
        addItemsButton.disabled = false
        editItemsButton.disabled = true
        deleteItemsButton.disabled = true
    }
}


    return{
        editPackage:editPackage,
        updatePackage:updatePackage
    }

    
}();

