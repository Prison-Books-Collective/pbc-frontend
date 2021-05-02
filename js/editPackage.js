editPackageFunctions = function(){

    let editItemsButtonId = "editItemsButton"
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
        buttonsDiv.appendChild(createEditItemButton())
        buttonsDiv.appendChild(createDeleteItemButton(package)) 
        buttonsDiv.appendChild(createDeletePackageButton(package["id"]))
    }

    function createDeleteItemButton(package){
        let deleteItemsButton = helperFunctions.createButton("Delete selected item(s)")
        deleteItemsButton.onclick = () =>{
            let zines = document.getElementsByName(zineCheckboxName)
            let books = document.getElementsByName(bookCheckboxName)
            let noISBNBooks =  document.getElementsByName(noISBNCheckboxName)

            zinesChecked = []
            booksChecked = []
            noISBNBooksChecked = []

            zines.forEach(checkbox =>{ 
                if(checkbox.checked){
                    zinesChecked.push(checkbox)
                }
            })
            
            books.forEach(checkbox =>{ 
                if(checkbox.checked){
                    booksChecked.push(checkbox)
                }
            })

            noISBNBooks.forEach(checkbox =>{ 
                if(checkbox.checked){
                    noISBNBooksChecked.push(checkbox)
                }
            })
            let packageZines = package["zines"]
            let packageBooks = package["books"]
            let packageNoISBNBooks = package["noISBNBooks"]

            for (i = 0; i< packageZines.length; i++){
                zinesChecked.forEach(checked => {
                    if (packageZines[i]["id"] == checked.id){
                        delete packageZines[i]
                    }
                })
            }
           
            for (i = 0; i< packageBooks.length; i++){
                booksChecked.forEach(checked => {
                    if (packageBooks[i]["id"] == checked.id){
                        delete packageBooks[i]
                    }
                })
            }

            for (i = 0; i< packageNoISBNBooks.length; i++){
                noISBNBooksChecked.forEach(checked => {
                    if (packageNoISBNBooks[i]["id"] == checked.id){
                        delete packageNoISBNBooks[i]
                    }
                })
            }
              
            console.log(package)
            //UPDATE PACKAGE
        }
        return deleteItemsButton
    }    

    function createEditItemButton(){
        let editItemsButton = helperFunctions.createButton("Edit selected item(s)")
        editItemsButton.id = editItemsButtonId
        editItemsButton.onclick = () => {
            //EDIT ITEMS
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
        inmateId = inmateHelperFunctions.getInmateDatabaseID()
        url = `http://localhost:8080/deletePackage?inmateId=${inmateId}&packageId=${packageId}`
        fetch(url, {
            method: 'put'
        }).then(function(response){
            if(response.status == 400){
                throw "400";
            }
            return response.json();
        }).then(function(data){
            inmateFunctions.findInmate(inmateId)
            helperFunctions.hideModal()
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
            zineCheckbox.onclick = () => {
                let editButton = document.getElementById(editItemsButtonId)
                editButton.disabled = zineCheckbox.checked
            }
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

            const label = document.createElement("label");
            label.htmlFor = bookCheckbox.id;
            label.style.paddingLeft = "5px"

            label.innerHTML = `<i>${book.title}</i> - ${book.authors[0]}`;

            div.appendChild(bookCheckbox);
            div.appendChild(label);
            div.appendChild(document.createElement("br"));
        });
    }
   




    return{
        editPackage:editPackage
    }

    
}();





