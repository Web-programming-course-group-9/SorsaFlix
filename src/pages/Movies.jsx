import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import "./Movies.css";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get("/movies/now-playing");

        setMovies(
          response.data.filter((movie) => movie.poster_path)
        );
      } catch (error) {
        console.error(error);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <main className="movies-page">
        <h1>Movies</h1>
        <p>Loading movies...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="movies-page">
        <h1>Movies</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="movies-page">
      <h1>Movies</h1>

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </main>
  );
}

export default Movies;