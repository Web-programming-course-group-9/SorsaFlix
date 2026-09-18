import MovieCard from './MovieCard'

// Shows a list of movies as MovieCards
// Receives an array of movie data as a prop; does not fetch data itself
function SearchResults({ results }) {
    return (
        <div>
            {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    )
}

export default SearchResults