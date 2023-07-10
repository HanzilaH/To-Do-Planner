let tasks = [];
let i = 0;
let number = 0;

const map = new Map()
const colors = ["#C97B84", "#A85751", "#EAB2A0", "#AABA9E", "#C6B89E", "#F3AA60", "#A0BFE0"]






/**
 * uses a random index
 * @returns a random color from the list of color predefined for the theme of the website
 */
function generateRandomColor(){
    const colorsIndex = Math.floor(Math.random()*colors.length)
    // return colors[colorsIndex]
    return "lightblue"

}






/**
 * This is the main function initially called to fetch the already stored tasks from the backend
 * this is asynchronous so to maintain the order
 * Notice that it automatically filters out the null items in the array and doesnt show any entries for those
 * it called sets the height of the textareas according to their scroll height 
 */
async function fetchData(){

    let ulList = document.getElementById("notes-list");

    fetch('/api/data')
    .then(response => response.json())
    .then(data => {

        
        
        tasks = data.tasks.filter((element) => element !== null);
        
        tasks.forEach(task => {

            
            map.set("task"+i, task)
            let EntryCode = "<li class=\"list-group-item\"><div class=\"input-group\"><div class=\"input-group-text entry-checkbox\"><label class=\"container\"><input type=\"checkbox\"><div class=\"checkmark\"></div></label></div><textarea class=\"form-control entry-text\" placeholder=\"Enter text\" onkeyup=\"handleKeyUp(event)\" id=\"task" + i + "\">" + task + "</textarea><div onclick=\"Delete(this)\" style=\"margin-left: 10px;\" class=\"trash-bin\"></div></div></li>";

            ulList.insertAdjacentHTML('beforeend', EntryCode);

            const element = document.getElementById("task" + i)

            const cl = generateRandomColor()
            console.log(cl)
            element.parentNode.parentNode.style.backgroundColor = cl


            // This code is needed to set the height of the textarea DURING LOADING
            element.style.height = `${element.scrollHeight}px`;
            i++;

            
        });


    
    })
    .catch(error => {
        console.error(error);
    });

}

fetchData()



/**
 * This function is called when the plus icon is pressed
 * It inserts the relevant html to add a list item
 * It then creates a null entry in the map using the i value
 * then it calls the function post the changes
 * 
 * notice that null entries are also posted
 * 
 */
function AddEntry() {

    let EntryCode = "<li class=\"list-group-item\"><div class=\"input-group\"><div class=\"input-group-text entry-checkbox\"><label class=\"container\"><input type=\"checkbox\"><div class=\"checkmark\"></div></label></div><textarea class=\"form-control entry-text\" placeholder=\"Enter text\" onkeyup=\"handleKeyUp(event)\" id=\"task" + (i) + "\"></textarea><div onclick=\"Delete(this)\" style=\"margin-left: 10px;\" class=\"trash-bin\"></div></div></li>";
    let ulList = document.getElementById("notes-list");
    ulList.insertAdjacentHTML('beforeend', EntryCode);


    const element = document.getElementById("task" + i)

    element.parentNode.parentNode.style.backgroundColor = generateRandomColor()

    
    map.set("task"+i, null)
    postTask(map)
    i++

}


/**
 * This is called everytime a key is released
 * This function updates the map and then called the function to post the updates
 * 
 * @param {Event} event 
 */
function handleKeyUp(event){
    console.log("the value is "+event.target.value+ "ans the id is "+ event.target.id)
    console.log(map)
    map.set(event.target.id, event.target.value)
    console.log(map)
    postTask(map)

}








//This code is separately needed to set the correct height of each textarea DURING writing 
let ulList = document.getElementById("notes-list");
ulList.addEventListener("keyup", function (e) {
    if (e.target.classList.contains("entry-text")) {

        let textarea = e.target;
        textarea.style.height = "30px";
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
});







/**
 * One of the most important functions for the application
 * It takes an arguments of map
 * Then it creates a temporary new array from that map 
 * and then posts that array using the api
 * NOTE: A map in js always stores the data in a sequence which is a major reason we dont care if the
 * i keeps on updating in the AddEntry function
 * The map will always create the array in the same sequence and the same sequence of array
 * allows it to create the sequential task ids when the application is loaded
 * 
 * 
 * Notice that this function doesnt care about the null entries
 * 
 * @param {Map} map 
 */
async function postTask(map) {

    let j = 0;
    const TempArrayOfTasks = Array.from(map.values());
    const apiUrl = '/api/data'; 
    const postData = {
      "tasks": TempArrayOfTasks
    };
  

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
  
      const data = await response.text();
      console.log(data); // Response from the API
    } catch (error) {
      console.error('Error:', error);
    }
  }
  









/**
 * This controls the bin icon
 * Onclick of the bin item this function is called
 * it handles the frontend by removing the specific list item
 * it then updates the map and calls the function to post the changes
 * @param {div} svgElement 
 */
function Delete(svgElement) {
    var div = svgElement.parentNode.parentNode;
    div.parentNode.removeChild(div);

    const removeValue =  svgElement.parentNode.querySelector("textarea").value
    const removeID = svgElement.parentNode.querySelector("textarea").id
    map.delete(removeID)
    postTask(map)

}

