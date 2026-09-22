import { Link } from "react-router-dom"
import "./MovieCard.css"

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  return (
    // By clicking on the card, we want to go to the movie page for this movie
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <article className="movie-card">

        {posterUrl && (
          <img
            className="movie-poster"
            src={posterUrl}
            alt={movie.title}
          />
        )}

        <div className="movie-info">

          <h2 className="movie-title">
            {movie.title}
          </h2>

          <p className="movie-rating">
             {movie.vote_average?.toFixed(1)}
          </p>

        </div>

      </article>
    </Link>
  )
}

export default MovieCard

