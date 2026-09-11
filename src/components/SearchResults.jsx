import MovieCard from './MovieCard'

// Shows a list of movies as MovieCards
// Receives an array of movie data as a prop; does not fetch data itself
function SearchResults({ movies }) {
    return (
        <div>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}

export default SearchResults