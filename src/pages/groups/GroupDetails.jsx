import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import MovieCard from "../../components/MovieCard.jsx"
import { getAccessToken } from "../../api/tokenStore.js"
 
// GroupDetails component fetches and displays details of a specific group, including its movies
function GroupDetails() {
  const { id } = useParams()

  const [group, setGroup] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
// Fetch group details and movies when the component mounts or when the group ID changes
  useEffect(() => {
    async function fetchGroup() {
      try {
        setLoading(true)
        setError("")

        const token = getAccessToken()

        const groupResponse = await axios.get(
          `/groups/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setGroup(groupResponse.data)

        const movieResponses = await Promise.all(
          groupResponse.data.movies.map(movie =>
            axios.get(`/movies/${movie.movie_id}`)
          )
        )

        setMovies(
          movieResponses.map(response => response.data)
        )
      } catch (error) {
        console.error(error)
// Handle different error scenarios based on the response status
        if (error.response?.status === 403) {
          setError(
            "You are not a member of this group."
          )
        } else if (error.response?.status === 401) {
          setError(
            "You must be logged in to view this group."
          )
        } else {
          setError("Failed to load group.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [id])
// Render loading, error, or group details based on the current state
  if (loading) {
    return (
      <main className="group-details-page">
        <p>Loading group...</p>
      </main>
    )
  }
// Render error message if there is an error
  if (error) {
    return (
      <main className="group-details-page">
        <h1>Group</h1>
        <p>{error}</p>
      </main>
    )
  }
// Render group details and list of movies if data is successfully fetched
  return (
    <main className="group-details-page">
      <h1>{group.name}</h1>

      <section>
        <h2>Movies</h2>

        {movies.length === 0 ? (
          <p>No movies in this group.</p>
        ) : (
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default GroupDetails