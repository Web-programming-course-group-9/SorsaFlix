import { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";

function MovieCarousel() {
  const carouselRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/movies/now-playing");

        if (!response.ok) {
          throw new Error("Movie search failed");
        }

        const data = await response.json();

        setMovies(data.filter((movie) => movie.poster_path));
      } catch (error) {
        console.error(error);
        setError("Downloading error");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const scrollRight = () => {
    const carousel = carouselRef.current;
    const item = carousel?.querySelector(".item");

    if (!carousel || !item) return;

    carousel.scrollLeft += item.clientWidth + 25;

    setActiveIndex((current) =>
      Math.min(current + 1, movies.length - 1)
    );
  };

  const scrollLeft = () => {
    const carousel = carouselRef.current;
    const item = carousel?.querySelector(".item");

    if (!carousel || !item) return;

    carousel.scrollLeft -= item.clientWidth + 25;

    setActiveIndex((current) =>
      Math.max(current - 1, 0)
    );
  };

  if (loading) {
    return <p className="carousel-message">Loading movies...</p>;
  }

  if (error) {
    return <p className="carousel-message">{error}</p>;
  }

  if (movies.length === 0) {
    return <p className="carousel-message">No movies found.</p>;
  }

  return (
    <div className="carousel-wrapper">

      <button
        className="left"
        onClick={scrollLeft}
        aria-label="Previous movie"
      >
        ‹
      </button>

      <div className="carousel" ref={carouselRef}>
        {movies.map((movie, index) => (
          <div
            className={`item ${
              index === activeIndex ? "active" : ""
            }`}
            key={movie.id}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      <button
        className="right"
        onClick={scrollRight}
        aria-label="Next movie"
      >
        ›
      </button>

    </div>
  );
}

export default MovieCarousel;