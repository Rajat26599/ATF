//import data from "./data.js";

export function display(){

    //JSON.parse(localStorage.getItem("savedContent"))?.reverse().forEach((item, index) => {
    chrome.storage.local.get("savedContent", (savedContent) => {
        
        const cardsList = document.getElementsByClassName("cards")[0];

        //remove all old elements
        var child = cardsList.lastChild;
        while(child) {
            cardsList.removeChild(child);
            child = cardsList?.lastChild;
        }
        
        //add fresh elements once again;
        savedContent.savedContent?.reverse().forEach((item, index) => {
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
            createdOn.innerHTML = item.createdOn?.substring(1,item.createdOn.length-1);
            newCard.appendChild(createdOn);

            cardsList.appendChild(newCard);
        });

        function remove(id){
            if(window.confirm("Are you sure you want to delete this item?")){
                // let savedContent = JSON.parse(localStorage.getItem("savedContent"));
                // console.log(savedContent);
                // savedContent.splice(savedContent.findIndex(e => e.id === id),1);
                // console.log(savedContent);
                // localStorage.setItem("savedContent", JSON.stringify(savedContent));
                // display();
                console.log(chrome.storage.local);
                chrome.storage.local.get("savedContent", (savedContent) => {
                    savedContent.savedContent.splice(savedContent.savedContent.findIndex(e => e.id === id),1);
                    chrome.storage.local.set({savedContent: savedContent.savedContent}, () => {
                        console.log("Removed Successfully!");
                        display();
                    });
                })
            }
        }

        const removeBtn = document.querySelectorAll('.remove-btn');
        removeBtn.forEach((item) => {
            item.addEventListener('click', (e) => {
                remove(e.target.id);
            });
        });
    });
    
}
display();