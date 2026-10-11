import { useEffect, useRef, useState } from "react"
import axios from "axios"
import MovieCard from "./MovieCard"
import "./MovieCarousel.css"

function MovieCarousel() {
  const carouselRef = useRef(null)
  const itemRefs = useRef([])

  const [movies, setMovies] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load movies
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get("/movies/now-playing")
        setMovies(response.data.filter((movie) => movie.poster_path))
      } catch (err) {
        console.error(err)
        setError("Failed to load movies.")
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Keep the active movie centered whenever it changes
  useEffect(() => {
    const carousel = carouselRef.current
    const item = itemRefs.current[activeIndex]
    if (!carousel || !item) return

    const left =
      item.offsetLeft - carousel.clientWidth / 2 + item.offsetWidth / 2

    carousel.scrollTo({ left, behavior: "smooth" })
  }, [activeIndex, movies])

  const goNext = () =>
    setActiveIndex((current) => Math.min(current + 1, movies.length - 1))

  const goPrev = () =>
    setActiveIndex((current) => Math.max(current - 1, 0))

  if (loading) return <p className="carousel-message">Loading movies...</p>
  if (error) return <p className="carousel-message">{error}</p>
  if (movies.length === 0)
    return <p className="carousel-message">No movies found.</p>

  return (
    <div className="carousel-wrapper">
      <button
        className="left"
        onClick={goPrev}
        disabled={activeIndex === 0}
        aria-label="Previous movie"
      >
        ‹
      </button>

      <div className="carousel" ref={carouselRef}>
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`item ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      <button
        className="right"
        onClick={goNext}
        disabled={activeIndex === movies.length - 1}
        aria-label="Next movie"
      >
        ›
      </button>
    </div>
  )
}

export default MovieCarousel