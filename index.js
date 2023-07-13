let tasks = [];
let i = 0;


// map is one of the most imp variables thats used to keep track of the values and the checked
// status for a single user
const map = new Map()


const colors = ["#E1EFF6", "#CFE8F8", "#BCE1F9", "#AADAFA", "#92CDFC"]

const currentDate = new Date()
const month = currentDate.toLocaleString('default', { month: 'long' });
const day = currentDate.getDate()



/**
 * This func is for the suffix of the date
 * @param {number} num 
 * @returns string of the suffix
 */
function setSuffix(num) {
  const moduloTen = num % 10;
  const moduloHundred = num % 100;

  if (moduloTen === 1 && moduloHundred !== 11) {
    return "st";
  } else if (moduloTen === 2 && moduloHundred !== 12) {
    return "nd";
  } else if (moduloTen === 3 && moduloHundred !== 13) {
    return "rd";
  } else {
    return "th";
  }
}



// this is to set the date initially
document.getElementById("date").textContent = `${day}${setSuffix(day)} ${month}`






let colorsIndex = -1;
/**
 * uses a fixed color gradient
 * @returns a color from the list of color predefined for the theme of the website
 */
function generateRandomColor() {
  // const colorsIndex = Math.floor(Math.random()*colors.length)
  // return colors[colorsIndex]
  colorsIndex++
  if (colorsIndex > colors.length - 1) colorsIndex = 0

  return colors[colorsIndex]

}






/**
 * This is the main function initially called to fetch the already stored tasks from the backend
 * this is asynchronous so to maintain the order
 * Notice that it automatically filters out the null items in the array and doesnt show any entries for those
 * it called sets the height of the textareas according to their scroll height 
 */
async function fetchData() {

  let ulList = document.getElementById("notes-list");

  fetch('/api/data')
    .then(response => response.json())
    .then(data => {

      console.log(data)



      tasks = data.tasks.filter((element) => {
        if (element[0] !== (null) && element[0] !== "") {
          return element
        }

      });
      console.log(tasks)
      tasks.forEach(task => {


        map.set("task" + i, task)
        let EntryCode = `
            <li class="list-group-item">
                <div class="input-group">
                    <div class="input-group-text entry-checkbox">
                        <label class="container">
                            <input onClick="handleCheck(event)" type="checkbox">
                            <div class="checkmark"></div>
                        </label>
                    </div>
                    <textarea  class="form-control entry-text" placeholder="Enter text" onkeyup="handleKeyUp(event)" id="task${i}">${task[0]}</textarea>
                    <div onclick="Delete(this)" style="margin-left: 10px;" class="trash-bin"></div>
                </div>
            </li>
        `;
        ulList.insertAdjacentHTML('beforeend', EntryCode);



        const element = document.getElementById("task" + i)


        const checkbox = element.parentNode.querySelector("input[type=\"checkbox\"]")
        checkbox.checked = task[1]


        const cl = generateRandomColor()
        element.parentNode.parentNode.style.backgroundColor = cl

        
        
        element.parentNode.parentNode.style.opacity = 0
        element.parentNode.parentNode.classList.add('animation');

        setTimeout(function() {
          // animation class is immediately removed so to fix another bug
          // if i dont remove the animation class immediately then the trash-animation
          // does not work immediately
          element.parentNode.parentNode.classList.remove('animation');
          element.parentNode.parentNode.style.opacity = 1
        }, 1500);




        // these two are need for a hover effect over the textbox
        // notice that hovering over the textbox changes the box shadow of the li item
        element.addEventListener('mouseover', function() {
          element.parentNode.parentNode.classList.add('hover-effect');
        });
        
        element.addEventListener('mouseout', function() {
          element.parentNode.parentNode.classList.remove('hover-effect');
        });




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

  let EntryCode = "<li class=\"list-group-item\"><div class=\"input-group\"><div class=\"input-group-text entry-checkbox\"><label class=\"container\"><input onClick = \"handleCheck(event)\" type=\"checkbox\"><div class=\"checkmark\"></div></label></div><textarea class=\"form-control entry-text\" placeholder=\"Enter text\" onkeyup=\"handleKeyUp(event)\" id=\"task" + (i) + "\"></textarea><div onclick=\"Delete(this)\" style=\"margin-left: 10px;\" class=\"trash-bin\"></div></div></li>";
  let ulList = document.getElementById("notes-list");
  ulList.insertAdjacentHTML('beforeend', EntryCode);


  const element = document.getElementById("task" + i)

  element.parentNode.parentNode.style.backgroundColor = generateRandomColor()


  map.set("task" + i, [null, false])
  postTask(map)
  i++

}


/**
 * This is called everytime a key is released
 * This function updates the map and then called the function to post the updates
 * 
 * @param {Event} event 
 */
function handleKeyUp(event) {
  console.log("the value is " + event.target.value + "ans the id is " + event.target.id)
  console.log(map)
  map.set(event.target.id, [event.target.value, false])
  console.log(map)
  postTask(map)

}


/**
 * This function edits the data whenever the checkbox is clicked
 * @param {Event} event 
 */
function handleCheck(event) {
  const checkbox = event.target
  const textarea = checkbox.parentNode.parentNode.parentNode.querySelector('textarea');
  console.log(textarea)

  const id = textarea.id
  map.set(id, [textarea.value, checkbox.checked])
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
  
  // animation is played AFTER the delete button is pressed
  div.classList.add('trash-animation')
  console.log(div.classList)


  // this timeout is required so that the div is removed after the animation played
  setTimeout(()=>{
      div.parentNode.removeChild(div);

  }, 400)

  const removeValue = svgElement.parentNode.querySelector("textarea").value
  const removeID = svgElement.parentNode.querySelector("textarea").id
  map.delete(removeID)
  postTask(map)

}

