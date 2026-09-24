import { useEffect, useState } from "react"
import axios from "axios"
import SerieCard from "../../components/serieCard/SerieCard"
import "./Series.css"

function Series() {
  const [series, setSeries] = useState([])
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("popular")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchSeries() {
      try {
        setLoading(true)
        setError("")

        const response = await axios.get(
          `/series/${sortBy}?page=${page}`
        )

        setSeries(
          response.data.filter((show) => show.poster_path)
        )
      } catch (error) {
        console.error(error)
        setError("Failed to load series.")
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [sortBy, page])

  function handleSortChange(event) {
    setSortBy(event.target.value)
    setPage(1)
  }

  function handlePrevious() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleNext() {
    setPage(page + 1)
  }

  if (loading) {
    return (
      <main className="series-page">
        <h1>Series</h1>
        <p>Loading series...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="series-page">
        <h1>Series</h1>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main className="series-page">
      <h1>Series</h1>

      <div className="series-controls">
        <select value={sortBy} onChange={handleSortChange}>
          <option value="popular">Popular</option>
          <option value="top-rated">Top Rated</option>
          <option value="airing-today">Airing Today</option>
          <option value="on-the-air">On The Air</option>
        </select>
      </div>

      <div className="series-grid">
        {series.map((show) => (
          <SerieCard
            key={show.id}
            serie={show}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button onClick={handleNext}>
          Next
        </button>
      </div>
    </main>
  )
}

export default Series