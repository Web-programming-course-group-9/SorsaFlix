import {useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./Moviepage.css"
import ReviewForm from "../../components/ReviewForm"
import ReviewList from "../../components/reviewList/reviewList.jsx"

function MoviePage() {
    //get movieId from URL -> "/movie/550" -> movieId = 550
    const { movieId } = useParams()
    
    // State for movie data, loading flag and errors
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Fetch the movie whenever the movieId changes
    useEffect(() => {
        async function fetchMovie() {
            try {
                setLoading(true)
                setError("")
                const response = await axios.get(`/movies/${movieId}`)
                setMovie(response.data)
            }
            catch(error) {
                console.error(error)
                setError("Failed to fetch movie data.")
            }
            finally {
                setLoading(false)
            }
        }

        fetchMovie()
    }, [movieId])

    // While loading, movie is still nnull - show a message and stop here
    if (loading) {
        return <main className="movie-page"><p>Loading...</p></main>
    }

    // If error, show erro and stop here
    if (error) {
        return <main className="movie-page"><p>{error}</p></main>
    }

    // release_date is in format "YYYY-MM-DD", we only want the year
    const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "----"

    // Build full image URLs from TMDB paths
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null

    // cast list lives under credits.cast. take first 10
    const cast = movie.credits?.cast?.slice(0, 10) ?? []

  return (
    <main className="movie-page">

      {/* Banner: backdrop image with the title on top */}
      <div className="movie-banner">
        {backdropUrl && (
          <img
            className="movie-backdrop"
            src={backdropUrl}
            alt={movie.title}
          />
        )}
        <h1 className="movie-banner-title">{movie.title}</h1>
      </div>

      {/* Content below the banner */}
      <div className="movie-content">

        {posterUrl && (
          <img
            className="movie-poster-large"
            src={posterUrl}
            alt={movie.title}
          />
        )}

        <div className="movie-info">
          <p className="movie-meta">
            {releaseYear} · {movie.runtime} min · ⭐ {movie.vote_average?.toFixed(1)}
          </p>

          <p className="movie-genres">
            {movie.genres?.map(genre => genre.name).join(", ")}
          </p>

          <p className="movie-overview">
            {movie.overview || "No description available."}</p>
        </div>
      </div>

      {/* Cast list */}
<div className="movie-cast-section">
  <h2>Cast</h2>

  <ul className="movie-cast">
    {cast.map(actor => (
      <li key={actor.id}>
        {actor.name} as {actor.character}
      </li>
    ))}
  </ul>
</div>

<ReviewForm movieId={movieId} />

      {/* Reviews */}
      <div className="movie-reviews-section">
        <h2>Reviews</h2>
        <ReviewList movieId={movieId} />
      </div>

    </main>
  )}
export default MoviePage