'use strict';


const errorName = "please enter correct name";
const emptyGender = "select a gender";
const noSaved = "No gender saved";
let previousNameSubmit = '';
const url = 'https://api.genderize.io/?name=';

//send a get request to https://api.genderize.io/?name= + the name that user will enter
//parse json response  
const getRequest = function(name){  
    const http = new XMLHttpRequest();
    let info = ' ';
    http.open("GET", url+name);
    http.responseType="text";
    http.send();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let myObj = JSON.parse(this.responseText);
          setInfo(myObj);
        }
      };
 }
 
//set the data from server to page 
const setInfo = function(info){
    if(info['gender']){
        document.querySelector('.pre-gender').textContent = info['gender'] + ' ';
        document.querySelector('.pre-probability').textContent = info['probability'] + ' ';
    }
    else {
        document.querySelector('.pre-gender').textContent = "No Prediction";
        document.querySelector('.pre-probability').textContent = 0;
    }
}

//get the data from radio 
const valueOfRadio = function () {
    const radio = document.querySelectorAll('input[name="gender"]');
    let selectedValue;
    for (const r of radio) {
        if (r.checked) {
            selectedValue = r.value;
            break;
        }
    }
    return selectedValue;
};

//check the name that entered is correct or not
const checkName = function(name){
     if(name.length == 0 || name.length >255 || !/^[a-zA-Z\s]*$/.test(name)){
         console.log(`hi`);
        return false
     }
       
     else return true;   
     
}

//display the notify panel with the its message
const notify = function(message){
    document.querySelector('.notify-text').textContent = message;
    document.querySelector('.notify').classList.remove('hidden');
}

//add event listener to clear button to remove the previous gender from local storage
document.querySelector('.clear').addEventListener('click', function(e){
    e.preventDefault();
    let myStorage = window.localStorage;
    if(previousNameSubmit){
        if(myStorage.getItem(previousNameSubmit)){
            myStorage.removeItem(previousNameSubmit);
            document.querySelector('.save-gender').textContent = ' ';
        }
        else {
            notify(noSaved);
        }
    }
})

//add event listener to submit button to sent a request to server and display its answer
document.querySelector('.submit').addEventListener('click' , function(e){
    e.preventDefault();
    let myStorage = window.localStorage;
    const name = document.querySelector('.name').value;
    if(checkName(name)){
        previousNameSubmit = name;
        getRequest(name);
        if(myStorage.getItem(name))
          document.querySelector('.save-gender').textContent = myStorage.getItem(name);
        else 
          document.querySelector('.save-gender').textContent = ' ';
    }
    else   notify(errorName);
    
    

})

//add event listener to save button to svae the gender that user entered 
document.querySelector('.save').addEventListener('click' , function(e){
    e.preventDefault();
    let myStorage = window.localStorage;
    const name = document.querySelector('.name').value;
    const radioValue = valueOfRadio();
    if(name){
        if(radioValue){
            if (!myStorage.getItem(name))
                myStorage.setItem(name , radioValue);
            else{
                myStorage.removeItem(name ,radioValue);
                myStorage.setItem(name , radioValue);
            }
            getRequest(name);
        }
        else{
            notify(emptyGender);
        }
    }
    else 
        notify(emptyName);

    document.querySelector('.save-gender').textContent = myStorage.getItem(name);
})
 
//add event listener to close button to close the notify panel
document.querySelector('.close').addEventListener('click',function(e){
    e.preventDefault();
    document.querySelector('.notify').classList.add('hidden');
})

