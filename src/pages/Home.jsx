import SearchBar from "../components/SearchBar";
import MovieCarousel from "../components/MovieCarousel";

function Home() {
  return (
    <main className="page home-page">

      <SearchBar />

      <section className="movie-section">

        <h1>In theater now</h1>

        <MovieCarousel />

      </section>

    </main>
  );
}

export default Home;