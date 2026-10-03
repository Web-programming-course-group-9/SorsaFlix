import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext.jsx"
import MovieCard from "../../components/MovieCard"
import "../movies/Movies.css"
import "./UserFavorites.css"

// Page that lists the logged in user's own favorite movies.
// Uses our protected GET /favorites route (movie ids only) and then
// fetches each movie's details through the existing /movies/:id route.
function UserFavorites() {
    // Logged in user, null when not logged in
    const { user } = useAuth()

    // Favorite movies with details from TMDB
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {
        // Not logged in: nothing to fetch
        if (!user) {
            setLoading(false)
            return
        }

        async function fetchFavorites() {
            try {
                setLoading(true)
                setError("")

                const response = await axios.get("/favorites")

                // Promise.all waits until all requests are done (faster than one by one).
                const movies = await Promise.all(
                    response.data.map(async (favorite) => {
                        try {
                            const movieResponse = await axios.get(`/movies/${favorite.movie_id}`)
                            return movieResponse.data
                        } catch (movieError) {
                            // One broken movie should not break the whole page
                            console.error(movieError)
                            return null
                        }
                    })
                )

                // Drop movies that failed to load
                setFavorites(movies.filter((movie) => movie !== null))
            } catch (fetchError) {
                console.error(fetchError)
                setError("Could not load your favorites. Try refreshing the page.")
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [user])

    // Remove one movie, then update the list without reloading the page
    async function handleRemove(movieId) {
        try {
            await axios.delete(`/favorites/${movieId}`)

            // "previous" is always the latest list, so quick repeated clicks stay correct
            setFavorites((previous) => previous.filter((movie) => movie.id !== movieId))
        } catch (removeError) {
            console.error(removeError)
            setError("Could not remove the movie. Try again.")
        }
    }

    // This page is personal, so ask to log in
    if (!user) {
        return (
            <main className="movies-page">
                <h1>My favorites</h1>
                <p><Link to="/login">Log in</Link> to see your favorite movies.</p>
            </main>
        )
    }

    if (loading) {
        return (
            <main className="movies-page">
                <p>Loading...</p>
            </main>
        )
    }

    return (
        <main className="movies-page">
            <h1>My favorites</h1>

            {error && <p>{error}</p>}

            {favorites.length === 0 ? (
                <p>
                    You haven't added any favorites yet. <Link to="/movies">Browse movies</Link>
                </p>
            ) : (
                <div className="movies-grid">
                    {favorites.map((movie) => (
                        // Wrapper holds the shared card and the remove button together
                        <div key={movie.id} className="favorite-item">
                            {/* Same card component as on the Movies page */}
                            <MovieCard movie={movie} />

                            {/* Outside the card's link, so clicking won't open the movie page */}
                            <button
                                type="button"
                                className="favorite-remove-button"
                                onClick={() => handleRemove(movie.id)}
                                aria-label={`Remove ${movie.title} from favorites`}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default UserFavorites