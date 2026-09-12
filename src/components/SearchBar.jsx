import { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/movies/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      setMovies(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">

      <form
        className="search-form"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search movies..."
          className="search-input"
        />

        <button
          type="submit"
          className="search-button"
        >
          Search
        </button>
      </form>

      {loading && (
        <p>Searching...</p>
      )}

      {movies.length > 0 && (
        <div className="search-results">

          {movies.map((movie) => (
            <div
              key={movie.id}
              className="search-result"
            >
              {movie.title}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default SearchBar;