import MovieCard from './MovieCard'
import SerieCard from './serieCard/SerieCard'
import './SearchResults.css'

// Shows a list of movies as MovieCards
// Receives an array of movie data as a prop; does not fetch data itself
function SearchResults({ results, type }) {
    return (
        <div className="search-results-grid">
            {results.map((item) =>
                type === "tv"
                    ? <SerieCard key={item.id} serie={item} />
                    : <MovieCard key={item.id} movie={item} />
            )}
        </div>
    )
}

export default SearchResults