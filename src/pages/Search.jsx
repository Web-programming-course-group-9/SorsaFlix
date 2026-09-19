import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import SearchResults from "../components/SearchResults"

function Search() {
  // Read query and type from the URL (?query=...&type=...)
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query") || ""
  const type = searchParams.get("type") || "movie"
  const year = searchParams.get("year") || ""

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true)
        setError("")

        // Choose endpoint by type: tv -> /series, movie -> /movies
        const basePath = type === "tv" ? "/series/search" : "/movies/search"

        const response = await axios.get(basePath, {
          params: { query, year: year || undefined },
        })

        setResults(response.data)
      } catch (error) {
        console.error(error)
        setError("Search failed.")
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    }
  }, [query, type, year])

  return (
    <main className="page">
      <h1>Search results for "{query}"</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && <SearchResults results={results} />}
    </main>
  )
}

export default Search