<?php
require_once 'config.php';
require_once 'database.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Buscar todos os filmes favoritos no banco
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM favorites ORDER BY created_at DESC");
    $favorites = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => $favorites
    ]);
    exit;
}

// POST: Receber um JSON do JS/Insomnia e salvar no banco
if ($method === 'POST') {
    // Captura o corpo da requisição JSON (payload enviado)
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['tmdb_id']) || empty($input['title'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Dados incompletos"]);
        exit;
    }

    try {
        $sql = "INSERT INTO favorites (tmdb_id, title, poster_path, vote_average) 
                VALUES (:tmdb_id, :title, :poster_path, :vote_average)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':tmdb_id'     => $input['tmdb_id'],
            ':title'       => $input['title'],
            ':poster_path' => $input['poster_path'] ?? null,
            ':vote_average' => $input['vote_average'] ?? 0.0
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Filme adicionado aos favoritos!"
        ]);
    } catch (PDOException $e) {
        // Trata duplicidade caso o filme já esteja favoritado (UNIQUE KEY)
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "Filme já está nos favoritos"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Método não suportado"]);