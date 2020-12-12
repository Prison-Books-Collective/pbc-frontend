adminFunctions = function(){
   
     async function displayAdminPage(){
        let container = helperFunctions.getAndClearSiteContent()
        let adminDiv = document.createElement("div")
        adminDiv.style.textAlign = "center"
        container.appendChild(adminDiv)

        adminDiv.appendChild(await createPackageSection())
        adminDiv.appendChild(document.createElement("br"))
        adminDiv.appendChild(document.createElement("br"))
        adminDiv.appendChild(createEditZinesSection())
    }

    async function getPackageCount(date){
        const response = await fetch(`http://localhost:8080/getPackageCountFromDate?date=${date}`, {
                method: 'get'
            })
        return response.json()
    }

   function addZine(){
    fetch(`http://localhost:8080/addZine`, {
        method: 'post'
    }).then(function(response){
        return response.json();
    }).then(function(data){
        window.alert(`Zine ${data["threeLetterCode"]} -  ${data["title"]} added`)
    })
    }


    async function createPackageSection(){
        let packageCountDiv = document.createElement("div")
        let  packageTitle = document.createElement("h3")
        packageTitle.innerHTML = "Packages"

        let packageHeader = document.createElement("p")
        packageHeader.style.fontSize = "30px"
        let date = helperFunctions.getDate()
        let packageCount =  await getPackageCount(date)
        let packageText = document.createElement("p")
        packageText.innerHTML = `You have completed <b>${packageCount}</b> packages on <b>${date}</b>.`
        packageCountDiv.appendChild(packageTitle)
        packageCountDiv.appendChild(packageHeader)
        packageCountDiv.appendChild(packageText)
        return packageCountDiv
    }
    function createEditZinesSection(){
        let zinesDiv = document.createElement("div")
        let  zineTitle = document.createElement("h3")
        zineTitle.innerHTML = "Zines"
        zinesDiv.appendChild(zineTitle)
        helperFunctions.createLabelAndField(zinesDiv, "Three letter code", "newZineThreeLetterCode","", "Enter three letter code")
        helperFunctions.createLabelAndField(zinesDiv, "Title", "newZineTitle","", "Enter zine title")

        let addZineButton = helperFunctions.createButton("Add Zine")
        zinesDiv.appendChild(addZineButton)
        return zinesDiv
    }
    return{
        displayAdminPage:displayAdminPage
        }

    
}();





