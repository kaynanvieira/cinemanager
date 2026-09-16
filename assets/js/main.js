const API_URL = 'api/movies.php';
const FAV_URL = 'api/favorites.php';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sectionTitle = document.getElementById('sectionTitle');
const showPopularBtn = document.getElementById('showPopularBtn');
const showFavsBtn = document.getElementById('showFavsBtn');

// Buscar filmes da API externa
async function fetchMovies(action = 'popular', query = '') {
    try {
        let url = `${API_URL}?action=${action}`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            displayMovies(data.results, false);
        } else {
            moviesGrid.innerHTML = '<p>Erro ao carregar filmes. Verifique o PHP.</p>';
        }
    } catch (error) {
        console.error('Erro no fetch:', error);
        moviesGrid.innerHTML = '<p>Erro de conexão com o servidor local.</p>';
    }
}

// Renderizar cards na tela
function displayMovies(movies, isFavoriteList = false) {
    if (!moviesGrid) return;
    moviesGrid.innerHTML = '';

    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach(movie => {
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=Sem+Foto';

        const tmdbId = movie.tmdb_id || movie.id;
        const voteAverage = movie.vote_average ? Number(movie.vote_average).toFixed(1) : '0.0';

        const card = document.createElement('div');
        card.classList.add('movie-card');

        card.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-actions">
                    <span class="movie-rating">⭐ ${voteAverage}</span>
                    ${!isFavoriteList ? `<button class="fav-btn" data-id="${tmdbId}">+ Favorito</button>` : ''}
                </div>
            </div>
        `;

        if (!isFavoriteList) {
            const favBtn = card.querySelector('.fav-btn');
            favBtn.addEventListener('click', () => {
                saveFavorite({
                    tmdb_id: tmdbId,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average
                }, favBtn);
            });
        }

        moviesGrid.appendChild(card);
    });
}

// Salvar um filme no Banco de Dados
async function saveFavorite(movieData, buttonElement) {
    try {
        const response = await fetch(FAV_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData)
        });

        const result = await response.json();

        if (response.ok) {
            buttonElement.textContent = '❤️ Salvo';
            buttonElement.classList.add('disabled');
            buttonElement.disabled = true;
        } else {
            alert(result.message || 'Erro ao favoritar.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Buscar filmes do Banco de Dados MySQL
async function fetchFavorites() {
    try {
        const response = await fetch(FAV_URL);
        const result = await response.json();

        if (result.status === 'success') {
            displayMovies(result.data, true);
        }
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        moviesGrid.innerHTML = '<p>Erro ao carregar os favoritos.</p>';
    }
}

// Eventos de clique com checagem
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            sectionTitle.textContent = `Resultados para: "${query}"`;
            fetchMovies('search', query);
        }
    });
}

if (showPopularBtn) {
    showPopularBtn.addEventListener('click', () => {
        sectionTitle.textContent = 'Filmes Populares';
        fetchMovies('popular');
    });
}

if (showFavsBtn) {
    showFavsBtn.addEventListener('click', () => {
        sectionTitle.textContent = 'Meus Favoritos';
        fetchFavorites();
    });
}

// Inicia
fetchMovies('popular');