

// This is the code for a list item
const EntryCode = "<li class=\"list-group-item\"><div class=\"input-group\"><div class=\"input-group-text entry-checkbox\"><label class=\"container\"><input type=\"checkbox\"><div class=\"checkmark\"></div></label></div><textarea class=\"form-control entry-text\" placeholder=\"Enter text\"></textarea><div onclick=\"Delete(this)\" style=\"margin-left: 10px;\" class=\"trash-bin\"></div></div></li>"

function AddEntry(){

    
    
    var htmlContent = "<li style=\"background-color: aquamarine; border-radius: 15px;\" class=\"list-group-item list-group-item-action\" for=\"first\"><div class=\"input-group\"><div  id=\"entry-checkbox\" class=\"input-group-text\"><input class=\"form-check-input mt-0\" type=\"checkbox\" ></div><input type=\"text\" id=\"entry-text\" class=\"form-control\" placeholder=\"Enter text\"></div></li>";


    var element = document.getElementById("notes-list");

    // Append the HTML content to the element
    element.innerHTML += EntryCode;



    const textareas = document.querySelectorAll("textarea");
    // Adding event listeners for each of the textboxes
    textareas.forEach(textarea => {
    textarea.addEventListener("keyup", e => {
        textarea.style.height = "30px";

        // Adjust the height based on the scrollHeight
        textarea.style.height = `${e.target.scrollHeight}px`;
    });
    });




    // Make a GET request to fetch JSON data from the backend
fetch('/api/data')
.then(response => response.json())
.then(data => {
  console.log(data);
  // Process the received JSON data
})
.catch(error => {
  console.error(error);
});






}






// To delete the specific textbox
function Delete(svgElement){
    var div = svgElement.parentNode.parentNode;
    div.parentNode.removeChild(div);
    console.log("Delete also works")
}



// This specifc code is needed to set the initial event listener
const textarea = document.querySelector("textarea")
textarea.addEventListener("keyup", e=>{


    // this is the initial height of the textarea
    textarea.style.height = "30px"
    var scrollheight = e.target.scrollHeight;
    textarea.style.height = `${scrollheight}px`


})





// const textareas = document.querySelectorAll("textarea");

// textareas.forEach(textarea => {
//   textarea.addEventListener("keyup", e => {
//     // Set the initial height of the textarea
//     textarea.style.height = "30px";
    
//     // Adjust the height based on the scrollHeight
//     textarea.style.height = `${e.target.scrollHeight}px`;
//   });
// });
