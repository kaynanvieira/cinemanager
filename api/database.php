<?php

$host = 'localhost';
$db   = 'cinemanager_db';
$user = 'root'; // Altere se o seu MySQL tiver usuário diferente
$pass = '';     // Altere se o seu MySQL tiver senha

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erro na conexão com o banco de dados: " . $e->getMessage()
    ]);
    exit;
}

?>