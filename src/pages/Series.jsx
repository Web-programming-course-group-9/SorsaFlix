import { useEffect, useState } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import "./Series.css"

function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSeries() {
      try {
        const response = await axios.get("/series/popular")

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
  }, [])

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

      <div className="series-grid">
        {series.map((show) => (
          <MovieCard
            key={show.id}
            movie={{
              ...show,
              title: show.name,
            }}
          />
        ))}
      </div>
    </main>
  )
}

export default Series