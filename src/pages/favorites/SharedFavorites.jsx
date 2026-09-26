import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import MovieCard from "../../components/MovieCard"
import "./SharedFavorites.css"
import { useAuth } from "../../context/AuthContext"
import ShareFavoritesButton from "../../components/ShareFavoritesButton"


function SharedFavorites() {
    const { userId } = useParams()
    const { user: loggedInUser } = useAuth()


    const [user, setUser] = useState(null)
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchFavorites() {
            try {
                setLoading(true)
                setError("")

                const response = await axios.get(`/favorites/user/${userId}`)

                setUser(response.data.user)
                setMovies(response.data.favorites)
            } catch (error) {
                if (error.response?.status === 404) {
                    setError("User not found.")
                } else {
                    setError("Failed to load favourites.")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()

    }, [userId])

    if (loading) {
        return (
            <main className="shared-favorites-page">
                <p>Loading favourites...</p>
            </main>
        )
    }
    if (error) {
        return (
            <main className="shared-favorites-page">
                <p>{error}</p>
            </main>
        )
    }


    return (
        <main className="shared-favorites-page">
            <h1>{user.username}'s Favorites</h1>
                        {loggedInUser?.id === user.id && (
                <ShareFavoritesButton userId={user.id} />
            )}

            {movies.length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                <div className="shared-favorites-grid">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </main>
    )
}

export default SharedFavorites