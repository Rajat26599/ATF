//import data from "./data.js";
// import { display } from "./options.js";

//###########################
//DEFAULT ACTIONS

const storage = chrome.storage.local;

const clearLocal = () => {
    storage.set({savedContent: []}, () => {
        console.log("Cleared Successfully!");
    });
}
const resetId = () => {
    console.log('Resettting id');
    storage.get("savedContent", (savedContent) => {
        const arr = savedContent.savedContent;
        arr.forEach((item, index) => {
            item.id = index;
        });
        clearLocal();
        storage.set({savedContent: arr}, () => {
            console.log("Saved Successfully!");
        });
    });
    console.log('Reset Successfully!');
}

//###########################

function checkDuplicate(obj){
    var duplicateItem = '';
    storage.get("savedContent", (savedContent) => {
        let arr = savedContent.savedContent;
        for(let item of arr){
            if(item.link === obj.link) {
                duplicateItem = item;
                break;
            }
        }
    });
    return new Promise(function(resolve, reject) {
            // Only `delay` is able to resolve or reject the promise
            setTimeout(function() {
                console.log('duplicateItem', duplicateItem);
                resolve(duplicateItem); // After 3 seconds, resolve the promise with value 42
            }, 100);
        });
}

function populateTags(item) {
    let tags = document.querySelector('.tags');
    let value = '';
    try {
        for(let i of item.tags) {
            value = value + (value ? ', ' : '') + i;
        } 
        tags.value = value;
    } catch {(e) => console.log(e)}
}

var obj = {};
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    const myurl = document.querySelector('.myurl');
    myurl.value = tabs[0].url;

    const mytitle = document.querySelector('.mytitle');
    mytitle.value = tabs[0].title;
    obj.title = tabs[0].title;
    console.log('tabtitle', tabs[0].title);

    checkDuplicate({link: myurl.value})
    .then((duplicateItem) => {
        console.log('duplicateItem in then', duplicateItem);
        populateTags(duplicateItem);
    }).catch((e) => {
        console.log(e);
    });
});

const btn = document.querySelector('.btn');

// function add(obj){
//     let savedContent = JSON.parse(localStorage.getItem("savedContent"));
//     if(savedContent!==null) localStorage.setItem("savedContent", JSON.stringify([...savedContent, obj]));
//     else localStorage.setItem("savedContent", JSON.stringify([obj]));
//     // display();
// }
function addInLocal(obj){
    storage.get("savedContent", (savedContent) => {
        if(savedContent.savedContent!==null) { 
            storage.set({savedContent: [...savedContent.savedContent, obj]}, () => {
                console.log("Saved Successfully!");
            });
        }
        else {
            storage.set({savedContent: [obj]}, () => {
                console.log("Saved Successfully!");
            });
        } 
        console.log(savedContent);
    });
}

function updateInLocal(obj) {
    storage.get("savedContent", (savedContent) => {
        let index = savedContent.savedContent.findIndex(e => e.id == obj.id);
        try {
            savedContent.savedContent[index] = obj;
            storage.set({savedContent: savedContent.savedContent}, () => {
                console.log('Updated item!', savedContent);
            })
        } catch {(e) => console.log(e)}
    })
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

    obj.title = popupFormData.get('title'); 
    obj.link = popupFormData.get('url');
    obj.tags = tagsList;
    obj.createdOn = JSON.stringify(new Date());

    storage.get("savedContent", (savedContent) => {
        obj.id = savedContent.savedContent.length ? savedContent.savedContent.length : 0;
    });
    // add(obj);
    checkDuplicate(obj)
    .then((duplicateItem) => {
        if(duplicateItem) {
            updateInLocal({...obj, id: duplicateItem.id});
        } else {
            addInLocal(obj);
        }
        window.close();
    }).catch((e) => console.log(e));
});