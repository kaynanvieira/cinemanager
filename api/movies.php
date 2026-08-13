<?php
require_once 'config.php';

// Captura a ação vinda da URL (ex: api/movies.php?action=popular)
$action = $_GET['action']?? 'popular';

if($action==='popular'){
    $url = TMDB_BASE_URL . "/movie/popular?api_key=" . TMDB_API_KEY . "&language=pt-BR";

    // Faz a requisição para a API do TMDB a partir do PHP
    $response = file_get_contents($url);

    // Devolve o JSON exatamente como o TMDB entregou
    echo $response;
    exit;
}

if($action === 'search'){
    $query = urldecode($_GET['q']?? '');
    $url = TMDB_BASE_URL . "/search/movie?api_key=" . TMDB_API_KEY . "&query={$query}&language=pt-BR";

    $response = file_get_contents($url);
    echo $response;
    exit;
}

echo json_encode(["status" => "error", "message" => "Ação inválida"]);

?>