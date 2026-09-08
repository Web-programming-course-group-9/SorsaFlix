import { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";

function MovieCarousel() {
  const carouselRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=fi-FI&region=FI&page=1`
        );

        const data = await response.json();

        setMovies(
          data.results.filter((movie) => movie.poster_path)
        );
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const scrollRight = () => {
    const carousel = carouselRef.current;
    const item = carousel.querySelector(".item");

    if (item) {
      carousel.scrollLeft += item.clientWidth;
    }
  };

  const scrollLeft = () => {
    const carousel = carouselRef.current;
    const item = carousel.querySelector(".item");

    if (item) {
      carousel.scrollLeft -= item.clientWidth;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="carousel-wrapper">

      <button
        className="left"
        onClick={scrollLeft}
        aria-label="reverse"
      >
        ‹
      </button>

      <div
        className="carousel"
        ref={carouselRef}
      >
        {movies.map((movie) => (
          <div className="item" key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      <button
        className="right"
        onClick={scrollRight}
        aria-label="Next"
      >
        ›
      </button>

    </div>
  );
}

export default MovieCarousel;