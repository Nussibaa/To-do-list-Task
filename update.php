<?php
include_once "conn.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['id']) && isset($data['task'])) {
    $id = $data['id'];
    $task = $data['task'];

    $updateQuery = "UPDATE tasks SET task = :task WHERE id = :id";
    $stmt = $pdo->prepare($updateQuery);
    $stmt->execute([
        ':task' => $task,
        ':id' => $id
    ]);

    echo "Task updated successfully!";
} else {
    echo "Invalid data received!";
}
?>
