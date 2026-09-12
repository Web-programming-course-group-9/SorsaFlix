import "./MovieCard.css";

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
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
  );
}

export default MovieCard;