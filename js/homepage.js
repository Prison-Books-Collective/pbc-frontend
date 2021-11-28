homepageFunctions = function(){
    const findInmateIdFieldId = "find_inmate_id_field"
    
    async function displayHomepage(){
        const container = helperFunctions.getAndClearSiteContent()
      
        
        let div = document.createElement("div")
        div.id = "inmate"
        


        let inputField = createInmateInputField()
        
        div.appendChild(inputField)
        div.appendChild(helperFunctions.createBreakElement())
        div.appendChild(helperFunctions.createBreakElement())
        div.appendChild(helperFunctions.createBreakElement())
        div.appendChild(helperFunctions.createBreakElement())
        div.appendChild(createNoIDLink())

        div.appendChild(helperFunctions.createBreakElement())
        div.appendChild(helperFunctions.createBreakElement())
        div.appendChild(await createPackageCount())

        container.appendChild(div)
        inputField.focus
        
    }

    async function getPackageCount(date){
      const response = await fetch(`http://localhost:8080/getPackageCountFromDate?date=${date}`, {
              method: 'get'
          })
      return response.json()
  }


    async function createPackageCount(){    
      let date = helperFunctions.getDate()
      let packageCount =  await getPackageCount(date)
      let packageText = document.createElement("span")
      packageText.innerHTML = `You have completed <b>${packageCount}</b> packages on <b>${date}</b>.`
      return packageText
  }

    function createInmateInputField(){
      let input = document.createElement("input")
        
        input.type = "text"
        input.style.textAlign = "center"
        input.id = findInmateIdFieldId
        input.placeholder = "Enter inmate ID # and press enter"
        input.class = "center"
        input.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.key === 'Enter') {
              inmateFunctions.findInmate(document.getElementById(findInmateIdFieldId).value)
            }
          });
      return input
    }

    function createNoIDLink(){
      let link = document.createElement("a")
      link.href = "#"
      link.textContent = "Don't have an ID?"
      link.style.fontSize = "12px"
      link.onclick = () => {
        inmateNoIDFunctions.displaySearchForInmateNoID()
      }
      return link
    }
    return{
        displayHomepage:displayHomepage
    }

    
}();





