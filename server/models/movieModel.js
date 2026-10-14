import axios from 'axios'
import "dotenv/config"

// Fetch one movie's details by its TMDB id
// appen_to_response=credits adds the cast list in the same request
// to avoid second request to the API
export async function getMovieById(movieId) {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,
    {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
        params: {
            language: "fi-FI",
            append_to_response: "credits"
        },
    }
)

    return response.data
}