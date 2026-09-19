import { useEffect, useState } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import "./Movies.css"

function Movies() {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("popular")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true)
        setError("")

        const response = await axios.get(
          `movies/${sortBy}?page=${page}`
        )

        setMovies(
          response.data.filter((movie) => movie.poster_path)
        )
      } catch (error) {
        console.error(error)
        setError("Failed to load movies.")
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [sortBy, page])

  function handleSortChange(event) {
    setSortBy(event.target.value)
    setPage(1)
  }

  function nextPage() {
    setPage(page + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function previousPage() {
    if (page > 1) {
      setPage(page - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <main className="movies-page">
        <h1>Movies</h1>
        <p>Loading movies...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="movies-page">
        <h1>Movies</h1>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main className="movies-page">
      <h1>Movies</h1>

      <div className="movies-controls">
        <label htmlFor="movie-sort">Sort by</label>

        <select
          id="movie-sort"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="popular">Popular</option>
          <option value="top-rated">Top Rated</option>
          <option value="now-playing">Now Playing</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={previousPage}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button onClick={nextPage}>
          Next
        </button>
      </div>
    </main>
  )
}

export default Movies
