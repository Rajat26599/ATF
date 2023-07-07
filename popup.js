//import data from "./data.js";
// import { display } from "./options.js";

const myurl = document.querySelector('.myurl');
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    myurl.value = tabs[0].url;
});

const btn = document.querySelector('.btn');

function add(obj){
    let savedContent = JSON.parse(localStorage.getItem("savedContent"));
    if(savedContent!==null) localStorage.setItem("savedContent", JSON.stringify([...savedContent, obj]));
    else localStorage.setItem("savedContent", JSON.stringify([obj]));
    // display();
}
function clear(){
    localStorage.clear();
}

btn.addEventListener('click', (e) => {
    e.preventDefault();
    var popupForm = document.forms.popupForm;
    var popupFormData = new FormData(popupForm);
    var tagsList = popupFormData.get('tags').split(",").map(function(item) {
        if(item.trim().length>0) return item.trim();
    });
    let savedContent = JSON.parse(localStorage.getItem("savedContent"));
    var obj = {
        id: savedContent!=null?savedContent.length:0,
        link: popupFormData.get('url'),
        tags: tagsList,
        createdOn: new Date(),
    };
    add(obj);
    window.close();
});
