import SearchResults from "../components/SearchResults";

// Temporary test data — replace with real search results in #23.
const testMovies = [
  { id: 1, title: "Batman Begins", poster_path: "/8RW2runSEc34IwKN2D1aPcJd2UL.jpg" },
  { id: 2, title: "The Dark Knight", poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 3, title: "The Batman", poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
];

function Movies() {
  return (
    <div>
      <h1>Movies</h1>
      <SearchResults movies={testMovies} />
    </div>
  );
}

export default Movies;