let tasksArray=new Map();
var loaded=false;

window.onload=function(){
     getFromLocalStorage();
 };


function deleteTask(row){
    if(row){
        let taskName = row.cells[0].textContent;
        let keyTask = taskName.toLowerCase().replace(/\s+/g, "");
        tasksArray.delete(keyTask);
        row.remove();
    }
    storeInLocalStorage();
}

let currentRow = null;

function editTask(row, button) {
    let oldContent=row.cells[0].textContent;
    if (currentRow === null) {
        document.getElementById("task").value = oldContent;
        button.textContent = "Save";
        currentRow = row;
    } else if (currentRow === row) {
        let newTask = document.getElementById("task").value.trim();
        if(newTask==""){
            alert("Please enter your edited task");
            return;
        }
        if (checkIfExist(newTask)) {
            button.innerHTML = 'Edit <i class="fa-solid fa-pen"></i>';
            document.getElementById("task").value = "";
            alert("This task already exist!");
            return;
        }
        tasksArray.delete(oldContent.toLowerCase().replace(/\s+/g, ""));
        row.cells[0].textContent = newTask;
        button.innerHTML = 'Edit <i class="fa-solid fa-pen"></i>';
        document.getElementById("task").value = "";
        storeInLocalStorage();
        currentRow = null;
    }
}

////function to edit and delete a task
function buttonEvents() {
    document.getElementById("tableBody").addEventListener("click", function(e) {
        var button = e.target.closest("button");
        if (!button) return; 

        if (button.classList.contains("del")) {
            var confirmation = confirm("Are you sure you want to delete this task?");
            if (confirmation) {
                deleteTask(button.closest("tr"));
            }
        } 
        else if (button.classList.contains("edit")) {
            editTask(button.closest("tr"),button);
        }
    });

    document.querySelector(".Add").addEventListener("click", function() {
        addTask();
        document.getElementById("task").value = "";
    });
}

function checkIfExist(Task){
    Task=Task.toLowerCase().replace(/\s+/g, "");
    if (tasksArray.has(Task)){
        return true;
    }
    else{
        tasksArray.set(Task, "exist");
        return false;
    }
}

function addTask() {
    var taskValue = document.getElementById("task").value;

    if (!taskValue.trim()) {
        alert("Please Enter your task first");
        return;
    }  

    if (!checkIfExist(taskValue)) { //if the task does not exist

        var tr = document.createElement("tr");

        var tdTask = document.createElement("td");
        tdTask.textContent = taskValue;
        tr.appendChild(tdTask);

        var tdDelete = document.createElement("td");
        tdDelete.id = "delete";
        tdDelete.innerHTML = '<button class="del">Delete <i class="fa-solid fa-trash"></i></button>';
        tr.appendChild(tdDelete);

        var tdEdit = document.createElement("td");
        tdEdit.id = "edit";
        tdEdit.innerHTML = '<button class="edit">Edit <i class="fa-solid fa-pen"></i></button>';
        tr.appendChild(tdEdit);

        document.getElementById("tableBody").appendChild(tr);

        storeInLocalStorage();
    }
    else{
        alert("This task is already added!");
    }
}


function storeInLocalStorage() {
    var tableBody = document.getElementById("tableBody");
    var tasksHTML = tableBody.innerHTML; 
    localStorage.setItem("Tasks", tasksHTML);
    localStorage.setItem("allTasks", JSON.stringify(Array.from(tasksArray.entries())));

}

function getFromLocalStorage() {
    let storedTasks=localStorage.getItem("allTasks");
    if(storedTasks){
        tasksArray=new Map(JSON.parse(storedTasks));
    }
    else{
        tasksArray=new Map();
    }

    var data = localStorage.getItem("Tasks"); 
    var tableBody = document.getElementById("tableBody");
    if (data) tableBody.innerHTML = data; // to put HTML code back
    buttonEvents();
}
