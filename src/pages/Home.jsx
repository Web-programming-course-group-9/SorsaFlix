import { useState } from "react"
import api from "../api/axios"
import SearchBar from "../components/SearchBar"
import SearchResults from "../components/SearchResults"
import MovieCarousel from "../components/MovieCarousel"

function Home() {
  // holds the search results
  const [searchResults, setSearchResults] = useState([])

  // Runs when the user submits a search term
  // Receives the search term from the SearchBar component
  const handleSearch = async (searchValues) => {
    // Ignore empty searches
    if (!searchValues.query.trim()) {
      return
    }
    try {
      // Calls GET http://localhost:3000/movies/search?query=<searchTerm>
      const response = await api.get("/search", {
        params: { 
          query: searchValues.query,
          year: searchValues.year || undefined,
        },
      })
      setSearchResults(response.data)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }
  return (
    <main className="page home-page">

      <SearchBar onSearch={handleSearch} />

      <SearchResults results={searchResults} />

      <section className="movie-section">

        <h1>In theater now</h1>

        <MovieCarousel />

      </section>

    </main>
  )
}

export default Home