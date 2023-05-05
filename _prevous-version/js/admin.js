adminFunctions = function(){
    let threeLetterCodeId = "newZineThreeLetterCode"
    let zineTitleId = "newZineTitle"

    function displayAdminPage(){
        let container = helperFunctions.getAndClearSiteContent()
        let adminDiv = document.createElement("div")
        adminDiv.style.textAlign = "center"
        container.appendChild(adminDiv)

        adminDiv.appendChild(document.createElement("br"))
        adminDiv.appendChild(document.createElement("br"))
        adminDiv.appendChild(createEditZinesSection())
    }

  
   function addZine(zine){
    fetch(`http://localhost:8080/addZine`, {
        method: 'post',
        body:  zine,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }).then(function(response){
        return response.json();
    }).then(function(data){
        window.alert(`Zine ${data["threeLetterCode"]} -  ${data["title"]} added`)
    })
    }


    
    function createEditZinesSection(){
        let zinesDiv = document.createElement("div")
        let  zineTitle = document.createElement("h3")
        zineTitle.innerHTML = "Zines"
        zinesDiv.appendChild(zineTitle)
        zinesDiv.appendChild(helperFunctions.createLabelAndField("Three letter code", threeLetterCodeId,"", "Enter three letter code"))
        zinesDiv.appendChild(helperFunctions.createLabelAndField( "Title", zineTitleId,"", "Enter zine title"))

        let addZineButton = helperFunctions.createButton("Add Zine")
        addZineButton.onclick = () => {
            let title = document.getElementById(zineTitleId).value
            let threeLetterCode = document.getElementById(threeLetterCodeId).value

            zineJson = `{"title": "${title}", "threeLetterCode": "${threeLetterCode}"}`

            addZine(zineJson)
        }
        zinesDiv.appendChild(addZineButton)
        return zinesDiv
    }
    return{
        displayAdminPage:displayAdminPage
        }

    
}();





