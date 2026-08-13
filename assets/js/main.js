const API_URL = 'api/movies.php';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sectionTitle = document.getElementById('sectionTitle');

// Função para buscar filmes do nosso Back-end
async function fetchMovies(action = 'popular', query = '') {
    try {
        let url = `${API_URL}?action=${action}`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        displayMovies(data.results);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        moviesGrid.innerHTML = '<p>Erro ao carregar os filmes.</p>';
    }
}

// Função para desenhar os cards no HTML
function displayMovies(movies) {
    moviesGrid.innerHTML = '';

    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach(movie => {
        // Trata filmes sem poster
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=Sem+Foto';

        const card = document.createElement('div');
        card.classList.add('movie-card');

        card.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</div>
            </div>
        `;

        moviesGrid.appendChild(card);
    });
}

// Evento de busca
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        sectionTitle.textContent = `Resultados para: "${query}"`;
        fetchMovies('search', query);
    }
});

// Carrega os populares assim que a página abre
fetchMovies('popular');