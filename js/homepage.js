homepageFunctions = function(){
    const findInmateIdFieldId = "find_inmate_id_field"
    function displayHomepage(){
        const container = document.getElementById("site_content")
        container.innerHTML = ""
        let input = document.createElement("input")
        
        input.type = "text"
        input.id = findInmateIdFieldId
        input.placeholder = "Enter inmate ID # and press enter"
        input.class = "center"
        input.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.key === 'Enter') {
              inmateFunctions.findInmate(document.getElementById(findInmateIdFieldId).value)
            }
          });
        container.appendChild(input)
        input.focus()
    }

    return{
        displayHomepage:displayHomepage
    }

    
}();





