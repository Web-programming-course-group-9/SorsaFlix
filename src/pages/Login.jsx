import { Link } from "react-router-dom"

function Login() {
  return (
    <main className="page">
      <h1>Log in</h1>
      <Link to="/register">Don't have an account? Sign up</Link>
    </main>
  )
}

export default Login