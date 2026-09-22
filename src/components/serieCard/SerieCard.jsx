import { Link } from "react-router-dom"
import "./SerieCard.css"

function SerieCard({ serie }) {
    // build full image URL from TMDB path
    const posterUrl = serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : null

    return (
        // card links to this sries' page
        <Link to={`/serie/${serie.id}`} className="serie-card-link">
            <article className="serie-card">

                {posterUrl && (
                    <img
                        className="serie-poster"
                        src={posterUrl}
                        alt={serie.name}
                    />
                )}

                <div className="serie-info">

                    <h2 className="serie-title">{serie.name}</h2>

                    <p className="serie-rating">⭐ {serie.vote_average?.toFixed(1)}</p>
                </div>
            </article>
        </Link>
    )
}

export default SerieCard