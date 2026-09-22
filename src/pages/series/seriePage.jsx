import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./seriePage.css"

function SeriePage() {
    // get seriesId from URL
    const { seriesId } = useParams()

    // state for series data, loading flag and errors
    const [serie, setSerie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Fetch the series whenever the seriesId changes
    useEffect(() => {
        async function fetchSerie() {
            try {
                setLoading(true)
                setError("")
                const response = await axios.get(`/series/${seriesId}`)
                setSerie(response.data)
            } catch (error) {
                console.error(error)
                setError("Failed to fetch series data.")
            } finally {
                setLoading(false)
            }
        }

        fetchSerie()
    }, [seriesId])

    // While loading, serie is still null - show a message and stop here
    if (loading) {
        return <main className="serie-page"><p>Loading...</p></main>
    }

    // If error, show error and stop here
    if (error) {
        return <main className="serie-page"><p>{error}</p></main>
    }

    // release_date is in format "YYYY-MM-DD", we only want the year
    const firstAirYear = serie.first_air_date ? serie.first_air_date.slice(0, 4) : "----"

    // Runtim for series is a List of episode runtimes, take first value
    const runtime = serie.episode_run_time?.[0]

    // build full image URLs from TMDB paths
    const posterUrl = serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : null
    const backdropUrl = serie.backdrop_path ? `https://image.tmdb.org/t/p/original${serie.backdrop_path}` : null

    // cast list lives under credits.cast. take first 10
    const cast = serie.credits?.cast?.slice(0, 10) ?? []

    return (
        <main className="serie-page">
            
            {/* Banner: backdrop image with the title on top */}
            <div className="serie-banner">
                {backdropUrl && (
                    <img
                        className="serie-backdrop"
                        src={backdropUrl}
                        alt={serie.name}
                    />
                )}
                <h1 className="serie-banner-title">{serie.name}</h1>
            </div>

            {/* Content below the banner */}
            <div className="serie-content">

                {posterUrl && (
                    <img
                        className="serie-poster-large"
                        src={posterUrl}
                        alt={serie.name}
                    />
                )}

                <div className="serie-info">
                    <p className="serie-meta">
                        {firstAirYear}
                        {runtime ? ` · ${runtime} min` : ""}
                        {" · ⭐ "}
                        {serie.vote_average?.toFixed(1)}
                    </p>

                    <p className="serie-genres">
                        {serie.genres?.map(genre => genre.name).join(", ")}
                    </p>

                    <p className="serie-overview">
                        {serie.overview || "No description available."}
                    </p>
                </div>
            </div>
                  {/* Cast list */}
            <div className="serie-cast-section">
                <h2>Cast</h2>
                <ul className="serie-cast">
                {cast.map(actor => (
                    <li key={actor.id}>
                    {actor.name} as {actor.character}
                    </li>
                ))}
                </ul>
            </div>
        </main>
    )
}

export default SeriePage