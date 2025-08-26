<?php
include_once "conn.php";

header('Content-Type: application/json; charset=utf-8');
$sqlQuery="SELECT * FROM tasks WHERE status = 0";
$stmt=$pdo->prepare($sqlQuery);//returns a statement object
$stmt->execute();
$data= $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;