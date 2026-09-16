<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Deixe apenas a hash alfanumérica na chave
define('TMDB_API_KEY', 'CHAVE'); 
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');

?>