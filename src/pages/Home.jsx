import SearchBar from "../components/SearchBar"
import MovieCarousel from "../components/MovieCarousel"
import { useNavigate } from "react-router-dom"

function Home() {
  // holds the search results
  const navigate = useNavigate()

 // send ssearch to the /search page with URL params
  const handleSearch = async (searchValues) => {
    // Ignore empty searches
    if (!searchValues.query.trim()) {
      return
    }

      const params = new URLSearchParams({
          query: searchValues.query,
          type: searchValues.type,
        })
      if (searchValues.year) {
        params.set("year", searchValues.year)
      }
      navigate("/search?" + params.toString())
    }
  
  return (
    <main className="page home-page">

      <SearchBar onSearch={handleSearch} />

      <section className="movie-section">

        <h1>In theater now</h1>

        <MovieCarousel />

      </section>

    </main>
  )
}

export default Home