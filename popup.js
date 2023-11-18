//import data from "./data.js";
// import { display } from "./options.js";

//###########################
//DEFAULT ACTIONS

const clearLocal = () => {
    chrome.storage.local.set({savedContent: []}, () => {
        console.log("Cleared Successfully!");
    });
}
const resetId = () => {
    console.log('Resettting id');
    chrome.storage.local.get("savedContent", (savedContent) => {
        const arr = savedContent.savedContent;
        arr.forEach((item, index) => {
            item.id = index;
        });
        clearLocal();
        chrome.storage.local.set({savedContent: arr}, () => {
            console.log("Saved Successfully!");
        });

    });
    console.log('Reset Successfully!');
}

//###########################

const myurl = document.querySelector('.myurl');
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    myurl.value = tabs[0].url;
});

const btn = document.querySelector('.btn');

// function add(obj){
//     let savedContent = JSON.parse(localStorage.getItem("savedContent"));
//     if(savedContent!==null) localStorage.setItem("savedContent", JSON.stringify([...savedContent, obj]));
//     else localStorage.setItem("savedContent", JSON.stringify([obj]));
//     // display();
// }
function addInLocal(obj){
    chrome.storage.local.get("savedContent", (savedContent) => {
        if(savedContent.savedContent!==null) { 
            chrome.storage.local.set({savedContent: [...savedContent.savedContent, obj]}, () => {
                console.log("Saved Successfully!");
            });
        }
        else {
            chrome.storage.local.set({savedContent: [obj]}, () => {
                console.log("Saved Successfully!");
            });
        } 
        console.log(savedContent);
    });
}

// function clear(){
//     localStorage.clear();
// }


btn.addEventListener('click', (e) => {
    e.preventDefault();
    var popupForm = document.forms.popupForm;
    var popupFormData = new FormData(popupForm);
    var tagsList = popupFormData.get('tags').split(",").map(function(item) {
        if(item.trim().length>0) return item.trim();
    });
    var obj = {
        link: popupFormData.get('url'),
        tags: tagsList,
        createdOn: JSON.stringify(new Date()),
    };
    chrome.storage.local.get("savedContent", (savedContent) => {
        obj.id = savedContent.savedContent.length ? savedContent.savedContent.length : 0;
    });
    // add(obj);
    addInLocal(obj);
    window.close();
});