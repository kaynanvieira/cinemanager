<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Deixe apenas a hash alfanumérica na chave
define('TMDB_API_KEY', '71ffd03e5378483f442e24f4879a1c82'); 
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');

?>