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
        alert("please add a task first!");
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

function addTask(){
    var taskValue=document.getElementById("task").value;

    if (!taskValue.trim()){
        alert("Please Enter your task first");
        return;
    }

    var tr=document.createElement("tr");
    
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
