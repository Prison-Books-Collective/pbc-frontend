helperFunctions = function () {

    function createLabelAndField(container, labelContent, fieldId, fieldContent, hint) {

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

    function generateInvoice(packageInfo) {
        let invoice = document.createElement("div")
        let page1 = invoicePage1(packageInfo);
        invoice.appendChild(page1);

        let page2 = document.createElement("img")
        page2.src = "style/invoicePage2.svg"
        invoice.appendChild(page2)

        let openWindow = window.open("", "title", "attributes")
        openWindow.document.write(invoice.innerHTML)
        setTimeout(() => {
            openWindow.document.close()
            openWindow.focus()
            openWindow.print()
            openWindow.close()

        }, 750)
    }

    function createFontStyleSection_Invoice() {
        let styleSection = document.createElement("style")
        styleSection.innerHTML = `
                                @font-face {
                                    font-family: gentium;
                                    src: url('style/Gentium_Basic/GentiumBasic-Regular.ttf') format("truetype");
                                    font-style: normal;
                                }
                                @font-face{
                                    font-family: gentium;
                                    src: url('style/Gentium_Basic/GentiumBasic-Bold.ttf') format("truetype");
                                    font-weight: bold;
                                    font-style: normal;
                                }`
        return styleSection
    }

    function createHeaderLogoAndTitle_Invoice() {
        let headerElement = document.createElement("div")
        headerElement.style.flexFlow = "row nowrap"
        headerElement.style.display = "flex"

        let logoDiv = document.createElement("div")
        let logo = document.createElement("img");
        logo.src = "style/logo.svg";
        logo.height = "150";
        logo.width = "150";
        logo.style.padding = "20px"
        logoDiv.appendChild(logo)
        headerElement.appendChild(logoDiv);

        let headerTextContainer = document.createElement("div")
        headerTextContainer.style.display = "flex"
        headerTextContainer.style.flexFlow = "column nowrap"
        headerTextContainer.style.alignItems = "center"
        headerTextContainer.style.justifyContent = "center"
        headerTextContainer.style.textAlign = "center"
        headerTextContainer.style.width = "100%"

        let pbcHeaderTitle = document.createElement("span");
        pbcHeaderTitle.textContent = "Prison Books Collective";
        pbcHeaderTitle.style.fontSize = "52px"
        pbcHeaderTitle.style.fontWeight = "bold"

        let pbcHeaderSubtitle = document.createElement("span")
        pbcHeaderSubtitle.textContent = "Publishing and Distribution"
        pbcHeaderSubtitle.style.fontSize = "42px"

        let address = document.createElement("span")
        address.style.paddingTop = "10px"
        address.fontSize = "35px"
        address.textContent = "PO Box 625, Carrboro, NC 27510"

        headerTextContainer.appendChild(pbcHeaderTitle);
        headerTextContainer.appendChild(pbcHeaderSubtitle);
        headerTextContainer.appendChild(address)

        headerElement.appendChild(headerTextContainer);
        return headerElement
    }

    function invoicePage1(package) {

        let page1 = document.createElement("div");
        page1.style.fontFamily = "gentium"
        page1.id = "page1";

        page1.appendChild(createFontStyleSection_Invoice())
        page1.appendChild(createHeaderLogoAndTitle_Invoice())
        page1.appendChild(createLineBreak("100%", "solid"))
        page1.appendChild(createNameDateInput_Invoice())
        page1.appendChild(createInformation_Invoice())
        page1.appendChild(createLineBreak("50%", "inset"))
        page1.appendChild(createInvoiceLabel())
        page1.appendChild(createPackageList_Invoice(package))
        return page1
    }

    function createLineBreak(width, style){
        let miniBreak = document.createElement("div")
        miniBreak.style.borderWidth = "1px"
        miniBreak.style.borderStyle = style
        miniBreak.style.width = width
        miniBreak.style.margin = "auto"
        return miniBreak
    }
    function createInvoiceLabel(){
        let div = document.createElement("div")
        div.style.textAlign = "center"
        div.style.paddingTop = "20px"

        let invoiceLabel = document.createElement("span")
        invoiceLabel.style.textAlign = "center"
        invoiceLabel.innerHTML = `<b><u>Invoice:</u></b>`
        invoiceLabel.style.fontSize = "20px"
        div.appendChild(invoiceLabel)
        return div
    }

    function createInformation_Invoice(){
        let info = document.createElement("p")
        info.style.fontSize = "18px"
        info.style.padding = "0px 85px 10px 85px"
        info.innerHTML = `Thank you for your letter, and our apologies for the delay! Due to the number of requests our group receives we are currently a month or two behind on filling requests. We are currently limited to sending <u>only 2 books</u> per package, and 1 package every 2 months.
        <br><br>
                I’ve done my best to find the books you've requested, but since our selection is based on donations, we usually can’t find specific titles. However, I've included books that I hope you’ll enjoy!`

        return info
    }

    function createPackageList_Invoice(package){
        let packageListDiv = document.createElement("div")
        packageListDiv.style.padding = "7px 0px 0px 95px"
        let packageList = document.createElement("ol")
        package.books.forEach(book => {
            let item = document.createElement("li")
            item.innerHTML = `<i>${book.title}</i> - ${book.authors[0]}`
            packageList.appendChild(item)
        })

        package.zines.forEach(zine => {
            let item = document.createElement("li")
            item.innerHTML = `${zine.title}`
            packageList.appendChild(item)
        })

        package.resources.forEach(resource => {
            let item = document.createElement("li")
            item.innerHTML = `<i>${resource.title}</i> - ${resource.authors[0]}`
            packageList.appendChild(item)
        })
        packageListDiv.appendChild(packageList)
        return packageListDiv
    }

    function createNameDateInput_Invoice(){
        let nameDateDiv = document.createElement("div")
        nameDateDiv.style.fontFamily = "arial"
        nameDateDiv.style.display = "flex"
        nameDateDiv.style.flexFlow = "row nowrap"
        nameDateDiv.style.alignItems = "center"
        nameDateDiv.style.justifyContent = "space-between"
        nameDateDiv.style.padding = "35px 85px 25px 85px"
        nameDateDiv.style.fontSize = "10px"

        let nameInput = document.createElement("span")
        nameInput.textContent = `___________________________________`

        let dateInput = document.createElement("span")
        dateInput.innerHTML = `_______ <span style="font-size: 20px">/</span>_______ <span style="font-size: 20px">/</span>______________`
        
        nameDateDiv.appendChild(nameInput)
        nameDateDiv.appendChild(dateInput)
        return nameDateDiv
    }
    function getModalContainer() {
        let modal = document.getElementById("modal-content")

        return modal
    }

    function createButton(text) {
        const button = document.createElement("button")
        button.innerHTML = text
        return button
    }

    function createAndAddParagraphElement(container, text) {
        let paraElement = document.createElement("p")
        paraElement.innerHTML = text
        container.appendChild(paraElement)
    }

    function hideModal() {
        const modal = document.getElementById("modal")
        modal.style.display = "none"
    }

    function displayModal() {
        const modal = document.getElementById("modal")
        modal.style.display = "block"
    }

    function getAndClearModalContainer(){
        let  container = getModalContainer()
        container.innerHTML = ""
        return container
    }
    return {
        createLabelAndField: createLabelAndField,
        createButton: createButton,
        createAndAddParagraphElement: createAndAddParagraphElement,
        getModalContainer: getModalContainer,
        displayModal: displayModal,
        hideModal: hideModal,
        generateInvoice: generateInvoice,
        getAndClearModalContainer:getAndClearModalContainer
    }


}();