//import data from "./data.js";

export function display(){
    const cardsList = document.getElementsByClassName("cards")[0];

    //remove all old elements
    var child = cardsList.lastChild;
    while(child) {
        cardsList.removeChild(child);
        child = cardsList?.lastChild;
    }

    //add fresh elements once again;
    JSON.parse(localStorage.getItem("savedContent")).reverse().forEach((item, index) => {
        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
        
        //btn panel starts
        const btnPanel = document.createElement("div");
        btnPanel.setAttribute("class", "btn-panel")

        const edit = document.createElement("button");
        edit.setAttribute("class", "edit-btn");
        edit.setAttribute("id", item.id);
        edit.innerHTML = "Edit";
        btnPanel.appendChild(edit);        

        const remove = document.createElement("button");
        remove.setAttribute("class", "remove-btn");
        remove.setAttribute("id", item.id);
        remove.innerHTML = "x";
        btnPanel.appendChild(remove);

        newCard.appendChild(btnPanel);
        //btn panel ends

        const ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", item.link);
        ifrm.setAttribute("class", "preview");
        newCard.appendChild(ifrm);

        const link = document.createElement("a");
        link.innerText = item.link;
        link.setAttribute('href', item.link);
        link.setAttribute('target', "_blank");
        newCard.appendChild(link);
        
        const tags = document.createElement("div");
        item.tags.forEach((tagName, tagIndex) => {
            if(tagName){
                const tag = document.createElement("p");
                tag.setAttribute("class", "tag");
                tag.innerHTML = tagName;
                tags.appendChild(tag);
            }
        })
        newCard.appendChild(tags);

        const createdOn = document.createElement("p");
        createdOn.innerHTML = item.createdOn;
        newCard.appendChild(createdOn);

        cardsList.appendChild(newCard);
    });

    function remove(id){
        if(window.confirm("Are you sure you want to delete this item?")){
            let savedContent = JSON.parse(localStorage.getItem("savedContent"));
            console.log(savedContent);
            savedContent.splice(savedContent.findIndex(e => e.id === id),1);
            console.log(savedContent);
            localStorage.setItem("savedContent", JSON.stringify(savedContent));
            display();
        }
    }
    
    const removeBtn = document.querySelectorAll('.remove-btn');
    removeBtn.forEach((item) => {
        item.addEventListener('click', (e) => {
            console.log(e.target.id);
            remove(e.target.id);
        });
    });
}
display();