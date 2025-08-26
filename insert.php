<?php
include_once "conn.php";

header('Content-Type: application/json; charset=utf-8');

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['Task'])) {
    $taskValue = $data['Task'];
    try {
        $sql = "INSERT INTO tasks (task) VALUES (:taskValue)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':taskValue' => $taskValue
        ]);

        $id = $pdo->lastInsertId();//I will need the last id to send it to js
        echo json_encode([
            "id"   => $id,
            "task" => $taskValue,
            "message" => "Task added successfully"
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "error" => "Error inserting task: " . $e->getMessage()
        ]); 
    }
} else {
    echo json_encode([
        "error" => "No task provided"
    ]);
}
