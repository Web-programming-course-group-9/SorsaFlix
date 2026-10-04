import { Link } from "react-router-dom"

// shown when no other route matches the URL
function NotFound() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Back to home page</Link>
    </main>
  )
}

export default NotFound
