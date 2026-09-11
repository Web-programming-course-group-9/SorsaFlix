// Shows one movie card with title, poster
// Receives a movie data as a prop; does not fetch data itself
function MovieCard({ movie }) {
    // TMDB returns only the path to the poster image, so we need to prepend the base URL
    const posterUrl = "https://image.tmdb.org/t/p/w200" + movie.poster_path;

    return (
        <div>
            <img src={posterUrl} alt={movie.title} />
            <p>{movie.title}</p>
        </div>
    );
}

export default MovieCard