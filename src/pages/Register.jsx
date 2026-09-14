import { useState } from "react"
import { useNavigate } from "react-router-dom"
import authApi from "../api/authApi"

function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      await authApi.post("/register", { username, email, password })
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.error ?? "Rekisteröinti epäonnistui")
    }
  }

  return (
    <main className="page">
      <h1>Rekisteröidy</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Käyttäjänimi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Rekisteröidy</button>
      </form>
    </main>
  )
}

export default Register
