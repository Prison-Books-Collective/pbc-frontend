helperFunctions = function(){
   
    function createLabelAndField(container, labelContent, fieldId, fieldContent, hint){
        
        const br = document.createElement("br");

        const label = document.createElement("label"); 
        label.textContent = labelContent
        label.htmlFor = fieldId

        const field = document.createElement("input");
        field.type = "text"
        field.id = fieldId
        field.value = fieldContent
        field.placeholder = hint

        container.appendChild(label)
        container.appendChild(field)
        container.appendChild(br)

    }

    function createButton(text){
        const button = document.createElement("button")
        button.innerHTML = text
        return button
    }

    function createAndAddParagraphElement(container, text){
        let paraElement = document.createElement("p")
        paraElement.innerHTML = text
        container.appendChild(paraElement)
    }

    return{
        createLabelAndField:createLabelAndField,
        createButton:createButton,
        createAndAddParagraphElement:createAndAddParagraphElement
    }

    
}();





