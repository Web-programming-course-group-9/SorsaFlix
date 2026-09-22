import { Link } from "react-router-dom"
import "./Genres.css"

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 37, name: "Western" }
]

function Genres() {
  return (
    <main className="genre-page">
      <h1>Movie Genres</h1>

      <div className="genre-grid">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/movies?genre=${genre.id}`}
            className="genre-card"
          >
            <h2>{genre.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Genres