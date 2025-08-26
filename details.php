<?php
include_once "conn.php";
if(isset($_GET['id'])){
    $id=$_GET['id'];
    $checkQuery="SELECT id,task FROM tasks WHERE id=:id";
    $stmt=$pdo->prepare($checkQuery);//return a statement object
    $stmt->execute(
        [':id' => $id]
    );
    $Data = $stmt->fetchAll(PDO::FETCH_OBJ);//returns rows of objects
    if(count($Data)>0){
        echo echo json_encode($Data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    else{
        echo "This ID is not Available";
    }
}
else{
    echo "Nothing was sent";
}