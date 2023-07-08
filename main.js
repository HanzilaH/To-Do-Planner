let tasks;
let i = 0;
let number = 0;

// Make a GET request to fetch JSON data from the backend
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        tasks = data.tasks;
        tasks = tasks.filter((element) => element !== null);
        tasks.forEach(task => {
            if (task == null) {
                tasks.re
            }
            console.log(task);
            Initialise(task, i);
            i++;
            number++;
        });
    })
    .catch(error => {
        console.error(error);
    });


let ulList = document.getElementById("notes-list");

ulList.addEventListener("keyup", function (e) {
    if (e.target.classList.contains("entry-text")) {
        let textarea = e.target;
        textarea.style.height = "30px";
        textarea.style.height = `${textarea.scrollHeight}px`;

        let textareaId = textarea.id;
        let textareaIndex = textareaId.substring(4); // Extract index from textarea id

        tasks[textareaIndex] = textarea.value;
        console.log(tasks[textareaIndex]);

        const apiUrl = '/api/data'; // Replace with your actual API endpoint

        const postData = {
            "tasks": tasks
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.text())
            .then(data => {
                console.log(data); // Response from the API
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});




/**
 * This function is only slightly different to the AddEntry() function because this is used initially
 * @param {string} task is the string name of the task to be performed
 * @param {number} i is the index of the task in the tasks list; this number is also used to giving id to each textbox
 */
function Initialise(task, i) {
    let EntryCode = "<li class=\"list-group-item\"><div class=\"input-group\"><div class=\"input-group-text entry-checkbox\"><label class=\"container\"><input type=\"checkbox\"><div class=\"checkmark\"></div></label></div><textarea class=\"form-control entry-text\" placeholder=\"Enter text\" id=\"task" + i + "\">" + task + "</textarea><div onclick=\"Delete(this)\" style=\"margin-left: 10px;\" class=\"trash-bin\"></div></div></li>";

    let ulList = document.getElementById("notes-list");

    // Append the HTML content to the element
    ulList.insertAdjacentHTML('beforeend', EntryCode);
    document.getElementById("task" + i).style.height = `${document.getElementById("task" + i).scrollHeight}px`

}



/**
 * This function is performed when the add button is clicked
 * It sets the corresponding value of the tasks array to null (so this null value can later be removed)
 */
function AddEntry() {
    number++
    tasks[number] = null


    // This is the code for a list item
    let EntryCode = "<li class=\"list-group-item\"><div class=\"input-group\"><div class=\"input-group-text entry-checkbox\"><label class=\"container\"><input type=\"checkbox\"><div class=\"checkmark\"></div></label></div><textarea class=\"form-control entry-text\" placeholder=\"Enter text\" id=\"task" + number + "\"></textarea><div onclick=\"Delete(this)\" style=\"margin-left: 10px;\" class=\"trash-bin\"></div></div></li>"

    let ulList = document.getElementById("notes-list");

    // Append the HTML content to the element
    ulList.insertAdjacentHTML('beforeend', EntryCode);




}






// To delete the specific textbox
function Delete(svgElement) {
    var div = svgElement.parentNode.parentNode;
    div.parentNode.removeChild(div);
    console.log("Delete also works")
}



// This specifc code is needed to set the initial event listener
// const textarea = document.querySelector("textarea")
// textarea.addEventListener("keyup", e=>{


//     // this is the initial height of the textarea
//     textarea.style.height = "30px"
//     var scrollheight = e.target.scrollHeight;
//     textarea.style.height = `${scrollheight}px`


// })





