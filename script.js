window.onload=function(){
   getFromLocalStorage();
};


function deleteTask(row){
    if(row){
        row.remove();
    }
    storeInLocalStorage();
}

function editTask(row){
    var newTask=document.getElementById("task").value;
    if(newTask.trim()==""){
        return;
    }
    else{
        row.cells[0].textContent=newTask;
        storeInLocalStorage();
    }
}

////function to edit and delete a task
function buttonEvents(){
var buttons=document.querySelectorAll("button");
buttons.forEach(function(button){
    button.addEventListener("click",function(){
        var parentClass=button.parentElement.className;
        if(button.className=="del"){
            var confirmation=confirm("Are you sure you want to delete this task?");
            if(confirmation){
                deleteTask(button.parentElement.parentElement);
            }
        }
        else if(button.className=="edit"){
            editTask(button.parentElement.parentElement);
        }
        else if(button.className=="Add"){
            addTask();
        }
    });
});
}

function storeInLocalStorage() {
    var tableBody = document.getElementById("tableBody");
    var tasksHTML = tableBody.innerHTML; 
    localStorage.setItem("Tasks", tasksHTML); 
}

function getFromLocalStorage() {
    var data = localStorage.getItem("Tasks"); 
    var tableBody = document.getElementById("tableBody");
    if (data) tableBody.innerHTML = data; // to put HTML code back
    buttonEvents();
}
