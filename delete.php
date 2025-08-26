<?php
include_once "conn.php";

if(isset($_GET['id'])){
    $id = $_GET['id'];

    $checkQuery = "SELECT id, task FROM tasks WHERE id = :id";
    $stmt = $pdo->prepare($checkQuery);
    $stmt->execute([':id' => $id]);
    $Data = $stmt->fetchAll(PDO::FETCH_OBJ);

    if(count($Data) > 0){
        // Update the status
        $changeStatus = "UPDATE tasks SET status = 1 WHERE id = :id";
        $stmt = $pdo->prepare($changeStatus);
        $stmt->execute([':id' => $id]);
        echo "Task is deleted and Status updated successfully";
    }
    else{
        echo "This ID is not available";
    }
}
else{
    echo "Nothing was sent";
}
